import { Resend } from 'resend';
import { sanitiseHeaderValue, type InquiryValues } from '@/lib/inquiry';
import { siteConfig } from '@/site.config';

/**
 * Enquiry delivery.
 *
 * This module either delivers an enquiry to a real inbox or throws. It never reports
 * success for a message that was not accepted by the provider, and it never logs the
 * enquiry body or the sender's contact details — the previous implementation wrote the
 * whole payload, including personal data, to the server log and returned success
 * regardless.
 */

/** Thrown when delivery is impossible or was refused. Safe to surface as a 5xx. */
export class InquiryDeliveryError extends Error {
  /** True when the failure is configuration rather than a transient provider fault. */
  readonly isConfiguration: boolean;

  constructor(message: string, options: { isConfiguration?: boolean } = {}) {
    super(message);
    this.name = 'InquiryDeliveryError';
    this.isConfiguration = options.isConfiguration ?? false;
  }
}

export type EmailConfig = {
  apiKey: string;
  from: string;
  to: string;
};

/**
 * Reads delivery configuration from the environment.
 *
 * Returns null when the provider is not configured, which the route treats as a
 * server error rather than pretending the message went somewhere.
 */
export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INQUIRY_FROM_EMAIL?.trim();
  const to = (process.env.INQUIRY_TO_EMAIL ?? siteConfig.contact.email ?? '').trim();

  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

/** True when the site can actually take an enquiry. Drives whether the form renders. */
export function canAcceptInquiries(): boolean {
  return getEmailConfig() !== null;
}

function plainTextBody(values: InquiryValues): string {
  const lines = [
    `Vehicle or model: ${values.vehicle}`,
    '',
    `Name:  ${values.name}`,
    `Email: ${values.email}`,
  ];
  if (values.phone.trim()) lines.push(`Phone: ${values.phone}`);
  lines.push('', '---', '', values.message, '', '---', `Sent from ${siteConfig.url}`);
  return lines.join('\n');
}

/** Escapes text for interpolation into the HTML part. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function htmlBody(values: InquiryValues): string {
  const rows: [string, string][] = [
    ['Vehicle or model', values.vehicle],
    ['Name', values.name],
    ['Email', values.email],
  ];
  if (values.phone.trim()) rows.push(['Phone', values.phone]);

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;white-space:nowrap;">${escapeHtml(
          label,
        )}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  // Restrained on purpose: this lands in an inbox, not a marketing client.
  return [
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;',
    'font-size:15px;line-height:1.6;color:#111;">',
    `<table style="border-collapse:collapse;font-size:14px;">${table}</table>`,
    '<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">',
    `<div style="white-space:pre-wrap;">${escapeHtml(values.message)}</div>`,
    '<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">',
    `<p style="font-size:12px;color:#888;">Sent from ${escapeHtml(siteConfig.url)}</p>`,
    '</div>',
  ].join('');
}

/**
 * Delivers one enquiry. Resolves only once the provider has accepted the message.
 *
 * `replyTo` is the enquirer's address, so replying from the inbox reaches them
 * directly. The subject carries the selected vehicle or model so enquiries are
 * sortable without opening them.
 */
export async function deliverInquiry(values: InquiryValues): Promise<void> {
  const config = getEmailConfig();
  if (!config) {
    throw new InquiryDeliveryError('Email delivery is not configured.', {
      isConfiguration: true,
    });
  }

  const resend = new Resend(config.apiKey);
  const subject = sanitiseHeaderValue(
    `Enquiry — ${values.vehicle} — ${values.name}`,
  ).slice(0, 200);

  let result: Awaited<ReturnType<typeof resend.emails.send>>;
  try {
    result = await resend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: sanitiseHeaderValue(values.email),
      subject,
      text: plainTextBody(values),
      html: htmlBody(values),
    });
  } catch {
    // Network or SDK failure. The cause is deliberately not attached: it can carry
    // request details, and this error is surfaced to the caller.
    throw new InquiryDeliveryError('The email provider could not be reached.');
  }

  if (result.error) {
    throw new InquiryDeliveryError(
      `The email provider rejected the message: ${result.error.message}`,
    );
  }

  if (!result.data?.id) {
    throw new InquiryDeliveryError(
      'The email provider did not confirm the message was queued.',
    );
  }
}
