// Cannon — sits on a wall slot, auto-acquires the nearest enemy in range and
// fires cannonballs (splash) on a cooldown.
import { CANNON } from '../config.js';
import Projectile from './Projectile.js';

export default class Cannon {
  constructor(scene, x, y, outwardAngle) {
    this.scene = scene;
    this.sprite = scene.add.image(x, y, 'cannon').setDepth(13);
    // Point the barrel outward by default (texture faces "up" = -PI/2).
    this.sprite.rotation = outwardAngle + Math.PI / 2;
    this.lastFire = 0;
    this.alive = true;
  }

  update(dt, time) {
    if (!this.alive) return;
    const s = this.sprite;
    const target = this.scene.nearestEnemy(s.x, s.y, CANNON.RANGE);
    if (!target) return;
    s.rotation = Phaser.Math.Angle.Between(s.x, s.y, target.sprite.x, target.sprite.y) + Math.PI / 2;
    if (time - this.lastFire >= CANNON.FIRE_MS) {
      this.lastFire = time;
      this.fire(target);
    }
  }

  fire(target) {
    const s = this.sprite;
    this.scene.projectiles.push(new Projectile(this.scene, s.x, s.y, {
      texture: 'ball',
      speed: CANNON.PROJECTILE_SPEED,
      damage: CANNON.DAMAGE,
      splash: 24,
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
