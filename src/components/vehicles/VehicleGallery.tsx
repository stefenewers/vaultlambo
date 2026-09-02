'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { VehicleImage } from '@/lib/types';

type Props = {
  images: VehicleImage[];
  /** Used in the lightbox announcement, e.g. "Lamborghini Temerario". */
  vehicleName: string;
};

const SWIPE_THRESHOLD = 44;

export function VehicleGallery({ images, vehicleName }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = images.length;
  const active = images[index];

  /**
   * Which stage images are mounted.
   *
   * The stage cross-fades between images, which previously meant every full-resolution
   * gallery image downloaded on first paint — ten of them on the Temerario. Only the
   * current image and its immediate neighbours are mounted, and anything already
   * visited stays mounted so stepping back through the gallery stays instant.
   */
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    setMounted((previous) => {
      const next = new Set(previous);
      next.add(index);
      if (index + 1 < count) next.add(index + 1);
      if (index - 1 >= 0) next.add(index - 1);
      return next;
    });
  }, [index, count]);

  const isNear = (i: number) => mounted.has(i);

  const thumbRailRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const labelId = useId();

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  const openLightbox = useCallback((at: number) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setIndex(at);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    openerRef.current?.focus();
  }, []);

  /**
   * Keep the active thumbnail in view. Scrolls the rail itself rather than calling
   * scrollIntoView, which would also scroll the document — on mount that would drag
   * the page down past the heading.
   */
  useEffect(() => {
    const rail = thumbRailRef.current;
    if (!rail) return;
    const el = rail.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    if (!el) return;

    const left = el.offsetLeft;
    const right = left + el.offsetWidth;
    const viewLeft = rail.scrollLeft;
    const viewRight = viewLeft + rail.clientWidth;

    if (left < viewLeft) {
      rail.scrollTo({ left: left - 8, behavior: 'smooth' });
    } else if (right > viewRight) {
      rail.scrollTo({ left: right - rail.clientWidth + 8, behavior: 'smooth' });
    }
  }, [index]);

  // Lightbox: scroll lock, keyboard control and a simple focus trap.
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          closeLightbox();
          break;
        case 'ArrowRight':
          event.preventDefault();
          go(1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          go(-1);
          break;
        case 'Home':
          event.preventDefault();
          setIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setIndex(count - 1);
          break;
        case 'Tab': {
          const root = dialogRef.current;
          if (!root) return;
          const focusable = Array.from(
            root.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
            ),
          );
          if (focusable.length === 0) return;
          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, go, closeLightbox, count]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    go(delta < 0 ? 1 : -1);
  };

  // A specific vehicle cannot be published without at least one image (see `ImageSet`),
  // so this is a defensive guard rather than a state the site renders. It shows
  // nothing rather than a placeholder announcing a missing asset.
  if (count === 0 || !active) return null;

  return (
    <section aria-label={`${vehicleName} gallery`} className="w-full">
      {/* Stage */}
      <div
        className="group relative w-full overflow-hidden border border-line bg-ink-panel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[4/3] w-full sm:aspect-[3/2] lg:aspect-[3/2]">
          {images.map((image, i) =>
            isNear(i) ? (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
                sizes="(min-width: 1280px) 68vw, (min-width: 768px) 92vw, 100vw"
                className={`object-contain transition-opacity duration-500 motion-reduce:transition-none ${
                  i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={i === index ? undefined : true}
              />
            ) : null,
          )}

          <button
            type="button"
            onClick={() => openLightbox(index)}
            className="absolute inset-0 cursor-zoom-in"
          >
            <span className="sr-only">
              Enlarge image {index + 1} of {count}: {active.alt}
            </span>
          </button>

          {count > 1 ? (
            <>
              <GalleryArrow
                direction="prev"
                onClick={() => go(-1)}
                className="left-3 sm:left-4"
              />
              <GalleryArrow
                direction="next"
                onClick={() => go(1)}
                className="right-3 sm:right-4"
              />
            </>
          ) : null}

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/80 to-transparent p-4 sm:p-5">
            {active.caption ? (
              <p className="max-w-md text-xs leading-relaxed text-bone-dim">
                {active.caption}
              </p>
            ) : (
              <span />
            )}
            <p className="label-xs shrink-0 tabular-nums text-bone-dim">
              {String(index + 1).padStart(2, '0')}
              <span className="text-steel-dim"> / {String(count).padStart(2, '0')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail rail */}
      {count > 1 ? (
        <div
          ref={thumbRailRef}
          role="tablist"
          aria-label={`${vehicleName} gallery thumbnails`}
          className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              data-thumb={i}
              aria-selected={i === index}
              aria-label={`Show image ${i + 1} of ${count}`}
              onClick={() => setIndex(i)}
              onDoubleClick={() => openLightbox(i)}
              className={`relative aspect-[4/3] w-20 shrink-0 snap-start overflow-hidden border bg-ink-panel transition-colors duration-300 sm:w-24 ${
                i === index
                  ? 'border-giallo'
                  : 'border-line hover:border-line-strong'
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                loading="lazy"
                sizes="96px"
                className={`object-cover transition-opacity duration-300 ${
                  i === index ? 'opacity-100' : 'opacity-55 hover:opacity-85'
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Lightbox */}
      {lightboxOpen ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex flex-col bg-[#050506]/97 backdrop-blur-sm"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <p id={labelId} className="sr-only">
            {vehicleName} gallery, image {index + 1} of {count}
          </p>

          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
            <p className="label-xs tabular-nums text-bone-dim">
              {String(index + 1).padStart(2, '0')}
              <span className="text-steel-dim"> / {String(count).padStart(2, '0')}</span>
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="inline-flex h-9 items-center gap-2 border border-line-strong px-3 text-xs uppercase tracking-[0.14em] text-bone transition-colors hover:border-line-strong hover:text-bone"
            >
              Close
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
            <div className="relative h-full w-full">
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {count > 1 ? (
              <>
                <GalleryArrow
                  direction="prev"
                  onClick={() => go(-1)}
                  className="left-2 sm:left-6"
                  alwaysVisible
                />
                <GalleryArrow
                  direction="next"
                  onClick={() => go(1)}
                  className="right-2 sm:right-6"
                  alwaysVisible
                />
              </>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-line px-4 py-4 sm:px-6">
            <p className="text-xs leading-relaxed text-bone-dim">
              {active.caption ?? active.alt}
            </p>
            <p className="mt-2 text-[0.6875rem] text-steel-dim">
              Use the arrow keys to move between images, Escape to close.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GalleryArrow({
  direction,
  onClick,
  className = '',
  alwaysVisible = false,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  className?: string;
  alwaysVisible?: boolean;
}) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-ink/70 text-bone backdrop-blur-sm transition duration-300 hover:border-line-strong hover:text-bone focus-visible:opacity-100 ${
        alwaysVisible ? '' : 'opacity-0 group-hover:opacity-100 max-md:opacity-100'
      } ${className}`}
    >
      <span className="sr-only">{isPrev ? 'Previous image' : 'Next image'}</span>
      <span aria-hidden="true" className="text-lg leading-none">
        {isPrev ? '‹' : '›'}
      </span>
    </button>
  );
}
