// Troop — a Texian defender. Trained for money, spawns in the courtyard, and
// holds at the shared rally flag, auto-attacking any enemy in range. Move the
// flag to reposition the whole line (advance to the walls or retreat to the chapel).
import { TROOP } from '../config.js';
import { HealthBar, hitFlash } from '../utils.js';

const TROOP_TINT = 0x2f6db0; // Texian blue

export default class Troop {
  constructor(scene, x, y) {
    this.scene = scene;
    this.maxHp = TROOP.HP;
    this.hp = TROOP.HP;
    this.sprite = scene.add.image(x, y, 'unit').setDepth(11);
    this.sprite.setTint(TROOP_TINT);
    this.sprite._baseTint = TROOP_TINT;
    this.alive = true;
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
    this.alive = false;
    this.scene.spawnBurst(this.sprite.x, this.sprite.y, 0x2f6db0, 5);
    this.destroy();
  }

  destroy() {
    this.alive = false;
    this.bar.destroy();
    this.sprite.destroy();
  }

  update(dt, time) {
    if (!this.alive) return;
    const s = this.sprite;

    // Attack an enemy in range first.
    const enemy = this.scene.nearestEnemy(s.x, s.y, TROOP.RANGE);
    if (enemy) {
      s.rotation = Phaser.Math.Angle.Between(s.x, s.y, enemy.sprite.x, enemy.sprite.y) + Math.PI / 2;
      if (time - this.lastAttack >= TROOP.ATTACK_MS) {
        this.lastAttack = time;
        enemy.takeDamage(TROOP.DAMAGE);
        hitFlash(this.scene, enemy.sprite);
      }
      this.drawBar();
      return;
    }

    // Otherwise hold at the rally flag.
    const r = this.scene.rallyPoint;
    const d = Phaser.Math.Distance.Between(s.x, s.y, r.x, r.y);
    if (d > 6) {
      const ang = Phaser.Math.Angle.Between(s.x, s.y, r.x, r.y);
      s.x += Math.cos(ang) * TROOP.SPEED * dt;
      s.y += Math.sin(ang) * TROOP.SPEED * dt;
      s.rotation = ang + Math.PI / 2;
    }
    this.drawBar();
  }

  drawBar() {
    this.bar.redraw(this.sprite.x, this.sprite.y, this.hp / this.maxHp, true);
  }
}
