import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { JsonLd } from '@/components/site/JsonLd';
import { SourcingCard } from '@/components/vehicles/SourcingCard';
import { SpecRow, SpecSection } from '@/components/vehicles/SpecSection';
import { creditLine } from '@/data/image-sources';
import { canAcceptInquiries } from '@/lib/email';
import { sourcingModelJsonLd } from '@/lib/jsonld';
import {
  getPublishedSourcingModels,
  getRelatedSourcingModels,
  getSourcingModelBySlug,
  vehicleHeading,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedSourcingModels().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const model = getSourcingModelBySlug(slug);
  if (!model) return { title: 'Model not found', robots: { index: false } };

  const title = `${vehicleHeading(model)} — model brief`;
  const canonical = `/sourcing/${model.slug}`;

  return {
    title,
    description: model.brief,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${title} — ${siteConfig.name}`,
      description: model.brief,
      url: canonical,
      images: [
        {
          url: model.image.src,
          width: model.image.width,
          height: model.image.height,
          alt: model.image.alt,
        },
      ],
    },
  };
}

/**
 * A model brief.
 *
 * Structurally distinct from a vehicle page on purpose: "Model brief" eyebrow, no
 * status chip, no price, no year, and a "Discuss your specification" action rather
 * than "Enquire about this vehicle". Nothing here should be mistakable for a car
 * standing on a forecourt.
 */
export default async function SourcingModelPage({ params }: Params) {
  const { slug } = await params;
  const model = getSourcingModelBySlug(slug);
  if (!model) notFound();

  const heading = vehicleHeading(model);
  const related = getRelatedSourcingModels(model.slug, 3);
  const credit = creditLine(model.image.src);
  const enquiryHref = `/contact?vehicle=${encodeURIComponent(heading)}`;

  return (
    <>
      <JsonLd data={sourcingModelJsonLd(model)} />

      <Container size="wide" className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-steel-dim">
            <li>
              <Link href="/sourcing" className="link-underline hover:text-bone">
                Sourcing
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-steel">{heading}</li>
          </ol>
        </nav>
      </Container>

      <Container size="wide" className="pt-8 sm:pt-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <p className="label-xs">
              {['Model brief', model.category, model.generation].filter(Boolean).join(' · ')}
            </p>
            <h1 className="display-1 mt-4 text-bone">{heading}</h1>
            <p className="mt-4 max-w-xl text-lg tracking-[-0.01em] text-steel sm:text-xl">
              {model.brief}
            </p>
          </div>

          <div className="shrink-0 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pb-1 lg:pl-10 lg:pt-0 lg:text-right">
            <p className="label-xs">Sourcing</p>
            <p className="mt-3 max-w-[22ch] text-[0.9375rem] leading-relaxed text-bone-dim">
              Not held. Located to your specification.
            </p>
          </div>
        </div>
      </Container>

      {/* Representative image */}
      <Container size="wide" className="mt-10 sm:mt-12">
        <figure>
          <div className="relative aspect-[3/2] w-full overflow-hidden border border-line bg-ink-panel lg:aspect-[21/9]">
            <Image
              src={model.image.src}
              alt={model.image.alt}
              fill
              sizes="(min-width: 1280px) 90vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="text-xs text-steel">Representative model imagery</span>
            {credit ? (
              <span className="text-[0.6875rem] text-steel-dim">{credit}</span>
            ) : null}
          </figcaption>
        </figure>
      </Container>

      <Container size="wide" className="mt-12 sm:mt-16">
        <SpecRow items={model.specs} />
      </Container>

      <Container size="wide" className="mt-12 sm:mt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <div className="prose-body">
            <h2 className="label-xs mb-5">About the model</h2>
            {model.notes.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          {canAcceptInquiries() ? (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-line bg-ink-raised p-6 sm:p-7">
                <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
                  Source this model
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-steel">
                  Tell us the specification you want and how firm each part of it is.
                </p>
                <Link href={enquiryHref} className="btn btn-primary mt-6 w-full">
                  Discuss your specification
                </Link>
                {siteConfig.contact.email ? (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="link-underline mt-5 block text-center text-xs text-steel transition-colors hover:text-bone"
                  >
                    {siteConfig.contact.email}
                  </a>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>
      </Container>

      {model.specGroups && model.specGroups.length > 0 ? (
        <Container size="wide" className="mt-16 sm:mt-24">
          <SpecSection
            title="Specification"
            intro="How the model is built and what the factory offered. Individual cars vary."
            groups={model.specGroups}
          />
        </Container>
      ) : null}

      {related.length > 0 ? (
        <Container size="wide" className="mt-20 sm:mt-28">
          <div className="rule flex flex-col gap-6 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-2 text-bone">Also sourced</h2>
            <Link
              href="/sourcing"
              className="link-underline shrink-0 self-start text-sm text-bone-dim transition-colors hover:text-bone sm:self-end"
            >
              All models
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="h-full">
                <SourcingCard
                  model={item}
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  );
}
