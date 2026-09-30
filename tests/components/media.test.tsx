/**
 * @vitest-environment jsdom
 *
 * Media components: the brand film renders nothing without footage, local video is
 * muted/inline with a poster, and ambient video never starts for a visitor who has
 * asked for reduced motion.
 */

import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AmbientVideo } from '@/components/media/AmbientVideo';
import { MediaFeature } from '@/components/media/MediaFeature';
import type { MediaVideo } from '@/content/media';

const video: MediaVideo = {
  sources: [
    { src: '/media/film/test.webm', type: 'video/webm' },
    { src: '/media/film/test.mp4', type: 'video/mp4' },
  ],
  mobileSources: [{ src: '/media/film/test-mobile.mp4', type: 'video/mp4' }],
  poster: {
    src: '/media/film/poster.jpg',
    width: 1920,
    height: 1080,
    alt: 'Test poster',
    kind: 'owner-photograph',
  },
};

let reduced = false;
const play = vi.fn(() => Promise.resolve());
const pause = vi.fn();

beforeEach(() => {
  reduced = false;
  play.mockClear();
  pause.mockClear();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce') ? reduced : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: play });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: pause });
});

afterEach(cleanup);

describe('MediaFeature', () => {
  it('renders nothing when no film is configured', () => {
    const { container } = render(<MediaFeature film={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing for a film with neither footage nor an embed', () => {
    const { container } = render(<MediaFeature film={{ title: 'Empty' }} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders local footage with a title, poster and controls, fetching nothing up front', () => {
    const { container, getByRole } = render(
      <MediaFeature film={{ title: 'On delivery', video }} />,
    );
    expect(getByRole('heading', { name: 'On delivery' })).toBeTruthy();
    const element = container.querySelector('video')!;
    expect(element.getAttribute('poster')).toBe('/media/film/poster.jpg');
    expect(element.hasAttribute('controls')).toBe(true);
    expect(element.getAttribute('preload')).toBe('none');
    expect(element.getAttribute('aria-label')).toBe('On delivery');
    // Mobile cut first, gated by a media query.
    const sources = container.querySelectorAll('source');
    expect(sources[0]?.getAttribute('media')).toBe('(max-width: 767px)');
    expect(sources).toHaveLength(3);
  });
});

describe('AmbientVideo', () => {
  it('is muted, looping and inline, with no autoplay attribute', () => {
    const { container } = render(<AmbientVideo video={video} mode="ambient" />);
    const element = container.querySelector('video')!;
    expect(element.muted).toBe(true);
    expect(element.loop).toBe(true);
    expect(element.hasAttribute('playsinline')).toBe(true);
    expect(element.hasAttribute('autoplay')).toBe(false);
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('starts playback when motion is allowed', async () => {
    await act(async () => {
      render(<AmbientVideo video={video} mode="ambient" />);
    });
    expect(play).toHaveBeenCalled();
  });

  it('never starts playback under reduced motion', async () => {
    reduced = true;
    await act(async () => {
      render(<AmbientVideo video={video} mode="ambient" />);
    });
    expect(play).not.toHaveBeenCalled();
  });
});
