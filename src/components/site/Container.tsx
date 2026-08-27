import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** `wide` is used for full-bleed-adjacent sections such as the gallery. */
  size?: 'default' | 'wide' | 'narrow';
};

const SIZES = {
  narrow: 'max-w-3xl',
  default: 'max-w-[86rem]',
  wide: 'max-w-[104rem]',
} as const;

export function Container({ children, className = '', size = 'default' }: Props) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 lg:px-12 ${SIZES[size]} ${className}`}>
      {children}
    </div>
  );
}
