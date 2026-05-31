// Central game constants and balance values for Defend the Alamo.
// Tweak balance here; tune by playtesting (see ROADMAP open items).

export const GAME = {
  WIDTH: 540,
  HEIGHT: 960,
  BG: '#caa472', // dusty Texas ground
};

// --- Economy ---------------------------------------------------------------
export const ECON = {
  START_MONEY: 220,
  KILL_REWARD: 12,        // money per soldado killed
  CANNON_COST: 90,
  TROOP_COST: 45,
  HERO_COST: 0,           // Crockett is free to deploy once (one hero in Phase 1)
  REPAIR_COST: 35,        // per repair tap on a damaged wall segment
  REPAIR_AMOUNT: 60,      // HP restored per repair
};

// --- Fort ------------------------------------------------------------------
export const FORT = {
  WALL_HP: 240,
  CHAPEL_HP: 500,
  // Outer wall is a rectangle of segments; each side has segments with slots.
  SEGMENTS_PER_SIDE: 2,   // -> 8 segments, 8 cannon slots total
};

// --- Cannon ----------------------------------------------------------------
export const CANNON = {
  RANGE: 190,
  DAMAGE: 34,
  FIRE_MS: 1100,          // ms between shots
  PROJECTILE_SPEED: 420,
};

// --- Troop -----------------------------------------------------------------
export const TROOP = {
  HP: 90,
  DAMAGE: 14,
  ATTACK_MS: 700,
  SPEED: 70,
  RANGE: 34,              // melee/close range
};

// --- Hero (Davy Crockett) --------------------------------------------------
export const HERO = {
  HP: 240,
  DAMAGE: 46,             // "Old Betsy" — high single-target
  ATTACK_MS: 650,
  SPEED: 80,
  RANGE: 230,             // long-range sharpshooter
  ABILITY_COOLDOWN_MS: 12000,
  ABILITY_DAMAGE: 40,     // "Volley": damage to all enemies in a radius
  ABILITY_RADIUS: 150,
};

// --- Enemies ---------------------------------------------------------------
// Soldado types of the 1836 Mexican Army.
export const ENEMY_TYPES = {
  infantry: { hp: 70,  speed: 38, damage: 12, attackMs: 800, reward: 12, tint: 0x9b2d2d },
  cazador:  { hp: 50,  speed: 62, damage: 9,  attackMs: 650, reward: 14, tint: 0x6b8e23 }, // fast skirmisher
  grenadier:{ hp: 150, speed: 28, damage: 22, attackMs: 1000, reward: 22, tint: 0x4a3f6b }, // tanky
};

// --- Waves (Phase 1: one level, ~7 escalating waves) ----------------------
// Each wave is a list of spawn groups: { type, count, gapMs }.
// gapMs = delay between individual spawns within the group.
export const WAVES = [
  [{ type: 'infantry', count: 5,  gapMs: 700 }],
  [{ type: 'infantry', count: 8,  gapMs: 600 }],
  [{ type: 'infantry', count: 6,  gapMs: 500 }, { type: 'cazador', count: 4, gapMs: 500 }],
  [{ type: 'cazador',  count: 8,  gapMs: 400 }],
  [{ type: 'infantry', count: 8,  gapMs: 450 }, { type: 'grenadier', count: 2, gapMs: 1500 }],
  [{ type: 'cazador',  count: 10, gapMs: 350 }, { type: 'grenadier', count: 3, gapMs: 1200 }],
  // Final assault columns (March 6)
  [{ type: 'infantry', count: 12, gapMs: 300 }, { type: 'cazador', count: 8, gapMs: 300 }, { type: 'grenadier', count: 4, gapMs: 900 }],
];

export const WAVE_PREP_MS = 6000; // calm between waves (repair/regroup)
