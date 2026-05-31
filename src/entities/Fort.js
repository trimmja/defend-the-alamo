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
    this.segmentMap = {};
    this.drawGroundPlan();

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

  drawGroundPlan() {
    const plaza = FORT.DECOR.PLAZA;
    this.scene.add.rectangle(plaza.x, plaza.y, plaza.w, plaza.h, 0xd8b980, 0.32)
      .setStrokeStyle(2, 0x9d8055, 0.35).setDepth(1);

    const g = this.scene.add.graphics().setDepth(3);
    g.lineStyle(5, 0x6b6052, 0.65);
    for (const l of FORT.DECOR.LUNETTES) {
      g.beginPath();
      g.arc(l.x, l.y, l.r, l.start, l.end, false);
      g.strokePath();
    }

    // Long Barracks mass and Crockett palisade read as landmarks without
    // becoming separate damage targets.
    this.scene.add.rectangle(424, 406, 34, 374, 0xb89a6c, 0.45)
      .setStrokeStyle(2, 0x806a4c, 0.45).setDepth(2);
    this.scene.add.rectangle(360, 650, 12, 156, 0x6b4a2b, 0.65)
      .setStrokeStyle(1, 0x3a2615, 0.5).setDepth(2);
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
