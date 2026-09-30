# Media: what exists, and what is needed

The site is built to be media-led: a full-height hero, a large commission feature,
detail views, and a brand-film section. It can only be as good as the media behind it,
and today that is one car's configurator renderings and one phone photograph.

**Only media the business has the right to publish belongs on this site.** No
third-party car photography, nothing downloaded from dealer, auction, press or
reference sites (including hypercars.com, which informed the design direction only),
and no stock imagery. Renderings are always captioned as renderings.

---

## 1. Current asset inventory

Everything in `public/` today. Source material is in `private-source/` (git-ignored,
never served).

| Asset | Source | Rights / provenance | Type | Dimensions | File size | Current usage | Recommended usage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `images/vehicles/lamborghini-temerario-giallo-inti/01-front-three-quarter.jpg` | Extracted from the car's Lamborghini configuration PDF | Owner supplied — all rights reserved | Factory configuration rendering | 1123×794 | 176 KB | **Homepage hero** (captioned), detail-page lead image, gallery | Keep as the hero fallback until owner footage exists |
| `…/02-rear-three-quarter.jpg` | Configuration PDF | Owner supplied | Factory rendering | 1123×794 | 150 KB | Homepage commission feature (lead), gallery | As is |
| `…/03-forged-wheel-detail.jpg` | Configuration PDF | Owner supplied | Factory rendering | 1123×553 | 113 KB | Homepage detail strip, gallery | As is |
| `…/04-roof-top-view.jpg` | Configuration PDF | Owner supplied | Factory rendering | 1123×559 | 92 KB | Homepage detail strip, gallery | As is |
| `…/05-cockpit.jpg` | Configuration PDF | Owner supplied | Factory rendering | 1123×794 | 156 KB | Homepage detail strip, gallery | As is |
| `…/06-seat-stitching-detail.jpg` | Configuration PDF | Owner supplied | Factory rendering | 561×559 | 46 KB | Gallery | Gallery only — too small for anything larger |
| `…/07-cabin.jpg` | Configuration PDF | Owner supplied | Factory rendering | 561×561 | 49 KB | Gallery | Gallery only |
| `…/08-cabin-passenger-side.jpg` | Configuration PDF | Owner supplied | Factory rendering | 1123×794 | 161 KB | Gallery | As is |
| `…/09-console-passenger-display.jpg` | Configuration PDF | Owner supplied | Factory rendering | 370×705 | 51 KB | Gallery | Gallery only |
| `…/10-delivery-photograph.jpg` | Owner's photograph of the car on delivery | Owner supplied | **Photograph** of this car | 960×1280 | 170 KB | Homepage detail strip, detail page "Photographed on delivery" | As is. The only photograph on the site |

| `images/vehicles/ferrari-sf90-spider-assetto-fiorano/01–08-*.jpg` (8 files) | Exotic Cars — their listing photography (`exoticcars.ae`), shot on a Sony A7 III | **Used with the rights holder's permission** (joint commission; confirmed by the owner 2026-09-29). Credited in every caption | Photographs of this car | 1500×1000 each | 290–425 KB | SF90 commission page gallery; `/commissions` list | As is. Ask Exotic Cars for full-resolution originals and a whole-car exterior |

| `images/vehicles/lamborghini-sian-roadster/01–10-*.jpg` (10 files) | Exotic Cars — their studio photography, supplied without metadata | **Used with the rights holder's permission** (joint commission; confirmed 2026-09-29). Credited in every caption | Photographs of this car, including **three whole-car studio views** | 1140–1500px wide; 01–03 are ~1500×655 panoramas | 100–440 KB | Sián commission page | **Strongest real photography on the site.** `01-front-three-quarter` is a candidate homepage hero (see owner decisions) |

`04-rear-wing-and-lights` is cropped to remove the dealer's number plate. The as-supplied
set is in `private-source/lamborghini-sian-roadster/as-supplied/`.

Held in `private-source/ferrari-sf90-spider-assetto-fiorano/as-supplied/` and **not
published**: the odometer close-up (reads 711 km against a listed 70 km), a rear-diffuser
close-up showing the partner's number plate, and three 612px whole-car screenshots
carrying the partner's branding.

There are no videos and no brand photography.

### Honest assessment

The existing set **cannot reach the reference quality** on its own:

- **Resolution.** 1123px is the ceiling. The configuration PDF was checked, and it holds
  nothing larger (its one bigger image is a mask). At full bleed on a 1440px screen these
  are upscaled about 1.3× (about 2.5× on a Retina display), so they soften. The layouts
  hold them inside the wide measure rather than the full viewport for that reason.
- **Kind.** Nine of ten are configurator renderings. They show the specification
  accurately, but they are not photographs of the delivered car, and the site never
  presents them as such.
- **Motion.** There is no footage at all. The hero, the brand film section and the
  motion system are built for it and are waiting on it.

---

## 2. Where to put new media

| What | Put files in | Then configure |
| --- | --- | --- |
| Hero video + posters | `public/media/hero/` | `heroMedia` in `src/content/media.ts` |
| Brand film | `public/media/film/` | `brandFilm` in `src/content/media.ts` |
| Brand film on YouTube/Vimeo (only if deliberately chosen) | — | `brandFilmEmbed` in `src/content/media-embed.ts`. This also opens the CSP `frame-src` to that one player origin |
| Photographs of a specific car | `public/images/vehicles/<slug>/` | That car's record in `src/data/`, with `kind: 'vehicle-photograph'`, plus a row in `src/data/image-sources.ts` |

Components do not need editing. `heroMedia` examples are in the comments of
`src/content/media.ts`. A test (`tests/media.test.ts`) fails the build if a configured
file is missing, if a rendering lacks a "rendering" caption, or if anything is
hotlinked.

When a media file is added, add a row to the inventory table above.

---

## 3. What to shoot

Everything below must be shot by, or licensed to, the business, and cleared by the car's
owner where the car is identifiable. Registration plates and VINs should be obscured or
avoided.

### Hero

| Asset | Spec | Target size | Notes |
| --- | --- | --- | --- |
| Horizontal driving/detail film | 10–20 s loop, 16:9, 1920×1080 (4K master, 1080p delivery), 24/25 fps, **no audio track** | WebM (VP9/AV1) ≤ 4 MB; MP4 (H.264, `+faststart`) ≤ 6 MB | Slow, controlled movement. Detail passes, rolling shots, light across bodywork. Loop point should be invisible. Dark-to-mid tones hold white type best |
| Mobile cut | 9:16 or 4:5, 1080×1920 / 1080×1350, 8–12 s | MP4 ≤ 2.5 MB | Separately framed, not a crop of the horizontal. Subject centred low, headroom for type |
| Desktop poster | First frame of the film, 2560×1440 | JPEG/WebP ≤ 350 KB | Shown before playback, to reduced-motion visitors, and if video fails |
| Mobile poster | 1080×1920 | ≤ 250 KB | Configure as `mobileStill` |

### Temerario (or any future commission)

Real photographs of the delivered car would replace the renderings as the lead imagery.
Shoot in one location, one light, one session, so the set reads as a set.

| Shot | Aspect | Minimum resolution |
| --- | --- | --- |
| Front three-quarter | 3:2 and 4:5 | 4000px long edge |
| Rear three-quarter | 3:2 | 4000px |
| Full side profile | 21:9 / 3:2 | 4000px |
| Interior wide (driver's door open) | 3:2 | 4000px |
| Steering wheel / cockpit | 4:5 | 3000px |
| Wheel and brake (Velador wheel, Nero Lucido CCB caliper) | 1:1 or 4:5 | 3000px |
| Stitching / Giallo Taurus detail | 1:1 | 3000px |
| Badge / script | 1:1 | 3000px |
| Delivery / handover moment | 3:2 | 4000px (only with the client's permission) |
| Rolling footage | 16:9, 1080p+ | 10–30 s clips |
| Start-up footage | 16:9, 1080p+, **with audio** | 10–20 s; for the brand film, not the hero |

Export photographs as high-quality JPEG (≈85%) at the long edge above. `next/image`
generates the responsive sizes.

### Brand

| Shot | Use |
| --- | --- |
| Hands on documents: configuration summaries, service books, inspection reports (with identifying details obscured) | Process, principles |
| Inspection in progress (with the inspector's permission) | Process |
| Transport and delivery: covered transporter, unloading | Process, "Handover" step |
| Client handover | Only with explicit permission |
| Detail and texture: paint, stitching, carbon, badges | Section breaks, category rows |

A 60–120 second **brand film** cut from the above (a search, a delivery) would fill the
brand film section. Deliver as 1080p WebM + MP4 with a 1920×1080 poster. It loads only
when the viewer presses play.

### Category imagery (optional, later)

The category rows are typographic. One approved image per category (Performance, Grand
Touring, Luxury SUV, Collector) could be revealed on hover: 1600×1000, ≤ 200 KB each, and
only of cars the business has handled or has rights to show.

---

## 4. Rules that do not bend

- A rendering is captioned as a rendering, everywhere, and never used as proof that a car
  was photographed.
- Photographs of other people's cars, or of cars the business did not handle, do not
  appear, however well licensed.
- Nothing is hotlinked. Every file is served from `public/`.
- Only the hero's poster/still is loaded eagerly. Everything else is lazy, and the brand
  film fetches nothing until played.
