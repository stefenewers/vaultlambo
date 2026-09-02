import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { ContactFormPanel } from '@/app/contact/ContactFormPanel';
import { contactCopy } from '@/content/copy';
import { canAcceptInquiries } from '@/lib/email';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingModels,
  vehicleHeading,
  vehicleTitle,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description: contactCopy.intro,
  alternates: { canonical: '/contact' },
};

/**
 * Contact.
 *
 * The select is grouped so a model brief cannot be mistaken for a car in stock: the
 * three collections are labelled separately, and completed cars are marked as sold.
 * When enquiries cannot be delivered the form is not rendered at all — a form that
 * silently drops a message is worse than an email address.
 */
export default function ContactPage() {
  const groups = [
    {
      label: 'Available now',
      options: getPublishedInventory().map((v) => ({
        value: vehicleTitle(v),
        label: vehicleTitle(v),
      })),
    },
    {
      label: 'Models we source',
      options: getPublishedSourcingModels().map((m) => ({
        value: vehicleHeading(m),
        label: vehicleHeading(m),
      })),
    },
    {
      label: 'Completed vehicles',
      options: getPublishedSoldVehicles().map((v) => ({
        value: vehicleTitle(v),
        label: `${vehicleTitle(v)} (sold)`,
      })),
    },
  ].filter((group) => group.options.length > 0);

  const { contact } = siteConfig;
  const accepting = canAcceptInquiries();

  return (
    <>
      <PageHeader title={contactCopy.headline} intro={contactCopy.intro} />

      <Container>
        <div className="rule grid gap-12 pt-12 lg:grid-cols-[1fr_18rem] lg:gap-20 lg:pt-16">
          {accepting ? (
            <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
              <ContactFormPanel groups={groups} />
            </Suspense>
          ) : (
            <div className="max-w-xl">
              <h2 className="display-3 text-bone">Enquiries are by email.</h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone-dim">
                {contact.email
                  ? 'Send the model, specification and timing you have in mind and we will come back to you directly.'
                  : 'The enquiry form is not accepting messages at the moment. Please try again shortly.'}
              </p>
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="btn btn-primary mt-8 inline-flex"
                >
                  {contact.email}
                </a>
              ) : null}
            </div>
          )}

          <aside className="lg:pt-1">
            {contact.email || contact.phone ? (
              <>
                <h2 className="label-xs">Direct</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  {contact.email ? (
                    <li>
                      <a
                        href={`mailto:${contact.email}`}
                        className="link-underline text-bone transition-colors hover:text-bone-dim"
                      >
                        {contact.email}
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

            <h2 className="label-xs mt-10">What helps</h2>
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
