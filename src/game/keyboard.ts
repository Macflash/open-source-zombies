import { ReadonlySet } from "typescript";

const pressedKeys = new Set<string>();

window.addEventListener("keydown", (ev) => {
  pressedKeys.add(ev.key.toLowerCase());
});

window.addEventListener("keyup", (ev) => {
  pressedKeys.delete(ev.key.toLowerCase());
});

export class KeyboardListener {
  static getPressedKeys(): ReadonlySet<string> {
    return pressedKeys;
  }

  static isPressed(key: string) {
    return pressedKeys.has(key);
  }
}
