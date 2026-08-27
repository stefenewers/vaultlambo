import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, intro, action, children }: Props) {
  return (
    <div className="rule pt-6 sm:pt-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="label-xs">{eyebrow}</p> : null}
          <h2 className="display-2 mt-3">{title}</h2>
          {intro ? (
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-steel">
              {intro}
            </p>
          ) : null}
          {children}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="link-underline shrink-0 self-start text-sm text-bone-dim transition-colors hover:text-bone sm:self-end"
          >
            {action.label}
            <span aria-hidden="true"> →</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
