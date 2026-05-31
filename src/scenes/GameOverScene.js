// GameOverScene — win/lose summary + retry.
import { GAME } from '../config.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data) {
    const { WIDTH, HEIGHT } = GAME;
    const win = data.result === 'win';

    this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'ground');
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000, win ? 0.45 : 0.6);

    this.add.text(WIDTH / 2, HEIGHT * 0.3, win ? 'THE ALAMO HOLDS!' : 'THE ALAMO HAS FALLEN', {
      fontFamily: 'Georgia, serif', fontSize: win ? '40px' : '36px',
      color: win ? '#ffe08a' : '#e6c0a0', stroke: '#3a2a1a', strokeThickness: 7,
      align: 'center', wordWrap: { width: WIDTH - 60 },
    }).setOrigin(0.5);

    const msg = win
      ? `You survived all ${data.total} waves.\nThe defenders are remembered.`
      : `You held until wave ${data.wave} of ${data.total}.\nRemember the Alamo.`;
    this.add.text(WIDTH / 2, HEIGHT * 0.44, msg, {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f4e4c1',
      align: 'center', lineSpacing: 8,
    }).setOrigin(0.5);

    this.makeButton(WIDTH / 2, HEIGHT * 0.62, win ? 'PLAY AGAIN' : 'TRY AGAIN', () => {
      this.scene.start('Game');
    });
    this.makeButton(WIDTH / 2, HEIGHT * 0.72, 'MAIN MENU', () => {
      this.scene.start('Menu');
    });
  }

  makeButton(x, y, label, onClick) {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 300, 64, 0x7a1f1f)
      .setStrokeStyle(4, 0xf4e4c1).setInteractive({ useHandCursor: true });
    const txt = this.add.text(0, 0, label, {
      fontFamily: 'Georgia, serif', fontSize: '24px', color: '#f4e4c1',
    }).setOrigin(0.5);
    c.add([bg, txt]);
    bg.on('pointerdown', () => { bg.setFillStyle(0x5a1515); c.setScale(0.97); });
    bg.on('pointerup', () => { c.setScale(1); onClick(); });
    bg.on('pointerout', () => { c.setScale(1); bg.setFillStyle(0x7a1f1f); });
    return c;
  }
}
