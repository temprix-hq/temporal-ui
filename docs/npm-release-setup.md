# npm release setup (one-time)

This repository publishes `@temporal-ui/core`, `@temporal-ui/react`, and `@temporal-ui/solid` to npmjs.org via GitHub Actions using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC). No long-lived `NPM_TOKEN` secret is stored in GitHub.

Releases are driven by two manually triggered workflows: [`.github/workflows/release-prep.yml`](.github/workflows/release-prep.yml) brings `main` to the release state through a version PR, and [`.github/workflows/release.yml`](.github/workflows/release.yml) publishes.

This document covers the one-time bootstrap.

## GitHub repository settings

On `temprix-hq/temporal-ui`, open **Settings → Actions → General → Workflow permissions**:

1. Select **Read and write permissions** for `GITHUB_TOKEN` (required to push the version branch, tags and GitHub Releases).
2. Enable **Allow GitHub Actions to create and approve pull requests** (required to open the version PR).

The `main-protection` ruleset stays as is: neither workflow pushes to `main` directly, so no bypass is needed.

## npm trusted publisher (per package)

For each package (`@temporal-ui/core`, `@temporal-ui/react`, `@temporal-ui/solid`):

1. Open the package on [npmjs.com](https://www.npmjs.com) → **Settings** → **Trusted Publisher** → **GitHub Actions**.
2. Configure:
   - **Organization or user:** `temprix-hq`
   - **Repository:** `temporal-ui`
   - **Workflow filename:** `release.yml` (filename only, including `.yml`)
   - **Environment:** leave empty
   - **Allowed actions:** `npm publish`
3. After CI publish works, optionally require 2FA and **disallow tokens** so only OIDC (CI) and interactive local 2FA can publish.

Do not rename `release.yml` without updating npm.

## First publish (if packages do not exist on npm yet)

npm cannot attach a trusted publisher until the package **exists** on the registry.

1. On a trusted machine: `npm login` (member of the `@temporal-ui` npm org, with 2FA).
2. From the repo root: `bun install`, then `bun run build`.
3. Publish each package once to npmjs.org (order matters: core first, then react and solid):

   ```bash
   cd packages/core && npm publish --access public
   cd ../react && npm publish --access public
   cd ../solid && npm publish --access public
   ```

   `prepack` / `postpack` scripts rewrite workspace dependencies for publish.

4. Add the trusted publisher on each package (see above).
5. All subsequent versions go through the release workflow only. Do not leave a bootstrap `NPM_TOKEN` in GitHub secrets.

## Release flow (after setup)

1. **Accumulate changesets on `main`** — feature PRs include `bun run changeset` and merge to `main`. Changeset files sit on `main` until you release; nothing runs automatically.
2. **Prepare the release** — open **Actions → Prepare release → Run workflow** on `main`. The run:
   - Applies all pending changesets (`changeset version`): bumps `package.json` versions (including the private root, synced by `scripts/sync-root-version.mjs`), updates changelogs, refreshes `bun.lock`
   - Force-pushes the result to the `changeset-release/main` branch as `chore: version packages (vX.Y.Z)`
   - Opens (or updates) the version PR against `main`
   - Starts the **Quality** workflow on that branch, so the required `Checks` and `Unit Tests` report on the PR
3. **Review and merge the version PR.** This is where the library reaches its release state on `main`. Nothing is published yet.
4. **Publish** — open **Actions → Release → Run workflow** on `main` and enter the version from the merged version PR (for example `1.1.0`). It becomes the run title (`Release 1.1.0`), and the run fails before publishing if it does not match `packages/core/package.json`. The run:
   - Publishes to npmjs.org (OIDC)
   - Creates git tags and GitHub Releases

**Prepare release** never publishes, and **Release** never changes versions. Release fails if changesets are still pending on `main`, and does nothing if the versions on `main` are already on npm.

If more changesets land on `main` before the version PR merges, run Prepare release again: it rebuilds `changeset-release/main` from `main` and updates the PR.

Re-run Release (with the same version) to retry a failed publish.

## Troubleshooting the version PR

- `Checks` and `Unit Tests` stay "expected" on the version PR: pushes made with `GITHUB_TOKEN` do not fire `pull_request` workflows, so `release-prep.yml` starts `quality.yml` through `workflow_dispatch`. `quality.yml` must keep its `workflow_dispatch` trigger and `release-prep.yml` must include `permissions.actions: write`. To start the checks by hand, run **Actions → Quality** on `changeset-release/main`.
- "GitHub Actions is not permitted to create or approve pull requests": enable the repository setting listed above. The branch is already pushed, so re-running Prepare release is enough.

## Troubleshooting changelog generation

- `changeset version` fails with "Please create a GitHub personal access token ... add it as the GITHUB_TOKEN environment variable" when the versioning step has no `GITHUB_TOKEN`. `@changesets/changelog-github` calls the GitHub API to link PRs and authors. The versioning step must pass `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`, and `release-prep.yml` must grant `permissions.pull-requests` (it has `write`, to open the version PR). No personal access token is needed.
- Changesets aborts before writing any files in this case, so re-running Prepare release is safe.

## Troubleshooting OIDC publish failures

- `release.yml` must include `permissions.id-token: write`.
- Do not set `NPM_TOKEN` or `NODE_AUTH_TOKEN` to a real token (OIDC is skipped if auth is present).
- Publish uses `npm publish` (not `bun publish`); npm CLI must be ≥ 11.5.1 (Node 24 in CI).
- Trusted publisher fields are case-sensitive; workflow filename must match exactly.
- Use GitHub-hosted runners (`ubuntu-latest`); self-hosted runners are not supported for npm OIDC.
