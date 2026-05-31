# Defend the Alamo

A mobile-first, browser-based **base-defense** game set during the 1836 Siege of the Alamo.
Fortify the Alamo, build wall-mounted cannons, train and command troops, and hold the chapel
against escalating assault waves of the Mexican Army.

**Play it:** https://trimmja.github.io/defend-the-alamo/ (open in Safari on your iPhone)

## Run it locally
Double-click **`start.command`** — it starts a local server at http://localhost:8080 and prints
your Mac's LAN IP so you can open it on a phone on the same Wi-Fi.

> Don't open `index.html` directly with `file://` — browsers block local image/module loads.

## Tech
- **Phaser 3** (loaded from CDN, no build step)
- Plain ES modules — deploys straight to GitHub Pages from `main`
- Portrait orientation, scales to fit any phone

## Docs
- `ROADMAP.md` — the full plan and phase-by-phase roadmap
- `CLAUDE.md` — project rules + sprite-wiring checklist
- `ASSETS.md` — canonical asset reference
