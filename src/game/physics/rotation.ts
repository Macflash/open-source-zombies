import { Vec2 } from "./vec2";

export function angleBetween(a: Vec2, b: Vec2) {
  const angleDiff = a.angle() - b.angle();
  return angleDiff;
}

// console.log(new Vec2(-1, 0).angle() / Math.PI);
// console.log(new Vec2(-1, 1).angle() / Math.PI);
// console.log(new Vec2(-1, -1).angle() / Math.PI);

// console.log(angleBetween(new Vec2(1, 0), new Vec2(-1, 1)) / Math.PI);

export function Direction(
  vec: Vec2
): "right" | "left" | "up" | "down" | undefined {
  if (vec.x > 0 && vec.x > vec.y) return "right";
  if (vec.x < 0 && vec.x < vec.y) return "left";
  if (vec.y > 0 && vec.y > vec.x) return "down";
  if (vec.y < 0 && vec.y < vec.x) return "up";
}

export interface ImageDirectionSet<T> {
  left: NoInfer<T>;
  right: NoInfer<T>;
  up: NoInfer<T>;
  down: NoInfer<T>;
}

export function SelectDirection<T>(
  vec: Vec2,
  t: {
    left: NoInfer<T>;
    right: NoInfer<T>;
    up: NoInfer<T>;
    down: NoInfer<T>;
  }
): NoInfer<T> | undefined {
  if (vec.x > 0 && vec.x > vec.y) return t.right;
  if (vec.x < 0 && vec.x < vec.y) return t.left;
  if (vec.y > 0 && vec.y > vec.x) return t.down;
  if (vec.y < 0 && vec.y < vec.x) return t.up;
}
