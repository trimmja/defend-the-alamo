// Fort — the historical Alamo compound (north-up portrait).
// Long rectangular plaza; chapel keep in the SE corner; Long Barracks on the
// east as the inner line. Outer walls are named emplacements with per-slot
// cannon tier ceilings (see config.js FORT.EMPLACEMENTS).
import { FORT } from '../config.js';
import { HealthBar } from '../utils.js';

// Fort footprint within the portrait playfield (north-up).
//   N wall (frontline) runs along y=T.
//   Chapel keep sits in the SE corner; its outer walls form the east/south
//   perimeter below the Long Barracks.
const L = 90, R = 446, T = 192, B = 756, TH = 18;
export const FORT_CENTER = { x: Math.round((L + R) / 2), y: Math.round((T + B) / 2) };

class WallSegment {
  constructor(scene, def) {
    this.scene = scene;
    this.maxHp = FORT.WALL_HP;
    this.hp = FORT.WALL_HP;
    this.alive = true;
    this.fx = def.fx;
    this.fy = def.fy;
    this.cx = def.cx;
    this.cy = def.cy;
    this.outward = def.outward;
    this.cannon = null;

    // Metadata for the upgrade panel (Phase 2).
    const meta = FORT.EMPLACEMENTS[def.id] || {};
    this.id = def.id;
    this.tierCeil = meta.tierCeil || 1;
    this.label = meta.label || def.id;

    this.sprite = scene.add.tileSprite(def.cx, def.cy, def.w, def.h, 'stone').setDepth(5);
    this.sprite.setInteractive();
    this.slot = scene.add.image(def.slotX, def.slotY, 'slot').setDepth(6);
    this.slot.setInteractive({ useHandCursor: true });
    this.slotX = def.slotX;
    this.slotY = def.slotY;

    // Cap the yOffset so tall vertical segments don't push the bar off-screen.
    const barW = Math.min(40, Math.max(def.w, def.h) - 6);
    const yOff = -Math.min(def.h / 2, 15) - 6;
    this.bar = new HealthBar(scene, barW, 4, yOff, 8);
    this.drawBar();
  }

  takeDamage(d) {
    if (!this.alive) return;
    this.hp -= d;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.sprite.setAlpha(0.18);
      this.slot.setAlpha(0.5);
    } else {
      const f = this.hp / this.maxHp;
      this.sprite.setTint(Phaser.Display.Color.GetColor(
        255 * (0.55 + 0.45 * f), 255 * (0.5 + 0.5 * f), 255 * (0.45 + 0.55 * f)));
    }
    this.drawBar();
  }

  repair(amount) {
    if (this.hp >= this.maxHp) return false;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    if (this.hp > 0 && !this.alive) {
      this.alive = true;
      this.sprite.setAlpha(1);
      this.slot.setAlpha(1);
    }
    if (this.hp >= this.maxHp) this.sprite.clearTint();
    this.drawBar();
    return true;
  }

  get damaged() { return this.hp < this.maxHp; }

  drawBar() {
    this.bar.redraw(this.cx, this.cy, this.hp / this.maxHp, true);
  }
}

class Chapel {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.maxHp = FORT.CHAPEL_HP;
    this.hp = FORT.CHAPEL_HP;
    this.alive = true;
    this.sprite = scene.add.image(x, y, 'chapel').setDepth(4).setScale(0.85);
    this.bar = new HealthBar(scene, 90, 7, -80, 8);
    this.drawBar();
  }

  takeDamage(d) {
    if (!this.alive) return;
    this.hp = Math.max(0, this.hp - d);
    if (this.hp <= 0) this.alive = false;
    this.drawBar();
  }

  drawBar() {
    this.bar.redraw(this.x, this.y, this.hp / this.maxHp, false);
  }
}

export default class Fort {
  constructor(scene) {
    this.scene = scene;
    this.segments = [];

    // Each entry maps to a named emplacement in FORT.EMPLACEMENTS.
    // fx/fy = outer face point (enemies stop here).
    // slotX/slotY = cannon-slot ring position (inside the fort).
    // outward = barrel-facing angle for a cannon placed here.
    const defs = [
      // --- North wall (frontline, 8-pdr battery) -------------------------
      { id:'north-wall-w',   cx:149, cy:T,   w:118, h:TH,  fx:149, fy:T-14, slotX:149, slotY:T+24,  outward:-Math.PI/2 },
      { id:'north-battery',  cx:268, cy:T,   w:120, h:TH,  fx:268, fy:T-14, slotX:268, slotY:T+24,  outward:-Math.PI/2 },
      { id:'north-wall-e',   cx:387, cy:T,   w:118, h:TH,  fx:387, fy:T-14, slotX:387, slotY:T+24,  outward:-Math.PI/2 },
      // --- West wall (acequia side) --------------------------------------
      { id:'west-upper',     cx:L,   cy:313, w:TH,  h:242, fx:L-14, fy:313, slotX:L+24, slotY:313,  outward:Math.PI },
      { id:'west-lower',     cx:L,   cy:567, w:TH,  h:266, fx:L-14, fy:567, slotX:L+24, slotY:567,  outward:Math.PI },
      // --- SW emplacement (18-pdr, highest tier, unique to this slot) ----
      { id:'sw-18pdr',       cx:L,   cy:728, w:TH,  h:56,  fx:L-14, fy:B,   slotX:L+24, slotY:728,  outward:Math.PI*5/6 },
      // --- South wall (sally port/gate + Crockett's palisade) ------------
      { id:'south-gate',     cx:153, cy:B,   w:126, h:TH,  fx:153, fy:B+14, slotX:153, slotY:B-24,  outward:Math.PI/2 },
      { id:'south-palisade', cx:279, cy:B,   w:126, h:TH,  fx:279, fy:B+14, slotX:279, slotY:B-24,  outward:Math.PI/2 },
      // --- Long Barracks / east wall (inner line, above the chapel) ------
      { id:'long-barracks',  cx:R,   cy:410, w:TH,  h:436, fx:R+14, fy:410, slotX:R-24, slotY:410,  outward:0 },
    ];

    for (const def of defs) {
      this.segments.push(new WallSegment(scene, def));
    }

    // Chapel keep — SE corner. Outer walls form the east/south perimeter
    // below the Long Barracks (approximately x=342–444, y=628–756).
    const chapelX = 393, chapelY = 692;
    this.chapelObj = new Chapel(scene, chapelX, chapelY);
    this.chapel = { x: chapelX, y: chapelY };
  }

  isInside(x, y) {
    return x > L && x < R && y > T && y < B;
  }

  nearestAliveSegment(x, y) {
    let best = null;
    let bd = Infinity;
    for (const s of this.segments) {
      if (!s.alive) continue;
      const d = Phaser.Math.Distance.Between(x, y, s.fx, s.fy);
      if (d < bd) { bd = d; best = s; }
    }
    return best;
  }

  segmentAt(x, y, radius = 40) {
    let best = null;
    let bd = radius;
    for (const s of this.segments) {
      const d = Phaser.Math.Distance.Between(x, y, s.cx, s.cy);
      if (d < bd) { bd = d; best = s; }
    }
    return best;
  }
}
