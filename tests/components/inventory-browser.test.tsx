/**
 * @vitest-environment jsdom
 *
 * Inventory filtering.
 *
 * Filter state lives in the URL rather than in component state, so a filtered view can
 * be shared and the browser's back button steps through filter changes. These tests
 * assert the URL is actually written, and that the filter bar is withheld entirely for
 * an inventory too small to be worth filtering.
 */

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { InventoryVehicle } from '@/lib/types';

const routerState = vi.hoisted(() => ({
  params: new URLSearchParams(),
  push: vi.fn<(href: string) => void>(),
  replace: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerState.push, replace: routerState.replace }),
  usePathname: () => '/inventory',
  useSearchParams: () => routerState.params,
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const { InventoryBrowser } = await import('@/components/vehicles/InventoryBrowser');

function vehicle(
  slug: string,
  make: string,
  year: number,
  category: InventoryVehicle['category'],
): InventoryVehicle {
  return {
    kind: 'inventory',
    published: true,
    slug,
    make,
    model: 'Test Model',
    year,
    category,
    bodyStyle: 'Coupe',
    availability: 'available',
    priceDisplay: 'Price on request',
    summary: `${make} summary`,
    description: ['Body copy.'],
    specs: [
      { label: 'Engine', value: 'V8' },
      { label: 'Drivetrain', value: 'RWD' },
      { label: 'Body', value: 'Coupe' },
    ],
    images: [
      {
        src: `/images/${slug}.jpg`,
        alt: `${make} photograph`,
        width: 1200,
        height: 800,
        kind: 'vehicle-photograph',
      },
    ],
  };
}

const fleet: InventoryVehicle[] = [
  vehicle('a', 'Porsche', 2023, 'Performance'),
  vehicle('b', 'Ferrari', 2024, 'Performance'),
  vehicle('c', 'Bentley', 2022, 'Grand Touring'),
  vehicle('d', 'Land Rover', 2024, 'Luxury SUV'),
];

beforeEach(() => {
  routerState.params = new URLSearchParams();
  routerState.push.mockReset();
  routerState.replace.mockReset();
});

afterEach(cleanup);

describe('InventoryBrowser', () => {
  it('withholds the filter bar for a small inventory', () => {
    render(<InventoryBrowser vehicles={fleet.slice(0, 2)} />);

    expect(screen.queryByLabelText(/Search inventory/i)).toBeNull();
    // The cars themselves are still listed.
    expect(screen.getByText('Porsche summary')).toBeInTheDocument();
  });

  it('shows the filter bar once there is enough to filter', () => {
    render(<InventoryBrowser vehicles={fleet} />);
    expect(screen.getByLabelText(/Search inventory/i)).toBeInTheDocument();
  });

  it('writes a chosen filter to the URL as a history entry', async () => {
    const user = userEvent.setup();
    render(<InventoryBrowser vehicles={fleet} />);

    await user.selectOptions(screen.getByLabelText('Make'), 'Ferrari');

    expect(routerState.push).toHaveBeenCalledWith('/inventory?make=Ferrari', {
      scroll: false,
    });
  });

  it('reads filters back out of the URL', () => {
    routerState.params = new URLSearchParams('category=Luxury+SUV');
    render(<InventoryBrowser vehicles={fleet} />);

    expect(screen.getByText('Land Rover summary')).toBeInTheDocument();
    expect(screen.queryByText('Porsche summary')).toBeNull();
  });

  it('ignores a filter value nothing in the data has', () => {
    // A hand-edited or stale URL must not produce a filtered view with no way back.
    routerState.params = new URLSearchParams('make=Bugatti');
    render(<InventoryBrowser vehicles={fleet} />);

    expect(screen.getByText('Porsche summary')).toBeInTheDocument();
    expect(screen.getByText('Ferrari summary')).toBeInTheDocument();
  });

  it('replaces rather than pushes while typing a search', async () => {
    const user = userEvent.setup();
    render(<InventoryBrowser vehicles={fleet} />);

    await user.type(screen.getByLabelText(/Search inventory/i), 'Ferrari');

    // Typing must not leave one history entry per keystroke.
    await vi.waitFor(() => expect(routerState.replace).toHaveBeenCalled());
    expect(routerState.push).not.toHaveBeenCalled();
  });

  it('filters the grid live while typing, before the URL catches up', async () => {
    const user = userEvent.setup();
    render(<InventoryBrowser vehicles={fleet} />);

    await user.type(screen.getByLabelText(/Search inventory/i), 'Ferrari');

    expect(screen.getByText('Ferrari summary')).toBeInTheDocument();
    expect(screen.queryByText('Porsche summary')).toBeNull();
  });

  it('offers a way out when filters exclude everything', async () => {
    const user = userEvent.setup();
    routerState.params = new URLSearchParams('make=Porsche&category=Luxury+SUV');
    render(<InventoryBrowser vehicles={fleet} />);

    expect(screen.getByText(/Nothing matches those filters/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(routerState.push).toHaveBeenCalledWith('/inventory', { scroll: false });
  });
});
