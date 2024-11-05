import { Keyboard } from "./input/keyboard";
import { Mouse } from "./input/mouse";
import { intersectRect, unintersectRect } from "./physics/rect";
import { Sound } from "./sound";
import { Positionable, Vec2 } from "./physics/vec2";
import { Entity, World } from "./world";
import { Collidable } from "./physics/collision";
import { keyboard } from "@testing-library/user-event/dist/keyboard";
import { SelectDirection } from "./physics/rotation";

import guy_up from "../img/guy_up.png";
import guy_left from "../img/guy_left.png";
import guy_right from "../img/guy_right.png";
import guy_down from "../img/guy_down.png";

const playerImages = {
  left: guy_left,
  right: guy_right,
  up: guy_up,
  down: guy_down,
};

export class Player implements Entity, Collidable {
  public health = 100;
  public mass = 100;
  private force = 10;

  public size = Vec2.square(20);
  public color = "tan";

  public vel = Vec2.zero();
  public dir = Vec2.zero();

  maxSprint = 150;
  sprint = this.maxSprint;
  isSprinting = false;

  image = guy_left;

  constructor(public pos: Vec2) {}

  doStep(world: World) {
    // USING gun length as mass lol.
    const keyDir = getKeyboardDir();
    if (keyDir) {
      let moveDir = keyDir.multiply(
        this.force / (this.mass + world.activeGun.length)
      );
      if (Keyboard.isDown("shift") && this.sprint > 1) {
        this.isSprinting = true;
        moveDir = moveDir.multiply(1.75);
        this.sprint--;
        if (this.sprint % 30 == 0) Sound.run();
      } else if (this.sprint < this.maxSprint) {
        this.sprint += 0.3;
      }
      this.vel = this.vel.plus(moveDir);
    } else if (this.sprint < this.maxSprint) {
      // Recovers faster when standing still
      this.sprint += 0.5;
    }

    this.vel = this.vel.multiply(0.9);
    this.pos = this.pos.plus(this.vel);

    // avoid buildings
    for (const b of world.buildings) {
      if (intersectRect(this, b)) {
        unintersectRect(this, b);
      }
    }

    this.pos = this.pos.clamp(world.size);
    this.dir = this.pos.directionTo(Mouse.pos());

    const newImage = SelectDirection<string>(this.dir, playerImages);
    this.image = newImage || this.image;
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
  return undefined;
}
