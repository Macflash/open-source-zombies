import { SignalSet } from "./signal";

export class Keyboard {
  static pressedKeys = new SignalSet<string>();
  static readonly onDown = Keyboard.pressedKeys.onAdded;
  static readonly onUp = Keyboard.pressedKeys.onDeleted;

  private static isInitialized = false;
  static attachListeners() {
    if (Keyboard.isInitialized) return;
    Keyboard.isInitialized = true;

    window.addEventListener("keydown", (ev) => {
      Keyboard.pressedKeys.add(ev.key.toLowerCase());
    });

    window.addEventListener("keyup", (ev) => {
      Keyboard.pressedKeys.delete(ev.key.toLowerCase());
    });
  }

  static isDown(key: string) {
    return Keyboard.pressedKeys.has(key);
  }
}

Keyboard.attachListeners();
