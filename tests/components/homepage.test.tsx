/**
 * @vitest-environment jsdom
 *
 * Homepage composition.
 *
 * The page now opens on full-height media and puts the commission directly under it.
 * What has to survive that: renderings are captioned as renderings (in the hero and in
 * the feature), "Start a search" appears only when there is a contact route, the
 * commission CTA is always available, category rows start a brief rather than imply
 * stock, and sections with nothing true to show do not render.
 */

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: { href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
  }: { src: string; alt: string } & React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} />
  ),
  getImageProps: ({ src }: { src: string }) => ({ props: { src, srcSet: src } }),
}));

const contact = vi.hoisted(() => ({ reachable: false, email: null as string | null }));
vi.mock('@/lib/contact', () => ({
  isReachable: () => contact.reachable,
  contactAvailability: () => ({
    form: contact.reachable,
    email: contact.email,
    reachable: contact.reachable,
  }),
}));

import HomePage from '@/app/page';

afterEach(() => {
  cleanup();
  contact.reachable = false;
  contact.email = null;
});

function hero(): HTMLElement {
  return screen.getByRole('region', { name: 'Cars worth finding.' });
}

describe('homepage', () => {
  it('places the recent commission directly after the hero', () => {
    const { container } = render(<HomePage />);
    const sections = container.querySelectorAll(':scope > section');
    expect(sections[0]?.getAttribute('aria-labelledby')).toBe('hero-heading');
    expect(sections[1]?.id).toBe('recent-commission');
  });

  it('captions the hero rendering on screen as a rendering', () => {
    render(<HomePage />);
    expect(within(hero()).getByText(/factory configuration rendering/i)).toBeTruthy();
  });

  it('captions every image in the commission feature by kind', () => {
    render(<HomePage />);
    const feature = document.getElementById('recent-commission')!;
    const figures = feature.querySelectorAll('figure');
    expect(figures.length).toBeGreaterThan(1);

    for (const figure of figures) {
      const caption = figure.querySelector('figcaption')?.textContent?.toLowerCase() ?? '';
      expect(caption, 'every image has a caption').not.toBe('');
      const alt = figure.querySelector('img')?.getAttribute('alt')?.toLowerCase() ?? '';
      // A rendering is never captioned as a photograph, and vice versa.
      if (alt.includes('rendering')) expect(caption).toContain('rendering');
      if (caption.includes('photograph')) expect(caption).not.toContain('rendering');
    }
  });

  it('withholds "Start a search" everywhere when there is no contact route', () => {
    render(<HomePage />);
    expect(screen.queryByRole('link', { name: /start a search/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /^contact/i })).toBeNull();
  });

  it('keeps the commission available when there is no contact route', () => {
    render(<HomePage />);
    const links = within(hero()).getAllByRole('link');
    expect(links[0]?.textContent).toMatch(/view our work/i);
    expect(links[0]?.className).toContain('btn-primary');
  });

  it('leads with "Start a search" once contact is configured', () => {
    contact.reachable = true;
    render(<HomePage />);
    const links = within(hero()).getAllByRole('link');
    expect(links[0]?.textContent).toMatch(/start a search/i);
    expect(links[0]?.className).toContain('btn-primary');
    expect(links.map((l) => l.textContent)).toContainEqual(
      expect.stringMatching(/view our work/i),
    );
    // And the closing frame asks for the brief.
    const closing = screen.getByRole('region', { name: /what are you\s*looking for/i });
    expect(within(closing).getByRole('link', { name: /start a search/i })).toBeTruthy();
  });

  it('sends category rows to the Sourcing page when there is no contact route', () => {
    render(<HomePage />);
    const index = screen.getByRole('region', { name: /what kind of car/i });
    for (const link of within(index).getAllByRole('link')) {
      expect(link.getAttribute('href')).toMatch(/^\/sourcing#/);
    }
  });

  it('opens a category brief in the enquiry form when contact is configured', () => {
    contact.reachable = true;
    render(<HomePage />);
    const index = screen.getByRole('region', { name: /what kind of car/i });
    for (const link of within(index).getAllByRole('link')) {
      const href = link.getAttribute('href') ?? '';
      expect(href).toMatch(/^\/contact\?vehicle=/);
      expect(decodeURIComponent(href)).toContain('sourcing brief');
    }
  });

  it('labels the categories as sourcing categories and example briefs', () => {
    render(<HomePage />);
    expect(screen.getByText(/sourcing categories/i)).toBeTruthy();
    expect(screen.getAllByText(/example briefs/i).length).toBeGreaterThan(0);
  });

  it('renders no brand film section while no footage is configured', () => {
    render(<HomePage />);
    expect(document.getElementById('brand-film')).toBeNull();
  });

  it('has exactly one h1', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });
});
