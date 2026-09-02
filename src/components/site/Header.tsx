'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Container } from '@/components/site/Container';
import { Wordmark } from '@/components/site/Wordmark';
import { siteConfig } from '@/site.config';

type Props = {
  /**
   * Whether anything is actually listed. Computed on the server and passed in so the
   * whole vehicle data set is not bundled into the client just to count it.
   */
  showInventory: boolean;
  /**
   * Whether a visitor can actually reach the business — a working form or a published
   * address. Both the Contact link and the Enquire button are withheld when they
   * cannot, because the page they lead to has nothing to offer.
   */
  canContact: boolean;
};

export function Header({ showInventory, canContact }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** Set when the menu is dismissed rather than navigated away from. */
  const restoreFocus = useRef(false);

  /**
   * Inventory is dropped from the navigation while nothing is listed. The route stays
   * live and reachable — it just is not offered as a primary destination when it has
   * nothing to show.
   */
  const nav = siteConfig.nav.filter((item) => {
    if (item.href === '/inventory') return showInventory;
    if (item.href === '/contact') return canContact;
    return true;
  });

  /** Dismiss and hand focus back to the button that opened the panel. */
  const close = useCallback(() => {
    restoreFocus.current = true;
    setOpen(false);
  }, []);

  // Close on navigation. Focus belongs to the new page here, not the toggle.
  useEffect(() => {
    restoreFocus.current = false;
    setOpen(false);
  }, [pathname]);

  /*
   * Return focus to the toggle after an Escape or a tap on the close button, but not
   * after a navigation — yanking focus back to the header would strand a keyboard user
   * at the top of a page they just moved to.
   */
  useEffect(() => {
    if (open) return;
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    toggleRef.current?.focus();
  }, [open]);

  /*
   * While the panel is open: lock scroll, close on Escape, and keep Tab inside the
   * panel. Without the trap, tabbing past the last link walks into the page behind the
   * overlay, which is invisible to a sighted keyboard user.
   */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = (): HTMLElement[] => {
      const root = panelRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.closest('[hidden]'));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      /*
       * The toggle stays in the cycle so the panel can always be closed from the
       * keyboard. It leads the list because it sits before the panel in DOM order —
       * appending it instead put the wrap boundary on the wrong element, and Tab off
       * the last link escaped the panel entirely.
       */
      const items = [toggleRef.current, ...focusables()].filter(
        (el): el is HTMLElement => el != null,
      );
      if (items.length === 0) return;

      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6 sm:h-20">
          <Wordmark />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      /*
                       * The active item carries a rule under it as well as a colour
                       * change, so "where am I" does not depend on distinguishing two
                       * greys.
                       */
                      className={`relative py-1 text-[0.8125rem] tracking-[0.02em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:transition-colors ${
                        active
                          ? 'text-bone after:bg-giallo'
                          : 'text-steel after:bg-transparent hover:text-bone hover:after:bg-line-strong'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {canContact ? (
            <div className="hidden md:block">
              <Link href="/contact" className="btn btn-primary btn-sm">
                Enquire
              </Link>
            </div>
          ) : null}

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls={panelId}
            /* 44px square: a comfortable tap target on the smallest phone. */
            className="-mr-2.5 inline-flex h-11 w-11 items-center justify-center text-bone md:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="border-t border-line bg-ink md:hidden"
      >
        <Container>
          <nav aria-label="Primary, mobile">
            <ul className="py-2">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="border-b border-line last:border-b-0">
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between gap-4 py-4 text-base ${
                        active ? 'text-bone' : 'text-bone-dim'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {/* A rule, not just a colour, marks the current page. */}
                        <span
                          aria-hidden="true"
                          className={`h-px w-4 ${active ? 'bg-giallo' : 'bg-transparent'}`}
                        />
                        {item.label}
                      </span>
                      <span aria-hidden="true" className="text-steel-dim">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
