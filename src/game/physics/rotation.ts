import { Vec2 } from "./vec2";

export function angleBetween(a: Vec2, b: Vec2) {
  const angleDiff = a.angle() - b.angle();
  return angleDiff;
}

console.log(new Vec2(-1, 0).angle() / Math.PI);
console.log(new Vec2(-1, 1).angle() / Math.PI);
console.log(new Vec2(-1, -1).angle() / Math.PI);

// console.log(angleBetween(new Vec2(1, 0), new Vec2(-1, 1)) / Math.PI);
