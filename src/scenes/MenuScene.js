// MenuScene — title screen + "Defend the Alamo" start button.
import { GAME } from '../config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { WIDTH, HEIGHT } = GAME;

    this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'ground');
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000, 0.25);

    // Chapel motif
    this.add.image(WIDTH / 2, HEIGHT * 0.34, 'chapel').setScale(1.4);

    this.add.text(WIDTH / 2, HEIGHT * 0.05, 'DEFEND', {
      fontFamily: 'Georgia, serif', fontSize: '54px', color: '#f4e4c1',
      stroke: '#3a2a1a', strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(WIDTH / 2, HEIGHT * 0.115, 'THE ALAMO', {
      fontFamily: 'Georgia, serif', fontSize: '46px', color: '#e0b24a',
      stroke: '#3a2a1a', strokeThickness: 7,
    }).setOrigin(0.5);
    this.add.text(WIDTH / 2, HEIGHT * 0.17, 'Hold the line — March 1836', {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#f4e4c1',
    }).setOrigin(0.5);

    this.makeButton(WIDTH / 2, HEIGHT * 0.62, 'START', () => {
      this.scene.start('Game');
    });

    this.add.text(WIDTH / 2, HEIGHT * 0.7,
      'Build cannons on the walls.\nTrain troops and drag the flag to position them.\nProtect the chapel.', {
        fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3a2a1a',
        align: 'center', lineSpacing: 6,
      }).setOrigin(0.5);
  }

  makeButton(x, y, label, onClick) {
    const w = 320;
    const h = 70;
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, w, h, 0x7a1f1f)
      .setStrokeStyle(4, 0xf4e4c1).setInteractive({ useHandCursor: true });
    const txt = this.add.text(0, 0, label, {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#f4e4c1',
    }).setOrigin(0.5);
    c.add([bg, txt]);
    bg.on('pointerover', () => bg.setFillStyle(0x9a2a2a));
    bg.on('pointerout', () => bg.setFillStyle(0x7a1f1f));
    bg.on('pointerdown', () => { bg.setFillStyle(0x5a1515); c.setScale(0.97); });
    bg.on('pointerup', () => { c.setScale(1); onClick(); });
    return c;
  }
}
