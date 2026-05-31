// Economy — money earned from kills, spent (anytime) on cannons / troops / repairs.
// Emits 'money' on the GameScene event emitter so the HUD can react.
import { ECON } from '../config.js';

export default class Economy {
  constructor(scene) {
    this.scene = scene;
    this.money = ECON.START_MONEY;
  }

  emit() {
    this.scene.events.emit('money', this.money);
  }

  canAfford(cost) {
    return this.money >= cost;
  }

  spend(cost) {
    if (this.money < cost) return false;
    this.money -= cost;
    this.emit();
    return true;
  }

  earn(amount) {
    this.money += amount;
    this.emit();
  }
}
