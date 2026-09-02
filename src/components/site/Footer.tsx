import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Wordmark } from '@/components/site/Wordmark';
import { hasPublishedInventory } from '@/lib/vehicles';
import { isLicensedDealer, siteConfig } from '@/site.config';

/**
 * Footer.
 *
 * Three columns of links plus a contact block, then one legal line. Sections that
 * have no content hide rather than render an empty heading: no phone row without a
 * phone number, no social row without links, no inventory link without inventory.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { contact, legal, social, dealerLicense } = siteConfig;
  const showInventory = hasPublishedInventory();

  return (
    <footer className="mt-28 border-t border-line bg-ink sm:mt-36">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Wordmark size="lg" asLink={false} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-steel">
              {siteConfig.descriptor}.
            </p>
            {contact.serviceArea ? (
              <p className="mt-3 text-sm text-steel-dim">{contact.serviceArea}</p>
            ) : null}
          </div>

          <FooterColumn title="Vehicles">
            {showInventory ? (
              <FooterLink href="/inventory">Inventory</FooterLink>
            ) : null}
            <FooterLink href="/sourcing">Models we source</FooterLink>
            <FooterLink href="/commissions">Past commissions</FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/credits">Image credits</FooterLink>
          </FooterColumn>

          <FooterColumn title="Contact">
            {contact.email ? (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
                >
                  {contact.email}
                </a>
              </li>
            ) : null}
            {contact.phone ? (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                  className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
                >
                  {contact.phone}
                </a>
              </li>
            ) : null}
            <li className="text-sm text-steel">By appointment</li>
            {social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link-underline text-sm text-steel transition-colors hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="rule flex flex-col gap-5 py-8 lg:flex-row lg:items-start lg:gap-16">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs leading-relaxed text-steel-dim">
              {legal.affiliationDisclaimer}
            </p>
            {isLicensedDealer() ? (
              <p className="text-xs leading-relaxed text-steel-dim">
                Motor vehicle dealer licence {dealerLicense.number},{' '}
                {dealerLicense.jurisdiction}.
              </p>
            ) : null}
          </div>

          <div className="shrink-0 lg:ml-auto lg:text-right">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
              <li>
                <Link
                  href="/privacy"
                  className="link-underline text-xs text-steel-dim transition-colors hover:text-bone-dim"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="link-underline text-xs text-steel-dim transition-colors hover:text-bone-dim"
                >
                  Terms
                </Link>
              </li>
            </ul>
            <p className="mt-3 text-xs text-steel-dim">
              © {year} {siteConfig.legalEntity ?? siteConfig.name}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="label-xs">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
      >
        {children}
      </Link>
    </li>
  );
}
