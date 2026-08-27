import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { ContactFormPanel } from '@/app/contact/ContactFormPanel';
import { contactCopy } from '@/content/copy';
import { getAllVehicles, vehicleTitle } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description: contactCopy.intro,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const vehicleOptions = getAllVehicles().map((v) => {
    const label = vehicleTitle(v);
    return {
      value: label,
      label: v.availability === 'sold' ? `${label} (sold)` : label,
    };
  });

  const { contact } = siteConfig;

  return (
    <>
      <PageHeader
        eyebrow={contactCopy.eyebrow}
        title={contactCopy.headline}
        intro={contactCopy.intro}
      />

      <Container>
        <div className="rule grid gap-12 pt-12 lg:grid-cols-[1fr_18rem] lg:gap-20 lg:pt-16">
          <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
            <ContactFormPanel vehicleOptions={vehicleOptions} />
          </Suspense>

          <aside className="lg:pt-1">
            <h2 className="label-xs">Direct</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-bone transition-colors hover:text-giallo"
                >
                  {contact.email}
                </a>
              </li>
              {contact.phone ? (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                    className="link-underline text-bone transition-colors hover:text-giallo"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.location ? (
                <li className="text-steel">{contact.location}</li>
              ) : null}
            </ul>

            <h2 className="label-xs mt-10">What helps</h2>
            <ul className="mt-5 space-y-2.5">
              {[
                'Model and specification, if you know it',
                'Colour and interior preferences',
                'Timing, and whether an order slot works',
                'Where the vehicle needs to end up',
              ].map((item) => (
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
