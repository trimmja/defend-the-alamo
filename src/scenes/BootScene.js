// BootScene — generates all textures in code (no external image files in Phase 1).
// See ASSETS.md for the catalog + the swap-in path for real sprites later.
import { GAME } from '../config.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Simple loading bar (we have no big downloads, but this keeps the pattern).
    const { WIDTH, HEIGHT } = GAME;
    const barW = WIDTH * 0.6;
    const bar = this.add.graphics();
    this.load.on('progress', (p) => {
      bar.clear().fillStyle(0xe8d3a1, 1)
        .fillRect((WIDTH - barW) / 2, HEIGHT / 2 - 8, barW * p, 16);
    });
  }

  create() {
    this.buildTextures();
    this.scene.start('Menu');
  }

  // ----- texture generation helpers ----------------------------------------
  tex(key, w, h, draw) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    draw(g, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  buildTextures() {
    // Dusty ground tile (subtle) — used as a TileSprite background.
    this.tex('ground', 64, 64, (g) => {
      g.fillStyle(0xc7a06a, 1).fillRect(0, 0, 64, 64);
      g.fillStyle(0xbb9460, 1);
      for (let i = 0; i < 22; i++) {
        const x = (i * 53) % 64;
        const y = (i * 29) % 64;
        g.fillRect(x, y, 3, 3);
      }
      g.fillStyle(0xd2ac76, 1);
      for (let i = 0; i < 14; i++) {
        g.fillRect((i * 41) % 60, (i * 17) % 60, 2, 2);
      }
    });

    // Stone wall tile — used as a TileSprite stretched along each wall segment.
    this.tex('stone', 32, 32, (g) => {
      g.fillStyle(0x8a7d6b, 1).fillRect(0, 0, 32, 32);
      g.lineStyle(2, 0x6b6052, 1);
      g.strokeRect(1, 1, 30, 14);
      g.strokeRect(1, 16, 14, 14);
      g.strokeRect(17, 16, 14, 14);
      g.fillStyle(0x9d917e, 1).fillRect(3, 3, 26, 4);
    });

    // Cannon-slot marker — a stone emplacement ring.
    this.tex('slot', 40, 40, (g) => {
      g.lineStyle(3, 0x5b4f3f, 1).strokeCircle(20, 20, 16);
      g.fillStyle(0x6b6052, 0.55).fillCircle(20, 20, 14);
      g.lineStyle(2, 0x4a4032, 0.8).strokeCircle(20, 20, 9);
    });

    // Cannon (top-down): wooden carriage + dark barrel + wheels. Drawn facing up.
    this.tex('cannon', 34, 38, (g) => {
      g.fillStyle(0x5a3d22, 1).fillRoundedRect(9, 14, 16, 22, 3); // carriage
      g.fillStyle(0x2c2c30, 1).fillRoundedRect(13, 0, 8, 22, 3);  // barrel
      g.fillStyle(0x141416, 1).fillCircle(17, 2, 4);              // muzzle
      g.fillStyle(0x3a2615, 1);                                   // wheels
      g.fillCircle(7, 26, 6);
      g.fillCircle(27, 26, 6);
      g.fillStyle(0x6b4a2b, 1);
      g.fillCircle(7, 26, 2.5);
      g.fillCircle(27, 26, 2.5);
    });

    // Generic top-down unit (white-based so it tints cleanly per faction).
    // Body + head + musket. Used for enemies and troops.
    this.tex('unit', 26, 26, (g) => {
      g.fillStyle(0xffffff, 1).fillRoundedRect(6, 9, 14, 14, 5); // torso/shoulders
      g.fillStyle(0xf0e2cf, 1).fillCircle(13, 9, 5);             // head (skin-ish)
      g.fillStyle(0x3a3a3a, 1).fillRect(20, 4, 2, 18);           // musket
      g.lineStyle(1, 0x000000, 0.25).strokeRoundedRect(6, 9, 14, 14, 5);
    });

    // Hero — Davy Crockett: buckskin body, coonskin cap, long rifle. Full color
    // (no tint) so he reads as distinct.
    this.tex('hero', 34, 34, (g) => {
      g.fillStyle(0x8a5a2b, 1).fillRoundedRect(8, 12, 18, 18, 6); // buckskin coat
      g.fillStyle(0xc89a5b, 1).fillRect(8, 26, 18, 4);            // fringe
      g.fillStyle(0xf0d2b0, 1).fillCircle(17, 11, 6);             // head
      g.fillStyle(0x5b4326, 1).fillEllipse(17, 8, 15, 8);         // coonskin cap
      g.fillStyle(0x3a2a18, 1).fillRect(22, 6, 5, 3);             // cap tail
      g.fillStyle(0x2c2c30, 1).fillRect(26, 2, 2, 24);            // long rifle "Old Betsy"
      g.lineStyle(1.5, 0x4a2f15, 1).strokeRoundedRect(8, 12, 18, 18, 6);
    });

    // Rally flag (Texian) — pole + triangle.
    this.tex('flag', 26, 34, (g) => {
      g.fillStyle(0x5a4326, 1).fillRect(4, 2, 3, 32);    // pole
      g.fillStyle(0x2456a6, 1);                          // blue flag
      g.fillTriangle(7, 3, 24, 9, 7, 16);
      g.fillStyle(0xf2e9d8, 1).fillCircle(13, 9, 2.5);   // lone star-ish dot
    });

    // Projectiles + particle.
    this.tex('ball', 12, 12, (g) => {
      g.fillStyle(0x1d1d20, 1).fillCircle(6, 6, 5);
      g.fillStyle(0x444450, 1).fillCircle(4, 4, 1.6);
    });
    this.tex('shot', 8, 8, (g) => {
      g.fillStyle(0xffe08a, 1).fillCircle(4, 4, 3);
    });
    this.tex('spark', 8, 8, (g) => {
      g.fillStyle(0xffffff, 1).fillRect(0, 0, 8, 8);
    });

    // The Alamo chapel (top-down-ish facade) — the heart you protect.
    this.tex('chapel', 120, 150, (g) => {
      g.fillStyle(0xcdb185, 1).fillRoundedRect(6, 18, 108, 126, 6);  // main body
      g.fillStyle(0xb89a6c, 1).fillRect(6, 18, 108, 14);             // roofline shadow
      // iconic curved-top facade block at the "front" (top)
      g.fillStyle(0xd8bd92, 1).fillRoundedRect(34, 4, 52, 40, 4);
      g.fillStyle(0xd8bd92, 1).fillEllipse(60, 8, 52, 26);
      // doorway + windows
      g.fillStyle(0x4a3826, 1).fillRoundedRect(50, 22, 20, 22, 4);
      g.fillStyle(0x6b533a, 1).fillRect(24, 60, 16, 22);
      g.fillStyle(0x6b533a, 1).fillRect(80, 60, 16, 22);
      g.lineStyle(2, 0x9c8358, 1).strokeRoundedRect(6, 18, 108, 126, 6);
    });

    // Soft circle for ability/area indicators.
    this.tex('ring', 64, 64, (g) => {
      g.lineStyle(3, 0xffe08a, 1).strokeCircle(32, 32, 30);
    });
  }
}
