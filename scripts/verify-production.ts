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

import { productionFindings } from '../src/lib/production-readiness';
import { siteConfig } from '../src/site.config';

const ESC = '\u001b';
const BOLD = `${ESC}[1m`;
const DIM = `${ESC}[2m`;
const RED = `${ESC}[31m`;
const YELLOW = `${ESC}[33m`;
const GREEN = `${ESC}[32m`;
const RESET = `${ESC}[0m`;

function main(): void {
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

main();
