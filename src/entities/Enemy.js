// Enemy — a Mexican Army soldado. Approaches the nearest intact wall, attacks
// it until breached, then pushes through to the chapel. Stops to fight any
// defender (troop/hero) that blocks its path.
import { ENEMY_TYPES } from '../config.js';
import { HealthBar, hitFlash } from '../utils.js';

export default class Enemy {
  constructor(scene, x, y, typeKey) {
    this.scene = scene;
    this.typeKey = typeKey;
    const t = ENEMY_TYPES[typeKey];
    this.maxHp = t.hp;
    this.hp = t.hp;
    this.speed = t.speed;
    this.damage = t.damage;
    this.attackMs = t.attackMs;
    this.reward = t.reward;

    this.sprite = scene.add.image(x, y, 'unit').setDepth(10);
    this.sprite.setTint(t.tint);
    this.sprite._baseTint = t.tint;
    this.alive = true;
    this.insideFort = false;
    this.segment = null;
    this.lastAttack = 0;
    this.bar = new HealthBar(scene, 22, 4, -15);
  }

  takeDamage(d) {
    if (!this.alive) return;
    this.hp -= d;
    hitFlash(this.scene, this.sprite);
    if (this.hp <= 0) this.die();
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.scene.spawnBurst(this.sprite.x, this.sprite.y, 0xd23b3b, 6);
    this.scene.economy.earn(this.reward);
    this.destroy();
  }

  destroy() {
    this.alive = false;
    this.bar.destroy();
    this.sprite.destroy();
  }

  moveTo(tx, ty, dt) {
    const s = this.sprite;
    const ang = Phaser.Math.Angle.Between(s.x, s.y, tx, ty);
    s.x += Math.cos(ang) * this.speed * dt;
    s.y += Math.sin(ang) * this.speed * dt;
    s.rotation = ang + Math.PI / 2;
  }

  attack(targetObj, time) {
    if (time - this.lastAttack < this.attackMs) return;
    this.lastAttack = time;
    targetObj.takeDamage(this.damage);
  }

  update(dt, time) {
    if (!this.alive) return;
    const s = this.sprite;
    const fort = this.scene.fort;

    // 1) A defender blocking us? Fight it (this is the "inner line").
    const def = this.scene.nearestDefender(s.x, s.y, 30);
    if (def) { this.attack(def, time); this.drawBar(); return; }

    // 2) Decide structural target.
    if (!this.segment || !this.segment.alive) {
      this.segment = fort.nearestAliveSegment(s.x, s.y);
    }
    if (fort.isInside(s.x, s.y)) this.insideFort = true;

    const goChapel = this.insideFort || !this.segment || !this.segment.alive;

    if (goChapel) {
      const c = fort.chapel;
      if (Phaser.Math.Distance.Between(s.x, s.y, c.x, c.y) <= 70) {
        this.attack(fort.chapelObj, time);
      } else {
        this.moveTo(c.x, c.y, dt);
        if (fort.isInside(s.x, s.y)) this.insideFort = true;
      }
    } else {
      const seg = this.segment;
      if (Phaser.Math.Distance.Between(s.x, s.y, seg.fx, seg.fy) <= 26) {
        this.attack(seg, time);
      } else {
        this.moveTo(seg.fx, seg.fy, dt);
      }
    }
    this.drawBar();
  }

  drawBar() {
    this.bar.redraw(this.sprite.x, this.sprite.y, this.hp / this.maxHp, true);
  }
}
