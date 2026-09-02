import Image from 'next/image';
import Link from 'next/link';
import type { SourcingModel } from '@/lib/types';
import { recordHref, vehicleHeading } from '@/lib/vehicles';

type Props = {
  model: SourcingModel;
  priority?: boolean;
  sizes?: string;
};

/**
 * Card for a model brief.
 *
 * Deliberately not the same object as a vehicle card: no status chip, no price, no
 * model year, and the action is "Discuss this model" rather than anything implying
 * a car is standing somewhere waiting. Marque sits above the model name so the page
 * reads as a marque list rather than a stock list.
 */
export function SourcingCard({
  model,
  priority = false,
  sizes = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw',
}: Props) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[3/2] w-full overflow-hidden border border-line bg-ink-panel">
        <Image
          src={model.image.src}
          alt={model.image.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="label-xs">{model.make}</p>

        <h3 className="mt-2.5 text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-bone">
          <Link href={recordHref(model)} className="before:absolute before:inset-0">
            {vehicleHeading(model)}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-steel">
          {model.category}
          {model.generation ? ` · ${model.generation}` : ''}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-steel">{model.brief}</p>

        <div className="rule mt-auto flex items-center justify-end pt-4">
          <span className="link-underline text-[0.8125rem] text-bone-dim transition-colors group-hover:text-bone">
            Discuss this model
            <span aria-hidden="true"> →</span>
          </span>
        </div>
      </div>
    </article>
  );
}
