// Fort — the Alamo. Outer wall (segmented, each with HP + a cannon slot) around
// a courtyard, with the chapel at the centre (the heart you protect). Walls can
// be breached and repaired.
import { FORT } from '../config.js';
import { HealthBar } from '../utils.js';

// Fort footprint within the portrait playfield.
const L = 120, R = 420, T = 280, B = 640, TH = 18;
export const FORT_CENTER = { x: (L + R) / 2, y: (T + B) / 2 };

class WallSegment {
  constructor(scene, def) {
    this.scene = scene;
    this.maxHp = FORT.WALL_HP;
    this.hp = FORT.WALL_HP;
    this.alive = true;
    this.fx = def.fx;            // outer face point (enemies stop here)
    this.fy = def.fy;
    this.cx = def.cx;
    this.cy = def.cy;
    this.outward = def.outward;  // barrel-facing angle for a cannon here
    this.cannon = null;

    this.sprite = scene.add.tileSprite(def.cx, def.cy, def.w, def.h, 'stone').setDepth(5);
    this.sprite.setInteractive();
    this.slot = scene.add.image(def.slotX, def.slotY, 'slot').setDepth(6);
    this.slot.setInteractive({ useHandCursor: true });
    this.slotX = def.slotX;
    this.slotY = def.slotY;

    this.bar = new HealthBar(scene, Math.min(40, Math.max(def.w, def.h) - 6), 4,
      -(def.h / 2) - 6, 8);
    this.drawBar();
  }

  takeDamage(d) {
    if (!this.alive) return;
    this.hp -= d;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.sprite.setAlpha(0.18);   // rubble / gap
      this.slot.setAlpha(0.5);
    } else {
      // darken as it crumbles
      const f = this.hp / this.maxHp;
      this.sprite.setTint(Phaser.Display.Color.GetColor(255 * (0.55 + 0.45 * f), 255 * (0.5 + 0.5 * f), 255 * (0.45 + 0.55 * f)));
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
    this.bar = new HealthBar(scene, 90, 7, -64, 8);
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
    const n = FORT.SEGMENTS_PER_SIDE;

    const topLen = (R - L) / n;
    const sideLen = (B - T) / n;
    for (let i = 0; i < n; i++) {
      const cxT = L + topLen * (i + 0.5);
      const cyL = T + sideLen * (i + 0.5);
      // top
      this.segments.push(new WallSegment(scene, {
        cx: cxT, cy: T, w: topLen - 4, h: TH, fx: cxT, fy: T - 14,
        slotX: cxT, slotY: T + 24, outward: -Math.PI / 2,
      }));
      // bottom
      this.segments.push(new WallSegment(scene, {
        cx: cxT, cy: B, w: topLen - 4, h: TH, fx: cxT, fy: B + 14,
        slotX: cxT, slotY: B - 24, outward: Math.PI / 2,
      }));
      // left
      this.segments.push(new WallSegment(scene, {
        cx: L, cy: cyL, w: TH, h: sideLen - 4, fx: L - 14, fy: cyL,
        slotX: L + 24, slotY: cyL, outward: Math.PI,
      }));
      // right
      this.segments.push(new WallSegment(scene, {
        cx: R, cy: cyL, w: TH, h: sideLen - 4, fx: R + 14, fy: cyL,
        slotX: R - 24, slotY: cyL, outward: 0,
      }));
    }

    this.chapelObj = new Chapel(scene, FORT_CENTER.x, FORT_CENTER.y);
    this.chapel = { x: FORT_CENTER.x, y: FORT_CENTER.y };
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

  // For the repair tool: find a damaged segment near a tap.
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
