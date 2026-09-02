/**
 * Shared test setup.
 *
 * Loaded for every test file. The jest-dom matchers are only meaningful in jsdom, but
 * importing them under the node environment is harmless, so this stays unconditional
 * rather than splitting into two setup files.
 */
import '@testing-library/jest-dom/vitest';
