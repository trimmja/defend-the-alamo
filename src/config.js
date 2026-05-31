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
  CENTER: { x: 270, y: 480 },
  RALLY: { x: 270, y: 545 },
  HERO_DEPLOY: { x: 330, y: 670 },
  BOUNDS: { left: 76, right: 470, top: 156, bottom: 812 },
  CHAPEL: { x: 432, y: 734, w: 124, h: 142 },
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
    { id:'north-wall-w',   cx:150, cy:168, w:108, h:30, fx:150, fy:146, slotX:150, slotY:198, outward:-Math.PI/2,
      visual: { key: 'alamo-walls', frame: 0, damagedFrame: 12, breachFrame: 14, x:150, y:168, w:168, h:62 } },
    { id:'north-battery',  cx:270, cy:168, w:124, h:30, fx:270, fy:146, slotX:270, slotY:198, outward:-Math.PI/2,
      visual: { key: 'alamo-walls', frame: 0, damagedFrame: 12, breachFrame: 14, x:270, y:168, w:184, h:62 } },
    { id:'north-wall-e',   cx:392, cy:168, w:102, h:30, fx:392, fy:146, slotX:392, slotY:198, outward:-Math.PI/2,
      visual: { key: 'alamo-walls', frame: 0, damagedFrame: 12, breachFrame: 14, x:392, y:168, w:156, h:62 } },
    { id:'west-upper',     cx:82,  cy:310, w:30,  h:270, fx:60,  fy:310, slotX:112, slotY:310, outward:Math.PI,
      visual: { key: 'alamo-walls', frame: 1, damagedFrame: 13, breachFrame: 15, x:82, y:310, w:62, h:330 } },
    { id:'west-lower',     cx:86,  cy:544, w:30,  h:238, fx:64,  fy:544, slotX:116, slotY:544, outward:Math.PI,
      visual: { key: 'alamo-walls', frame: 1, damagedFrame: 13, breachFrame: 15, x:86, y:544, w:62, h:300 } },
    { id:'sw-18pdr',       cx:136, cy:694, w:134, h:84, fx:136, fy:720, slotX:164, slotY:662, outward:Math.PI*0.75,
      visual: { key: 'alamo-structures', frame: 10, damagedFrame: 10, breachFrame: 14, x:136, y:694, w:160, h:142 } },
    { id:'south-gate',     cx:260, cy:750, w:116, h:48, fx:260, fy:778, slotX:260, slotY:718, outward:Math.PI/2,
      visual: { key: 'alamo-walls', frame: 10, damagedFrame: 12, breachFrame: 14, x:260, y:750, w:176, h:78 } },
    { id:'south-palisade', cx:333, cy:654, w:28,  h:136, fx:355, fy:654, slotX:303, slotY:654, outward:0,
      visual: { key: 'alamo-structures', frame: 6, damagedFrame: 6, breachFrame: 14, x:333, y:654, w:62, h:160 } },
    { id:'long-barracks',  cx:404, cy:414, w:82,  h:512, fx:428, fy:414, slotX:374, slotY:414, outward:0,
      visual: { key: 'alamo-structures', frame: 9, damagedFrame: 9, breachFrame: 14, x:404, y:414, w:112, h:420 } },
  ],
  STRUCTURES: [
    { id: 'nw-corner', key: 'alamo-walls', frame: 2, x: 92, y: 168, w: 84, h: 84 },
    { id: 'ne-corner', key: 'alamo-walls', frame: 3, x: 458, y: 168, w: 84, h: 84 },
    { id: 'west-sw-corner', key: 'alamo-walls', frame: 4, x: 92, y: 676, w: 84, h: 84 },
    { id: 'south-lunette', key: 'alamo-structures', frame: 7, x: 260, y: 825, w: 130, h: 84 },
    { id: 'chapel-keep', key: 'alamo-structures', frame: 8, x: 432, y: 734, w: 122, h: 136 },
    { id: 'chapel-pad', key: 'alamo-structures', frame: 11, x: 432, y: 646, w: 80, h: 72 },
    { id: 'east-support', key: 'alamo-structures', frame: 12, x: 454, y: 462, w: 38, h: 92 },
  ],
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
    breach: { x: 270, y: 146 },
    path: [{ x: 270, y: 220 }, { x: 270, y: 430 }, { x: 350, y: 600 }, { x: 432, y: 734 }],
  },
  west: {
    label: 'Acequia wall probe',
    spawn: { x: 24, y: 520, jitterX: 16, jitterY: 190 },
    segment: 'west-lower',
    breach: { x: 64, y: 544 },
    path: [{ x: 126, y: 544 }, { x: 260, y: 548 }, { x: 350, y: 628 }, { x: 432, y: 734 }],
  },
  south: {
    label: 'Sally port assault',
    spawn: { x: 270, y: 846, jitterX: 130, jitterY: 18 },
    segment: 'south-gate',
    breach: { x: 260, y: 778 },
    path: [{ x: 260, y: 720 }, { x: 340, y: 656 }, { x: 432, y: 734 }],
  },
};
