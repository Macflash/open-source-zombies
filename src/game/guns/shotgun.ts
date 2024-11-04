import { Bullet } from "../bullet";
import { Mouse } from "../input/mouse";
import { Keyboard } from "../input/keyboard";
import { Player } from "../player";
import { Sound } from "../sound";
import { Vec2 } from "../vec2";
import { Gun } from "./gun";

export class Shotgun implements Gun {
  public ammo = 30;
  public clip = 6;
  public isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;

  length = 35;

  doStep(player: Player) {
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (this.shootDelay == 5 && !this.isReloading) Sound.reload();
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.isReloading || Keyboard.isDown("r")) this.reload();
    if (Mouse.isDown()) return this.shoot(player);
    return undefined;
  }

  shoot(player: Player) {
    this.isReloading = false;
    this.length = 35;
    if (this.clip <= 0) {
      this.reload();
      return [];
    }
    if (this.shootDelay > 0) return [];
    this.clip--;
    if (this.clip == 0) Sound.ding();
    else Sound.blam();
    this.shootDelay = 100;
    this.reloadDelay = 50;
    const barrelPos = player.pos.plus(player.dir.multiply(this.length));
    return [
      new Bullet(
        barrelPos.clone(),
        player.dir.rotate(0.5 * (Math.random() - 0.5)).multiply(3),
        34
      ),
      new Bullet(
        barrelPos.clone(),
        player.dir.rotate(0.5 * (Math.random() - 0.5)).multiply(3),
        34
      ),
      new Bullet(
        barrelPos.clone(),
        player.dir.rotate(0.02 + Math.random() * 0.1).multiply(3),
        34
      ),
      new Bullet(
        barrelPos.clone(),
        player.dir.rotate(-0.02 - Math.random() * 0.1).multiply(3),
        34
      ),
    ];
  }

  reload() {
    if (this.ammo <= 0 || this.clip >= 6) {
      this.isReloading = false;
      this.length = 35;
      return;
    }
    this.isReloading = true;
    this.length = 20;

    if (this.reloadDelay > 0) return;
    Sound.dong();
    this.clip++;
    this.ammo--;
    this.reloadDelay = 100;
    this.shootDelay = 100;
  }
}
