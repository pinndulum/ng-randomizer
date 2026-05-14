# ng-randomizer

Angular demo and documentation site for [`@joxnathan/mock-randomizer`](https://www.npmjs.com/package/@joxnathan/mock-randomizer).

The project exists to show practical ways to generate synthetic data for demos, unit tests, fixtures, and repeatable datasets. It is not a general random-number toy; each page is meant to demonstrate a different part of the mock-randomizer API.

## Live Demo

[ng-randomizer on GitHub Pages](https://pinndulum.github.io/ng-randomizer/)

## Demo Areas

- **Buzzwords**: custom word banks, URL query replay, and simple generated phrases.
- **Shakespeare Insults**: reusable word lists with browser speech synthesis.
- **Flip A Coin**: random choices, visual feedback, and aggregate outcome tracking.
- **Pseudo Identity**: realistic names, addresses, phone numbers, emails, time zones, and credit-card-shaped values.
- **Change Log History**: nested generated objects, generated arrays, seeded replay, and copyable JSON.
- **Mock DSL Fill**: interactive JSON DSL experimentation.
- **Pi Digits** and **World Clock**: deterministic "not so random" reference pages.

## Requirements

- Node.js compatible with Angular 21.
- npm.

Install dependencies:

```powershell
npm install
```

## Local Development

Start the dev server:

```powershell
npm start
```

Then open `http://localhost:4200/`.

Useful checks:

```powershell
npm run lint
npm run build
npm run test:ci
```

`npm run lint:fix` applies ESLint autofixes.

## GitHub Pages Publishing

The project is configured for GitHub Pages under `/ng-randomizer/`.

Before publishing:

1. Make sure the release is being prepared from `main`.

    ```powershell
    git switch main
    git pull --ff-only
    git status --short
    ```

2. Review release metadata and docs.

    - Update `package.json` and `package-lock.json` if the app version needs to change. Prefer `npm version <version> --no-git-tag-version` so both files stay in sync.
    - Keep the app version aligned with the demonstrated `@joxnathan/mock-randomizer` version when that is the intent of the release.
    - Update `CHANGELOG.md` with the release date and meaningful user-facing changes.
    - Re-read the README sections that describe the current demos and publishing steps.

3. Run the local verification commands.

    ```powershell
    npm run lint
    npm run build
    npm run test:ci
    ```

4. Commit and push the release state on `main`. Use the actual release version in the commit message.

    ```powershell
    git status --short
    git add package.json package-lock.json CHANGELOG.md README.md
    # Add any intentional source or asset changes for the release.
    git status --short
    git commit -m "Prepare release 0.4.0"
    git push origin main
    ```

Build and publish to GitHub Pages:

```powershell
npm run ghpages
```

The `preghpages` lifecycle script runs first and builds with:

```powershell
ng build --base-href /ng-randomizer/
```

Then `angular-cli-ghpages` publishes `dist/ng-randomizer/browser` to the GitHub Pages branch. In the repository settings, GitHub Pages should be configured to serve from the published `gh-pages` branch.

## Project Notes

- Angular 21 standalone bootstrapping is used; the old root NgModule pattern has been removed.
- Line endings are intentionally CRLF through `.editorconfig` and `.gitattributes`.
- The style guide uses four-space indentation.
- The app is zoneless and relies on modern Angular patterns where they have been migrated.
- The remaining `::ng-deep` usage is limited to the JSON editor integration where third-party DOM styling requires it.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
