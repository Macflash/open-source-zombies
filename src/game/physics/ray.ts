import { offsetRect, Rect } from "./rect";
import { Vec2 } from "./vec2";

export interface Ray {
  pos: Vec2;
  vec: Vec2;
  steps?: number; // Steps between pos and vec to check.
}

export function intersectRay(ray: Ray, rect: Rect): boolean {
  const steps = ray.steps || 3;
  for (let i = 0; i <= steps; i++) {
    if (intersectPoint(ray.pos.plus(ray.vec.multiply(i / steps)), rect)) {
      return true;
    }
  }
  return false;
}

export function intersectPoint(pos: Vec2, rect: Rect): boolean {
  rect = offsetRect(rect);
  return (
    pos.x > rect.pos.x &&
    pos.x < rect.pos.x + rect.size.x &&
    pos.y > rect.pos.y &&
    pos.y < rect.pos.y + rect.size.y
  );
}
