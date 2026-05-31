// Alamo TD — entry point. Phaser is loaded globally from the CDN (see index.html).
import { GAME } from './config.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import HUDScene from './scenes/HUDScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  backgroundColor: GAME.BG,
  scale: {
    mode: Phaser.Scale.FIT,        // portrait, scales to fit any iPhone
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, MenuScene, GameScene, HUDScene, GameOverScene],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
