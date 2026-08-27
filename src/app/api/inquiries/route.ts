import { NextResponse } from 'next/server';
import { validateInquiry } from '@/lib/inquiry';

/**
 * Inquiry sink.
 *
 * No email provider is configured, so this route validates the submission and logs it
 * server-side. To connect a real provider, replace `deliverInquiry` below — the
 * contract (validated payload in, thrown error or void out) is all the form depends on.
 *
 * Resend example:
 *
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: 'site@yourdomain.com',
 *     to: siteConfig.contact.email,
 *     replyTo: payload.email,
 *     subject: `Inquiry — ${payload.vehicle}`,
 *     text: body,
 *   });
 *
 * Formspree example: POST the same payload to your form endpoint.
 */
async function deliverInquiry(payload: Record<string, string>): Promise<void> {
  // eslint-disable-next-line no-console
  console.info('[inquiry]', {
    receivedAt: new Date().toISOString(),
    ...payload,
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const values = {
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    phone: String(raw.phone ?? ''),
    vehicle: String(raw.vehicle ?? ''),
    message: String(raw.message ?? ''),
  };

  // Honeypot: real people leave this empty. Accept silently so bots learn nothing.
  if (String(raw.company ?? '').trim()) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateInquiry(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    await deliverInquiry(values);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'The message could not be sent. Please email us directly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
