# Defend the Alamo — Assets

## Layout reference
`docs/historical-alamo.jpg` ("The Alamo in 1836") is the canonical reference for the fort footprint:
the long plaza, the **chapel keep in the SE corner**, the Long Barracks inner line, the south
gate/lunette, and the named gun emplacements (18-pdr SW, 8-pdr north platform, 12-pdrs at the chapel).
The Phase 2 remodel traces this layout — see `ROADMAP.md`.

## Map layers
The playable map uses a layered scene-mode bundle, not a single baked wall image:

| File | Size | Use |
|---|---:|---|
| `assets/maps/alamo-ground.png` | 540×960 | Runtime foundation-only terrain layer |
| `assets/maps/alamo-ground-source.png` | 941×1672 | Original generated source for recrops |
| `assets/tilesets/alamo-walls.png` | 1024×1024 | 4×4 transparent wall grammar spritesheet, 256px frames |
| `assets/tilesets/alamo-walls-source.png` | 1254×1254 | Original generated magenta wall sheet |
| `assets/tilesets/alamo-structures.png` | 1024×1024 | 4×4 transparent structure spritesheet, 256px frames |
| `assets/tilesets/alamo-structures-source.png` | 1254×1254 | Original generated magenta sheet |
| `assets/maps/alamo-layered-preview.png` | 540×960 | QA preview composed from runtime layers |
| `data/alamo-1836-map.json` | — | Layer/asset manifest; gameplay coordinates remain in `src/config.js` |
| `tools/map-builder.html` | — | Browser map-placement helper for tuning structure coordinates |

Generated prompt metadata:
- `assets/maps/alamo-ground.prompt.txt`
- `assets/tilesets/alamo-walls.prompt.txt`
- `assets/tilesets/alamo-structures.prompt.txt`

The foundation layer must stay free of runtime-controlled walls/buildings. Wall HP, breach state,
repair, cannon slots, chapel HP, and assault lanes are separate runtime objects/data.

## Code-generated textures
Small runtime sprites are still generated procedurally in **`src/scenes/BootScene.js`**
(`buildTextures()`) until they are replaced with real sprite sheets. These are intentionally simple
but read as real objects (soldiers, cannons, projectiles, UI markers) — not bare rectangles.

| Texture key | Size (px) | What it is | Notes |
|---|---|---|---|
| `ground` | 64×64 | Dusty Texas ground | Fallback/menu background |
| `stone`  | 32×32 | Stone wall | Legacy fallback only |
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

## Generated hero sprites

Davy Crockett now has project-native generated animation sheets under
`assets/sprites/davy-crockett/`. These are not wired into runtime yet; the current game still uses
the code-generated `hero` texture until the swap is intentional and tested.

| File | Size | Frame size | Use |
|---|---:|---:|---|
| `assets/sprites/davy-crockett/davy-crockett-idle.png` | 256×256 | 128×128 | 2×2 idle loop |
| `assets/sprites/davy-crockett/davy-crockett-walk.png` | 256×256 | 128×128 | 2×2 reposition/walk loop |
| `assets/sprites/davy-crockett/davy-crockett-shoot.png` | 256×256 | 128×128 | 2×2 body-only rifle shot loop |
| `assets/sprites/davy-crockett/davy-crockett-*-master.png` | 768×768 | 384×384 | Master transparent sheets |
| `assets/sprites/davy-crockett/davy-crockett-*.gif` | — | — | Animation previews for visual QC |
| `assets/sprites/davy-crockett/manifest.json` | — | — | Frame metadata and QC notes |

QC notes: processed with shared scale, feet anchor, largest body component, and no edge-touch frames.
The rifle-shot sheet intentionally excludes muzzle flash, smoke, projectile, and impact FX so those
can be layered separately without shrinking the hero body in fixed animation cells.

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
