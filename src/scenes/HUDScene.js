// HUDScene — overlay UI that runs in parallel with GameScene. Top bar shows
// money / wave / chapel health / pause; the bottom bar has thumb-friendly
// buttons. Reads game state via this.scene.get('Game') and its event emitter.
import { GAME, ECON } from '../config.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  create() {
    const { WIDTH, HEIGHT } = GAME;
    this.game_ = this.scene.get('Game');
    this.money = this.game_.economy.money;

    // --- top bar ---
    this.add.rectangle(WIDTH / 2, 41, WIDTH, 82, 0x2a1c10, 0.62).setDepth(1000);
    this.moneyText = this.add.text(16, 30, '', {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#ffd86b',
    }).setDepth(1001);
    this.waveText = this.add.text(WIDTH / 2, 18, '', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f4e4c1',
    }).setOrigin(0.5, 0).setDepth(1001);

    // chapel health bar
    this.add.text(WIDTH / 2 - 96, 50, 'CHAPEL', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#f4e4c1',
    }).setOrigin(0, 0.5).setDepth(1001);
    this.chapelBarBg = this.add.rectangle(WIDTH / 2 - 30, 56, 124, 12, 0x000000, 0.6)
      .setOrigin(0, 0.5).setDepth(1001);
    this.chapelBar = this.add.rectangle(WIDTH / 2 - 29, 56, 122, 10, 0x46c24a)
      .setOrigin(0, 0.5).setDepth(1002);

    // pause button
    this.makePause(WIDTH - 34, 40);

    // --- center banner (waves / prep countdown) ---
    this.banner = this.add.text(WIDTH / 2, HEIGHT * 0.28, '', {
      fontFamily: 'Georgia, serif', fontSize: '40px', color: '#fff4d6',
      stroke: '#7a1f1f', strokeThickness: 6, align: 'center',
    }).setOrigin(0.5).setDepth(1001);

    // --- bottom bar ---
    this.add.rectangle(WIDTH / 2, HEIGHT - 58, WIDTH, 118, 0x2a1c10, 0.62).setDepth(1000);
    this.hint = this.add.text(WIDTH / 2, HEIGHT - 124,
      `Tap a wall ring to build a cannon  ($${ECON.CANNON_COST})   ·   Tap a cracked wall to repair  ($${ECON.REPAIR_COST})`, {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#f4e4c1', align: 'center',
      }).setOrigin(0.5).setDepth(1001);

    this.troopBtn = this.makeButton(150, HEIGHT - 56, 'unit', 0x2f6db0, 'Troop', `$${ECON.TROOP_COST}`,
      () => this.game_.trainTroop());
    this.heroBtn = this.makeButton(270, HEIGHT - 56, 'hero', null, 'Crockett', 'Deploy',
      () => this.game_.deployHero());
    this.volleyBtn = this.makeButton(390, HEIGHT - 56, null, 0x7a4f1f, 'Volley', 'Ability',
      () => this.game_.useAbility(), '⚡');
    this.volleyBtn.container.setAlpha(0.4);
    this.volleyReady = false;
    this.heroDeployed = false;

    // cooldown wedge over the volley button
    this.cdG = this.add.graphics().setDepth(1004);

    // --- events from GameScene ---
    const ev = this.game_.events;
    ev.on('money', this.onMoney, this);
    ev.on('wave', this.onWave, this);
    ev.on('prep', this.onPrep, this);
    ev.on('prepEnd', this.onPrepEnd, this);
    ev.on('chapelHp', this.onChapelHp, this);
    ev.on('heroDeployed', this.onHeroDeployed, this);
    ev.on('ability', this.onAbility, this);
    this.events.once('shutdown', () => {
      ev.off('money', this.onMoney, this);
      ev.off('wave', this.onWave, this);
      ev.off('prep', this.onPrep, this);
      ev.off('prepEnd', this.onPrepEnd, this);
      ev.off('chapelHp', this.onChapelHp, this);
      ev.off('heroDeployed', this.onHeroDeployed, this);
      ev.off('ability', this.onAbility, this);
    });

    this.onMoney(this.money);
    this.waveText.setText('Get ready…');
  }

  // ----- button factories ---------------------------------------------------
  makeButton(x, y, iconKey, iconTint, label, cost, onClick, glyph) {
    const c = this.add.container(x, y).setDepth(1003);
    const circle = this.add.circle(0, 0, 38, 0x4a3320).setStrokeStyle(4, 0xf4e4c1)
      .setInteractive({ useHandCursor: true });
    c.add(circle);
    if (iconKey) {
      const icon = this.add.image(0, -4, iconKey).setScale(1.2);
      if (iconTint !== null && iconTint !== undefined) icon.setTint(iconTint);
      c.add(icon);
    } else if (glyph) {
      c.add(this.add.text(0, -6, glyph, { fontSize: '30px' }).setOrigin(0.5));
    }
    c.add(this.add.text(0, 20, label, {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#f4e4c1',
    }).setOrigin(0.5));
    const costText = this.add.text(0, 50, cost, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#ffd86b',
    }).setOrigin(0.5).setDepth(1003);
    circle.on('pointerdown', () => { c.setScale(0.94); });
    circle.on('pointerup', () => { c.setScale(1); onClick(); });
    circle.on('pointerout', () => { c.setScale(1); });
    return { container: c, circle, costText };
  }

  makePause(x, y) {
    const btn = this.add.circle(x, y, 22, 0x4a3320).setStrokeStyle(3, 0xf4e4c1)
      .setDepth(1001).setInteractive({ useHandCursor: true });
    this.add.text(x, y, '❚❚', { fontSize: '18px', color: '#f4e4c1' })
      .setOrigin(0.5).setDepth(1002);
    this.paused = false;
    const overlay = this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x000000, 0.6)
      .setDepth(1100).setInteractive().setVisible(false);
    const overlayText = this.add.text(GAME.WIDTH / 2, GAME.HEIGHT / 2, 'PAUSED\n\ntap to resume', {
      fontFamily: 'Georgia, serif', fontSize: '34px', color: '#fff4d6', align: 'center',
    }).setOrigin(0.5).setDepth(1101).setVisible(false);
    const resume = () => {
      this.paused = false;
      overlay.setVisible(false);
      overlayText.setVisible(false);
      this.scene.resume('Game');
    };
    btn.on('pointerdown', () => {
      if (this.paused) { resume(); return; }
      this.paused = true;
      overlay.setVisible(true);
      overlayText.setVisible(true);
      this.scene.pause('Game');
    });
    overlay.on('pointerdown', resume);
  }

  // ----- event handlers -----------------------------------------------------
  onMoney(money) {
    this.money = money;
    this.moneyText.setText('$ ' + money);
    this.setEnabled(this.troopBtn, money >= ECON.TROOP_COST);
    if (!this.heroDeployed) this.setEnabled(this.heroBtn, true);
  }

  onWave({ current, total }) {
    if (current <= 0) { this.waveText.setText('Get ready…'); return; }
    this.waveText.setText(`Wave ${current} / ${total}`);
  }

  onPrep(seconds) {
    if (seconds > 0) {
      this.banner.setText(`Next wave in ${seconds}…\nRepair & regroup!`);
      this.banner.setVisible(true);
    } else {
      this.banner.setVisible(false);
    }
  }

  onPrepEnd() {
    this.banner.setVisible(false);
    this.flashBanner('Here they come!');
  }

  onChapelHp(frac) {
    frac = Phaser.Math.Clamp(frac, 0, 1);
    this.chapelBar.width = 122 * frac;
    this.chapelBar.fillColor = frac <= 0.25 ? 0xd23b3b : frac <= 0.5 ? 0xe8c038 : 0x46c24a;
  }

  onHeroDeployed() {
    this.heroDeployed = true;
    this.heroBtn.costText.setText('Out');
    this.setEnabled(this.heroBtn, false);
  }

  onAbility(frac) {
    const ready = frac >= 1;
    this.volleyReady = ready;
    this.volleyBtn.container.setAlpha(ready ? 1 : 0.55);
    // cooldown wedge
    this.cdG.clear();
    if (!ready) {
      const x = this.volleyBtn.container.x;
      const y = this.volleyBtn.container.y;
      this.cdG.fillStyle(0x000000, 0.55);
      this.cdG.slice(x, y, 38, -Math.PI / 2, -Math.PI / 2 + (1 - frac) * Math.PI * 2, true);
      this.cdG.fillPath();
    }
  }

  flashBanner(text) {
    this.banner.setText(text).setVisible(true).setAlpha(1);
    this.tweens.add({ targets: this.banner, alpha: 0, duration: 1200, delay: 500,
      onComplete: () => this.banner.setVisible(false) });
  }

  setEnabled(btn, enabled) {
    btn.container.setAlpha(enabled ? 1 : 0.45);
    btn.circle.input.enabled = enabled;
  }
}
