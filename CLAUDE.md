# Defend the Alamo — Project Rules

## What this is
A browser-based, mobile-first **base-defense** game (Phaser 3) about defending the Alamo (1836).
Top-down fort, wall-mounted cannons, rally-commanded troops, historical heroes, escalating
Mexican-Army assault waves. Jacob is the lead designer/decision-maker. Plays in the browser and
on iPhone via Safari.

The fort layout follows the real 1836 compound (`docs/historical-alamo.jpg`): the **chapel is the
SE-corner keep** (final defensive point), not centered. See `ROADMAP.md` (Phase 2 remodel).

## Ground rules
- **Validate before claiming done.** State assumptions, deploy to GitHub Pages, and wait for
  Jacob to confirm the live build actually runs (no console errors, no missing-texture boxes)
  before saying a feature works. Don't rush a "done."
- **Mobile-first.** Everything must be comfortably tappable with a thumb. Test touch, not just mouse.
- **No build step.** Phaser is loaded from CDN in `index.html`; source is plain ES modules under
  `src/`. This must keep deploying to GitHub Pages straight from `main`.
- **Keep balance in `src/config.js`.** Don't scatter magic numbers across entities.
- **Tone:** historical and respectful. The enemy is the 1836 Mexican Army (soldados); never a
  caricature. Both sides treated with respect.

## Architecture
- `src/main.js` — Phaser game config + scene list (portrait, Scale.FIT).
- `src/config.js` — all constants & balance.
- `src/scenes/` — Boot (preload), Menu, Game (gameplay), HUD (overlay), GameOver.
- `src/entities/` — Fort, Cannon, Troop, Enemy, Hero, Projectile.
- `src/systems/` — WaveManager, Economy, Placement.
- HUDScene runs **in parallel** with GameScene (`scene.launch`) and talks to it via the registry
  / events, not direct coupling.
- `index.html` loads Phaser (CDN) + `src/main.js` (module); `manifest.webmanifest` + `icons/`
  provide the "Add to Home Screen" PWA icon (standalone, portrait).

## Sprite / texture wiring checklist (avoid the "green box" bug)
The map is layered: a foundation-only terrain image plus separate runtime structure sprites (see
`ASSETS.md`). Small unit/projectile/UI sprites are still **code-generated** in `BootScene`. When we
later swap in more real sprite sheets (Kenney / commissioned), follow this every time:
1. Add the file under `assets/`, record path + frame size in **`ASSETS.md`** first.
2. Load with the **exact** frame width/height in `BootScene.preload`.
3. Verify the texture key matches what entities request.
4. Run the game and confirm the sprite renders (not a green/blank box) before moving on.

## Running / testing
- Official validation: push to GitHub, wait for GitHub Pages to publish, then Jacob tests the
  live build at https://trimmja.github.io/defend-the-alamo/
- Do not claim a feature is validated until Jacob confirms it on the live Pages URL.
- Optional convenience only: `start.command` → http://localhost:8080 (never `file://`).
- **Never use Playwright or headless browser automation for testing.** Jacob does all in-browser
  testing himself. Do not attempt to screenshot or drive the browser programmatically.
