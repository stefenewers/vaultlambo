/**
 * @vitest-environment jsdom
 *
 * Enquiry form behaviour.
 *
 * The single most important assertion here is that a success state cannot appear
 * unless the server actually accepted the message. The original endpoint logged the
 * enquiry and returned 200 regardless, so the form told every visitor their message
 * had been sent when nothing had been delivered anywhere.
 */

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OptionGroup } from '@/components/forms/InquiryForm';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const { InquiryForm } = await import('@/components/forms/InquiryForm');

const groups: OptionGroup[] = [
  {
    label: 'Models we source',
    options: [{ value: 'Porsche 911 GT3 Touring', label: 'Porsche 911 GT3 Touring' }],
  },
];

/** Fills every required field with something valid. */
async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/), 'Alex Marlowe');
  await user.type(screen.getByLabelText(/^Email/), 'alex@example.org');
  await user.selectOptions(
    screen.getByLabelText(/Vehicle or model/),
    'Porsche 911 GT3 Touring',
  );
  await user.type(
    screen.getByLabelText(/^Message/),
    'Looking for a manual car in Shark Blue, flexible on timing.',
  );
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('InquiryForm', () => {
  it('carries real name attributes and autocomplete hints', () => {
    render(<InquiryForm groups={groups} />);

    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/^Phone/)).toHaveAttribute('autocomplete', 'tel');
    expect(screen.getByLabelText(/Vehicle or model/)).toHaveAttribute('name', 'vehicle');
    expect(screen.getByLabelText(/^Message/)).toHaveAttribute('name', 'message');
  });

  it('states how details are used, next to the submit action', () => {
    render(<InquiryForm groups={groups} />);
    expect(
      screen.getByText(/used only to answer this enquiry/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /how we handle enquiries/i }),
    ).toHaveAttribute('href', '/privacy');
  });

  it('blocks submission and summarises errors when the form is empty', async () => {
    const user = userEvent.setup();
    render(<InquiryForm groups={groups} />);

    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    const summary = await screen.findByRole('alert');
    expect(summary).toHaveTextContent(/fields need attention/i);
    // Nothing is sent while the form is invalid.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('moves focus to the error summary so every problem is announced at once', async () => {
    const user = userEvent.setup();
    render(<InquiryForm groups={groups} />);

    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    const summary = await screen.findByRole('alert');
    await waitFor(() => expect(document.activeElement).toBe(summary));
  });

  it('shows success only after the server accepts the enquiry', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    render(<InquiryForm groups={groups} />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByText(/Thanks/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never reports success when delivery fails', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: 'Delivery failed upstream.' }), {
        status: 502,
      }),
    );

    render(<InquiryForm groups={groups} />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByText('Delivery failed upstream.')).toBeInTheDocument();
    expect(screen.queryByText(/Thanks/i)).toBeNull();
  });

  it('never reports success when delivery is unconfigured', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: false,
          error: 'Enquiries are temporarily unavailable. Please email us directly.',
        }),
        { status: 503 },
      ),
    );

    render(<InquiryForm groups={groups} />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByText(/temporarily unavailable/i)).toBeInTheDocument();
    expect(screen.queryByText(/Thanks/i)).toBeNull();
  });

  it('never reports success when the request itself throws', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error('network down'));

    render(<InquiryForm groups={groups} />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByText(/could not be sent/i)).toBeInTheDocument();
    expect(screen.queryByText(/Thanks/i)).toBeNull();
  });

  it('sends the honeypot field so the server can score it', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    render(<InquiryForm groups={groups} />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [, init] = fetchMock.mock.calls[0]!;
    const payload = JSON.parse(String((init as RequestInit).body));
    expect(payload).toHaveProperty('company', '');
    expect(payload.email).toBe('alex@example.org');
  });
});
