import { Container } from '@/components/site/Container';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  intro?: string;
  children?: ReactNode;
};

export function PageHeader({ title, intro, children }: Props) {
  return (
    <Container className="pb-12 pt-16 sm:pb-16 sm:pt-24">
      <h1 className="display-2 max-w-[20ch] text-bone">{title}</h1>
      {intro ? (
        <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
          {intro}
        </p>
      ) : null}
      {children}
    </Container>
  );
}
