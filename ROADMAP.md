# Defend the Alamo — Roadmap

A mobile-first, browser-based **base-defense** game set during the 13-day Siege of the Alamo
(Feb–Mar 1836). Fortify the Alamo, build wall-mounted cannons, train and command troops, and hold
the chapel against ever-larger assault waves of the Mexican Army under General Santa Anna. Playable
heroes are based on the real defenders.

**Tone:** historical and respectful — the enemy is the period Mexican Army (soldados: infantry,
cazadores, grenadiers, and the final assault columns), not a caricature. Both sides are treated
with respect.

## Locked-in design
| Decision | Choice |
|---|---|
| Engine | Phaser 3 (CDN, no build step) |
| Layout | **Faithful irregular Alamo compound** (see `docs/historical-alamo.jpg`), north-up portrait — army attacks from all sides |
| Cannons | Fixed wall slots — tap a slot, buy a cannon, it auto-fires in range. **Each slot upgrades through historical gun tiers up to a per-emplacement ceiling** (only the SW slot reaches the 18-pounder) |
| Troops | Rally-point controlled — train, then tap/drag a flag to position them |
| Win / Lose | Protect the chapel. **Layered, directional retreat:** outer walls → plaza → Long Barracks inner line → **chapel (SE corner keep)**. Walls have HP, can be breached and **repaired**. Chapel HP 0 = lose; survive all waves = win. |
| Build timing | Anytime, costs money (earned from kills) |
| Orientation | Portrait |
| First hero | Davy Crockett — long-range sharpshooter + "Volley" ability |

## Historical fort layout (from `docs/historical-alamo.jpg`)
The Alamo was not a symmetric fort with a central tower — it was a long rectangular **plaza**
(~462 × 162 ft, roughly 3:1) ringed by walls and buildings, with the **chapel in the southeast
corner**. That corner was the real last redoubt: defenders held the perimeter, the assault broke
through the **north wall**, everyone fell back across the plaza into the **Long Barracks**, and the
final holdouts died in the **chapel** (where the survivors were found). So the chapel sitting on one
side is not a problem to solve — it *is* the historical last-stand, and it makes the defense
satisfyingly **directional**: the north wall is the far frontline, the SE chapel is the deep point
you protect.

Oriented **north-up** so the long plaza axis runs vertically on a portrait phone. The chapel's own
thick outer walls double as the east perimeter.

```
            N wall (frontline) + 8-pdr battery
        +------------------------------+
        |                              |
   W    |            PLAZA             |   Long
  wall  |        (open courtyard)      | Barracks
 (acequia)            ...              |  (inner
        |                              |   line)
  18pdr-+                          +---+
        +===== Crockett palisade ===|CHAPEL|  <- SE keep
            south gate / sally port  +------+
                + lunette
```

| Real feature | In-game role |
|---|---|
| Plaza (~462×162 ft) | the open courtyard the fight flows across |
| North wall + 8-pdr platform | frontline battery; where the assault historically breaks through |
| West wall (along the acequia) | perimeter wall segments + lunettes |
| South gate / sally port + lunette | main entry; outer demilune hardpoint; the 18-pdr sits nearby |
| **Southwest emplacement** | the **18-pounder** — the only slot that upgrades to the top tier |
| Long Barracks / Convento (east) | the **inner retreat line** before the chapel |
| Crockett's palisade (gate → chapel) | Crockett's default deploy spot |
| **Chapel (SE corner)** | the **final keep** — highest HP, 12-pdr rear battery, the lose condition |

## Cannon upgrade tiers
Cannons aren't one-size: each slot starts light and upgrades up a ladder of real Alamo guns, capped
by what that emplacement historically mounted. All numbers tune in `src/config.js`.

| Tier | Gun | Feel |
|---|---|---|
| 1 | Swivel / wall gun | light, fast, cheap — the base build, available on every slot |
| 2 | 6-pounder | solid shot, modest range |
| 3 | 8-pounder | stronger, longer range |
| 4 | 12-pounder | heavy, splash damage |
| 5 | **18-pounder** | siege gun: long range + big splash — **SW slot only** |

- Each upgrade costs money mid-level and raises damage / range / fire-rate (and should swap the sprite).
- **Per-slot ceiling = the emplacement's real gun:** SW → T5 (18-pdr), chapel → T4 (12-pdr), north
  battery → T3 (8-pdr), sally-port → T2, minor wall slots → T1. This makes the SW corner the gun you
  invest in and gives the map strategic asymmetry.
- **UI (history stays discoverable, never clutter):** tapping a slot opens a build/upgrade panel that
  names the emplacement, gives a short historical blurb, and shows current tier + next-tier stats,
  cost, and the slot's ceiling. A HUD **Fort Map / codex** button opens an opt-in overlay of the
  compound with the labeled features for players who want the history.

## Phase 1 — playable vertical slice  (BUILT & DEPLOYED — in playtesting)
One level, end to end, live on GitHub Pages and playable on iPhone, proving the full loop + one hero.
Status: shipped to https://trimmja.github.io/defend-the-alamo/ with a home-screen app icon; now
being playtested and balanced (`src/config.js`).
**Note:** Phase 1 uses a simplified *centered-chapel* placeholder layout and a single cannon type —
both are **superseded by the Phase 2 historical remodel** below. Real art still pending (see Phase 6).
- Scaffold + docs + GitHub Pages deploy (no build step).
- Fort: outer wall segments (HP + cannon slots), courtyard, inner line, central chapel (HP), repair.
- Enemies: soldados spawn at edges, path to nearest wall, attack/breach it, then push to the chapel.
- Cannons on wall slots: tap-to-buy, auto-fire nearest in range.
- Troops: trained for money, positioned with a draggable rally flag, auto-engage — enables retreat.
- Hero (Crockett): long range, high single-target damage, active ability on cooldown.
- Economy: seed money + per-kill rewards; spend anytime on cannons / troops / repairs.
- Waves: ~7 escalating waves with a calm prep gap between them; win on survival, lose if chapel falls.
- HUD: top bar (money / wave / chapel + wall health / pause), bottom thumb-friendly build bar, hero
  ability button. Game-over screen with retry.

## Phase 2 — Historical fort remodel & cannon upgrades  (IN PROGRESS)
Rebuild the fort to the real compound and add depth to the cannons:
- ✅ **Fort layout reworked** — symmetric rectangle replaced with the historical footprint: north
  wall frontline (3 segments, T3 ceiling), west wall + SW 18-pdr bastion (T5, unique), south gate /
  lunette + Crockett's palisade, Long Barracks east wall, **chapel keep in the SE corner**.
  9 named emplacements with per-slot `tierCeil` values stored in `src/config.js` (`FORT.EMPLACEMENTS`).
- ✅ **FORT_CENTER updated** — rally flag, hero deploy, and enemy spawn circle all use the new
  compound center (268, 474).
- ✅ **Historical assault lanes** — waves now spawn from named north, west, and south approaches,
  breach assigned wall lines, then push across the plaza toward the SE chapel keep.
- ✅ Cannon upgrade-tier system (ladder: swivel → 6-pdr → 8-pdr → 12-pdr → 18-pdr).
- ⬜ Tap-to-reveal build/upgrade panel (emplacement name + history blurb + tier stats + cost).
- ⬜ Opt-in Fort Map / codex overlay.

## Phase 3 — Content & heroes
Full hero roster — Travis ("line in the sand" rally buff), Bowie (melee/knife), Bonham, Seguín
(Tejano) — each with a unique ability. More cannon/troop types (musketeers, riflemen; grapeshot vs.
solid shot).

## Phase 4 — Enemy variety & the 13-day siege
Cazadores (skirmishers), cavalry/lancers, sappers (fast wall-breakers), artillery, and the climactic
pre-dawn assault columns of March 6. Multiple levels = the days of the siege escalating to the final
assault.

## Phase 5 — Meta progression
Money/honor between levels to permanently upgrade walls, cannons, and heroes; unlockables.

## Phase 6 — Juice & polish
Custom/commissioned art (the remodeled fort + each gun tier), animations, particle effects (smoke,
muzzle flash), sound design, music, screen shake, victory/defeat cinematics. (Phase 1 ships with
code-generated placeholder art — see `ASSETS.md`.)

## Phase 7 — Mobile polish for distribution
Full PWA on top of the existing GitHub Pages host; later, optional iOS wrap.
*(Already done in Phase 1: GitHub Pages hosting + home-screen icon & `manifest.webmanifest`
[standalone, portrait]. Remaining: offline support via a service worker, install polish.)*

## Open items (tune by playtesting)
- Starting money / wave counts / costs — balance in `src/config.js`.
- Gun-tier stats and per-slot upgrade ceilings — also in `src/config.js`.
- Real art: swap the code-generated placeholders for sprites (Kenney "Medieval RTS" CC0 fits the
  top-down fort + soldiers theme, or commissioned art).
