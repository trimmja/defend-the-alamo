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
| Layout | Top-down fort — army attacks from all sides |
| Cannons | Fixed wall slots — tap a slot, buy a cannon, it auto-fires in range |
| Troops | Rally-point controlled — train, then tap/drag a flag to position them |
| Win / Lose | Protect the chapel. Layered defense: outer walls → courtyard → inner line → chapel. Walls have HP, can be breached and **repaired**. Retreat and hold. Chapel HP 0 = lose; survive all waves = win. |
| Build timing | Anytime, costs money (earned from kills) |
| Orientation | Portrait |
| First hero | Davy Crockett — long-range sharpshooter + "Volley" ability |

## Phase 1 — playable vertical slice (CURRENT)
One level, end to end, live on GitHub Pages and playable on iPhone, proving the full loop + one hero.
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

## Phase 2 — Content & heroes
Full hero roster — Travis ("line in the sand" rally buff), Bowie (melee/knife), Bonham, Seguín
(Tejano) — each with a unique ability. More cannon/troop types (musketeers, riflemen; grapeshot vs.
solid shot).

## Phase 3 — Enemy variety & the 13-day siege
Cazadores (skirmishers), cavalry/lancers, sappers (fast wall-breakers), artillery, and the climactic
pre-dawn assault columns of March 6. Multiple levels = the days of the siege escalating to the final
assault.

## Phase 4 — Meta progression
Money/honor between levels to permanently upgrade walls, cannons, and heroes; unlockables.

## Phase 5 — Juice & polish
Custom/commissioned art, animations, particle effects (smoke, muzzle flash), sound design, music,
screen shake, victory/defeat cinematics. (Phase 1 ships with code-generated placeholder art — see
`ASSETS.md`.)

## Phase 6 — Mobile polish for distribution
PWA (add-to-home-screen) on top of the existing GitHub Pages host; later, optional iOS wrap.

## Open items (tune by playtesting)
- Starting money / wave counts / costs — balance in `src/config.js`.
- Real art: swap the code-generated placeholders for sprites (Kenney "Medieval RTS" CC0 fits the
  top-down fort + soldiers theme, or commissioned art).
