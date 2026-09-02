# Marlowe Motorcars

Site for an independent automotive sourcing and vehicle representation business, built
with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000

npm run lint
npm run typecheck
npm run test
npm run build
npm run verify:production    # what is still missing before this can go live
```

## Before this site goes live

`npm run verify:production` lists every factual input that has not been supplied yet,
and exits non-zero while anything is blocking. Until it passes, the site sets
`noindex`, `robots.txt` disallows crawling, and no organisation structured data is
emitted. That is deliberate — see [Honesty rules](#honesty-rules).

Do not make the script pass by inventing a value.

## Content model

The site holds three separate collections. They are a discriminated union in
`src/lib/types.ts`, not one record with a status string, so a model description cannot
be rendered where a specific car is implied.

| Collection | File | What belongs in it | Public labels |
| --- | --- | --- | --- |
| `inventory` | `src/data/inventory.ts` | Specific cars genuinely on offer | Available, Reserved |
| `soldVehicles` | `src/data/sold.ts` | Specific cars sold, documented individually | Sold |
| `sourcingCatalogue` | `src/data/sourcing.ts` | Models we can discuss or locate — **not cars** | Sourcing, Model brief, Source this model, Discuss your specification |

A `SourcingModel` has no `availability`, no `priceDisplay`, no `statusNote` and no
model year. Those fields do not exist on the type, so a model brief cannot acquire
them.

Every record carries `published`. All read access goes through the accessors in
`src/lib/vehicles.ts`, which filter on it, so a draft never reaches a route, the
sitemap or structured data.

### Publishing a car to `inventory`

Required, and partly enforced by the compiler:

1. A unique, identifiable vehicle — not a model.
2. Real photography in `public/images/vehicles/<slug>/`. *(The `ImageSet` type requires
   at least one image.)*
3. A verified year. *(Required by the type.)*
4. Verified make, model and variant.
5. Verified availability — `'available'` or `'reserved'`. Use `'reserved'` and a
   "Deposit taken" note only when that has actually happened.
6. At least three meaningful vehicle-specific facts. *(The `specs` tuple requires three.)*
7. A working enquiry destination — `npm run verify:production` passing.

Never invent mileage, VIN, stock number, price, ownership, history or specification.
Omit what is not known; the layouts are built to omit rather than pad.

While `inventory` is empty the homepage inventory section hides, `Inventory` drops out
of the navigation, `/inventory` renders an honest empty state, and no inventory detail
routes are generated.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Multi-marque hero, inventory (when any), models we source, process, recently completed, contact |
| `/inventory` | Active inventory with search and filters, or an honest empty state |
| `/inventory/[slug]` | A specific car on offer |
| `/sourcing` | Sourcing catalogue grouped by category, plus the process |
| `/sourcing/[slug]` | A model brief |
| `/sold-vehicles` | Completed vehicles |
| `/sold-vehicles/[slug]` | A specific completed car |
| `/about` | The operating model |
| `/contact` | Enquiry form, or a direct email address when delivery is unconfigured |
| `/privacy` | What the enquiry form collects and how to have it removed |
| `/terms` | Manufacturer independence, verification, imagery |
| `/credits` | Image attribution, generated from the ledger |
| `/api/inquiries` | Enquiry delivery |
| `/sitemap.xml`, `/robots.txt` | Generated; drafts excluded, indexing gated on readiness |

Redirects in `next.config.ts` preserve every previously published URL: `/sold`,
the Temerario's old `/inventory/…` address, and the model briefs that moved out of
inventory into `/sourcing/…`.

## Environment variables

Full list with comments in `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Branded canonical origin. Falls back to the Vercel URL. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | **Yes** | Public enquiry address |
| `NEXT_PUBLIC_CONTACT_PHONE` | No | Unset hides the phone number everywhere |
| `NEXT_PUBLIC_SERVICE_AREA` | No | Truthful service area — not a showroom address |
| `NEXT_PUBLIC_LEGAL_ENTITY` | No | Registered trading entity, once there is one |
| `NEXT_PUBLIC_BUSINESS_CLASSIFICATION` | Recommended | `sourcing-agent` or `dealer` |
| `NEXT_PUBLIC_DEALER_LICENSE_NUMBER` | Only if a dealer | Required to claim dealer status |
| `NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION` | Only if a dealer | Required to claim dealer status |
| `NEXT_PUBLIC_SOCIAL_LINKS` | No | `Label\|https://…` pairs, comma-separated |
| `RESEND_API_KEY` | **Yes** | Enquiry delivery |
| `INQUIRY_FROM_EMAIL` | **Yes** | Sender, on a domain verified in Resend |
| `INQUIRY_TO_EMAIL` | No | Destination; defaults to `NEXT_PUBLIC_CONTACT_EMAIL` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | No | `false` forces `noindex` on a complete staging deploy |

### Connecting the branded domain

1. Add the domain to the project in Vercel and point the DNS records it gives you.
2. Set `NEXT_PUBLIC_SITE_URL` to the domain, with scheme and no trailing slash
   (`https://marlowemotorcars.com`), in the Production environment.
3. Redeploy, then confirm `/sitemap.xml` and the `<link rel="canonical">` tags carry
   the branded host.

Until step 2, canonicals resolve to the Vercel deployment URL. That is correct — the
canonical points at where the site is actually served — but it is off-brand, so
`verify:production` reports it as an incomplete item rather than a blocker.

### Enquiry email

1. Create a Resend account and verify a sending domain.
2. Create an API key, set `RESEND_API_KEY`.
3. Set `INQUIRY_FROM_EMAIL` to an address on the verified domain.
4. Set `INQUIRY_TO_EMAIL` if enquiries should land somewhere other than the public
   contact address.

`src/app/api/inquiries/route.ts` validates, applies a honeypot and per-client rate
limiting, and returns success **only after Resend accepts the message**. Reply-To is
set to the sender so replying from the inbox reaches them. The route does not log the
enquiry body or the sender's details — only a failure reason.

The rate limiter (`src/lib/rate-limit.ts`) is in-memory, so on a multi-instance
deployment the limit is per instance. Move it to a shared store behind the same
`checkRateLimit` signature if a hard guarantee is ever needed.

When the provider is not configured the contact page shows the direct email address
instead of a form, and the enquiry CTAs on vehicle and model pages are hidden. A form
that silently discards a message is worse than no form.

## Imagery

Every externally obtained image is recorded in `src/data/image-sources.ts` with its
source URL, creator, licence, attribution requirement and access date. `/credits`
renders the entries that require attribution; adding an image to the ledger is what
puts it on that page.

Sourcing photography is **representative of the model** and is labelled as such. It
never implies that the pictured car is held by Marlowe.

Rules for adding imagery, in priority order:

1. Owner-supplied photography.
2. Manufacturer press assets whose terms allow the intended use.
3. Creative Commons photography with commercial reuse permitted.
4. Properly licensed stock for atmosphere and detail.

Never use dealership inventory photos, auction listings (Bring a Trailer, Cars & Bids),
social-media images, watermarked images, or anything whose licensing cannot be
established. Nothing is hotlinked — `next.config.ts` declares no `remotePatterns` on
purpose. If no rights-cleared image can be found, leave the record `published: false`
rather than publishing without one.

ShareAlike note: the cropped and re-encoded derivatives published here remain under the
same licence as their source, as recorded in the ledger.

## Honesty rules

These are the constraints the site is built around. Most are enforced by types or
tests rather than by convention.

- **Nothing claims a status it cannot support.** Available, Reserved, Deposit taken,
  In stock and Recently sold are only used for specific cars with evidence behind them.
- **Model briefs are not stock.** Enforced by the discriminated union; `vehicleJsonLd`
  cannot even be called with a `SourcingModel`.
- **Structured data asserts nothing unsupported.** `AutoDealer` requires a confirmed
  dealer classification *and* licence details on file; otherwise a conservative
  `Organization`, or nothing at all. No `offers`, `price`, VIN, mileage, condition,
  seller or location anywhere.
- **Renderings are not photographs.** A factory configurator rendering is captioned as
  one, kept out of `image` in structured data, and separated from documentary
  photography in the data model.
- **An incomplete deployment is not indexed.** Readiness gates `robots.txt` and the
  `robots` meta tag.
- **No invented business facts.** No years in business, vehicles sold, staff,
  partnerships, manufacturer relationships, testimonials, press, awards, showroom,
  finance, shipping volume, review counts, trust badges or activity feeds.
- **Private material stays private.** `private-source/` is git-ignored and never
  served. No buyer identity, full VIN, address, invoice price, customs or transaction
  paperwork appears anywhere on the site.

## Still to be confirmed by the owner

These need a decision or a document; none of them can be filled in from the code.

1. **Public email address** — blocks launch.
2. **Resend account, verified sending domain, API key** — blocks launch.
3. **Branded domain** — for canonicals and for the Vercel URL to stop being the public
   address.
4. **Business classification** — is Marlowe operating as a sourcing agent, or as a
   licensed motor vehicle dealer? This changes the structured data, the footer and
   whether "dealer" may be used at all. If a dealer, the licence number and issuing
   jurisdiction are needed.
5. **Legal entity name**, once registered.
6. **Service area** — a truthful city/state or region, or leave it unset.
7. **Phone number**, if there is to be a public one.
8. **Social profiles**, if any exist.

### Legal review still outstanding

Deliberately not written, because they require a confirmed business location and
professional review:

- Jurisdiction-specific motor trade or dealer disclosures.
- Statutory consumer rights language, cooling-off periods and cancellation terms.
- Jurisdiction-specific privacy rights (GDPR/UK GDPR/CCPA request procedures, lawful
  basis, controller identity, any supervisory-authority details). `/privacy` describes
  what actually happens to an enquiry and how to have it deleted, and stops there.
- Any warranty, guarantee or returns position.

`/terms` states manufacturer independence, that vehicle information is subject to
verification, and that nothing on the site creates a warranty. It claims no authorised
dealer status.

## Testing

`npm run test` (Vitest, `tests/`) covers the things that would be credibility failures
if they regressed:

- Separation of inventory, sold and sourcing records, and per-kind routing.
- Sourcing models carrying no availability, price, status or year.
- Draft exclusion from accessors, routes and the sitemap.
- The empty-inventory state and the "no inventory" navigation behaviour.
- Enquiry validation, header-injection sanitising, rate limiting, and delivery
  configuration — including that a missing provider throws rather than reporting
  success.
- Production-readiness detection: `example.com`, zero-filled phones, TODO markers,
  localhost canonicals, missing email and domain.
- Structured-data selection across every configuration state.
- Image-ledger completeness for every image in use.

No test sends an email. `RESEND_API_KEY` values in tests are inert strings.

## Accessibility

- Skip link, landmark structure, visible focus ring on every interactive element.
- The lightbox is a modal dialog: focus trap, `Escape` to close, `←`/`→`/`Home`/`End`,
  focus returned to the opener, scroll lock while open.
- Touch swipe on the gallery stage and in the lightbox.
- Filter results announced through a polite live region.
- Form errors tied to inputs with `aria-describedby` / `aria-invalid`; focus moves to
  the first invalid field on submit.
- `prefers-reduced-motion` disables transitions, smooth scrolling and hover scaling.

## Performance notes

- The gallery mounts only the active image and its neighbours, so a ten-image gallery
  no longer downloads every full-resolution file on first paint.
- Every `Image` carries a `sizes` hint matched to its grid; only above-fold hero images
  use `priority`.
- All imagery is local, sized, and served as AVIF/WebP by the image pipeline.

## Source material

`private-source/` holds the owner-supplied configuration PDF, the original delivery
photograph and the supplied configurator renders. It is git-ignored and never served.
