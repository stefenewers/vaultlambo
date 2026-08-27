# Apex Motor Collection

A boutique vehicle marketplace built with Next.js 15 (App Router), TypeScript and
Tailwind CSS v4. Dark editorial layout, photography-led, with a filterable inventory,
per-vehicle detail pages and a documented sold archive.

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
| `/` | Hero, featured archive vehicle, current inventory, recently sold strip |
| `/inventory` | Full list with client-side search and filters |
| `/inventory/[slug]` | Vehicle detail template (gallery, specs, configuration, similar) |
| `/sold` | Archive of vehicles no longer available |
| `/about` | Positioning and how the collection works |
| `/contact` | Inquiry form with validation and a success state |
| `/api/inquiries` | Inquiry sink — validates and logs; swap in a real provider |
| `/sitemap.xml`, `/robots.txt` | Generated from the vehicle data |

Every vehicle route is pre-rendered via `generateStaticParams`, so detail pages resolve
on a cold refresh. Unknown slugs fall through to `src/app/not-found.tsx`.

## Where to change things

### Site name and contact details

**`src/site.config.ts`** — the only place any brand string lives. Company name, tagline,
canonical URL, email, phone, location, response-time line, social links, navigation,
and every legal/disclaimer string. No component hard-codes any of these.

### Vehicle data

**`src/data/vehicles.ts`** — the six sample listings and the exported `vehicles` array.
**`src/data/temerario.ts`** — the one real record, kept separate because its content is
transcribed from an actual configuration document.

The shape is defined in `src/lib/types.ts`. Notable fields:

- `year` is **optional** — a vehicle only carries a year when the year is genuinely
  known. Nothing is inferred.
- `priceDisplay` is a string, not a number. There are no numeric prices in this data
  set; `'Price on request'` and `'Not published'` are the two values in use.
- `isSample: true` marks a placeholder record. It drives the "Sample listing" marker on
  cards, sets `robots: noindex` on that detail page, excludes the record from the
  sitemap, and suppresses its JSON-LD.

### Imagery

Vehicle photography lives in **`public/images/vehicles/<slug>/`**. Add the files, then
list them in that vehicle's `images` array with `src`, `alt`, `width` and `height`.
`alt` is required by the type — it is never decorative on this site.

While a vehicle's `images` array is empty, `VehicleCard` and `VehicleGallery` fall back
to a neutral "Photography pending" panel (the `.photo-pending` treatment in
`src/app/globals.css`). No stock imagery or remote image hosts are configured;
`next.config.ts` deliberately declares no `remotePatterns`.

### Sample inventory toggle

**`src/site.config.ts` → `showSampleInventoryNotice`.** Set it to `false` to remove the
site-wide "Sample inventory shown for demonstration" notice once the placeholder
listings have been replaced. The notice text itself is
`siteConfig.legal.sampleInventoryNotice`.

### The Temerario's availability status

**`src/data/temerario.ts`** — change `availability` (`'available' | 'pending' | 'sold'`)
and `statusNote` (the short line beside the chip, currently `'Custom order fulfilled'`).
The badge, the detail-page CTA wording, the home page featured slot and the `/sold`
listing all follow from those two fields.

To move it off the home page featured slot, remove `featured: true`.

### Copy

**`src/content/copy.ts`** — headlines, intros and section text for the home, about,
contact, inventory and sold pages. Components read from it; they don't contain prose.

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
| `AvailabilityBadge` | Status chip in four sizes, with an optional qualifier line |
| `SpecRow` / `SpecSection` | Metadata strip and the two-column grouped option layout |
| `FilterBar` | Search plus availability / make / body style / year, mobile disclosure |
| `InventoryBrowser` | Owns filter state and renders the results grid |
| `InquiryForm` | Client-side validation, honeypot, submitting and success states |
| `VehicleThumb` | Lead image with the photography-pending fallback |

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

`src/lib/jsonld.ts` emits an `AutoDealer` block site-wide and a `Vehicle` block on
non-sample detail pages. It is deliberately conservative: no `offers`, `price`,
`vehicleIdentificationNumber`, `mileageFromOdometer`, `itemCondition` or `seller`,
because none of those are known. Optional fields are only emitted when the data
actually holds them.

## Source material

`private-source/` holds the owner-supplied configuration PDF, the original photograph
and the supplied configurator renders. It is git-ignored and never served — the site
references the existence of that documentation but does not publish it. See
`private-source/README.md`.

## Notes on content accuracy

The Temerario record is the only non-sample listing. Its configuration is transcribed
from the vehicle's own factory configuration summary. It carries no VIN, price,
mileage, registration, location, seller, prior owner, history or transaction date,
because none of those are known to this site.

The site makes no claim of affiliation with any manufacturer, and carries no reviews,
press logos, buyer names, sales figures or activity feeds.
