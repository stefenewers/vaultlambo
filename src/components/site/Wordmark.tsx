import Link from 'next/link';
import { siteConfig } from '@/site.config';

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-[0.4rem] ${className}`}
      aria-label={`${siteConfig.name} — home`}
    >
      <span className="text-[0.95rem] font-medium tracking-[-0.01em] text-bone">
        {siteConfig.name}
      </span>
      <span
        aria-hidden="true"
        className="h-[3px] w-[3px] translate-y-[-1px] rounded-full bg-giallo transition-transform duration-300 group-hover:translate-y-[-4px]"
      />
    </Link>
  );
}
