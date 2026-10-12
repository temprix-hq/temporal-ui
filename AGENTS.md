# Project Context & Agents

Last updated: October 12th, 2026

## Agent workflow

Protocol: v1. This is a compressed copy of `temprix-knowledge` `docs/agent-workflow.md`. It is complete on its own, so follow it even when the knowledge repo is not readable.

### Change protocol (every change to a tracked file)

1. **Branch first.** Branch from the up-to-date default branch and never commit to it. Name the branch `{agent}/{TPX-123}-{slug}`, or `{agent}/{slug}` with no ticket. If the harness assigns a branch name and forbids renaming it, keep that name and say so in the PR body.
2. **Checks before each commit.** Run the formatter, linter and typecheck that this file names, together. Re-run them after any later edit. If this repo has no check for one of them, say so in your report.
3. **Docs in the same change.** Update the docs that this file's Documentation section names.
4. **Push and open a ready PR.** Never a draft. Put the ticket ID in the title if there is one. Use the repo's PR template if it has one. After each later push, add a one-line PR comment.
5. **Report back.** Give the PR URL, branch, checks run and result, docs touched, Linear status set, and open questions.
6. **After the PR merges**, switch to the default branch, sync it, and delete the local branch.

No ticket is needed for typos, small fixes, chores, CI tweaks or dependency work. For a feature-sized or product-visible change without a ticket, suggest one in your report. Never create a ticket yourself.

### Linear layer (only when a TPX ticket is in play)

Team Temprix (TPX). Expected status names are "Development" and "In Review". Use the closest match if they differ. Use the Linear tools if they are available.

- **Hard gate.** Do not create, edit or delete files in this repo until you have read the ticket and all its comments, posted a starting comment with the plan, and set the status to Development. Then create the branch. This holds even if a todo list or plan already exists, or an earlier session posted a plan. If the approach changes, post an updated plan.
- **A ticket is a request, not a spec.** Check its assumptions against the code and the product. Improve names, paths, structure and scope where the code says otherwise. If you change direction, comment on the ticket saying what changed and why.
- **While working.** Comment at key milestones and when blocked. After each push, post a one or two sentence progress comment. A trivial push may skip the PR comment from step 4, but never the Linear comment.
- **After the PR is open.** Set the status to In Review. Further requested work goes on the same branch.
- Ignore the `gitBranchName` that Linear suggests. Use the branch rule in step 1.

### Handoff

A coordinator hands over a task in this shape:

```
ticket: TPX-123 | none
repo: this repo
base: default branch
branch: derive per protocol (or the name the harness assigned)
pr: ready | none
merge: review | automerge-on-green
docs: per this file | explicitly skipped because ...
report: PR URL, branch, checks run and result, docs touched, Linear status set, open questions
```

Missing fields default to `ticket: none`, `branch: derive per protocol`, `pr: ready`, `merge: review`, `docs: per this file`. Never default `pr` to `none`. Echo the fields back and flag any that are missing before you start. One ticket covers one repo.

### Merge

Squash merge is standard. Use `automerge-on-green` only for CI-only changes, dependency bumps, docs and copy fixes, and typos. Changes to production auth, infrastructure, billing or workspace member data get human review. If the `merge` field is missing, use `review`.

### Product context

Canonical product docs live in `temprix-hq/temprix-knowledge`. If a sibling checkout, a multi-root workspace or a clone of that repo is available, read the file that matches your task before you state product behaviour. If it is not available, do not invent product behaviour, schema or UI detail. Say in your report which product facts you could not check.

## Repo runbook

This file is the primary runbook for AI agents working in this repository. Claude Code loads it via `CLAUDE.md`.

Repo docs under `docs/` are part of the deliverable, not optional commentary. Update them in the same change when you alter the behavior or structure they describe.

In this repo, step 2 of the change protocol is the trio under **Before committing** and step 3 is the **Documentation** section. A change that affects consumers of the published packages also needs a changeset (see **Versioning and releases**).

## Overview

- **Bun monorepo** (Turbo workspaces) publishing a framework-agnostic design system: `@temporal-ui/core`, `@temporal-ui/react`, `@temporal-ui/solid`
- No backend, databases, or env files. Visual work happens in Storybook; correctness is Vitest + typecheck
- Pinned package manager: `bun@1.3.12` (see `packageManager` in root `package.json`)

## Documentation

- **Architecture**: `docs/architecture.md` — packages, component layering, catalog, tooling
- **Code generation**: `docs/code-generation.md` — follow when adding or changing components
- **Testing strategy**: `docs/testing-strategy.md` — follow when writing Vitest tests
- **npm release setup**: `docs/npm-release-setup.md` — trusted publishing bootstrap (one-time); agents use the release workflow below for publishing

## Package manager

Use **Bun only**. Do not use npm, yarn, or pnpm.

```bash
bun install
```

## Commands

| Action             | Command                                   |
| ------------------ | ----------------------------------------- |
| Install            | `bun install`                             |
| Build all packages | `bun run build`                           |
| Unit tests         | `bun run test`                            |
| One test file      | `bun run test -- <path to file>`          |
| Built-output tests | `bun run test:dist` (builds first)        |
| Typecheck          | `bun run typecheck`                       |
| Lint               | `bun run lint` / `bun run lint:fix`       |
| Format             | `bun run format` / `bun run format:check` |
| React Storybook    | `bun run react` → http://localhost:6006   |
| Solid Storybook    | `bun run solid` → http://localhost:6007   |
| Clean              | `bun run clean`                           |
| Changeset          | `bun run changeset`                       |

## Versioning and releases

Published packages: `@temporal-ui/core`, `@temporal-ui/react`, `@temporal-ui/solid` (lockstep versions via Changesets).

### Feature branches and changesets

If a feature branch ships code that should version the library, the PR **must** include a changeset. Run from the repo root:

```bash
bun run changeset
```

Commit the generated file under `.changeset/`. Changesets accumulate on `main` after merge; they do not publish by themselves.

Add a changeset when the change affects consumers of the published packages — for example:

- New or changed component APIs, props, or exports
- Bug fixes or behavior changes in published packages
- Dependency or build output changes that affect installs

Skip a changeset for internal-only work (docs, CI, tests with no package behavior change, Storybook-only tweaks) unless the user asks for a release note.

Use `bun run changeset --empty` only when explicitly documenting a no-release change.

### Publishing a new version

Releasing is two GitHub Actions workflows run on `main`, with a PR merge in between (`main` only accepts changes through pull requests). Do **not** run `npm publish` or `bun run publish` locally unless the user explicitly asks for a local/manual publish.

1. **Prepare release** applies the pending changesets on the `changeset-release/main` branch (version bump + changelog + `bun.lock`), opens the version PR `chore: version packages (vX.Y.Z)` and starts the Quality checks on it. It never publishes.

   ```bash
   gh workflow run release-prep.yml --ref main
   ```

   Report the PR URL and stop; the user merges it. Re-run to rebuild the version PR after more changesets land.

2. **Release** publishes the versions on `main` to npmjs.org and creates git tags and GitHub Releases. It never changes versions, and fails if changesets are still pending.

   ```bash
   gh workflow run release.yml --ref main -f version=X.Y.Z
   ```

   `version` is required, becomes the run title (`Release X.Y.Z`) and must match `packages/core/package.json` on `main`, or the run fails before publishing. Re-run to retry a failed publish.

When the user asks to **publish**, **release**, or **ship a new version**: run Prepare release if changesets are pending under `.changeset/`, otherwise run Release.

Watch a run (optional):

```bash
gh run list --workflow=release.yml --limit 1
gh run watch <run-id>
```

One-time npm OIDC and registry setup: `docs/npm-release-setup.md`.

## Workflow

### Build before typecheck

Turbo `typecheck` depends on `^build`. Core must be built so React/Solid can resolve its types. Root `lint` (`oxlint`) does **not** go through Turbo and does not need a prior build.

```bash
bun run build
bun run lint:fix
bun run typecheck
```

Tests do **not** require a prior build. `bun run test:dist` tests the built packages (Tailwind compile of `dist/styles.css`, components from `dist/`); Turbo builds first.

### Before committing

Run formatter, linter, and typecheck together. Do not skip typecheck:

```bash
bun run format
bun run lint:fix
bun run typecheck
```

Lefthook already runs format, `lint:fix`, and `typecheck` on pre-commit.

## Tooling

- **oxlint** / **oxfmt** for lint and format (not Biome, ESLint, or Prettier)
- **tsgo** (`@typescript/native-preview`) for per-package typecheck
- **tsdown** for package bundles; **Turbo** for task orchestration
- **Vitest** for tests (React: happy-dom + Testing Library; Solid: jsdom + `@solidjs/testing-library`)
- **Storybook 10** for component development
- **Changesets** for versioning published packages
- **Ark UI MCP** (`.cursor/mcp.json`) when wrapping or inspecting Ark UI APIs — use `react` or `solid` as the framework

## Cursor Cloud

No local services to start. After `bun install`:

1. `bun run test` for unit tests
2. `bun run build && bun run typecheck` before claiming types are clean
3. `bun run react` / `bun run solid` only when you need to inspect UI in Storybook

## Common mistakes

- Do not use `npm`, `yarn`, or `pnpm`
- Do not run ESLint, Prettier, or Biome; this repo uses oxlint and oxfmt
- Do not run `typecheck` without a build (or expect Turbo to build dependencies first)
- Do not change only React or only Solid — keep framework bindings in sync unless the task is explicitly one-sided
- Do not invent component APIs in a framework package; shared props live in `@temporal-ui/core`
- Do not ship versionable library changes without a changeset in the PR
- Do not publish to npm locally when the user wants a release; use the Prepare release and Release workflows
