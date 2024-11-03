import { KeyboardListener } from "./keyboard";
import { Positionable, Vec2 } from "./vec2";
import { Entity, World } from "./world";

const keyboard = new KeyboardListener();

export class Player implements Entity {
  public health = 100;
  public size = 20;
  public color = "tan";

  constructor(public pos: Vec2) {}

  doStep(world: World) {
    const pressedKeys = KeyboardListener.getPressedKeys();
    if (pressedKeys.has("a")) this.pos.x--;
    if (pressedKeys.has("d")) this.pos.x++;
    if (pressedKeys.has("w")) this.pos.y--;
    if (pressedKeys.has("s")) this.pos.y++;
    this.pos = this.pos.clamp(world.size);
  }

  takeDamage(damage: number) {
    this.health -= damage;
  }
}
