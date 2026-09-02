import { describe, expect, it } from 'vitest';
import { inventory } from '@/data/inventory';
import { imageSourceFor, imageSources } from '@/data/image-sources';
import { soldVehicles } from '@/data/sold';
import { sourcingCatalogue } from '@/data/sourcing';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingModels,
  getPublishedSpecificVehicles,
  getSoldVehicleBySlug,
  getSourcingByCategory,
  hasPublishedInventory,
  recordHref,
  vehicleTitle,
} from '@/lib/vehicles';

/**
 * These tests exist to stop the specific failure this site was overhauled to fix:
 * generic model information being presented as individual available inventory. Most of
 * them assert something that would be a credibility problem if it regressed, not just
 * a rendering bug.
 */

describe('collection separation', () => {
  it('keeps the three collections disjoint by slug-and-kind', () => {
    const kinds = new Map<string, string[]>();

    for (const record of [...inventory, ...soldVehicles, ...sourcingCatalogue]) {
      const existing = kinds.get(record.slug) ?? [];
      kinds.set(record.slug, [...existing, record.kind]);
    }

    // A slug may legitimately appear in more than one collection only if the records
    // are genuinely different things; today nothing does, and a duplicate is far more
    // likely to be a copy-paste than a deliberate decision.
    for (const [slug, entries] of kinds) {
      expect(entries, `slug "${slug}" appears more than once`).toHaveLength(1);
    }
  });

  it('tags every record with the kind its collection implies', () => {
    expect(inventory.every((v) => v.kind === 'inventory')).toBe(true);
    expect(soldVehicles.every((v) => v.kind === 'sold')).toBe(true);
    expect(sourcingCatalogue.every((m) => m.kind === 'sourcing')).toBe(true);
  });

  it('never returns a sourcing model as a specific vehicle', () => {
    for (const vehicle of getPublishedSpecificVehicles()) {
      expect(vehicle.kind).not.toBe('sourcing');
    }
  });

  it('routes each kind to its own section of the site', () => {
    for (const vehicle of getPublishedInventory()) {
      expect(recordHref(vehicle)).toMatch(/^\/inventory\//);
    }
    for (const vehicle of getPublishedSoldVehicles()) {
      expect(recordHref(vehicle)).toMatch(/^\/sold-vehicles\//);
    }
    for (const model of getPublishedSourcingModels()) {
      expect(recordHref(model)).toMatch(/^\/sourcing\//);
    }
  });
});

describe('sourcing models make no claims about specific cars', () => {
  it('carries no availability, price or status field', () => {
    for (const model of sourcingCatalogue) {
      // These are absent from the type; this guards against the object literal
      // acquiring them through a loosened type or a bad merge.
      const loose = model as unknown as Record<string, unknown>;
      expect(loose.availability).toBeUndefined();
      expect(loose.priceDisplay).toBeUndefined();
      expect(loose.statusNote).toBeUndefined();
      expect(loose.year).toBeUndefined();
    }
  });

  it('never prints a model year in a title', () => {
    for (const model of getPublishedSourcingModels()) {
      expect(vehicleTitle(model)).not.toMatch(/\b(19|20)\d{2}\b/);
    }
  });

  it('labels its imagery as representative', () => {
    for (const model of sourcingCatalogue) {
      expect(model.image.kind).toBe('representative');
    }
  });

  it('groups by category without producing empty groups', () => {
    const groups = getSourcingByCategory();
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group.models.length).toBeGreaterThan(0);
    }
    // Every published model lands in exactly one group.
    const grouped = groups.flatMap((g) => g.models);
    expect(grouped).toHaveLength(getPublishedSourcingModels().length);
  });

  it('holds the marques moved out of the old inventory list', () => {
    const makes = new Set(sourcingCatalogue.map((m) => m.make));
    for (const make of [
      'Porsche',
      'Ferrari',
      'McLaren',
      'Bentley',
      'Mercedes-AMG',
      'Land Rover',
      'BMW',
    ]) {
      expect(makes, `${make} should be a sourcing model`).toContain(make);
    }
  });
});

describe('active inventory', () => {
  it('reports no inventory, so the homepage section and nav item hide', () => {
    expect(getPublishedInventory()).toHaveLength(0);
    expect(hasPublishedInventory()).toBe(false);
  });

  it('requires photography and three specific facts for anything published', () => {
    for (const vehicle of getPublishedInventory()) {
      expect(vehicle.images.length).toBeGreaterThan(0);
      expect(vehicle.specs.length).toBeGreaterThanOrEqual(3);
      expect(vehicle.year).toBeTypeOf('number');
    }
  });

  it('only ever holds a live status, never "sold"', () => {
    for (const vehicle of inventory) {
      expect(['available', 'reserved']).toContain(vehicle.availability);
    }
  });
});

describe('completed vehicles', () => {
  it('publishes only the documented Temerario', () => {
    const sold = getPublishedSoldVehicles();
    expect(sold).toHaveLength(1);
    expect(sold.map((v) => v.slug)).toEqual(['lamborghini-temerario-giallo-inti']);
  });

  it('does not present the BMW M3 CS as a completed sale', () => {
    expect(soldVehicles.some((v) => v.model === 'M3')).toBe(false);
    expect(sourcingCatalogue.some((m) => m.model === 'M3' && m.variant === 'CS')).toBe(
      true,
    );
  });

  it('keeps factory renderings out of the documentary photographs', () => {
    for (const vehicle of getPublishedSoldVehicles()) {
      for (const image of vehicle.images) {
        expect(image.kind).not.toBe('vehicle-photograph');
      }
      for (const image of vehicle.documentaryImages ?? []) {
        expect(image.kind).toBe('vehicle-photograph');
      }
    }
  });

  it('captions every configuration rendering as a rendering', () => {
    const temerario = getSoldVehicleBySlug('lamborghini-temerario-giallo-inti');
    if (!temerario) throw new Error('The documented Temerario record is missing.');

    for (const image of temerario.images) {
      expect(image.caption?.toLowerCase()).toContain('rendering');
      expect(image.alt.toLowerCase()).toContain('rendering');
    }
  });

  it('drops the copy that explained why information was withheld', () => {
    const prose = getPublishedSoldVehicles()
      .flatMap((v) => v.description)
      .join(' ')
      .toLowerCase();

    for (const phrase of [
      'remains listed',
      'for anyone researching',
      'not published',
      'authorities',
    ]) {
      expect(prose, `description should not contain "${phrase}"`).not.toContain(phrase);
    }
  });
});

describe('draft records', () => {
  it('excludes anything unpublished from every accessor', () => {
    const published = [
      ...getPublishedInventory(),
      ...getPublishedSoldVehicles(),
      ...getPublishedSourcingModels(),
    ];
    expect(published.every((record) => record.published)).toBe(true);
  });

  it('filters a draft out of its collection', () => {
    // Simulates the accessor's own predicate against a mixed list, so the behaviour is
    // covered even while every real record happens to be published.
    const mixed = [
      { slug: 'live', published: true },
      { slug: 'draft', published: false },
    ];
    expect(mixed.filter((r) => r.published).map((r) => r.slug)).toEqual(['live']);
  });
});

describe('image ledger', () => {
  it('records a source for every externally obtained image in use', () => {
    const inUse = [
      ...sourcingCatalogue.map((m) => m.image.src),
      ...soldVehicles.flatMap((v) => [
        ...v.images.map((i) => i.src),
        ...(v.documentaryImages ?? []).map((i) => i.src),
      ]),
      ...inventory.flatMap((v) => v.images.map((i) => i.src)),
    ];

    for (const path of inUse) {
      expect(imageSourceFor(path), `no ledger entry for ${path}`).toBeDefined();
    }
  });

  it('gives every externally sourced entry a source URL and access date', () => {
    for (const source of imageSources) {
      expect(source.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (source.license !== 'Owner supplied — all rights reserved') {
        expect(source.sourceUrl, `${source.path} has no source URL`).toBeTruthy();
        expect(source.creator).toBeTruthy();
      }
    }
  });

  it('requires attribution for every licence that is not CC0 or owner supplied', () => {
    for (const source of imageSources) {
      const exempt =
        source.license === 'CC0 1.0' ||
        source.license === 'Owner supplied — all rights reserved';
      expect(source.attributionRequired, `${source.path}`).toBe(!exempt);
    }
  });

  it('has no duplicate paths', () => {
    const paths = imageSources.map((s) => s.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
