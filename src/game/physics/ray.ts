import { offsetRect, Rect } from "./rect";
import { Vec2 } from "./vec2";

export interface Ray {
  pos: Vec2;
  vec: Vec2;
  steps?: number; // Steps between pos and vec to check.
}

export function intersectRayDot(ray: Ray, rect: Rect): boolean {
  let { pos, vec } = ray;

  // seems off by 90 degrees? and doesn't respect forwards or backwards.
  vec = new Vec2(vec.y, vec.x * -1);

  const offset = offsetRect(rect);

  const corners = [
    offset.pos,
    offset.pos.plus(offset.size),
    offset.pos.plus(new Vec2(offset.size.x, 0)),
    offset.pos.plus(new Vec2(0, offset.size.y)),
  ];

  const relative = corners.map((v) => v.minus(pos));

  const dots = relative.map((v) => v.dot(vec));

  const n = dots.filter((d) => d < 0).length;
  if (n == dots.length) return false;
  const p = dots.filter((d) => d > 0).length;
  if (p == dots.length) return false;

  // check which way the ray is pointing?
  if (rect.pos.distanceTo(pos) > rect.pos.plus(ray.vec).distanceTo(pos))
    return false;

  // this seems to get the correct direction!
  // but does not handle the distance or forward/backwards!

  return true;
}

// char get_line_intersection(float p0_x, float p0_y, float p1_x, float p1_y,
//     float p2_x, float p2_y, float p3_x, float p3_y, float *i_x, float *i_y)
// {
//     float s1_x, s1_y, s2_x, s2_y;
//     s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
//     s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

//     float s, t;
//     s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
//     t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

//     if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
//     {
//         // Collision detected
//         if (i_x != NULL)
//             *i_x = p0_x + (t * s1_x);
//         if (i_y != NULL)
//             *i_y = p0_y + (t * s1_y);
//         return 1;
//     }

//     return 0; // No collision
// }

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
