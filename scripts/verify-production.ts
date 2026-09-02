/**
 * `npm run verify:production`
 *
 * Lists every factual input the site still needs before it can present itself as a
 * real business. Exits non-zero if anything is blocking.
 *
 * This script has no opinions of its own: it reports what `productionFindings()`
 * finds, which is the same function the site uses to decide whether to allow indexing
 * and whether to emit organisation structured data. Nothing here invents a value to
 * make the run pass — a failing check means something still has to be supplied.
 */

import { existsSync } from 'node:fs';

/*
 * Load the same env files Next.js would, before anything reads process.env.
 *
 * Without this the script reports blockers for values that are configured in
 * .env.local and works fine in the running app — which trains everyone to ignore it.
 * Later files do not override earlier ones, matching Next's precedence.
 *
 * The imports below are deliberately dynamic: `src/site.config.ts` reads process.env
 * at module scope, so a static import would be evaluated before this runs.
 */
for (const file of ['.env.local', '.env']) {
  if (existsSync(file)) process.loadEnvFile(file);
}

type Deps = {
  productionFindings: typeof import('../src/lib/production-readiness').productionFindings;
  siteConfig: typeof import('../src/site.config').siteConfig;
};

async function loadDeps(): Promise<Deps> {
  const [readiness, config] = await Promise.all([
    import('../src/lib/production-readiness'),
    import('../src/site.config'),
  ]);
  return { productionFindings: readiness.productionFindings, siteConfig: config.siteConfig };
}

const ESC = '\u001b';
const BOLD = `${ESC}[1m`;
const DIM = `${ESC}[2m`;
const RED = `${ESC}[31m`;
const YELLOW = `${ESC}[33m`;
const GREEN = `${ESC}[32m`;
const RESET = `${ESC}[0m`;

async function main(): Promise<void> {
  const { productionFindings, siteConfig } = await loadDeps();
  const findings = productionFindings();
  const blockers = findings.filter((f) => f.severity === 'blocker');
  const warnings = findings.filter((f) => f.severity === 'warning');

  console.log(`\n${BOLD}Marlowe Motorcars — production readiness${RESET}`);
  console.log(`${DIM}Canonical origin: ${siteConfig.url}${RESET}`);
  console.log(`${DIM}Classification:   ${siteConfig.classification}${RESET}\n`);

  if (findings.length === 0) {
    console.log(`${GREEN}✓ Everything required is configured.${RESET}\n`);
    return;
  }

  if (blockers.length > 0) {
    console.log(`${RED}${BOLD}Blocking (${blockers.length})${RESET}`);
    console.log(
      `${DIM}The site will not be indexed and will not emit organisation structured ` +
        `data until these are resolved.${RESET}\n`,
    );
    for (const finding of blockers) {
      console.log(`  ${RED}✗${RESET} ${BOLD}${finding.field}${RESET}`);
      console.log(`    ${finding.problem}`);
      console.log(`    ${DIM}→ ${finding.remedy}${RESET}\n`);
    }
  }

  if (warnings.length > 0) {
    console.log(`${YELLOW}${BOLD}Incomplete (${warnings.length})${RESET}`);
    console.log(`${DIM}Honest as it stands, but still missing information.${RESET}\n`);
    for (const finding of warnings) {
      console.log(`  ${YELLOW}!${RESET} ${BOLD}${finding.field}${RESET}`);
      console.log(`    ${finding.problem}`);
      console.log(`    ${DIM}→ ${finding.remedy}${RESET}\n`);
    }
  }

  if (blockers.length > 0) {
    console.log(
      `${RED}Not ready to publish.${RESET} ` +
        `${DIM}Supply the values above in .env.local or your host's environment.${RESET}\n`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `${GREEN}✓ No blocking issues.${RESET} ` +
      `${DIM}The site can be published and indexed.${RESET}\n`,
  );
}

main().catch((error: unknown) => {
  console.error('verify:production failed to run:', error);
  process.exit(1);
});
