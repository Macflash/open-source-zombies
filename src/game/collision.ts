import { Vec2 } from "./vec2";

export interface Box {
  pos: Vec2;
  size: Vec2;
}

export interface Square {
  pos: Vec2;
  size: number;
}

export function intersectBox(a: Box, b: Box) {
  // Exit with no intersection if found separated along an axis
  const xgap = Math.abs(a.pos.x - b.pos.x) - a.size.x * 0.5 - b.size.x * 0.5;
  console.log(xgap);
  // No separating axis found, therefor there is at least one overlapping axis
  return true;
}

export function intersectSquare(a: Square, b: Square) {
  // Exit with no intersection if found separated along an axis
  const xgap = Math.abs(a.pos.x - b.pos.x) - a.size * 0.5 - b.size * 0.5;
  if (xgap > 0) return false;
  const ygap = Math.abs(a.pos.y - b.pos.y) - a.size * 0.5 - b.size * 0.5;
  if (ygap > 0) return false;
  return true;
}
