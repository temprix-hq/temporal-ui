# AGENTS.md

Last updated: October 22nd, 2026

Bun monorepo (Turbo) publishing `@temporal-ui/core`, `@temporal-ui/react` and `@temporal-ui/solid` in lockstep versions via Changesets. No backend, no env files. Visual work happens in Storybook; correctness is Vitest plus typecheck. `README.md` is for npm consumers; agent and contributor rules live here and in `docs/`.

## Workflow

Follow these steps for every change to a tracked file.

1. **Branch** from the up-to-date default branch and never commit to it: `{agent}/{issue-id}-{slug}`, or `{agent}/{slug}` with no issue. If the harness assigns a branch name and forbids renaming it, keep it and say so in the PR body.
2. **Checks.** Before each commit run the formatter, linter and typecheck in **Before committing** below, together, and re-run them after any later edit. Report them as passing only if the last run was on the current tree.
3. **Docs.** Update `docs/` and this file in the same change when you alter the behavior or structure they describe. Set `Last updated:` on files you edit.
4. **Changeset.** A change that affects consumers of the published packages also needs one (see **Versioning and releases**).
5. **PR.** Open it ready for review, never draft, using `.github/pull_request_template.md`, with the issue ID in the title if there is one. After each later push add a one-line PR comment. Squash merge is standard.
6. **Ask first** before merging, force-pushing, publishing, changing CI or repository settings, or adding a dependency or service.
7. **Report** the PR URL, branch, checks and result, docs touched and open questions. After the merge, sync the default branch and delete the local branch.

This repo's own docs and code are the source of truth. If a task needs facts you cannot verify here, say so instead of inventing them.

## Commands

Use **Bun only**. Do not use npm, yarn or pnpm. Lint and format are **oxlint** and **oxfmt**; do not add or run Biome, ESLint or Prettier.

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
| React Storybook    | `bun run react` (port 6006)               |
| Solid Storybook    | `bun run solid` (port 6007)               |
| Changeset          | `bun run changeset`                       |

### Before committing

Run all three together. Do not skip typecheck:

```bash
bun run format
bun run lint:fix
bun run typecheck
```

Turbo `typecheck` depends on `^build`, so core is built first. Root `lint` does not go through Turbo and needs no build. Unit tests need no build. Lefthook runs `format`, `lint` and `typecheck` on pre-commit (it does not fix lint). CI (`quality.yml`) runs format check, lint with `--deny-warnings`, typecheck, build and `test:dist`, then unit tests.

## Rules

- Shared props, variants and CSS live in `@temporal-ui/core`. Do not invent a component API in a framework package.
- React and Solid stay in sync: same export names, props, `data-*` attributes and stories. Do not change only one unless the task says so.
- Follow [`docs/code-generation.md`](docs/code-generation.md) when adding or changing components and [`docs/testing-strategy.md`](docs/testing-strategy.md) when writing tests.
- Use the Ark UI MCP (`.cursor/mcp.json`) for Ark part names and props, with `framework` set to `react` or `solid`. Do not guess them.
- Architecture, styling tokens and the reasons behind them: [`docs/architecture.md`](docs/architecture.md).

## Versioning and releases

If a PR changes what consumers of the published packages get, it **must** include a changeset: new or changed component APIs, props or exports; bug fixes or behavior changes; dependency or build output changes that affect installs. Run `bun run changeset` and commit the file under `.changeset/`. Changesets accumulate on `main` and do not publish by themselves. Skip one for docs, CI, tests with no package behavior change and Storybook-only tweaks. Use `--empty` only to document a no-release change explicitly.

Releasing is two GitHub Actions workflows run on `main`, with a PR merge in between (`main` only accepts pull requests). Do **not** run `npm publish` or `bun run publish` locally unless the user explicitly asks.

1. **Prepare release** applies the pending changesets on `changeset-release/main`, opens the version PR `chore: version packages (vX.Y.Z)` and starts Quality on it. It never publishes. Report the PR URL and stop; the user merges it. Re-run to rebuild after more changesets land.

   ```bash
   gh workflow run release-prep.yml --ref main
   ```

2. **Release** publishes the versions on `main` to npm and creates git tags and GitHub Releases. It never changes versions and fails if changesets are pending. `version` must match `packages/core/package.json` on `main`, or the run fails before publishing. Re-run to retry a failed publish.

   ```bash
   gh workflow run release.yml --ref main -f version=X.Y.Z
   ```

When asked to publish, release or ship a new version: run Prepare release if changesets are pending under `.changeset/`, otherwise run Release. One-time npm OIDC setup and troubleshooting: [`docs/npm-release-setup.md`](docs/npm-release-setup.md).
