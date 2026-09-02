# Launch checklist

Work top to bottom. Everything in **Blockers** must be done before the site is made
public; the site is built to fail safe until they are, so skipping one does not produce
a broken page — it produces a `noindex`, a hidden form, or a missing section.

Verify with:

```bash
npm run check              # lint, typecheck, tests, build, build-output scan
npm run verify:production  # what the owner still has to supply
```

---

## Blockers

### 1. Branded domain

- [ ] Register the Marlowe Motorcars domain.
- [ ] Add it in **Vercel → Project → Settings → Domains** and set it as primary.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the canonical origin, with protocol and no trailing
      slash (`https://marlowemotorcars.com`).
- [ ] Redeploy, then confirm `/sitemap.xml` and every `<link rel="canonical">` point at
      the branded host.

`vaultlambo.vercel.app` does not match the brand and should not be the public address.
Until `NEXT_PUBLIC_SITE_URL` is set, canonicals resolve to whatever Vercel is serving —
correct, but off-brand, and `verify:production` reports it.

### 2. Enquiry delivery

- [ ] Create a Resend account and verify the sending domain (DNS records).
- [ ] Set `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL` (on the verified domain), and
      `INQUIRY_TO_EMAIL`.
- [ ] Set `NEXT_PUBLIC_CONTACT_EMAIL` to the monitored public address.
- [ ] Send **one real test enquiry** through the deployed form and confirm it arrives,
      that Reply-To is the sender's address, and that replying reaches them.
- [ ] Confirm the failure path: with a deliberately wrong key on a preview deployment,
      the form shows an error and **never** a success message.

While delivery is unconfigured the form and every enquiry CTA are hidden rather than
shown and silently discarded.

### 3. Business identity

- [ ] Decide the business type and set `NEXT_PUBLIC_BUSINESS_CLASSIFICATION`.
- [ ] If `dealer`: set `NEXT_PUBLIC_DEALER_LICENSE_NUMBER` and
      `NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION`. Setting `dealer` without them is a
      blocking error by design.
- [ ] Set `NEXT_PUBLIC_LEGAL_ENTITY` and `NEXT_PUBLIC_SERVICE_AREA` if available.

No organisation structured data is emitted at all until the classification is
confirmed. `AutoDealer` requires the licence fields.

### 4. Legal

- [ ] Have `/privacy` and `/terms` reviewed by a qualified adviser in the operating
      jurisdiction.
- [ ] Name the data controller on the privacy page (needs items 1.3 and 2.1 in
      `CONTENT_NEEDED.md`).
- [ ] Confirm no jurisdiction-specific dealer disclosure is required, or add one.

### 5. Commercial terms

- [ ] Answer "what does Marlowe charge?" — see `CONTENT_NEEDED.md` §3. It is the most
      common question a sourcing client asks and the site currently does not answer it.

---

## Pre-launch verification

### Automated

- [ ] `npm run check` passes.
- [ ] `npm run verify:production` reports **no blockers**.
- [ ] `npm run verify:build` reports no blockers *on CI* (where a localhost canonical is
      promoted from warning to blocker).

### Manual — run against the production build (`npm run build && npm start`)

- [ ] Every route at **390px**, **768px**, **1440px** and a wide desktop:
      `/`, `/inventory`, `/sourcing`, `/commissions`,
      `/commissions/lamborghini-temerario-giallo-inti`, `/about`, `/contact`,
      `/privacy`, `/terms`, and a deliberate 404.
- [ ] No horizontal scrolling at any width.
- [ ] Keyboard only: tab through every page. Focus is always visible; the mobile menu
      traps focus and returns it to the toggle on Escape; the gallery lightbox traps
      focus in both directions and returns it to the opener.
- [ ] Filters: change a filter, confirm the URL updates, then confirm browser Back
      restores the previous filter state.
- [ ] Gallery: confirm in DevTools → Network that opening the Temerario page downloads
      **two** stage images, not ten.
- [ ] Submit the enquiry form with an empty form: an error summary appears and takes
      focus, and no request is sent.
- [ ] No console errors from application code.

### Metadata

- [ ] `/robots.txt` allows crawling (it will `Disallow: /` until readiness passes).
- [ ] `/sitemap.xml` contains no `/sourcing/<slug>` URLs, no `/credits`, and no drafts.
- [ ] Open Graph preview renders correctly — check with a real link preview tool once
      the domain is live.
- [ ] Favicon appears in the browser tab.
- [ ] `AutoDealer` JSON-LD appears **only** if the business is genuinely a licensed
      dealer.

### Content

- [ ] No `example.com`, no `000-0000`, no placeholder text anywhere (`verify:build`
      covers this, but read the pages too).
- [ ] Every published vehicle has real photography and verified facts.
- [ ] Nothing claims a car is available, reserved or sold without evidence.
- [ ] No Enquire or Contact affordance appears anywhere while there is no contact
      route configured — and every one appears once there is.

---

## After launch

- [ ] Submit the sitemap in Google Search Console.
- [ ] Confirm the site is being indexed under the branded domain and that
      `vaultlambo.vercel.app` is not.
- [ ] If analytics is added: update the CSP in `next.config.ts` (`script-src` and
      `connect-src`), update `/privacy`, and add a consent mechanism if the operating
      jurisdiction requires one.
