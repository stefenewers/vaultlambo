import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { siteConfig } from '@/site.config';

export function Footer() {
  const year = new Date().getFullYear();
  const { contact, legal, social } = siteConfig;

  return (
    <footer className="mt-24 border-t border-line bg-ink sm:mt-32">
      <Container>
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <p className="display-3 max-w-sm text-bone">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-steel">
              {siteConfig.tagline}.
            </p>
          </div>

          <div>
            <h2 className="label-xs">Navigate</h2>
            <ul className="mt-5 space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label-xs">Contact</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-bone-dim transition-colors hover:text-bone"
                >
                  {contact.email}
                </a>
              </li>
              {contact.phone ? (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                    className="link-underline text-bone-dim transition-colors hover:text-bone"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.location ? (
                <li className="text-steel">{contact.location}</li>
              ) : null}
            </ul>

            {social.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
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
              </ul>
            ) : null}
          </div>
        </div>

        <div className="rule flex flex-col gap-6 py-8 lg:flex-row lg:gap-16">
          <p className="max-w-3xl text-xs leading-relaxed text-steel-dim">
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
