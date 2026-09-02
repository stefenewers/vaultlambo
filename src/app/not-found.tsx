import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/site/Container';

/*
 * A 404 inherited the site's default title, so a missing page announced itself in the
 * tab and in history as though it were the homepage.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="label-xs">404</p>
      <h1 className="display-2 mt-5 max-w-[14ch] text-bone">Page not found.</h1>
      <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-bone-dim">
        The address may be wrong, or the page may have moved. The models we source and
        the commission archive are both a click away.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link href="/sourcing" className="btn btn-primary">
          Models we source
        </Link>
        <Link href="/commissions" className="btn btn-secondary">
          Past commissions
        </Link>
      </div>
    </Container>
  );
}
