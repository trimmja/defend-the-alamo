// Projectile — two flavors:
//  - cannonball: non-homing, travels to a fixed aim point, splash damage on impact
//  - shot: homing single-target (hero / future ranged troops)
export default class Projectile {
  constructor(scene, x, y, opts) {
    this.scene = scene;
    this.alive = true;
    this.damage = opts.damage;
    this.speed = opts.speed;
    this.splash = opts.splash || 0;
    this.homing = !!opts.homing;
    this.target = opts.target || null;     // Enemy instance (for homing)
    this.aim = { x: opts.aimX, y: opts.aimY };
    this.sprite = scene.add.image(x, y, opts.texture || 'ball').setDepth(20);
    this.maxLife = 2500; // ms safety
    this.age = 0;
  }

  update(dt, delta) {
    if (!this.alive) return;
    this.age += delta;
    const s = this.sprite;

    if (this.homing && this.target && this.target.alive) {
      this.aim.x = this.target.sprite.x;
      this.aim.y = this.target.sprite.y;
    }

    const dist = Phaser.Math.Distance.Between(s.x, s.y, this.aim.x, this.aim.y);
    const step = this.speed * dt;
    s.rotation = Phaser.Math.Angle.Between(s.x, s.y, this.aim.x, this.aim.y) + Math.PI / 2;

    if (this.homing) {
      // direct hit on target
      if (this.target && this.target.alive) {
        const dt2 = Phaser.Math.Distance.Between(s.x, s.y, this.target.sprite.x, this.target.sprite.y);
        if (dt2 <= 12) { this.target.takeDamage(this.damage); return this.explode(s.x, s.y, false); }
      }
      if (dist <= step || this.age > this.maxLife) return this.explode(s.x, s.y, false);
    } else {
      // cannonball: detonate near any enemy en route, or at the aim point
      const e = this.scene.nearestEnemy(s.x, s.y, 12);
      if (e) return this.explode(s.x, s.y, true);
      if (dist <= step || this.age > this.maxLife) return this.explode(this.aim.x, this.aim.y, true);
    }

    const ang = Phaser.Math.Angle.Between(s.x, s.y, this.aim.x, this.aim.y);
    s.x += Math.cos(ang) * step;
    s.y += Math.sin(ang) * step;
  }

  explode(x, y, doSplash) {
    if (doSplash && this.splash > 0) {
      for (const e of this.scene.enemiesInRadius(x, y, this.splash)) {
        e.takeDamage(this.damage);
      }
    }
    this.scene.spawnBurst(x, y, doSplash ? 0xffb347 : 0xffe08a, doSplash ? 10 : 5);
    this.destroy();
  }

  destroy() {
    this.alive = false;
    this.sprite.destroy();
  }
}
