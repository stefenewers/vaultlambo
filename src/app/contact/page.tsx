import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactFormPanel } from '@/app/contact/ContactFormPanel';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { contactCopy } from '@/content/copy';
import { contactAvailability } from '@/lib/contact';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingCategories,
  vehicleTitle,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description: contactCopy.intro,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Marlowe Motorcars',
    description: contactCopy.intro,
    url: '/contact',
  },
};

/**
 * Contact.
 *
 * Three possible states, and the page has to be honest in all of them:
 *
 *   1. Form configured — render the form.
 *   2. No form, but a published email address — say so, and show the address.
 *   3. Neither — this page is not linked from anywhere (see lib/contact.ts), but it
 *      stays reachable by direct URL and must not pretend. It says plainly that there
 *      is no contact route yet, rather than inviting an email to an address that does
 *      not exist.
 *
 * State 3 previously rendered "Enquiries are by email." with no email beneath it,
 * while the header advertised "Enquire" on every page. That dead end is what this
 * structure exists to prevent.
 */
export default function ContactPage() {
  const { form, email, reachable } = contactAvailability();

  /*
   * Options for the enquiry select, grouped so the collections stay visibly separate.
   * Sourcing entries are categories rather than model names: a category cannot be
   * mistaken for a car in stock, which a model name in a dropdown quietly can.
   */
  const groups = [
    {
      label: 'Available now',
      options: getPublishedInventory().map((v) => ({
        value: vehicleTitle(v),
        label: vehicleTitle(v),
      })),
    },
    {
      label: 'Sourcing a car',
      options: getPublishedSourcingCategories().map((c) => ({
        value: `${c.category} — sourcing brief`,
        label: c.category,
      })),
    },
    {
      label: 'Completed commissions',
      options: getPublishedSoldVehicles().map((v) => ({
        value: vehicleTitle(v),
        label: `${vehicleTitle(v)} (sold)`,
      })),
    },
  ].filter((group) => group.options.length > 0);

  const { contact } = siteConfig;

  return (
    <>
      <PageHeader title={contactCopy.headline} intro={contactCopy.intro} />

      <Container>
        <div className="rule grid gap-12 pt-12 lg:grid-cols-[1fr_18rem] lg:gap-20 lg:pt-16">
          {form ? (
            <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
              <ContactFormPanel groups={groups} />
            </Suspense>
          ) : email ? (
            <div className="max-w-xl">
              <h2 className="display-3 text-bone">Enquiries are by email.</h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone-dim">
                Send the model, specification and timing you have in mind and we will
                come back to you directly.
              </p>
              <a href={`mailto:${email}`} className="btn btn-primary mt-8 inline-flex">
                {email}
              </a>
            </div>
          ) : (
            <div className="max-w-xl">
              <h2 className="display-3 text-bone">
                There is no contact route configured yet.
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone-dim">
                Enquiries cannot be received at the moment, and no address is published
                because there is not yet one to publish. While that is true this page is
                not linked from anywhere else on the site.
              </p>
            </div>
          )}

          <aside className="lg:pt-1">
            {reachable ? (
              <>
                {email || contact.phone ? (
                  <>
                    <h2 className="label-xs">Direct</h2>
                    <ul className="mt-5 space-y-4 text-sm">
                      {email ? (
                        <li>
                          <a
                            href={`mailto:${email}`}
                            className="link-underline text-bone transition-colors hover:text-bone-dim"
                          >
                            {email}
                          </a>
                        </li>
                      ) : null}
                      {contact.phone ? (
                        <li>
                          <a
                            href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                            className="link-underline text-bone transition-colors hover:text-bone-dim"
                          >
                            {contact.phone}
                          </a>
                        </li>
                      ) : null}
                      {contact.serviceArea ? (
                        <li className="text-steel">{contact.serviceArea}</li>
                      ) : null}
                    </ul>
                  </>
                ) : null}

                <h2 className="label-xs mt-10">Appointments</h2>
                <p className="mt-5 text-[0.8125rem] leading-relaxed text-steel">
                  {contact.appointmentPolicy}
                </p>
              </>
            ) : null}

            <h2 className={`label-xs ${reachable ? 'mt-10' : ''}`}>What helps</h2>
            <ul className="mt-5 space-y-2.5">
              {contactCopy.helps.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[0.8125rem] leading-relaxed text-steel"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.62em] h-px w-3 shrink-0 bg-steel-dim"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </>
  );
}
