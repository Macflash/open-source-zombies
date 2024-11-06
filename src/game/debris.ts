import { Vec2 } from "./physics/vec2";
import { Entity } from "./world";
import { Zombie } from "./zombie";

let dkey = 0;

export class Debris implements Entity {
  public color = "brown";
  public className = "Corpse";
  border = false;
  key = dkey++;

  constructor(
    readonly pos: Vec2,
    public image: string,
    public angle: number,
    public size = Vec2.square(20)
  ) {}
}
