// Hero — Davy Crockett. A long-range sharpshooter ("Old Betsy"): high
// single-target damage from range. Draggable to reposition. Active ability
// "Volley" damages all enemies around him on a cooldown.
import { HERO } from '../config.js';
import Projectile from './Projectile.js';
import { HealthBar, hitFlash } from '../utils.js';

export default class Hero {
  constructor(scene, x, y) {
    this.scene = scene;
    this.maxHp = HERO.HP;
    this.hp = HERO.HP;
    this.sprite = scene.add.image(x, y, 'hero').setDepth(14);
    this.sprite.setScale(1.05);
    this.alive = true;
    this.lastAttack = 0;
    this.lastAbility = -HERO.ABILITY_COOLDOWN_MS; // ready immediately
    this.bar = new HealthBar(scene, 30, 5, -20);

    // Draggable to reposition (tap-drag on the hero himself).
    this.sprite.setInteractive({ draggable: true, useHandCursor: true });
    scene.input.setDraggable(this.sprite);
    this.sprite.on('drag', (pointer, dragX, dragY) => {
      this.sprite.x = Phaser.Math.Clamp(dragX, 20, scene.scale.width - 20);
      this.sprite.y = Phaser.Math.Clamp(dragY, 110, scene.scale.height - 140);
    });
  }

  takeDamage(d) {
    if (!this.alive) return;
    this.hp -= d;
    hitFlash(this.scene, this.sprite);
    if (this.hp <= 0) this.die();
  }

  die() {
    this.alive = false;
    this.scene.spawnBurst(this.sprite.x, this.sprite.y, 0x8a5a2b, 8);
    this.destroy();
  }

  destroy() {
    this.alive = false;
    this.bar.destroy();
    this.sprite.destroy();
    this.scene.hero = null;
  }

  abilityReady(time) {
    return time - this.lastAbility >= HERO.ABILITY_COOLDOWN_MS;
  }

  abilityFraction(time) {
    return Phaser.Math.Clamp((time - this.lastAbility) / HERO.ABILITY_COOLDOWN_MS, 0, 1);
  }

  useAbility(time) {
    if (!this.alive || !this.abilityReady(time)) return false;
    this.lastAbility = time;
    const s = this.sprite;
    // "Volley" — burst of shots hitting everything nearby.
    for (const e of this.scene.enemiesInRadius(s.x, s.y, HERO.ABILITY_RADIUS)) {
      e.takeDamage(HERO.ABILITY_DAMAGE);
    }
    const ring = this.scene.add.image(s.x, s.y, 'ring').setDepth(30)
      .setScale(0.2).setAlpha(0.9);
    this.scene.tweens.add({
      targets: ring, scale: HERO.ABILITY_RADIUS / 32, alpha: 0,
      duration: 420, onComplete: () => ring.destroy(),
    });
    this.scene.spawnBurst(s.x, s.y, 0xffe08a, 16);
    this.scene.cameras.main.shake(120, 0.004);
    return true;
  }

  update(dt, time) {
    if (!this.alive) return;
    const s = this.sprite;
    const enemy = this.scene.nearestEnemy(s.x, s.y, HERO.RANGE);
    if (enemy) {
      s.rotation = Phaser.Math.Angle.Between(s.x, s.y, enemy.sprite.x, enemy.sprite.y);
      if (time - this.lastAttack >= HERO.ATTACK_MS) {
        this.lastAttack = time;
        this.scene.projectiles.push(new Projectile(this.scene, s.x, s.y, {
          texture: 'shot', speed: 520, damage: HERO.DAMAGE, homing: true,
          target: enemy, aimX: enemy.sprite.x, aimY: enemy.sprite.y,
        }));
      }
    }
    this.bar.redraw(s.x, s.y, this.hp / this.maxHp, true);
  }
}
