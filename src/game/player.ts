import { Keyboard } from "./input/keyboard";
import { Mouse } from "./input/mouse";
import { intersectRect, unintersectRect } from "./physics/rect";
import { Sound } from "./sound";
import { Positionable, Vec2 } from "./physics/vec2";
import { Entity, World } from "./world";
import { Collidable } from "./physics/collision";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

export class Player implements Entity, Collidable {
  public health = 100;
  public mass = 100;
  private force = 10;

  public size = Vec2.square(20);
  public color = "tan";

  public vel = Vec2.zero();
  public dir = Vec2.zero();

  constructor(public pos: Vec2) {}

  doStep(world: World) {
    let moveDir = getKeyboardDir().multiply(this.force / this.mass);
    if (Keyboard.isDown("shift")) moveDir = moveDir.multiply(1.5);
    this.vel = this.vel.plus(moveDir).multiply(0.9);
    this.pos = this.pos.plus(this.vel);

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

function getKeyboardDir() {
  if (Keyboard.isDown("a") && Keyboard.isDown("w"))
    return new Vec2(-1, -1).unit();
  if (Keyboard.isDown("a") && Keyboard.isDown("s"))
    return new Vec2(-1, 1).unit();
  if (Keyboard.isDown("d") && Keyboard.isDown("w"))
    return new Vec2(1, -1).unit();
  if (Keyboard.isDown("d") && Keyboard.isDown("s"))
    return new Vec2(1, 1).unit();
  if (Keyboard.isDown("a")) return new Vec2(-1, 0);
  if (Keyboard.isDown("d")) return new Vec2(1, 0);
  if (Keyboard.isDown("w")) return new Vec2(0, -1);
  if (Keyboard.isDown("s")) return new Vec2(0, 1);
  return Vec2.zero();
}
