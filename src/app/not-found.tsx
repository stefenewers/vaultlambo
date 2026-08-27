import Link from 'next/link';
import { Container } from '@/components/site/Container';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="label-xs text-giallo">404</p>
      <h1 className="display-1 mt-5 max-w-[14ch] text-bone">
        That page isn&rsquo;t here.
      </h1>
      <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-bone-dim">
        The listing may have been sold and archived, or the address may be wrong. The
        current inventory and the archive are both a click away.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link
          href="/inventory"
          className="inline-flex h-12 items-center border border-giallo bg-giallo px-7 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-[#0a0a0b] transition-colors duration-300 hover:bg-transparent hover:text-giallo"
        >
          View inventory
        </Link>
        <Link
          href="/sold"
          className="inline-flex h-12 items-center border border-line-strong px-7 text-[0.8125rem] uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:border-bone"
        >
          Sold archive
        </Link>
      </div>
    </Container>
  );
}
