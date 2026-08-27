/**
 * Next.js declares `*.module.css` but not plain global stylesheets, and TypeScript 6
 * errors on an undeclared side-effect import. This covers `import './globals.css'`.
 */
declare module '*.css';
