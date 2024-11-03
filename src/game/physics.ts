import { Vec2 } from "./vec2";

export interface Rect {
  pos: Vec2;
  size: Vec2;
}

export interface Square {
  pos: Vec2;
  size: number;
}

export function offsetRect(r: Rect): Rect {
  return {
    ...r,
    pos: r.pos.minus(r.size.divide(2)),
  };
}

// this doesn't handle that they are offset by 1/2 their width...
export function intersectRect(a: Rect, b: Rect) {
  a = offsetRect(a);
  b = offsetRect(b);
  return intersectRectAABB(a, b);
  if (a.pos.x + a.size.x < b.pos.x) return false;
  if (a.pos.x > b.pos.x + b.size.x) return false;
  if (b.pos.x + b.size.x < a.pos.x) return false;
  if (b.pos.x > a.pos.x + a.size.x) return false;

  if (a.pos.y + a.size.y < b.pos.y) return false;
  if (a.pos.y > b.pos.y + b.size.y) return false;
  if (b.pos.y + b.size.y < a.pos.y) return false;
  if (b.pos.y > a.pos.y + a.size.y) return false;

  return true;
}

export function intersectRectAABB(a: Rect, b: Rect) {
  return (
    a.pos.x < b.pos.x + b.size.x &&
    a.pos.x + a.size.x > b.pos.x &&
    a.pos.y < b.pos.y + b.size.y &&
    a.pos.y + a.size.y > b.pos.y
  );
}

export function intersectSquare(a: Square, b: Square) {
  if (a.pos.x + a.size < b.pos.x) return false;
  if (a.pos.x > b.pos.x + b.size) return false;
  if (b.pos.x + b.size < a.pos.x) return false;
  if (b.pos.x > a.pos.x + a.size) return false;

  if (a.pos.y + a.size < b.pos.y) return false;
  if (a.pos.y > b.pos.y + b.size) return false;
  if (b.pos.y + b.size < a.pos.y) return false;
  if (b.pos.y > a.pos.y + a.size) return false;

  return true;
}

// idk if this is even slower or not...
export function intersectSquareSLOW(a: Square, b: Square) {
  // xmax < bmin
  if (a.pos.x + a.size < b.pos.x) return false;
  // Exit with no intersection if found separated along an axis
  const xgap = Math.abs(a.pos.x - b.pos.x) - a.size * 0.5 - b.size * 0.5;
  if (xgap > 0) return false;
  const ygap = Math.abs(a.pos.y - b.pos.y) - a.size * 0.5 - b.size * 0.5;
  if (ygap > 0) return false;
  return true;
}

// squares can only push perpendicular to one of their faces.
// a gets moved!
export function unintersectRect(a: Rect, b: Rect) {
  const oa = offsetRect(a);
  const ob = offsetRect(b);

  const leftO = getLeftOverlap(oa, ob);
  const topO = getTopOverlap(oa, ob);
  const rightO = getRightOverlap(oa, ob);
  const botO = getBotOverlap(oa, ob);

  // TODO: CORNERS!!! use min.

  if (topO && leftO) {
    if (topO < leftO) a.pos = a.pos.minus(new Vec2(0, topO));
    else a.pos = a.pos.minus(new Vec2(leftO, 0));
    return;
  }

  if (botO && leftO) {
    if (botO < leftO) a.pos = a.pos.plus(new Vec2(0, botO));
    else a.pos = a.pos.minus(new Vec2(leftO, 0));
    return;
  }

  if (topO && rightO) {
    if (topO < rightO) a.pos = a.pos.minus(new Vec2(0, topO));
    else a.pos = a.pos.plus(new Vec2(rightO, 0));
    return;
  }

  if (botO && rightO) {
    if (botO < rightO) a.pos = a.pos.plus(new Vec2(0, botO));
    else a.pos = a.pos.plus(new Vec2(rightO, 0));
    return;
  }

  if (leftO) {
    a.pos = a.pos.minus(new Vec2(leftO, 0));
    return;
  }

  if (topO) {
    a.pos = a.pos.minus(new Vec2(0, topO));
    return;
  }

  if (rightO) {
    a.pos = a.pos.plus(new Vec2(rightO, 0));
    return;
  }

  if (botO) {
    a.pos = a.pos.plus(new Vec2(0, botO));
    return;
  }

  // we should ideally do this, somewhat uniformly, based on mass/momentum.
  // but like.. idk how that will scale with other bodies.aaaaaaaa
  const dist = a.pos.directionTo(b.pos);
  a.pos = a.pos.minus(dist);
}

// All offsets are POSITIVE.

// ASSUME OFFSET IS APPLIED!!
function getLeftOverlap(oa: Rect, ob: Rect) {
  if (oa.pos.x + oa.size.x > ob.pos.x && oa.pos.x < ob.pos.x) {
    return oa.pos.x + oa.size.x - ob.pos.x;
  }
}

// ASSUME OFFSET IS APPLIED!!
function getRightOverlap(oa: Rect, ob: Rect) {
  if (
    oa.pos.x < ob.pos.x + ob.size.x &&
    oa.pos.x + oa.size.x > ob.pos.x + ob.size.x
  )
    return ob.size.x + ob.pos.x - oa.pos.x;
}

// ASSUME OFFSET IS APPLIED!!
function getTopOverlap(oa: Rect, ob: Rect) {
  if (oa.pos.y + oa.size.y > ob.pos.y && oa.pos.y < ob.pos.y) {
    return oa.pos.y + oa.size.y - ob.pos.y;
  }
}

// ASSUME OFFSET IS APPLIED!!
function getBotOverlap(oa: Rect, ob: Rect) {
  if (
    oa.pos.y < ob.pos.y + ob.size.y &&
    oa.pos.y + oa.size.y > ob.pos.y + ob.size.y
  ) {
    return ob.pos.y + ob.size.y - oa.pos.y;
  }
}
