# Defend the Alamo — Assets

## Phase 1: code-generated textures (no image files)
All Phase-1 art is generated procedurally in **`src/scenes/BootScene.js`** (`buildTextures()`),
so the repo has zero external image dependencies and deploys cleanly to GitHub Pages. These are
intentionally simple but read as real objects (soldiers, cannons, the chapel) — not bare rectangles.

| Texture key | Size (px) | What it is | Notes |
|---|---|---|---|
| `ground` | 64×64 | Dusty Texas ground | Tiled as the background |
| `stone`  | 32×32 | Stone wall | Stretched/tiled along each wall segment |
| `slot`   | 40×40 | Cannon emplacement ring | Marks a buildable wall slot |
| `cannon` | 34×38 | Top-down cannon (faces up) | Rotated toward target in-game |
| `unit`   | 26×26 | Generic top-down soldier | White-based; **tinted** per faction/type |
| `hero`   | 34×34 | Davy Crockett (coonskin cap, long rifle) | Full color, no tint |
| `flag`   | 26×34 | Texian rally flag | Draggable troop rally point |
| `ball`   | 12×12 | Cannonball | Cannon projectile |
| `shot`   | 8×8   | Musket shot | Troop/hero projectile |
| `spark`  | 8×8   | Particle | Hit/explosion bursts |
| `chapel` | 120×150 | The Alamo chapel facade | The heart you protect |
| `ring`   | 64×64 | Range/ability indicator | |

### Faction tints (applied to the `unit` texture)
- **Mexican Army** (enemies): infantry `0x9b2d2d` (red), cazador `0x6b8e23` (green), grenadier
  `0x4a3f6b` (purple). Defined in `config.js` → `ENEMY_TYPES`.
- **Texian defenders** (troops): buckskin/blue tint set in `Troop.js`.

## App / home-screen icon
Pixel-art icon (frontiersman + the Alamo, Texas flag, cannon, defenders) under `icons/`, wired in
`index.html` (`apple-touch-icon`, favicon) and `manifest.webmanifest` for "Add to Home Screen".
Generated from a 1254×1254 source via `sips`:

| File | Size | Use |
|---|---|---|
| `icons/apple-touch-icon.png` | 180×180 | iOS home-screen icon |
| `icons/icon-192.png` | 192×192 | PWA manifest |
| `icons/icon-512.png` | 512×512 | PWA manifest (also `maskable`) |
| `icons/favicon-32.png` | 32×32 | Browser tab favicon |

To regenerate from a new source image: `sips -z <px> <px> source.png --out icons/<file>`.

## Swapping in real sprites later (Phase 5 art polish)
Kenney **"Medieval RTS"** (CC0) fits the top-down fort + soldiers theme well (top-down troops,
walls, towers, cannons), as does commissioned art. To swap:
1. Drop files under `assets/`, record path + frame size **here first**.
2. `this.load.image(...)` / `this.load.spritesheet(...)` in `BootScene.preload` using the exact
   frame size, with the **same texture keys** above.
3. Remove the matching `this.tex(...)` call from `buildTextures()`.
4. Run the game and confirm it renders (not a green box) before moving on.
