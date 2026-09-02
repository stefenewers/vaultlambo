'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
   * visited stays mounted so stepping back through the gallery is instant.
   */
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    setMounted((previous) => {
      if (
        previous.has(index) &&
        (index + 1 >= count || previous.has(index + 1)) &&
        (index - 1 < 0 || previous.has(index - 1))
      ) {
        return previous;
      }
      const next = new Set(previous);
      next.add(index);
      if (index + 1 < count) next.add(index + 1);
      if (index - 1 >= 0) next.add(index - 1);
      return next;
    });
  }, [index, count]);

  const thumbRailRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const labelId = useId();

  /**
   * Host node for the lightbox.
   *
   * The dialog is portalled out of the page so everything else can be marked `inert`
   * while it is open. Left in place, the page behind stays in the accessibility tree
   * and in the tab order underneath a full-screen overlay.
   */
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

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

  /* Mount the portal host and make the rest of the document inert while open. */
  useEffect(() => {
    if (!lightboxOpen) return;

    const host = document.createElement('div');
    host.dataset.galleryLightbox = '';
    document.body.appendChild(host);

    const siblings = Array.from(document.body.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && child !== host,
    );
    for (const el of siblings) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setPortalHost(host);

    return () => {
      for (const el of siblings) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
      document.body.style.overflow = previousOverflow;
      host.remove();
      setPortalHost(null);
    };
  }, [lightboxOpen]);

  /* Keyboard control and focus containment, once the dialog is actually in the DOM. */
  useEffect(() => {
    if (!portalHost) return;

    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          closeLightbox();
          return;
        case 'ArrowRight':
          event.preventDefault();
          go(1);
          return;
        case 'ArrowLeft':
          event.preventDefault();
          go(-1);
          return;
        case 'Home':
          event.preventDefault();
          setIndex(0);
          return;
        case 'End':
          event.preventDefault();
          setIndex(count - 1);
          return;
        case 'Tab': {
          const root = dialogRef.current;
          if (!root) return;

          const focusable = Array.from(
            root.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.closest('[hidden]'));

          if (focusable.length === 0) {
            // Nothing to move to — keep focus on the dialog rather than letting it out.
            event.preventDefault();
            root.focus();
            return;
          }

          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;
          const activeEl = document.activeElement;

          /*
           * The dialog container itself is focused on open and is not in `focusable`.
           * Without this branch, the first Shift+Tab escapes into the inert page
           * behind — the exact reverse-tabbing case the trap exists to prevent.
           */
          if (activeEl === root || !root.contains(activeEl)) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
            return;
          }

          if (event.shiftKey && activeEl === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && activeEl === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [portalHost, go, closeLightbox, count]);

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
  // so this is a defensive guard rather than a state the site renders.
  if (count === 0 || !active) return null;

  /** Announced on every change, in both the page and the lightbox. */
  const positionLabel = `Image ${index + 1} of ${count}${
    active.caption ? `. ${active.caption}` : ''
  }`;

  return (
    <section aria-label={`${vehicleName} gallery`} className="w-full">
      {/* Stage */}
      <div
        className="group relative w-full overflow-hidden border border-line bg-ink-panel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
          {images.map((image, i) =>
            mounted.has(i) ? (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                /*
                 * Only the first stage image is a genuine LCP candidate. Everything
                 * else, including neighbours prefetched for fast navigation, loads
                 * lazily.
                 */
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

      {/* Announce stage changes without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {positionLabel}
      </p>

      {/*
        Thumbnail rail.

        Ordinary buttons rather than a tab/tablist: the previous markup declared
        role="tab" without a matching tabpanel, roving tabindex or arrow-key handling,
        which promises a keyboard contract the component did not implement. Each button
        names the image it selects and marks itself with aria-current when active.
      */}
      {count > 1 ? (
        <div
          ref={thumbRailRef}
          className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              data-thumb={i}
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Show image ${i + 1} of ${count}: ${image.caption ?? image.alt}`}
              onClick={() => setIndex(i)}
              className={`relative aspect-[4/3] w-20 shrink-0 snap-start overflow-hidden border bg-ink-panel transition-colors duration-300 motion-reduce:transition-none sm:w-24 ${
                i === index ? 'border-giallo' : 'border-line hover:border-line-strong'
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                loading="lazy"
                sizes="96px"
                className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
                  i === index ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Lightbox, portalled to the body so the page behind can be made inert. */}
      {portalHost
        ? createPortal(
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
                {vehicleName} gallery
              </p>
              <p aria-live="polite" className="sr-only">
                {positionLabel}
              </p>

              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
                <p className="label-xs tabular-nums text-bone-dim">
                  {String(index + 1).padStart(2, '0')}
                  <span className="text-steel-dim">
                    {' '}
                    / {String(count).padStart(2, '0')}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex h-11 items-center gap-2 border border-line-strong px-4 text-xs uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone hover:text-bone"
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
                <p className="mt-2 text-xs text-steel-dim">
                  Use the arrow keys to move between images, Escape to close.
                </p>
              </div>
            </div>,
            portalHost,
          )
        : null}
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
      className={`absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-ink/70 text-bone backdrop-blur-sm transition duration-300 hover:border-bone motion-reduce:transition-none focus-visible:opacity-100 ${
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
