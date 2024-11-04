import { Signal } from "../signal";
import { Vec2 } from "../physics/vec2";

export const GAMEWORLD_ID = "gameworld-el";

export class Mouse {
  private static isMouseDown = false;
  private static isRightDown = false;
  public static readonly mouseDown = new Signal<boolean>();
  public static readonly onRightDown = new Signal<boolean>();

  private static worldEl?: HTMLElement;
  private static mousePos = new Vec2(0, 0);

  static isDown() {
    return Mouse.isMouseDown;
  }

  static isRight() {
    return Mouse.isRightDown;
  }

  static pos() {
    return Mouse.mousePos.clone();
  }

  static onMouseDown(ev: React.MouseEvent) {
    if (ev.button == 2) {
      Mouse.isRightDown = true;
      return;
    }

    if (!Mouse.isMouseDown) Mouse.mouseDown.pub(true);
    Mouse.isMouseDown = true;
  }

  static onMouseUp(ev: React.MouseEvent) {
    if (ev.button == 2) {
      Mouse.isRightDown = false;
      return;
    }

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
