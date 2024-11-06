export interface Positionable {
  pos: Vec2;
}

export interface Sizable {
  size: number;
}

export class Vec2 {
  static zero() {
    return new Vec2(0, 0);
  }

  static square(size: number) {
    return new Vec2(size, size);
  }

  constructor(public x: number, public y: number) {}

  clone() {
    return new Vec2(this.x, this.y);
  }

  plus(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  minus(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  multiply(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  divide(s: number): Vec2 {
    return new Vec2(this.x / s, this.y / s);
  }

  unit(): Vec2 {
    return this.divide(this.magnitude());
  }

  directionTo(other: Vec2): Vec2 {
    return other.minus(this).unit();
  }

  distanceTo(other: Vec2): number {
    return other.minus(this).magnitude();
  }

  rotate(angle: number): Vec2 {
    return new Vec2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  nearest<T extends Positionable>(targets: T[]): T | undefined {
    if (!targets.length) return;

    let nearestDist = Number.MAX_VALUE;
    let nearest = targets[0];
    for (const target of targets) {
      const dist = this.distanceTo(target.pos);
      if (dist < nearestDist) {
        nearest = target;
        nearestDist = dist;
      }
    }

    return nearest;
  }

  clamp(size: number): Vec2 {
    return new Vec2(clamp(this.x, size), clamp(this.y, size));
  }
}

function clamp(value: number, max: number) {
  const enforceMax = Math.min(value, max);
  return Math.max(0, enforceMax);
}
