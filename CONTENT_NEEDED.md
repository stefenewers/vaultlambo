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
| 4.3 | **Temerario — real exterior photography** | Recommended | The gallery is nine factory configurator renderings plus **one** interior delivery photograph. Renders are captioned as renders and are excluded from structured data. A real exterior photograph would materially improve the page. |
| 4.4 | **Any other genuinely completed commissions** | Recommended | The archive currently holds exactly one car. Each addition needs its own photography and verified facts. |
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
- Any mileage, VIN, registration, ownership history or price not supplied by the owner
