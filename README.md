# Marlowe Motorcars

A private vehicle sourcing and commission service for performance, luxury and collector
cars. Next.js 15 (App Router), TypeScript, Tailwind CSS v4.

**Read `CONTENT_NEEDED.md` and `LAUNCH_CHECKLIST.md` before deploying publicly.** The
site is built to fail safe: with no business details configured it refuses to be
indexed, hides the enquiry form rather than discarding messages, and emits no
organisation structured data.

```bash
npm install
npm run dev                # http://localhost:3000
npm run check              # lint + typecheck + test + build + output scan
npm run verify:production  # what the owner still has to supply
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest — data rules, validation, components, accessibility |
| `npm run test:watch` | Vitest in watch mode |
| `npm run verify:production` | Lists every missing factual input, with severity |
| `npm run verify:build` | Scans build output for placeholders and false claims |
| `npm run check` | All of the above, in the order CI runs them |

---

## The content model

This is the most important thing to understand about the codebase.

The site holds **three kinds of content**, and they are not interchangeable. They are a
discriminated union in `src/lib/types.ts` rather than one record with a status string,
so the compiler — not a code review — prevents a model brief from being rendered
anywhere a specific car is implied.

| Kind | What it is | Route | Structured data | In sitemap |
| --- | --- | --- | --- | --- |
| `InventoryVehicle` | A **specific car** genuinely being offered | `/inventory/[slug]` | `Vehicle` | Yes |
| `SoldVehicle` | A **specific car** that was delivered and sold | `/commissions/[slug]` | `Vehicle` | Yes |
| `SourcingModel` | A **model** we can go and find. Not a car. | `/sourcing/[slug]` | None | Yes, as a brief |

### Why this exists

Earlier in this repository's history, six records were explicitly marked `isSample`.
A later commit removed that flag and began presenting them as real available, reserved
and sold vehicles — complete with "Deposit taken" statuses and a BMW listed as sold by
Marlowe. None of it was true.

The type system now makes that specific mistake impossible to repeat:

- `SourcingModel` **has no** `availability`, `price`, `statusNote` or `year` field.
  There is nowhere to put "Reserved" on a model brief.
- `InventoryVehicle.images` and `SoldVehicle.images` are `readonly [VehicleImage,
  ...VehicleImage[]]` — a non-empty tuple. Publishing a specific car with no
  photography is a compile error.
- `InventoryVehicle.specs` requires **at least three** entries, so a car with nothing
  specific to say about it cannot be listed.
- There is no `mileage`, `vin`, `stockNumber` or `price` field on any type. An invented
  value has nowhere to live.

### Publishing and drafts

Every record carries `published: boolean`. All reads go through the accessors in
`src/lib/vehicles.ts`, which filter on it — routes, `generateStaticParams`, the sitemap
and JSON-LD never touch the raw arrays. An unpublished record 404s and appears nowhere.

`updated?: string` (ISO date) feeds `lastModified` in the sitemap. It is omitted rather
than guessed; a fabricated freshness date is a small lie told to a crawler.

### Adding a verified inventory vehicle

1. Put photography in `public/images/vehicles/<slug>/`. Real photographs of **that
   car** — not the model, not a press shot.
2. Add the record to `src/data/inventory.ts` as an `InventoryVehicle`.
3. Provide at least three vehicle-specific facts in `specs`. Model-level equipment
   belongs in `specGroups`, which is where "available on this model" material goes.
4. Set `published: true` only once every claim on the record is supported.
5. Run `npm run check`.

The moment the array is non-empty, the inventory section appears on the homepage, the
`/inventory` route switches from its empty state to the grid, and `Inventory` returns
to the primary navigation. Filters appear at four or more vehicles — below that,
filtering is theatre.

### Adding a completed commission

Same as above, but in `src/data/sold.ts` as a `SoldVehicle`. Two extra fields matter:

- `salePrice` — a string, e.g. `'$150,000 USD'`, and **only** when the owner has
  confirmed the figure. Absent means no price line renders at all: no "price on
  request", nothing that invites a guess.
- `documentaryImages` — photographs of the finished car, kept apart from `images` so
  a configurator rendering is never presented as documentation of the delivered car.

### Image kinds

`VehicleImage.kind` is required and drives how an image is captioned and used:

| Kind | Meaning | Used in `Vehicle` JSON-LD |
| --- | --- | --- |
| `factory-render` | Manufacturer configurator output for this exact specification | No |
| `vehicle-photograph` | A photograph of this exact car | Yes |
| `representative` | A photograph of *some* example of the model | No |

Only `vehicle-photograph` images are offered to search engines as pictures of the car.
Sourcing imagery is labelled "Representative model imagery" in the interface.

Every externally sourced image is recorded in `src/data/image-sources.ts` with its
source URL, creator, licence and access date, and credited on `/credits`.

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | Photography-led hero, what we source, how sourcing works, recent commissions |
| `/inventory` | Verified active listings, or an honest empty state |
| `/inventory/[slug]` | A specific car being offered |
| `/sourcing` | The sourcing catalogue and process |
| `/sourcing/[slug]` | A model brief — explicitly not a car |
| `/commissions` | Documented completed commissions |
| `/commissions/[slug]` | A specific completed car |
| `/about` | Operating model and FAQ |
| `/contact` | Enquiry form |
| `/privacy`, `/terms` | Linked discreetly in the footer |
| `/credits` | Image attribution |
| `/api/inquiries` | Enquiry delivery |

Redirects in `next.config.ts` preserve every previously published URL:
`/sold` and `/sold-vehicles` → `/commissions`; the old
`/inventory/<sold-slug>` → `/commissions/<slug>`; and the seven model briefs that used
to sit under `/inventory` → `/sourcing/<slug>`.

---

## Enquiry delivery

`src/app/api/inquiries/route.ts` delivers through Resend and **returns success only
after the provider accepts the message.** The previous implementation logged the
enquiry to the server console and returned 200 regardless, so every visitor was told
their message had been sent when nothing had been delivered anywhere.

Protections in place:

- Server-side validation with maximum lengths (`src/lib/inquiry.ts`)
- JSON content type required; anything else is rejected with 415
- Body size capped and measured on the actual body, not the `Content-Length` claim
- Per-client rate limiting (`src/lib/rate-limit.ts`)
- A honeypot field, as one layer among several rather than the whole strategy
- Header-injection sanitising on anything interpolated into a subject or Reply-To
- **No enquiry payload, name, email, phone or message body is ever logged.** Failures
  log a reason and a status only.
- Unconfigured delivery returns 503 and the form shows an error — never a false success

### Setting it up

1. Create a [Resend](https://resend.com) account.
2. Verify your sending domain and add the DNS records it gives you.
3. Set `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL` (on the verified domain) and
   `INQUIRY_TO_EMAIL`.
4. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the monitored public address.
5. Send one real test enquiry through the deployed form and confirm it arrives and that
   replying reaches the sender.

### Rate limiting, honestly

`src/lib/rate-limit.ts` is an in-memory counter. It is genuinely useful against casual
abuse from a single client, and it is **not** durable: serverless instances do not share
memory, so the effective limit is per-instance. It is not described anywhere as more
than that. A durable limit needs a shared store such as Upstash Redis or a platform WAF
rule.

---

## Environment variables

See `.env.example` for the annotated list. Copy it to `.env.local` for development and
set the same values in your host for production. Run `npm run verify:production` to see
what is still missing.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin. See below. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Public enquiry address |
| `RESEND_API_KEY` | Yes | Enquiry delivery |
| `INQUIRY_FROM_EMAIL` | Yes | Verified sender address |
| `INQUIRY_TO_EMAIL` | No | Destination; defaults to the contact address |
| `NEXT_PUBLIC_CONTACT_PHONE` | No | Hidden entirely when unset |
| `NEXT_PUBLIC_SERVICE_AREA` | No | Truthful service area, not a showroom address |
| `NEXT_PUBLIC_LEGAL_ENTITY` | No | Registered trading entity |
| `NEXT_PUBLIC_BUSINESS_CLASSIFICATION` | No | `sourcing-agent` \| `dealer` |
| `NEXT_PUBLIC_DEALER_LICENSE_NUMBER` / `_JURISDICTION` | Only if `dealer` | Required to claim dealer status |
| `NEXT_PUBLIC_SOCIAL_LINKS` | No | `Label\|https://…` pairs, comma-separated |
| `NEXT_PUBLIC_ALLOW_INDEXING` | No | Set `false` to force noindex on staging |

### Connecting the branded domain

`vaultlambo.vercel.app` does not match the brand and should not be the public address.

1. Register the Marlowe Motorcars domain.
2. Add it in **Vercel → Project → Settings → Domains**, set it primary.
3. Set `NEXT_PUBLIC_SITE_URL` to it, with scheme and no trailing slash.
4. Redeploy and confirm `/sitemap.xml` and the canonical tags use the new host.

Until then the origin resolves from `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`,
which is correct but off-brand, and `verify:production` reports it as a warning.

---

## SEO and indexing rules

Indexing is gated on the site being genuinely finished. `shouldAllowIndexing()` in
`src/lib/production-readiness.ts` refuses on any of three conditions:

1. `NEXT_PUBLIC_ALLOW_INDEXING=false`
2. A Vercel **preview or development** deployment (`VERCEL_ENV`)
3. Any blocking readiness finding — missing contact address, no delivery, a localhost
   canonical

When it refuses, `robots.txt` becomes `Disallow: /` and the root metadata sets
`noindex`. Getting a half-configured site into the index is far harder to undo than
waiting.

Structured data is equally conservative:

- `AutoDealer` only when the classification is `dealer` **and** a licence number and
  jurisdiction are on file. Otherwise `Organization`, and nothing at all while the
  classification is unconfirmed.
- `Vehicle` only for specific inventory and sold cars. Never for sourcing models.
- No `offers`, `price`, `mileageFromOdometer`, `vehicleIdentificationNumber`,
  `itemCondition` or `seller` — none of those are known, so none are asserted.

---

## Security

`next.config.ts` sets a Content-Security-Policy, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options` on every route, and
`Cache-Control: no-store` on `/api/*`.

The CSP is tight because the site loads nothing from anywhere else: all imagery is
local, `next/font` self-hosts at build time, and there is no analytics or third-party
script. `'unsafe-inline'` is present on `script-src` and `style-src` because Next.js
requires it for its inline bootstrap and streaming styles; a nonce-based policy needs
middleware on every request, which is poor value on a fully static site that renders no
user-supplied markup. Adding analytics means updating `script-src` and `connect-src`.

---

## Accessibility

- Skip link, landmark structure, semantic headings, visible focus on every control
- Mobile menu: focus trap, Escape to dismiss, focus returned to the toggle on dismiss
  but **not** on navigation
- Gallery lightbox: portalled to `<body>` so the rest of the document is marked `inert`
  and `aria-hidden`; focus trapped in both directions, including the first reverse-tab
  from the dialog container; Escape closes and returns focus to the opener
- Thumbnails are ordinary labelled buttons with `aria-current`, not an incomplete
  `role="tab"` pattern that promises keyboard behaviour it does not implement
- Status is never communicated by colour alone — the active nav item carries a rule,
  and availability chips carry text
- All text meets WCAG AA contrast, asserted numerically in `tests/design-tokens.test.ts`
- No meaningful text below 12px, also asserted in that test
- `prefers-reduced-motion` disables transitions and smooth scrolling

---

## Performance

- The gallery mounts only the active stage image and its immediate neighbours. It
  previously stacked all ten full-resolution images and cross-faded opacity, which
  downloaded every one on first paint.
- Exactly one image per page carries `priority` — the genuine LCP candidate.
- Everything below the fold is lazy-loaded with explicit `sizes`.
- Images are pre-cropped WebP at the aspect ratio they render at, so there is no layout
  shift and no oversized download.
- Pages are server components. The client bundle is limited to the header, the gallery,
  the filter bar and the enquiry form.

---

## Testing

```bash
npm run test
```

| File | Covers |
| --- | --- |
| `tests/content-model.test.ts` | Collection separation, draft exclusion, route generation |
| `tests/routes-and-schema.test.ts` | Sitemap exclusions, JSON-LD selection, canonicals |
| `tests/production-readiness.test.ts` | Placeholder detection, indexing gates |
| `tests/inquiry.test.ts` | Validation, maximum lengths, header sanitising |
| `tests/design-tokens.test.ts` | WCAG AA contrast and minimum type size |
| `tests/components/mobile-nav.test.tsx` | Menu open/close, focus return, focus trap |
| `tests/components/gallery.test.tsx` | Lazy mounting, navigation, lightbox and `inert` |
| `tests/components/inventory-browser.test.tsx` | URL-driven filters, empty state |
| `tests/components/inquiry-form.test.tsx` | Client validation, no false success |
| `tests/components/accessibility.test.tsx` | axe-core over the interactive components |

Data and validation tests run in `node`; component tests declare
`@vitest-environment jsdom` per file.

CI (`.github/workflows/ci.yml`) runs install-from-lockfile, lint, typecheck, tests,
build and the build-output scan on every push and pull request.

---

## Source material

`private-source/` holds the owner-supplied Temerario configuration PDF, the original
delivery photograph and the supplied configurator renders. It is git-ignored and never
served. The site references the existence of that documentation but does not publish
it, and no buyer identity, VIN, address, invoice or customs paperwork appears anywhere.
