import { siteConfig } from '@/site.config';

/**
 * Site-wide demonstration notice. Rendered only while
 * `siteConfig.showSampleInventoryNotice` is true — set it to false once the sample
 * listings in `src/data/vehicles.ts` have been replaced.
 */
export function SampleInventoryNotice({ className = '' }: { className?: string }) {
  if (!siteConfig.showSampleInventoryNotice) return null;

  return (
    <p
      className={`flex items-start gap-3 border-l border-giallo-deep py-1 pl-4 text-xs leading-relaxed text-steel ${className}`}
    >
      <span className="label-xs shrink-0 text-giallo">Note</span>
      <span>{siteConfig.legal.sampleInventoryNotice}</span>
    </p>
  );
}
