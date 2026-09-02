/**
 * @vitest-environment jsdom
 *
 * Gallery behaviour: lazy stage mounting, navigation, and the lightbox contract.
 *
 * The lazy-mounting assertions exist because of a specific regression. The stage
 * cross-fades between images by stacking them and animating opacity, which meant every
 * full-resolution image in the gallery was in the DOM — and therefore downloaded — on
 * first paint. On the Temerario that was ten large images to show one.
 */

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VehicleImage } from '@/lib/types';

/** next/image needs a real layout pipeline; a plain img is enough to assert mounting. */
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    sizes,
    priority,
    fill,
    loading,
    ...rest
  }: {
    src: string;
    alt: string;
    sizes?: string;
    priority?: boolean;
    fill?: boolean;
    loading?: 'lazy' | 'eager';
  } & React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src={src}
      alt={alt}
      data-sizes={sizes}
      data-priority={priority ? 'true' : 'false'}
      data-fill={fill ? 'true' : undefined}
      loading={loading}
      {...rest}
    />
  ),
}));

const { VehicleGallery } = await import('@/components/vehicles/VehicleGallery');

const IMAGE_COUNT = 10;

const images: VehicleImage[] = Array.from({ length: IMAGE_COUNT }, (_, i) => ({
  src: `/images/test/${i + 1}.jpg`,
  alt: `Alt text for image ${i + 1}`,
  caption: `Caption ${i + 1}`,
  width: 1200,
  height: 800,
  kind: 'factory-render' as const,
}));

/** Stage images carry the responsive `sizes`; thumbnails are a fixed 96px. */
function stageImages(): HTMLElement[] {
  return screen
    .getAllByRole('img', { hidden: true })
    .filter((el) => el.getAttribute('data-sizes') !== '96px');
}

afterEach(cleanup);

describe('VehicleGallery', () => {
  it('mounts only the first image and its neighbour, not the whole gallery', () => {
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    // Index 0 plus its forward neighbour. Emphatically not all ten.
    expect(stageImages()).toHaveLength(2);
    expect(stageImages().length).toBeLessThan(IMAGE_COUNT);
  });

  it('gives priority to the first stage image only', () => {
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    const prioritised = stageImages().filter(
      (el) => el.getAttribute('data-priority') === 'true',
    );
    expect(prioritised).toHaveLength(1);
    expect(prioritised[0]).toHaveAttribute('src', images[0]!.src);
  });

  it('advances with the next control and widens the mounted window', async () => {
    const user = userEvent.setup();
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    await user.click(screen.getAllByRole('button', { name: 'Next image' })[0]!);

    // Now at index 1, so 0, 1 and 2 are mounted — still far short of ten.
    expect(stageImages()).toHaveLength(3);
    expect(screen.getAllByText('Caption 2').length).toBeGreaterThan(0);
  });

  it('selects an image from the thumbnail rail and marks it current', async () => {
    const user = userEvent.setup();
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    const thumb = screen.getByRole('button', {
      name: `Show image 5 of ${IMAGE_COUNT}: Caption 5`,
    });
    await user.click(thumb);

    expect(thumb).toHaveAttribute('aria-current', 'true');
    expect(screen.getAllByText('Caption 5').length).toBeGreaterThan(0);
  });

  it('uses plain buttons rather than an incomplete tab pattern', () => {
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    // role="tab" without a tabpanel, roving tabindex or arrow-key handling promises a
    // keyboard contract this component does not implement.
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryAllByRole('tablist')).toHaveLength(0);
  });

  it('opens the lightbox, makes the page inert, and restores on Escape', async () => {
    const user = userEvent.setup();
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    const opener = screen.getByRole('button', {
      name: `Enlarge image 1 of ${IMAGE_COUNT}: ${images[0]!.alt}`,
    });
    await user.click(opener);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Everything outside the portal host is inert, so the page behind is out of both
    // the tab order and the accessibility tree.
    const host = dialog.parentElement!;
    const others = Array.from(document.body.children).filter((c) => c !== host);
    expect(others.length).toBeGreaterThan(0);
    for (const el of others) {
      expect(el).toHaveAttribute('inert');
      expect(el).toHaveAttribute('aria-hidden', 'true');
    }

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    for (const el of others) {
      expect(el).not.toHaveAttribute('inert');
      expect(el).not.toHaveAttribute('aria-hidden');
    }
    expect(document.activeElement).toBe(opener);
  });

  it('navigates the lightbox with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    await user.click(
      screen.getByRole('button', {
        name: `Enlarge image 1 of ${IMAGE_COUNT}: ${images[0]!.alt}`,
      }),
    );

    const dialog = screen.getByRole('dialog');
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText('Caption 2')).toBeInTheDocument();

    await user.keyboard('{End}');
    expect(within(dialog).getByText(`Caption ${IMAGE_COUNT}`)).toBeInTheDocument();

    await user.keyboard('{Home}');
    expect(within(dialog).getByText('Caption 1')).toBeInTheDocument();
  });

  it('traps reverse tabbing from the initially focused dialog', async () => {
    const user = userEvent.setup();
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    await user.click(
      screen.getByRole('button', {
        name: `Enlarge image 1 of ${IMAGE_COUNT}: ${images[0]!.alt}`,
      }),
    );

    const dialog = screen.getByRole('dialog');
    // The dialog container itself holds focus on open and is not in the focusable
    // list, so the first Shift+Tab used to escape into the page behind.
    expect(document.activeElement).toBe(dialog);

    await user.tab({ shift: true });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
