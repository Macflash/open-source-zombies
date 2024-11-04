import { Signal } from "../signal";
import { Vec2 } from "../vec2";

export const GAMEWORLD_ID = "gameworld-el";

export class Mouse {
  private static isMouseDown = false;
  public static readonly mouseDown = new Signal<boolean>();

  private static worldEl?: HTMLElement;
  private static mousePos = new Vec2(0, 0);

  static isDown() {
    return Mouse.isMouseDown;
  }

  static pos() {
    return Mouse.mousePos.clone();
  }

  static onMouseDown() {
    if (!Mouse.isMouseDown) Mouse.mouseDown.pub(true);
    Mouse.isMouseDown = true;
  }

  static onMouseUp() {
    Mouse.isMouseDown = false;
  }

  static onMouseMove(ev: React.MouseEvent) {
    const clientPos = new Vec2(ev.clientX, ev.clientY);
    Mouse.worldEl = Mouse.worldEl ?? document.getElementById(GAMEWORLD_ID)!;

    if (!Mouse.worldEl) return;

    Mouse.mousePos = clientPos.minus(
      new Vec2(Mouse.worldEl.offsetLeft, Mouse.worldEl.offsetTop)
    );
  }
}
