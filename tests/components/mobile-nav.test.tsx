/**
 * @vitest-environment jsdom
 *
 * Mobile navigation behaviour.
 *
 * The panel is a full-screen overlay on a phone, so the things that matter are the
 * ones a keyboard or screen-reader user would notice: that it opens, that Escape
 * dismisses it, that focus comes back to the control that opened it rather than being
 * dropped at the top of the document, and that Tab cannot walk into the page behind.
 */

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const pathname = vi.hoisted(() => ({ current: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => pathname.current,
}));

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

const { Header } = await import('@/components/site/Header');

afterEach(() => {
  cleanup();
  pathname.current = '/';
});

/**
 * The panel is hidden with the `hidden` attribute rather than being unmounted, and is
 * located through the toggle's own aria-controls — the same association a screen
 * reader uses.
 */
function panel(): HTMLElement {
  const toggle = screen.getByRole('button', { name: /menu$/ });
  const id = toggle.getAttribute('aria-controls');
  const el = id ? document.getElementById(id) : null;
  if (!el) throw new Error('mobile panel not found via aria-controls');
  return el;
}

describe('mobile navigation', () => {
  it('opens and closes from the toggle', async () => {
    const user = userEvent.setup();
    render(<Header showInventory canContact />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(panel()).toHaveAttribute('hidden');

    await user.click(toggle);

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(panel()).not.toHaveAttribute('hidden');
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<Header showInventory canContact />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    await user.click(toggle);
    expect(panel()).not.toHaveAttribute('hidden');

    await user.keyboard('{Escape}');

    expect(panel()).toHaveAttribute('hidden');
    // The specific regression this guards: focus used to be left on <body>, which
    // drops a keyboard user back at the very top of the document.
    expect(document.activeElement).toBe(toggle);
  });

  it('keeps Tab inside the panel while it is open', async () => {
    const user = userEvent.setup();
    render(<Header showInventory canContact />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    await user.click(toggle);

    const links = within(panel()).getAllByRole('link');
    const last = links[links.length - 1]!;
    last.focus();

    // Tabbing off the last link wraps to the first focusable in the trap, never out
    // into the page rendered behind the overlay.
    await user.tab();
    expect(panel().contains(document.activeElement) || document.activeElement === toggle)
      .toBe(true);

    // And reverse-tabbing from the first stays contained too.
    links[0]!.focus();
    await user.tab({ shift: true });
    expect(panel().contains(document.activeElement) || document.activeElement === toggle)
      .toBe(true);
  });

  it('locks page scroll while open and restores it on close', async () => {
    const user = userEvent.setup();
    render(<Header showInventory canContact />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('omits Inventory from navigation when nothing is listed', () => {
    render(<Header showInventory={false} canContact />);
    expect(screen.queryByRole('link', { name: 'Inventory' })).toBeNull();
    expect(screen.getAllByRole('link', { name: 'Sourcing' }).length).toBeGreaterThan(0);
  });

  it('omits Contact and Enquire when there is no way to get in touch', () => {
    render(<Header showInventory={false} canContact={false} />);

    // The specific dead end this guards: the header used to advertise "Enquire" on
    // every page, and the contact page it led to showed neither a form nor an address.
    expect(screen.queryByRole('link', { name: 'Contact' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Enquire' })).toBeNull();

    // The rest of the site stays navigable.
    expect(screen.getAllByRole('link', { name: 'Sourcing' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Commissions' }).length).toBeGreaterThan(0);
  });

  it('offers Contact and Enquire once a contact route exists', () => {
    render(<Header showInventory={false} canContact />);
    expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Enquire' })).toBeInTheDocument();
  });

  it('marks the current section with aria-current', () => {
    pathname.current = '/sourcing';
    render(<Header showInventory canContact />);

    const current = screen
      .getAllByRole('link', { name: 'Sourcing' })
      .filter((el) => el.getAttribute('aria-current') === 'page');

    expect(current.length).toBeGreaterThan(0);
  });
});
