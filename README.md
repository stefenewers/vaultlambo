# Marlowe Motorcars

An independent luxury and performance car dealer site, built with Next.js 15
(App Router), TypeScript and Tailwind CSS v4. Dark editorial layout with a filterable
inventory, per-vehicle detail pages, a sold-vehicle record and a sourcing enquiry flow.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, featured inventory, browse by category, recently sold, sourcing |
| `/inventory` | Full list with client-side search and filters |
| `/inventory/[slug]` | Vehicle detail template (gallery, specs, equipment, similar) |
| `/sold-vehicles` | Cars that have sold (`/sold` permanently redirects here) |
| `/sourcing` | How a search is run, and how to send a brief |
| `/about` | Short positioning statement |
| `/contact` | Enquiry form with validation and a success state |
| `/api/inquiries` | Enquiry sink — validates and logs; swap in a real provider |
| `/sitemap.xml`, `/robots.txt` | Generated from the vehicle data |

Every vehicle route is pre-rendered via `generateStaticParams`, so detail pages resolve
on a cold refresh. Unknown slugs fall through to `src/app/not-found.tsx`.

The inventory page reads `?category=` and `?availability=` on load, which is how the
home page category row and the footer links deep-link into a filtered view.

## Where to change things

### Site name and contact details

**`src/site.config.ts`** — the only place any brand string lives. Company name, the
two-part wordmark (`MARLOWE` / `MOTORCARS`), tagline, email, phone, location,
response-time line, social links, navigation, and every legal string. No component
hard-codes any of these.

The canonical origin is resolved rather than hard-coded, because a wrong canonical on a
live site points search engines at the wrong host. Order of precedence:

1. `CANONICAL_URL` at the top of `src/site.config.ts` — set this once a real domain is
   in place
2. `NEXT_PUBLIC_SITE_URL`
3. `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL` (both set automatically on Vercel)
4. `http://localhost:3000`

It is only ever read on the server — in `layout.tsx`, `sitemap.ts`, `robots.ts` and
`lib/jsonld.ts`.

### Vehicle data

**`src/data/vehicles.ts`** — the inventory records and the exported `vehicles` array.
**`src/data/temerario.ts`** — kept separate because its content is transcribed from an
actual factory configuration document.

The shape is defined in `src/lib/types.ts`. Notable fields:

- `year` is **optional** — a vehicle carries a year only when the year is genuinely
  known. Nothing is inferred.
- `priceDisplay` is a string, not a number. There are no numeric prices in this data
  set; every listed car uses `'Price on request'`, and the price line is hidden
  entirely once a car is sold.
- `availability` is `'available' | 'reserved' | 'sold'`.
- `category` is `'Performance' | 'Grand Touring' | 'Luxury SUV' | 'Collector'` and
  drives the browse-by-category row, the footer links and the inventory filter. Adding
  a category means extending `Category` in `src/lib/types.ts` and `CATEGORY_ORDER` /
  `CATEGORY_BLURB` in `src/lib/vehicles.ts`.
- `documentation` is set only for cars that came with a factory configuration summary.
  It switches the specification section's heading to "Configuration".

### Imagery

Vehicle photography lives in **`public/images/vehicles/<slug>/`**. Add the files, then
list them in that vehicle's `images` array with `src`, `alt`, `width` and `height`.
`alt` is required by the type — it is never decorative on this site.

While a vehicle's `images` array is empty, the card, the gallery and the sold-list
thumbnail fall back to `VehicleImagePanel` — a typographic charcoal panel carrying the
marque, model and category. It is a deliberate treatment rather than a missing-asset
state, and it disappears the moment an image is added, with no other change needed.

No stock imagery or remote image hosts are configured; `next.config.ts` deliberately
declares no `remotePatterns`.

### The Temerario's availability status

**`src/data/temerario.ts`** — change `availability` (`'available' | 'pending' | 'sold'`)
and `statusNote` (the short line beside the chip, currently `'Custom order fulfilled'`).
The badge, the detail-page CTA wording, the home page featured slot and the `/sold`
listing all follow from those two fields.

The Temerario appears in `/sold-vehicles` and in the Recently Sold list on the home
page. It is not featured anywhere else — the home page hero is typographic and shows no
single car.

### Copy

**`src/content/copy.ts`** — headlines, intros and section text for the home, about,
sourcing, contact, inventory and sold pages, plus the hero marque line. Components read
from it; they don't contain prose.

### Wiring up email

`src/app/api/inquiries/route.ts` validates the submission and currently logs it
server-side. Replace the `deliverInquiry` function with a Resend, Formspree or SMTP
call — the contract (validated payload in, throw on failure) is all the form depends
on. The form posts to `siteConfig.inquiryEndpoint`, so pointing it at a third-party
endpoint instead is a one-line change.

## Components

| Component | Purpose |
| --- | --- |
| `VehicleCard` | Grid card — image, title, metadata, status, "View vehicle" |
| `VehicleGallery` | Stage, thumbnail rail, lightbox, keyboard and touch navigation |
| `AvailabilityBadge` | Quiet status chip in three sizes, with an optional qualifier |
| `SpecRow` / `SpecSection` | Metadata strip and the two-column grouped equipment layout |
| `FilterBar` | Search plus availability / make / category / year, mobile disclosure |
| `InventoryBrowser` | Owns filter state, reads deep-link params, renders the grid |
| `InquiryForm` | Client-side validation, honeypot, submitting and success states |
| `VehicleThumb` | Lead image, falling back to `VehicleImagePanel` |
| `VehicleImagePanel` | Typographic stand-in for listings without photography |

## Accessibility

- Skip link, landmark structure, and a visible focus ring on every interactive element.
- The lightbox is a modal dialog: focus trap, `Escape` to close, `←`/`→`/`Home`/`End`
  to navigate, focus returned to the opener on close, scroll lock while open.
- The gallery supports touch swipe on both the stage and the lightbox.
- Filter results are announced through a polite live region.
- Form errors are tied to inputs with `aria-describedby` / `aria-invalid`, and focus
  moves to the first invalid field on submit.
- `prefers-reduced-motion` disables transitions and smooth scrolling.

## Structured data

`src/lib/jsonld.ts` emits an `AutoDealer` block site-wide and a `Vehicle` block on each
detail page. It is deliberately conservative: no `offers`, `price`,
`vehicleIdentificationNumber`, `mileageFromOdometer`, `itemCondition` or `seller`,
because none of those are known. Optional fields are emitted only when the data
actually holds them.

## Source material

`private-source/` holds the owner-supplied configuration PDF, the original photograph
and the supplied configurator renders. It is git-ignored and never served — the site
references the existence of that documentation but does not publish it. See
`private-source/README.md`.

## Notes on content accuracy

Listing copy and equipment lists describe the model and its factory specification.
Per-car facts that are not held — mileage, service history, registration, ownership,
price — are omitted rather than invented, which is why `priceDisplay` is a string and
why `year` is optional on the `Vehicle` type.

The Temerario's configuration is transcribed from the car's own factory configuration
summary. It carries no VIN, price, mileage, registration, location, prior owner,
history or transaction date.

The site makes no claim of affiliation with any manufacturer, invents no company
history, location, sales figures or awards, and carries no reviews, press logos, buyer
names or activity feeds.
