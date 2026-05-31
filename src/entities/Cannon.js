// Cannon — sits on a wall slot, auto-acquires the nearest enemy in range and
// fires cannonballs (splash) on a cooldown.
import { CANNON } from '../config.js';
import Projectile from './Projectile.js';

export default class Cannon {
  constructor(scene, x, y, outwardAngle, tierCeil = 1) {
    this.scene = scene;
    this.tier = 1;
    this.tierCeil = tierCeil;
    this.sprite = scene.add.image(x, y, 'cannon').setDepth(13);
    // Point the barrel outward by default (texture faces "up" = -PI/2).
    this.sprite.rotation = outwardAngle + Math.PI / 2;
    this.lastFire = 0;
    this.alive = true;
    this.applyTierVisuals();
  }

  get stats() {
    return CANNON.TIERS[this.tier] || CANNON.TIERS[1];
  }

  get canUpgrade() {
    return this.tier < this.tierCeil;
  }

  get nextUpgradeCost() {
    if (!this.canUpgrade) return 0;
    return CANNON.TIERS[this.tier + 1].upgradeCost;
  }

  upgrade() {
    if (!this.canUpgrade) return false;
    this.tier++;
    this.applyTierVisuals();
    return true;
  }

  applyTierVisuals() {
    const scale = 0.95 + this.tier * 0.08;
    const tint = [0xffffff, 0xd9d0bd, 0xc7b07d, 0xb78b52, 0x8d7043][this.tier - 1] || 0xffffff;
    this.sprite.setScale(scale).setTint(tint);
  }

  update(dt, time) {
    if (!this.alive) return;
    const s = this.sprite;
    const stats = this.stats;
    const target = this.scene.nearestEnemy(s.x, s.y, stats.range);
    if (!target) return;
    s.rotation = Phaser.Math.Angle.Between(s.x, s.y, target.sprite.x, target.sprite.y) + Math.PI / 2;
    if (time - this.lastFire >= stats.fireMs) {
      this.lastFire = time;
      this.fire(target);
    }
  }

  fire(target) {
    const s = this.sprite;
    this.scene.projectiles.push(new Projectile(this.scene, s.x, s.y, {
      texture: 'ball',
      speed: CANNON.PROJECTILE_SPEED,
      damage: this.stats.damage,
      splash: this.stats.splash,
      homing: false,
      aimX: target.sprite.x,
      aimY: target.sprite.y,
    }));
    this.scene.spawnBurst(s.x, s.y, 0xffe08a, 3);
  }

  destroy() {
    this.alive = false;
    this.sprite.destroy();
  }
}
