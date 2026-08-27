import Link from 'next/link';
import { siteConfig } from '@/site.config';

type Props = {
  className?: string;
  size?: 'sm' | 'lg';
  /** Renders as plain markup rather than a link — for use inside the footer. */
  asLink?: boolean;
};

const SIZES = {
  sm: { primary: 'text-[0.9375rem] tracking-[0.16em]', secondary: 'text-[0.5rem]' },
  lg: { primary: 'text-2xl tracking-[0.18em]', secondary: 'text-[0.625rem]' },
} as const;

export function Wordmark({ className = '', size = 'sm', asLink = true }: Props) {
  const s = SIZES[size];

  const mark = (
    <span className="flex flex-col leading-none">
      <span className={`font-medium text-bone ${s.primary}`}>
        {siteConfig.wordmark.primary}
      </span>
      <span
        className={`mt-[0.35em] font-medium uppercase tracking-[0.42em] text-steel ${s.secondary}`}
      >
        {siteConfig.wordmark.secondary}
      </span>
    </span>
  );

  if (!asLink) return <div className={className}>{mark}</div>;

  return (
    <Link
      href="/"
      className={`inline-block ${className}`}
      aria-label={`${siteConfig.name} — home`}
    >
      {mark}
    </Link>
  );
}
