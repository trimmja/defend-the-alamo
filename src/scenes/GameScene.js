// GameScene — owns the battlefield, all entities, and the update loop. The HUD
// runs in parallel (launched here) and calls the action methods below.
import { GAME, ECON, CANNON, FORT } from '../config.js';
import Fort from '../entities/Fort.js';
import Cannon from '../entities/Cannon.js';
import Troop from '../entities/Troop.js';
import Hero from '../entities/Hero.js';
import Economy from '../systems/Economy.js';
import WaveManager from '../systems/WaveManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const { WIDTH, HEIGHT } = GAME;
    this.gameEnded = false;

    this.add.image(WIDTH / 2, HEIGHT / 2, 'alamo-ground').setDepth(0);

    this.enemies = [];
    this.troops = [];
    this.cannons = [];
    this.projectiles = [];
    this.hero = null;

    this.economy = new Economy(this);
    this.fort = new Fort(this);

    // Shared rally flag for troops — drag it to move the whole line.
    this.rallyPoint = { x: FORT.RALLY.x, y: FORT.RALLY.y };
    this.flag = this.add.image(this.rallyPoint.x, this.rallyPoint.y, 'flag').setDepth(15);
    this.flag.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(this.flag);
    this.flag.on('drag', (pointer, dragX, dragY) => {
      this.flag.x = this.rallyPoint.x = Phaser.Math.Clamp(dragX, 30, WIDTH - 30);
      this.flag.y = this.rallyPoint.y = Phaser.Math.Clamp(dragY, 110, HEIGHT - 140);
    });

    this.wireBuildAndRepair();

    this.waves = new WaveManager(this);

    // Win/lose hookup.
    this.events.on('victory', () => this.endGame('win'));

    // Launch the HUD overlay and let it know the economy starting state.
    this.scene.launch('HUD');
    this.economy.emit();

    // Clean up listeners if the scene restarts.
    this.events.once('shutdown', () => {
      this.events.off('victory');
    });
  }

  wireBuildAndRepair() {
    for (const seg of this.fort.segments) {
      // Tap a wall slot ring -> build a cannon there.
      seg.slot.on('pointerdown', () => {
        if (this.gameEnded) return;
        if (seg.cannon) {
          const cost = seg.cannon.nextUpgradeCost;
          if (!seg.cannon.canUpgrade) { this.flashMsg(seg.label + ' maxed'); return; }
          if (!this.economy.canAfford(cost)) { this.flashMsg('Need $' + cost); return; }
          this.economy.spend(cost);
          seg.cannon.upgrade();
          this.spawnBurst(seg.slotX, seg.slotY, 0xffe08a, 8);
          this.flashMsg(CANNON.TIERS[seg.cannon.tier].name);
          return;
        }
        const cost = CANNON.TIERS[1].cost;
        if (!this.economy.canAfford(cost)) { this.flashMsg('Need $' + cost); return; }
        this.economy.spend(cost);
        const c = new Cannon(this, seg.slotX, seg.slotY, seg.outward, seg.tierCeil);
        seg.cannon = c;
        this.cannons.push(c);
        this.spawnBurst(seg.slotX, seg.slotY, 0xffe08a, 5);
        this.flashMsg(seg.label);
      });
      // Tap a damaged wall -> repair it.
      seg.sprite.on('pointerdown', () => {
        if (this.gameEnded) return;
        if (!seg.damaged) { this.flashMsg('Wall is fine'); return; }
        if (!this.economy.canAfford(ECON.REPAIR_COST)) { this.flashMsg('Need $' + ECON.REPAIR_COST); return; }
        this.economy.spend(ECON.REPAIR_COST);
        seg.repair(ECON.REPAIR_AMOUNT);
        this.spawnBurst(seg.cx, seg.cy, 0x9d917e, 5);
      });
    }
  }

  // ----- actions called by the HUD ------------------------------------------
  trainTroop() {
    if (this.gameEnded) return;
    if (!this.economy.canAfford(ECON.TROOP_COST)) { this.flashMsg('Need $' + ECON.TROOP_COST); return; }
    this.economy.spend(ECON.TROOP_COST);
    const ox = Phaser.Math.Between(-18, 18);
    const oy = Phaser.Math.Between(-18, 18);
    this.troops.push(new Troop(this, this.rallyPoint.x + ox, this.rallyPoint.y + oy));
  }

  deployHero() {
    if (this.gameEnded || this.hero) return;
    this.hero = new Hero(this, FORT.HERO_DEPLOY.x, FORT.HERO_DEPLOY.y);
    this.events.emit('heroDeployed');
    this.flashMsg('Crockett deployed!');
  }

  useAbility() {
    if (this.gameEnded || !this.hero) return;
    this.hero.useAbility(this.time.now);
  }

  // ----- queries used by entities -------------------------------------------
  nearestEnemy(x, y, range) {
    let best = null;
    let bd = range;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const d = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
      if (d <= bd) { bd = d; best = e; }
    }
    return best;
  }

  nearestDefender(x, y, range) {
    let best = null;
    let bd = range;
    for (const t of this.troops) {
      if (!t.alive) continue;
      const d = Phaser.Math.Distance.Between(x, y, t.sprite.x, t.sprite.y);
      if (d <= bd) { bd = d; best = t; }
    }
    if (this.hero && this.hero.alive) {
      const d = Phaser.Math.Distance.Between(x, y, this.hero.sprite.x, this.hero.sprite.y);
      if (d <= bd) { bd = d; best = this.hero; }
    }
    return best;
  }

  enemiesInRadius(x, y, r) {
    return this.enemies.filter((e) => e.alive &&
      Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y) <= r);
  }

  spawnBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const p = this.add.image(x, y, 'spark').setTint(color).setDepth(25)
        .setScale(Phaser.Math.FloatBetween(0.4, 1));
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(8, 26);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(220, 420),
        onComplete: () => p.destroy(),
      });
    }
  }

  flashMsg(text) {
    if (this._msg) this._msg.destroy();
    this._msg = this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 160, text, {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fff4d6',
      stroke: '#7a1f1f', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(950);
    this.tweens.add({
      targets: this._msg, y: GAME.HEIGHT - 185, alpha: 0,
      duration: 900, onComplete: () => { if (this._msg) { this._msg.destroy(); this._msg = null; } },
    });
  }

  endGame(result) {
    if (this.gameEnded) return;
    this.gameEnded = true;
    const wave = this.waves ? Math.max(0, this.waves.index + 1) : 0;
    this.scene.stop('HUD');
    this.scene.start('GameOver', { result, wave, total: this.waves.total });
  }

  update(time, delta) {
    if (this.gameEnded) return;
    const dt = delta / 1000;

    this.waves.update(dt, delta);

    for (const e of this.enemies) e.update(dt, time);
    for (const t of this.troops) t.update(dt, time);
    for (const c of this.cannons) c.update(dt, time);
    if (this.hero) this.hero.update(dt, time);
    for (const p of this.projectiles) p.update(dt, delta);

    // Cull the dead.
    this.enemies = this.enemies.filter((e) => e.alive);
    this.troops = this.troops.filter((t) => t.alive);
    this.projectiles = this.projectiles.filter((p) => p.alive);

    // HUD feedback.
    this.events.emit('chapelHp', this.fort.chapelObj.hp / FORT.CHAPEL_HP);
    if (this.hero) this.events.emit('ability', this.hero.abilityFraction(time));

    // Lose condition.
    if (this.fort.chapelObj.hp <= 0) this.endGame('lose');
  }
}
