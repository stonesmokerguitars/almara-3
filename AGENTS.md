# Codex guidance for Almara-3

## Workspace boundary

- Treat this repository as the only writable workspace.
- Do not write temporary files, scripts, screenshots, caches, test fixtures, Playwright helpers, or package installs to `/tmp`, `/private/tmp`, `$HOME`, Desktop, Documents, Applications, or any other location outside this repository.
- Use `.codex-tmp/` for all temporary Codex/QA artifacts. Create it if needed.
- When a command or tool needs a temp directory, prefer running it with `TMPDIR="$PWD/.codex-tmp"`.
- Do not request elevated/full filesystem permissions and do not use `sudo`. If an approach needs access outside the repository, redesign the approach so it stays inside the workspace.

## Implementation quality

- Implement the requested change completely; do not stop after analysis or a plan.
- Preserve unrelated user changes and avoid broad rewrites unless they are necessary for the task.
- Prefer the existing project architecture and source files over patching generated output.
- For generated page content, edit the relevant files under `src/`, `scripts/`, or `site.config.mjs` and then run `node scripts/build.mjs` as appropriate.
- After meaningful code/content changes, run `node scripts/check.mjs` and fix failures caused by the change.
- For visual, responsive, scrolling, animation, menu, gallery, or interaction work, perform browser/viewport QA when practical. Keep any QA scripts, screenshots, browser helpers, caches, or temporary dependencies under `.codex-tmp/`.
- Check at least a narrow mobile viewport and a desktop viewport for responsive UI changes, and look for overflow, clipped content, broken navigation, and unintended layout shifts.
- If a temporary Node package is needed only for QA, install it under `.codex-tmp/` (for example with `npm install --prefix .codex-tmp ...`) rather than globally or under `/private/tmp`.
- Remove or leave ignored temporary QA artifacts in `.codex-tmp/`; do not add them to commits.

## Project-specific notes

- `src/home.html` is the homepage/source template.
- `src/services.mjs` contains service content.
- `scripts/build.mjs` generates the HTML pages.
- `scripts/check.mjs` validates generated pages, links, SEO metadata, IDs, images, and sitemap relationships.
- `styles.css` and `script.js` are used directly and do not require regeneration unless another source change also requires it.
- Generated `index.html` files should not be edited manually when the same change belongs in a source/generator file.
