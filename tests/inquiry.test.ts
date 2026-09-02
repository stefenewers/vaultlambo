import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LIMITS, sanitiseHeaderValue, validateInquiry } from '@/lib/inquiry';
import { checkRateLimit, clientKey, resetRateLimits } from '@/lib/rate-limit';

const VALID = {
  name: 'Alex Marlowe',
  email: 'alex@example.org',
  phone: '',
  vehicle: 'Porsche 911 GT3 Touring',
  message: 'Looking for a manual car in a dark colour, ideally before spring.',
};

describe('enquiry validation', () => {
  it('accepts a complete enquiry', () => {
    expect(validateInquiry(VALID)).toEqual({});
  });

  it('requires a name, a reachable email, a selection and a real message', () => {
    const errors = validateInquiry({
      name: 'A',
      email: 'not-an-email',
      phone: '',
      vehicle: '',
      message: 'hi',
    });

    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.vehicle).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });

  it('treats the phone number as optional but validates what is typed', () => {
    expect(validateInquiry({ ...VALID, phone: '' }).phone).toBeUndefined();
    expect(validateInquiry({ ...VALID, phone: '12345' }).phone).toBeTruthy();
    expect(validateInquiry({ ...VALID, phone: '+1 415 555 0142' }).phone).toBeUndefined();
  });

  it('rejects oversized fields rather than forwarding them', () => {
    const long = 'x'.repeat(LIMITS.message + 1);
    expect(validateInquiry({ ...VALID, message: long }).message).toBeTruthy();
    expect(
      validateInquiry({ ...VALID, name: 'y'.repeat(LIMITS.name + 1) }).name,
    ).toBeTruthy();
  });

  it('strips newlines that could forge an email header', () => {
    expect(sanitiseHeaderValue('alex@example.org\r\nBcc: someone@else.test')).toBe(
      'alex@example.org Bcc: someone@else.test',
    );
    expect(sanitiseHeaderValue('  padded  ')).toBe('padded');
  });
});

describe('rate limiting', () => {
  beforeEach(() => {
    resetRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetRateLimits();
  });

  it('allows a normal run of submissions and then refuses', () => {
    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit('198.51.100.7').ok, `attempt ${i + 1}`).toBe(true);
    }

    const blocked = checkRateLimit('198.51.100.7');
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it('keeps separate counters per client', () => {
    for (let i = 0; i < 5; i += 1) checkRateLimit('198.51.100.7');
    expect(checkRateLimit('198.51.100.7').ok).toBe(false);
    expect(checkRateLimit('203.0.113.4').ok).toBe(true);
  });

  it('lets a blocked client through once the window has passed', () => {
    for (let i = 0; i < 6; i += 1) checkRateLimit('198.51.100.7');
    expect(checkRateLimit('198.51.100.7').ok).toBe(false);

    vi.advanceTimersByTime(10 * 60 * 1000 + 1000);
    expect(checkRateLimit('198.51.100.7').ok).toBe(true);
  });

  it('reads the leftmost forwarded address as the client', () => {
    const request = new Request('https://example.test/api/inquiries', {
      headers: { 'x-forwarded-for': '198.51.100.7, 10.0.0.1' },
    });
    expect(clientKey(request)).toBe('198.51.100.7');
  });

  it('falls back to a shared bucket when no address is present', () => {
    const request = new Request('https://example.test/api/inquiries');
    expect(clientKey(request)).toBe('unknown');
  });
});

describe('email delivery configuration', () => {
  const ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...ENV };
    vi.resetModules();
  });

  async function load(env: Record<string, string | undefined>) {
    process.env = { ...ENV, ...env };
    return import('@/lib/email');
  }

  it('refuses to accept enquiries when the provider is not configured', async () => {
    const { canAcceptInquiries, getEmailConfig } = await load({
      RESEND_API_KEY: undefined,
      INQUIRY_FROM_EMAIL: undefined,
      INQUIRY_TO_EMAIL: undefined,
      NEXT_PUBLIC_CONTACT_EMAIL: undefined,
    });

    expect(getEmailConfig()).toBeNull();
    expect(canAcceptInquiries()).toBe(false);
  });

  it('throws a configuration error rather than reporting a false success', async () => {
    const { deliverInquiry, InquiryDeliveryError } = await load({
      RESEND_API_KEY: undefined,
      INQUIRY_FROM_EMAIL: undefined,
      INQUIRY_TO_EMAIL: undefined,
      NEXT_PUBLIC_CONTACT_EMAIL: undefined,
    });

    await expect(deliverInquiry(VALID)).rejects.toBeInstanceOf(InquiryDeliveryError);
    await expect(deliverInquiry(VALID)).rejects.toMatchObject({
      isConfiguration: true,
    });
  });

  it('falls back to the public contact address as the destination', async () => {
    const { getEmailConfig } = await load({
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
      INQUIRY_TO_EMAIL: undefined,
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
    });

    expect(getEmailConfig()).toEqual({
      apiKey: 'test-key-not-used',
      from: 'site@marlowemotorcars.com',
      to: 'enquiries@marlowemotorcars.com',
    });
  });

  it('prefers an explicit destination over the public address', async () => {
    const { getEmailConfig } = await load({
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
      INQUIRY_TO_EMAIL: 'inbox@marlowemotorcars.com',
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
    });

    expect(getEmailConfig()?.to).toBe('inbox@marlowemotorcars.com');
  });
});
