// Fort — the historical Alamo compound (north-up portrait).
// Long rectangular plaza; chapel keep in the SE corner; Long Barracks on the
// east as the inner line. Outer walls are named emplacements with per-slot
// cannon tier ceilings (see config.js FORT.EMPLACEMENTS).
import { FORT } from '../config.js';
import { HealthBar } from '../utils.js';

export const FORT_CENTER = FORT.CENTER;

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
    this.visual = null;
    this.visualFrame = def.visual ? def.visual.frame : null;
    this.damagedFrame = def.visual ? def.visual.damagedFrame : null;
    this.breachFrame = def.visual ? def.visual.breachFrame : null;

    // Metadata for the upgrade panel (Phase 2).
    const meta = FORT.EMPLACEMENTS[def.id] || {};
    this.id = def.id;
    this.tierCeil = meta.tierCeil || 1;
    this.label = meta.label || def.id;

    if (def.visual) {
      this.visual = scene.add.image(def.visual.x, def.visual.y, def.visual.key, def.visual.frame)
        .setDepth(4);
      this.visual.displayWidth = def.visual.w;
      this.visual.displayHeight = def.visual.h;
    }

    this.sprite = scene.add.rectangle(def.cx, def.cy, def.w, def.h, 0xffffff, 0.001).setDepth(5);
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
      this.sprite.setAlpha(0.001);
      this.slot.setAlpha(0.5);
      if (this.visual) {
        this.visual.setFrame(this.breachFrame).setAlpha(1);
      }
    } else {
      const f = this.hp / this.maxHp;
      if (this.visual && f <= 0.45) this.visual.setFrame(this.damagedFrame);
    }
    this.drawBar();
  }

  repair(amount) {
    if (this.hp >= this.maxHp) return false;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    if (this.hp > 0 && !this.alive) {
      this.alive = true;
      this.sprite.setAlpha(0.001);
      this.slot.setAlpha(1);
    }
    const f = this.hp / this.maxHp;
    if (this.visual) this.visual.setFrame(f <= 0.45 ? this.damagedFrame : this.visualFrame);
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
    this.sprite = scene.add.image(x, y, 'alamo-structures', 8).setDepth(4);
    this.sprite.displayWidth = FORT.CHAPEL.w;
    this.sprite.displayHeight = FORT.CHAPEL.h;
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
    this.segmentMap = {};
    this.drawStructures();

    for (const def of FORT.SEGMENTS) {
      const seg = new WallSegment(scene, def);
      this.segments.push(seg);
      this.segmentMap[seg.id] = seg;
    }

    // Chapel keep — SE corner. Outer walls form the east/south perimeter
    // below the Long Barracks.
    const chapelX = FORT.CHAPEL.x, chapelY = FORT.CHAPEL.y;
    this.chapelObj = new Chapel(scene, chapelX, chapelY);
    this.chapel = { x: chapelX, y: chapelY };
  }

  drawStructures() {
    for (const obj of FORT.STRUCTURES) {
      const sprite = this.scene.add.image(obj.x, obj.y, obj.key, obj.frame)
        .setDepth(3);
      sprite.displayWidth = obj.w;
      sprite.displayHeight = obj.h;
      if (obj.rotation) sprite.rotation = obj.rotation;
    }
  }

  isInside(x, y) {
    const b = FORT.BOUNDS;
    return x > b.left && x < b.right && y > b.top && y < b.bottom;
  }

  segmentById(id) {
    return this.segmentMap[id] || null;
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
