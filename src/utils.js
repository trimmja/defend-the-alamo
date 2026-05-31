// Small shared helpers.

// A thin health bar that floats above an entity or structure.
export class HealthBar {
  constructor(scene, width = 24, height = 4, yOffset = -16, depth = 900) {
    this.scene = scene;
    this.w = width;
    this.h = height;
    this.yOffset = yOffset;
    this.g = scene.add.graphics().setDepth(depth);
  }

  // frac 0..1. hideWhenFull: don't draw a full bar (less clutter for units).
  redraw(x, y, frac, hideWhenFull = false) {
    this.g.clear();
    frac = Phaser.Math.Clamp(frac, 0, 1);
    if (frac <= 0) return;
    if (hideWhenFull && frac >= 1) return;
    const w = this.w;
    const left = x - w / 2;
    const top = y + this.yOffset;
    this.g.fillStyle(0x000000, 0.55).fillRect(left - 1, top - 1, w + 2, this.h + 2);
    let color = 0x46c24a;
    if (frac <= 0.25) color = 0xd23b3b;
    else if (frac <= 0.5) color = 0xe8c038;
    this.g.fillStyle(color, 1).fillRect(left, top, w * frac, this.h);
  }

  destroy() {
    this.g.destroy();
  }
}

// Brief white flash on a sprite when it takes a hit.
export function hitFlash(scene, sprite) {
  if (!sprite || !sprite.active) return;
  const prev = sprite.tintTopLeft;
  sprite.setTintFill(0xffffff);
  scene.time.delayedCall(70, () => {
    if (!sprite.active) return;
    sprite.clearTint();
    if (typeof sprite._baseTint === 'number') sprite.setTint(sprite._baseTint);
    else void prev;
  });
}
