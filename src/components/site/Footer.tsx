import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Wordmark } from '@/components/site/Wordmark';
import { CATEGORY_ORDER } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

export function Footer() {
  const year = new Date().getFullYear();
  const { contact, legal, social } = siteConfig;

  return (
    <footer className="mt-28 border-t border-line bg-ink sm:mt-36">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Wordmark size="lg" asLink={false} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-steel">
              {siteConfig.tagline}.
            </p>
          </div>

          <FooterColumn title="Inventory">
            {CATEGORY_ORDER.map((category) => (
              <FooterLink
                key={category}
                href={`/inventory?category=${encodeURIComponent(category)}`}
              >
                {category}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {siteConfig.nav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
              >
                {contact.email}
              </a>
            </li>
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
            {contact.location ? (
              <li className="text-sm text-steel">{contact.location}</li>
            ) : null}
            {social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="link-underline text-sm text-steel transition-colors hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="rule flex flex-col gap-5 py-8 lg:flex-row lg:items-start lg:gap-16">
          <p className="max-w-2xl text-xs leading-relaxed text-steel-dim">
            {legal.affiliationDisclaimer}
          </p>
          <p className="shrink-0 text-xs text-steel-dim lg:ml-auto">
            © {year} {siteConfig.name}
          </p>
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
