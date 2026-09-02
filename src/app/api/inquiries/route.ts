import { NextResponse } from 'next/server';
import { InquiryDeliveryError, deliverInquiry, getEmailConfig } from '@/lib/email';
import { LIMITS, validateInquiry, type InquiryValues } from '@/lib/inquiry';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';

/**
 * Enquiry endpoint.
 *
 * Success is returned only after the email provider has accepted the message. Nothing
 * here logs the enquiry body, the sender's name, address or phone number: an enquiry
 * is personal data, and server logs are not the place for it. Failures are logged as
 * a reason and a status, never as a payload.
 */

/** Body larger than this is not a real enquiry. Guards against oversized posts. */
const MAX_BODY_BYTES = 32 * 1024;

const GENERIC_FAILURE =
  'The message could not be sent. Please try again in a moment, or email us directly.';

function readString(source: Record<string, unknown>, key: string, max: number): string {
  const value = source[key];
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export async function POST(request: Request) {
  // --- Abuse protection ----------------------------------------------------
  const limit = checkRateLimit(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many enquiries from this connection. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'That message is too long to send.' },
      { status: 413 },
    );
  }

  // --- Parse ---------------------------------------------------------------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;

  const values: InquiryValues = {
    name: readString(raw, 'name', LIMITS.name + 1),
    email: readString(raw, 'email', LIMITS.email + 1),
    phone: readString(raw, 'phone', LIMITS.phone + 1),
    vehicle: readString(raw, 'vehicle', LIMITS.vehicle + 1),
    message: readString(raw, 'message', LIMITS.message + 1),
  };

  // Honeypot: real people leave this empty. Accept silently so bots learn nothing
  // from the response, but send nothing.
  if (readString(raw, 'company', 200).trim()) {
    return NextResponse.json({ ok: true });
  }

  // --- Validate ------------------------------------------------------------
  const errors = validateInquiry(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // --- Deliver -------------------------------------------------------------
  if (!getEmailConfig()) {
    // Misconfiguration, not the sender's fault. Never report success for a message
    // that has nowhere to go.
    console.error('[inquiries] delivery is not configured; enquiry refused');
    return NextResponse.json(
      { ok: false, error: 'Enquiries are temporarily unavailable. Please email us directly.' },
      { status: 503 },
    );
  }

  try {
    await deliverInquiry(values);
  } catch (error) {
    const reason =
      error instanceof InquiryDeliveryError ? error.message : 'unexpected delivery failure';
    // Reason only. The payload is deliberately not logged.
    console.error('[inquiries] delivery failed:', reason);

    return NextResponse.json({ ok: false, error: GENERIC_FAILURE }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
