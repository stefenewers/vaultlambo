# Content and business facts still needed

Everything on this list is something only the owner can answer. Nothing here has been
guessed, and nothing here is rendered on the site until it is supplied — the UI hides
the relevant element and `npm run verify:production` reports the gap.

**The rule this repository follows:** if a fact cannot be verified from the repository
or supplied by the owner, it is omitted rather than estimated. An invented figure,
address, licence number or founding date is the single fastest way to destroy the
credibility of a site like this.

Status key: **Blocker** — public launch is unsafe or the site cannot function without
it. **Recommended** — the site is honest without it, but weaker.

---

## 1. Business identity

| # | Item | Status | Why it matters | Where it goes |
|---|------|--------|----------------|---------------|
| 1.1 | **Confirmed business type** — sourcing agent, broker, or licensed dealer | Blocker | Drives the structured data and the wording throughout. The site currently describes itself as a sourcing and representation service and emits **no** organisation schema at all. `AutoDealer` is a regulated claim and stays off until 1.2 is answered. | `NEXT_PUBLIC_BUSINESS_CLASSIFICATION` = `sourcing-agent` \| `dealer` |
| 1.2 | **Dealer / broker / import licence** — number and issuing jurisdiction | Blocker *if* operating as a dealer | Without it the site must not call itself a dealer. Setting classification to `dealer` without these two values is treated as a blocking error, deliberately. | `NEXT_PUBLIC_DEALER_LICENSE_NUMBER`, `NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION` |
| 1.3 | **Registered legal entity name** | Recommended | Needed for the footer legal line, the terms page and the privacy page's data-controller identity. | `NEXT_PUBLIC_LEGAL_ENTITY` |
| 1.4 | **Operating location and service area** | Recommended | The About page has a "Where we operate" section that renders only when this is set. Leave unset rather than naming a market you do not serve. | `NEXT_PUBLIC_SERVICE_AREA` |
| 1.5 | **Who operates Marlowe** | Recommended | Buyers spending six figures want to know who they are dealing with. Deliberately absent: no founder biography, no staff, no photographs. Supply real details or leave it out. | About page copy — see `src/content/copy.ts` |

## 2. Contact and delivery

| # | Item | Status | Why it matters | Where it goes |
|---|------|--------|----------------|---------------|
| 2.1 | **Real monitored email address** | Blocker | Nothing can be delivered without it. While unset, the enquiry form and every enquiry CTA are hidden rather than shown and silently discarded. | `NEXT_PUBLIC_CONTACT_EMAIL` |
| 2.2 | **Resend API key** | Blocker | The enquiry endpoint refuses with 503 rather than faking success. | `RESEND_API_KEY` |
| 2.3 | **Verified sending domain and From address** | Blocker | Resend will not send from an unverified domain. | `INQUIRY_FROM_EMAIL` |
| 2.4 | **Destination inbox** for enquiries | Recommended | Defaults to 2.1 if unset. | `INQUIRY_TO_EMAIL` |
| 2.5 | **Public phone number** | Optional | Renders only when set. There is no placeholder. | `NEXT_PUBLIC_CONTACT_PHONE` |
| 2.6 | **Marlowe-branded domain** | Blocker | `vaultlambo.vercel.app` does not match the brand and undermines the whole proposition. See `LAUNCH_CHECKLIST.md`. | `NEXT_PUBLIC_SITE_URL` |
| 2.7 | **Social profiles** | Optional | The footer row hides itself when empty. Only add profiles that exist. | `NEXT_PUBLIC_SOCIAL_LINKS` |

## 3. Commercial terms

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | **What Marlowe charges** — flat fee, percentage, retainer, or "quoted per search" | Blocker | This is the most common question a sourcing client asks, and it is currently **not answered anywhere on the site**. It was deliberately left out of the About FAQ rather than filled with a plausible-sounding invention. Supply the actual model and it can be added. |
| 3.2 | **When a fee is agreed and whether it is refundable** | Recommended | Needed before the terms page can say anything meaningful about the commercial relationship. |
| 3.3 | **Deposit handling**, if deposits are ever taken | Recommended | The words "reserved" and "deposit taken" are supported by the data model but are not used anywhere, because no vehicle has ever had that status verified. |

## 4. Vehicles

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | **Lamborghini Temerario — sale price** | ✅ Supplied | `$150,000 USD`, confirmed by the owner and published on the commission page. |
| 4.2 | **Temerario — delivery date and jurisdiction** | Recommended | Would let the commission carry a date and populate `lastModified` in the sitemap. Currently omitted rather than guessed. |
| 4.3 | **Temerario — real exterior photography** | Recommended | The gallery is nine factory configurator renderings plus **one** interior delivery photograph. Renders are captioned as renders and are excluded from structured data. One of them currently stands in as the homepage hero, captioned on screen. A real exterior photograph would materially improve the page. Shot list in `MEDIA_NEEDED.md`. |
| 4.7 | **Any owner-supplied brand or vehicle photography** | Recommended | All external Creative Commons imagery has been removed: the licences were fine, but the pictures were of other people's cars, shot by different photographers in different places, and together they made the site look like a classifieds page. The site is now media-led and built for owner footage, but today it carries only the Temerario's renderings and one photograph. Real photography and video — a car, a handover, a workspace — would be the single biggest visual improvement available, but it has to be yours. **See `MEDIA_NEEDED.md`** for the asset inventory, shot list, formats and where files go. |
| 4.4 | **Any other genuinely completed commissions** | Recommended | The archive holds four cars: the Temerario, the SF90 Spider, the Sián Roadster and the BMW M5. Each addition needs its own photography (owned, or used with the rights holder's permission) and verified facts. |
| 4.8 | **SF90 Spider — sale price, delivery date** | Recommended | Published as a joint commission with Exotic Cars (confirmed by the owner, 2026-09-29). No price or date is shown until confirmed. |
| 4.9 | **SF90 Spider — mileage discrepancy** | Recommended | The supplied listing says 70 km; the odometer photograph reads 711 km. Neither is published (the data model has no mileage field). Resolve before any mileage is quoted anywhere, including in conversation with clients. |
| 4.10 | **SF90 Spider — paint name, wheels, interior name** | Recommended | "Pearl White" is the listing's wording, not necessarily Ferrari's paint name. Carbon-fibre wheels are claimed by the listing but not visible in the supplied photographs. Interior is "White" in one place and "Ivory" in another; the site says "white with red detailing", which is what the photographs show. |
| 4.11 | **SF90 Spider — full-car photography** | Recommended | The high-resolution set is interior and detail. The only whole-car views supplied are 612px screenshots with the partner's branding; they are kept in `private-source/` and not published. A full-resolution exterior from Exotic Cars would give the car a proper lead image. |
| 4.13 | **Sián Roadster — sale price, delivery date, paint and trim names** | Recommended | Published as a joint commission with Exotic Cars (confirmed 2026-09-29). The listing's 100 km, "brand-new", GCC spec and warranty are not published. "White" and "Ivory" are the listing's words, not necessarily Lamborghini's. |
| 4.14 | **Sián Roadster — seat monogram** | Recommended | The seatbacks carry an embroidered monogram that may be a previous owner's initials. It is visible in three published photographs (cockpit, cabin from above, seats) but not described. Decide whether those photographs should stay. |
| 4.15 | **BMW M5 — audio, paint and trim names, price, date** | Recommended | Published as a completed commission with Marlowe's own photographs. The listing's Bowers & Wilkins audio is not stated because the photographs don't show it; confirm from the build sheet. Mileage, warranty and location are not published. |
| 4.16 | **No location detail on listings** | Owner instruction (2026-09-29) | No Dubai or other location detail appears on any vehicle record. A test enforces it. |
| 4.12 | **Which commission is the most recent** | Recommended | The first record in `src/data/sold.ts` is the homepage feature. The Temerario stays first until this is confirmed. |
| 4.5 | **Real active inventory** | Recommended | There is none, and the site says so plainly. See the README for what a listing requires before it can be published. |
| 4.6 | **BMW M3 CS** | ⚠️ Resolved by removal | Was published as *sold by Marlowe* with no supporting evidence. Moved to the sourcing catalogue as a model brief. Restore it as a commission only if actual records and photography exist for a specific car. |

## 5. Legal and privacy

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | **Data controller identity and contact** for the privacy page | Blocker | The privacy page describes what is collected and why, which is accurate. It cannot name the responsible entity until 1.3 and 2.1 exist. |
| 5.2 | **Governing jurisdiction** for the terms page | Blocker | No jurisdiction-specific dealer disclosures have been written, because inventing one is worse than having none. Needs 1.4 plus legal review. |
| 5.3 | **Legal review of terms and privacy** | Blocker | Both pages are drafted conservatively and claim no warranties. They are not a substitute for review by a qualified adviser in the operating jurisdiction. |
| 5.4 | **Retention period** for enquiry data | Recommended | The privacy page currently describes deletion on request. A stated retention period would be stronger. |

## 6. Operations

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | **Inspection providers** | Recommended | The sourcing page says an independent inspection *can be arranged*. It does not name partners or claim a standing network, because none is established. |
| 6.4 | **Verified marque expertise**, if any | Recommended | The sourcing categories are described as *representative briefs* — examples of scope. They deliberately avoid saying these are models the firm knows well, because that is a capability claim nobody has verified. Tell us where genuine depth exists and it can be said directly. |
| 6.2 | **Transport and logistics providers** | Recommended | Same treatment: "can be arranged", not "we operate". |
| 6.3 | **Analytics decision** | Recommended | None is installed. The CSP would need a matching `script-src`/`connect-src` entry, and the privacy page would need updating, if one is added. |

---

## Claims deliberately not made

Recorded so nobody re-adds them by accident:

- Years in business, founding date, company history
- Number of vehicles sold or sourced
- Staff names, biographies or photographs
- Manufacturer relationships, authorisations or franchises
- Trade contacts, standing allocations or held factory order slots
- Testimonials, reviews, ratings, press mentions or awards
- Showroom or street address
- Finance, warranty, insurance or shipping offerings
- Live activity feeds, view counters or vehicle counts
- Familiarity with any particular model or marque
- Photography of any car other than the one commission the owner supplied
- Any mileage, VIN, registration, ownership history or price not supplied by the owner
