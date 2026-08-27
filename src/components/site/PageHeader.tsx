import { Container } from '@/components/site/Container';
import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, intro, children }: Props) {
  return (
    <Container className="pb-10 pt-14 sm:pb-14 sm:pt-20">
      {eyebrow ? <p className="label-xs">{eyebrow}</p> : null}
      <h1 className="display-1 mt-5 max-w-[18ch] text-bone">{title}</h1>
      {intro ? (
        <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
          {intro}
        </p>
      ) : null}
      {children}
    </Container>
  );
}
