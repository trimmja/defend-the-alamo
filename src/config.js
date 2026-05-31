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
  TROOP_COST: 45,
  HERO_COST: 0,           // Crockett is free to deploy once (one hero in Phase 1)
  REPAIR_COST: 35,        // per repair tap on a damaged wall segment
  REPAIR_AMOUNT: 60,      // HP restored per repair
};

// --- Fort ------------------------------------------------------------------
export const FORT = {
  WALL_HP: 240,
  CHAPEL_HP: 500,
  CENTER: { x: 268, y: 474 },
  RALLY: { x: 268, y: 560 },
  HERO_DEPLOY: { x: 279, y: 690 },
  BOUNDS: { left: 82, right: 454, top: 186, bottom: 766 },
  CHAPEL: { x: 394, y: 692, w: 118, h: 148 },
  // Named emplacements for the historical compound. tierCeil = max upgrade tier
  // (1=swivel, 2=6-pdr, 3=8-pdr, 4=12-pdr, 5=18-pdr). Used by the upgrade
  // panel (Phase 2) and cannon-tier system.
  EMPLACEMENTS: {
    'north-wall-w':   { label: 'North Wall (West)',        tierCeil: 2 },
    'north-battery':  { label: 'North Battery (8-pdr)',    tierCeil: 3 },
    'north-wall-e':   { label: 'North Wall (East)',        tierCeil: 2 },
    'west-upper':     { label: 'West Wall (Upper)',        tierCeil: 1 },
    'west-lower':     { label: 'West Wall (Lower)',        tierCeil: 1 },
    'sw-18pdr':       { label: 'SW Emplacement (18-pdr)',  tierCeil: 5 },
    'south-gate':     { label: 'South Gate / Lunette',     tierCeil: 2 },
    'south-palisade': { label: "Crockett's Palisade",      tierCeil: 1 },
    'long-barracks':  { label: 'Long Barracks',            tierCeil: 2 },
  },
  SEGMENTS: [
    { id:'north-wall-w',   cx:143, cy:194, w:108, h:18, fx:143, fy:176, slotX:143, slotY:222, outward:-Math.PI/2 },
    { id:'north-battery',  cx:260, cy:194, w:126, h:18, fx:260, fy:176, slotX:260, slotY:222, outward:-Math.PI/2 },
    { id:'north-wall-e',   cx:384, cy:206, w:104, h:18, fx:384, fy:188, slotX:384, slotY:234, outward:-Math.PI/2 },
    { id:'west-upper',     cx:88,  cy:324, w:18,  h:258, fx:70,  fy:324, slotX:116, slotY:324, outward:Math.PI },
    { id:'west-lower',     cx:96,  cy:582, w:18,  h:278, fx:78,  fy:582, slotX:124, slotY:582, outward:Math.PI },
    { id:'sw-18pdr',       cx:166, cy:744, w:152, h:18, fx:166, fy:766, slotX:166, slotY:716, outward:Math.PI/2 },
    { id:'south-gate',     cx:292, cy:756, w:88,  h:18, fx:292, fy:778, slotX:292, slotY:728, outward:Math.PI/2 },
    { id:'south-palisade', cx:357, cy:648, w:18,  h:142, fx:377, fy:648, slotX:327, slotY:648, outward:0 },
    { id:'long-barracks',  cx:446, cy:406, w:18,  h:402, fx:464, fy:406, slotX:416, slotY:406, outward:0 },
  ],
  DECOR: {
    PLAZA: { x: 264, y: 480, w: 246, h: 368 },
    LUNETTES: [
      { x: 110, y: 194, r: 42, start: Math.PI, end: Math.PI * 1.55 },
      { x: 246, y: 748, r: 52, start: 0, end: Math.PI },
      { x: 404, y: 744, r: 48, start: -Math.PI / 2, end: Math.PI * 0.08 },
    ],
  },
};

// --- Cannon ----------------------------------------------------------------
export const CANNON = {
  TIERS: {
    1: { name: 'Swivel gun', cost: 75, upgradeCost: 70, range: 170, damage: 24, fireMs: 900,  splash: 16 },
    2: { name: '6-pounder',  cost: 0,  upgradeCost: 95, range: 195, damage: 34, fireMs: 1050, splash: 22 },
    3: { name: '8-pounder',  cost: 0,  upgradeCost: 125, range: 220, damage: 44, fireMs: 1200, splash: 28 },
    4: { name: '12-pounder', cost: 0,  upgradeCost: 165, range: 245, damage: 58, fireMs: 1400, splash: 34 },
    5: { name: '18-pounder', cost: 0,  upgradeCost: 220, range: 285, damage: 76, fireMs: 1700, splash: 44 },
  },
  PROJECTILE_SPEED: 420,
};

// --- Troop -----------------------------------------------------------------
export const TROOP = {
  HP: 90,
  DAMAGE: 14,
  ATTACK_MS: 700,
  SPEED: 70,
  RANGE: 105,             // short musket range for holding fallback lines
  PROJECTILE_SPEED: 430,
  FORMATION_SPREAD: 38,
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
  [{ type: 'infantry', count: 5,  gapMs: 700, lane: 'north' }],
  [{ type: 'infantry', count: 8,  gapMs: 600, lane: 'north' }],
  [{ type: 'infantry', count: 6,  gapMs: 500, lane: 'north' }, { type: 'cazador', count: 4, gapMs: 500, lane: 'west' }],
  [{ type: 'cazador',  count: 5,  gapMs: 450, lane: 'west' }, { type: 'infantry', count: 4, gapMs: 650, lane: 'south' }],
  [{ type: 'infantry', count: 8,  gapMs: 450, lane: 'north' }, { type: 'grenadier', count: 2, gapMs: 1500, lane: 'south' }],
  [{ type: 'cazador',  count: 8,  gapMs: 350, lane: 'west' }, { type: 'grenadier', count: 3, gapMs: 1200, lane: 'north' }],
  // Final assault columns (March 6)
  [{ type: 'infantry', count: 12, gapMs: 300, lane: 'north' }, { type: 'cazador', count: 8, gapMs: 300, lane: 'west' }, { type: 'grenadier', count: 4, gapMs: 900, lane: 'south' }],
];

export const WAVE_PREP_MS = 6000; // calm between waves (repair/regroup)

export const ASSAULT_LANES = {
  north: {
    label: 'North assault column',
    spawn: { x: 268, y: 104, jitterX: 160, jitterY: 18 },
    segment: 'north-battery',
    breach: { x: 260, y: 176 },
    path: [{ x: 260, y: 250 }, { x: 270, y: 410 }, { x: 342, y: 570 }, { x: 394, y: 692 }],
  },
  west: {
    label: 'Acequia wall probe',
    spawn: { x: 24, y: 520, jitterX: 16, jitterY: 190 },
    segment: 'west-lower',
    breach: { x: 78, y: 582 },
    path: [{ x: 138, y: 582 }, { x: 260, y: 550 }, { x: 350, y: 620 }, { x: 394, y: 692 }],
  },
  south: {
    label: 'Sally port assault',
    spawn: { x: 310, y: 828, jitterX: 140, jitterY: 18 },
    segment: 'south-gate',
    breach: { x: 292, y: 778 },
    path: [{ x: 292, y: 720 }, { x: 342, y: 660 }, { x: 394, y: 692 }],
  },
};
