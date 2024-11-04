import { Rect } from "./rect";
import { Vec2 } from "./vec2";

export interface Collidable extends Rect {
  mass: number;
  vel: Vec2;
}

// Both objects stick together and have the same velocity.
export function collideInelastic(a: Collidable, b: Collidable) {
  const momentum = a.vel.multiply(a.mass).plus(b.vel.multiply(b.mass));
  const newVel = momentum.divide(a.mass + b.mass);
  a.vel = newVel;
  b.vel = a.vel.clone();
}
