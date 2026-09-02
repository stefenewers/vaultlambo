/**
 * Scan the production build output for things that must never reach a visitor.
 *
 * `verify:production` checks configuration. This checks the artefact — the HTML, RSC
 * payloads and client chunks Next.js actually emitted — because the two can disagree.
 * A placeholder hard-coded into a component, a stray sample vehicle, or a claim
 * reintroduced into copy would all pass a config check and still ship.
 *
 * Only application output is scanned: `.next/server/app` and `.next/static/chunks/app`.
 * Framework and vendor chunks are excluded because they contain their own TODOs and
 * long digit runs, and flagging those trains everyone to ignore this check.
 *
 * Run after `next build`:  npm run verify:build
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

type Severity = 'blocker' | 'warning';

type Rule = {
  label: string;
  pattern: RegExp;
  /** Why it must not ship. */
  why: string;
  severity: Severity;
  /**
   * Which artefacts the rule applies to. Defaults to all of them.
   *
   * Some rules only make sense against rendered output. `production-readiness.ts`
   * contains a regex listing the very markers this scan looks for, and that module is
   * bundled into route handlers — so searching JS chunks for "FIXME" finds the
   * detector rather than a defect.
   */
  appliesTo?: RegExp;
};

/** Artefacts a visitor actually reads, as opposed to code that produces them. */
const RENDERED_OUTPUT = /\.(html|rsc|txt|xml|body)$/;

/**
 * A local build legitimately resolves canonicals to localhost, because
 * NEXT_PUBLIC_SITE_URL is not set on a developer machine. On CI or Vercel there is no
 * such excuse, so the same finding is promoted to a blocker.
 */
const IS_DEPLOY_CONTEXT = process.env.CI === 'true' || process.env.VERCEL === '1';

const RULES: Rule[] = [
  {
    label: 'example.com placeholder',
    pattern: /\b[\w.+-]+@example\.(com|org|net)\b/i,
    why: 'A placeholder contact address would be published as a real one.',
    severity: 'blocker',
  },
  {
    label: 'zero-filled phone number',
    // Requires phone-shaped punctuation. A bare run of zeros inside minified code is
    // not a phone number, and matching one made this check noise.
    pattern: /(?:\+\d\s*)?\(0{3}\)[\s.-]*0{3}[\s.-]*0{4}|(?:\+\d[\s.-]*)?0{3}[\s.-]+0{3}[\s.-]+0{4}/,
    why: 'A placeholder phone number would be published as a real one.',
    severity: 'blocker',
  },
  {
    label: 'localhost canonical',
    pattern: /https?:\/\/localhost(:\d+)?/i,
    why: 'A canonical, sitemap or metadata URL pointing at a developer machine.',
    severity: IS_DEPLOY_CONTEXT ? 'blocker' : 'warning',
  },
  {
    label: 'unresolved marker',
    pattern: /\b(TODO|FIXME|CHANGEME|LOREM IPSUM)\b/,
    why: 'Unfinished copy left in a shipped page.',
    severity: 'blocker',
    appliesTo: RENDERED_OUTPUT,
  },
  {
    label: 'deposit claim',
    pattern: /deposit\s+taken/i,
    why: 'A transaction claim nothing in the repository supports.',
    severity: 'blocker',
  },
  {
    label: 'sample-vehicle marker',
    pattern: /\bisSample\b/,
    why: 'The sample-listing flag from the original data set has come back.',
    severity: 'blocker',
  },
];

/**
 * Slugs that were never real cars. If one appears alongside an availability status in
 * the same document, a model brief is being presented as stock again.
 */
const SOURCING_SLUGS = [
  'porsche-911-gt3-touring',
  'ferrari-296-gtb',
  'mclaren-artura',
  'bentley-continental-gt',
  'mercedes-amg-g-63',
  'range-rover-sv',
  'bmw-m3-cs',
];

const AVAILABILITY_CLAIM = /availability["'\\:\s]+(available|reserved)/i;

/** Only application output. Vendor and framework chunks are not ours to police. */
const SCAN_ROOTS = ['.next/server/app', '.next/static/chunks/app'];

type Finding = {
  file: string;
  label: string;
  why: string;
  sample: string;
  severity: Severity;
};

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(html|js|json|txt|xml|rsc|body)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function main(): void {
  const files = SCAN_ROOTS.flatMap((root) => walk(root));

  if (files.length === 0) {
    console.error(
      'No application build output found. Run "npm run build" before this check.',
    );
    process.exit(1);
  }

  const findings: Finding[] = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');

    for (const rule of RULES) {
      if (rule.appliesTo && !rule.appliesTo.test(file)) continue;
      const match = content.match(rule.pattern);
      if (!match) continue;
      findings.push({
        file,
        label: rule.label,
        why: rule.why,
        severity: rule.severity,
        sample: match[0].slice(0, 80),
      });
    }

    // A sourcing slug and an availability status in the same document means a model
    // brief has been rendered as though it were a car on offer.
    if (AVAILABILITY_CLAIM.test(content)) {
      const slug = SOURCING_SLUGS.find((s) => content.includes(s));
      if (slug) {
        findings.push({
          file,
          label: 'sourcing model marked as available',
          why: `"${slug}" is a model brief and cannot carry an availability status.`,
          severity: 'blocker',
          sample: content.match(AVAILABILITY_CLAIM)?.[0] ?? '',
        });
      }
    }
  }

  console.log(`Scanned ${files.length} application artefacts.\n`);

  const blockers = findings.filter((f) => f.severity === 'blocker');
  const warnings = findings.filter((f) => f.severity === 'warning');

  const report = (list: Finding[], heading: string) => {
    if (list.length === 0) return;
    console.error(`${heading}\n`);
    for (const f of list) {
      console.error(`  ${f.label}`);
      console.error(`    file:   ${f.file}`);
      console.error(`    found:  ${f.sample}`);
      console.error(`    why:    ${f.why}\n`);
    }
  };

  report(blockers, `${blockers.length} blocker(s):`);
  report(warnings, `${warnings.length} warning(s):`);

  if (blockers.length > 0) {
    console.error('Build output is not safe to publish.');
    process.exit(1);
  }

  if (warnings.length === 0) {
    console.log('No placeholder text, false availability or unsupported claims found.');
  } else {
    console.log(
      'No blocking problems. Warnings above are expected in a local build and become ' +
        'blockers on CI or Vercel.',
    );
  }
}

main();
