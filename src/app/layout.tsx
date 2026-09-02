import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { JsonLd } from '@/components/site/JsonLd';
import { organizationJsonLd } from '@/lib/jsonld';
import { shouldAllowIndexing } from '@/lib/production-readiness';
import { hasPublishedInventory } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

/**
 * Indexing is tied to production readiness.
 *
 * An incomplete deployment — placeholder contact details, no delivery configured, a
 * canonical pointing at localhost — is kept out of search results rather than allowed
 * to rank for the brand name in a half-finished state.
 */
const allowIndexing = shouldAllowIndexing();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = organizationJsonLd();

  return (
    <html lang="en" className={interTight.variable}>
      <body className="flex min-h-dvh flex-col overflow-x-hidden antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-giallo focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bone"
        >
          Skip to content
        </a>
        <Header showInventory={hasPublishedInventory()} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Null until the business information behind it is actually configured. */}
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
