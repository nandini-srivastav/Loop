# Contributing to UQ Pulse

Thanks for considering a contribution — this project is built by and for UQ students, so contributions from other students are especially welcome.

## Before you start

- Check open [issues](../../issues) — if what you want to work on isn't there yet, open one first so we can align on approach before you write code.
- Issues labeled `good first issue` are scoped for newer contributors.
- For anything bigger than a small fix, comment on the issue so two people don't build the same thing.

## Workflow

1. Fork the repo (or branch directly if you have write access)
2. Branch naming: `feat/short-description`, `fix/short-description`, `docs/short-description`
3. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat: add event map deep link`, `fix: correct timezone on event cards`
4. Open a PR against `main` using the PR template. Link the issue it closes (`Closes #12`).
5. CI must pass (lint, type-check, tests, build) before review.
6. At least one approving review required before merge. PRs are squash-merged.

## Local setup

See [README.md](./README.md#getting-started).

## Code style

- TypeScript strict mode, ESLint + Prettier — run `npm run lint` before pushing
- Python service: `black` + `ruff`, run `make lint` in `apps/scraper`

## Code of Conduct

By participating, you agree to uphold [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
