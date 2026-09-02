import { canAcceptInquiries } from '@/lib/email';
import { siteConfig } from '@/site.config';

/**
 * Whether a visitor has any way to reach the business.
 *
 * One question, answered in one place, because the previous behaviour was the worst
 * kind of dead end: the header offered "Enquire" on every page, and the contact page it
 * led to said enquiries were by email without showing an email address. A visitor who
 * followed the call to action arrived nowhere.
 *
 * There are two independent routes in:
 *
 *   - a working enquiry form, which needs a provider key and a verified sender
 *   - a published email address
 *
 * Either is enough. Neither means every Contact and Enquire affordance is withheld
 * across the site, rather than pointing at a page that cannot help.
 */
export type ContactAvailability = {
  /** The enquiry form can be rendered and will actually deliver. */
  form: boolean;
  /** A public email address is configured and can be shown. */
  email: string | null;
  /** True when at least one route in exists. Gates every contact CTA. */
  reachable: boolean;
};

export function contactAvailability(): ContactAvailability {
  const form = canAcceptInquiries();
  const email = siteConfig.contact.email;

  return { form, email, reachable: form || Boolean(email) };
}

/**
 * Convenience for components that only need the yes/no.
 *
 * Used by the header, the footer and every page-level call to action, so an
 * unreachable business shows no contact prompts at all.
 */
export function isReachable(): boolean {
  return contactAvailability().reachable;
}
