# Changelog

## 0.4.0 - 2026-05-14

### Angular 21 modernization

- Migrated the app to standalone Angular bootstrapping and removed legacy root/routing/material NgModule files.
- Enabled strict standalone/template compiler settings for the upgraded Angular 21 app.
- Removed `zone.js` and switched the app to zoneless change detection patterns where updated.
- Migrated selected component APIs to modern Angular signals, including signal inputs, model values, outputs, and view queries.
- Removed the custom `NgVarDirective` and replaced its usage with current Angular template syntax.

### Linting, formatting, and project hygiene

- Strengthened ESLint configuration for Angular, TypeScript, templates, signal usage, standalone components, lifecycle interfaces, and unsafe typing.
- Enforced CRLF line endings through `.editorconfig` and `.gitattributes`.
- Preserved the four-space project indentation style.
- Removed unused vendor/static assets and packages that were no longer needed after the Angular 21 update.
- Removed Bootstrap JavaScript bundle usage and replaced Bootstrap-driven interactions with Angular/native behavior.
- Removed `moment` and replaced date/time logic with lighter local utilities.
- Set the app package version to `0.4.0` and pinned `@joxnathan/mock-randomizer` to `0.4.0` so the demo release tracks the library version exactly.

### UI and feature improvements

- Centralized route paths, route links, and sidebar navigation metadata.
- Added sidebar links for Pi Digits and World Clock under the not-so-random area.
- Reworked native dialogs for larger image previews and improved content padding.
- Added responsive table wrappers and small-screen spacing polish for demo pages.
- Added replayable seeded data controls to Change Log History.
- Added a reload content action to Change Log History.
- Added an experimental CSS quarter flip animation to Flip A Coin.

### Documentation

- Rewrote the README around the real purpose of the project: documenting and demonstrating `@joxnathan/mock-randomizer`.
- Added GitHub Pages publishing instructions.
- Added this changelog.
