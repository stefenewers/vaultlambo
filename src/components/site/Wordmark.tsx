import Link from 'next/link';
import { siteConfig } from '@/site.config';

type Props = {
  className?: string;
  size?: 'sm' | 'lg';
  /** Renders as plain markup rather than a link — for use inside the footer. */
  asLink?: boolean;
};

const SIZES = {
  sm: { primary: 'text-[1.0625rem] tracking-[0.17em]', secondary: 'text-[0.6875rem]' },
  lg: { primary: 'text-[1.75rem] tracking-[0.19em]', secondary: 'text-xs' },
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
