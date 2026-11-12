# Project Documentation Context (Non-Obvious Only)

- `AGENTS.md` at project root is the single source of truth for agent guidance — mode-specific files are in `.roo/rules-*/`
- `raw_git_log.txt` (temporary file) contains `git log --date=short --pretty=format:"%ad | %s"` output spanning 2026-09-20 to 2026-11-12 — delete after docs regeneration
- Locale bundles at `public/locales/{it,en,de,es,fr}/translation.json` exist but were never fetched until `preload` was added to i18n config
