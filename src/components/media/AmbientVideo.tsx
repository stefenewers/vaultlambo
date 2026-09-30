'use client';

import { useEffect, useRef, useState } from 'react';
import type { MediaVideo } from '@/content/media';

type Props = {
  video: MediaVideo;
  className?: string;
  /**
   * Ambient: muted, looping, starts by itself, no controls, hidden from assistive tech
   * (the surrounding section carries the meaning). Film: native controls and a title,
   * started by the viewer.
   */
  mode: 'ambient' | 'film';
  /** Accessible name, required in film mode. */
  title?: string;
  /** `none` below the fold so nothing is fetched until the viewer is near it. */
  preload?: 'none' | 'metadata' | 'auto';
};

const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Local video, with reduced motion respected.
 *
 * Ambient video has no `autoPlay` attribute. It is started from script, only once it
 * is known that the visitor has not asked for reduced motion — an autoplay attribute
 * would start it for everyone before any preference could be checked. If the
 * preference changes while the page is open, playback follows. Without JavaScript,
 * or if playback is refused, the poster simply stays up.
 */
export function AmbientVideo({ video, className = '', mode, title, preload }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(REDUCED);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (mode !== 'ambient') return;
    const element = ref.current;
    if (!element) return;
    if (reduced) {
      element.pause();
      return;
    }
    // A rejected play() (low-power mode, data saver) just leaves the poster showing.
    element.play().catch(() => undefined);
  }, [mode, reduced]);

  const ambient = mode === 'ambient';

  return (
    <video
      ref={ref}
      className={className}
      poster={video.poster.src}
      muted={ambient}
      loop={ambient}
      playsInline
      controls={!ambient}
      preload={preload ?? (ambient ? 'metadata' : 'none')}
      aria-hidden={ambient ? true : undefined}
      tabIndex={ambient ? -1 : undefined}
      title={ambient ? undefined : title}
      aria-label={ambient ? undefined : title}
      data-reduced-motion={reduced ? 'true' : 'false'}
    >
      {video.mobileSources?.map((source) => (
        <source
          key={source.src}
          src={source.src}
          type={source.type}
          media="(max-width: 767px)"
        />
      ))}
      {video.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
