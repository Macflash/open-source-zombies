import { Keyboard } from "./input/keyboard";
import { Mouse } from "./input/mouse";
import { intersectRect, unintersectRect } from "./physics";
import { Sound } from "./sound";
import { Positionable, Vec2 } from "./vec2";
import { Entity, World } from "./world";

export class Player implements Entity {
  public health = 100;
  public size = Vec2.square(20);
  public color = "tan";

  public dir = new Vec2(0, 0);

  constructor(public pos: Vec2) {}

  doStep(world: World) {
    if (Keyboard.isDown("a")) this.pos.x--;
    if (Keyboard.isDown("d")) this.pos.x++;
    if (Keyboard.isDown("w")) this.pos.y--;
    if (Keyboard.isDown("s")) this.pos.y++;

    // avoid buildings
    for (const b of world.buildings) {
      if (intersectRect(this, b)) {
        unintersectRect(this, b);
      }
    }

    this.pos = this.pos.clamp(world.size);
    this.dir = this.pos.directionTo(Mouse.pos());
  }

  takeDamage(damage: number) {
    this.health -= damage;
    Sound.ouch();
  }
}
