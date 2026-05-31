// WaveManager — drives the escalating waves for the level. A calm "prep" gap
// between waves gives the player time to repair and regroup. Emits HUD events:
//  'wave'  -> { current, total }
//  'prep'  -> secondsRemaining (and 'prepEnd' when a wave starts)
//  'victory' when the last wave is cleared.
import { WAVES, WAVE_PREP_MS, ENEMY_TYPES, ASSAULT_LANES } from '../config.js';
import Enemy from '../entities/Enemy.js';

export default class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.total = WAVES.length;
    this.index = -1;
    this.state = 'prep';
    this.prepLeft = WAVE_PREP_MS;
    this.queue = [];
    this.qpos = 0;
    this.elapsed = 0;
    this.done = false;
    this.scene.events.emit('wave', { current: 0, total: this.total });
    this.scene.events.emit('prep', Math.ceil(this.prepLeft / 1000));
  }

  startWave(i) {
    this.index = i;
    const q = [];
    for (const grp of WAVES[i]) {
      for (let k = 0; k < grp.count; k++) {
        q.push({ type: grp.type, lane: grp.lane || 'north', at: k * grp.gapMs });
      }
    }
    q.sort((a, b) => a.at - b.at);
    this.queue = q;
    this.qpos = 0;
    this.elapsed = 0;
    this.state = 'active';
    this.scene.events.emit('wave', { current: i + 1, total: this.total });
    this.scene.events.emit('prepEnd');
  }

  spawnOne(type, laneKey) {
    const lane = ASSAULT_LANES[laneKey] || ASSAULT_LANES.north;
    let x = lane.spawn.x + Phaser.Math.Between(-lane.spawn.jitterX, lane.spawn.jitterX);
    let y = lane.spawn.y + Phaser.Math.Between(-lane.spawn.jitterY, lane.spawn.jitterY);
    x = Phaser.Math.Clamp(x, 24, this.scene.scale.width - 24);
    y = Phaser.Math.Clamp(y, 108, this.scene.scale.height - 132);
    if (!ENEMY_TYPES[type]) type = 'infantry';
    this.scene.enemies.push(new Enemy(this.scene, x, y, type, laneKey));
  }

  update(dt, delta) {
    if (this.done) return;

    if (this.state === 'prep') {
      this.prepLeft -= delta;
      this.scene.events.emit('prep', Math.max(0, Math.ceil(this.prepLeft / 1000)));
      if (this.prepLeft <= 0) this.startWave(this.index + 1);
      return;
    }

    // active
    this.elapsed += delta;
    while (this.qpos < this.queue.length && this.queue[this.qpos].at <= this.elapsed) {
      this.spawnOne(this.queue[this.qpos].type, this.queue[this.qpos].lane);
      this.qpos++;
    }
    // Wave cleared once everything is spawned and all enemies are dead.
    if (this.qpos >= this.queue.length && this.scene.enemies.length === 0) {
      if (this.index + 1 >= this.total) {
        this.done = true;
        this.scene.events.emit('victory');
      } else {
        this.state = 'prep';
        this.prepLeft = WAVE_PREP_MS;
        this.scene.events.emit('prep', Math.ceil(this.prepLeft / 1000));
      }
    }
  }
}
