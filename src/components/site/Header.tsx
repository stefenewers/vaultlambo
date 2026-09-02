'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/site/Container';
import { Wordmark } from '@/components/site/Wordmark';
import { siteConfig } from '@/site.config';

type Props = {
  /**
   * Whether anything is actually listed. Computed on the server and passed in so the
   * whole vehicle data set is not bundled into the client just to count it.
   */
  showInventory: boolean;
};

export function Header({ showInventory }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /**
   * Inventory is dropped from the navigation while nothing is listed. The route stays
   * live and reachable — it just is not offered as a primary destination when it has
   * nothing to show.
   */
  const nav = showInventory
    ? siteConfig.nav
    : siteConfig.nav.filter((item) => item.href !== '/inventory');

  // Close the panel on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll and allow Escape to dismiss while the panel is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6 sm:h-20">
          <Wordmark />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`link-underline text-[0.8125rem] tracking-[0.02em] transition-colors ${
                      isActive(item.href) ? 'text-bone' : 'text-steel hover:text-bone'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:block">
            <Link href="/contact" className="btn btn-primary btn-sm">
              Enquire
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center text-bone md:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-ink md:hidden"
      >
        <Container>
          <nav aria-label="Primary, mobile">
            <ul className="py-2">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex items-center justify-between py-4 text-base ${
                      isActive(item.href) ? 'text-bone' : 'text-bone-dim'
                    }`}
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-steel-dim">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
