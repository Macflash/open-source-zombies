type Callback<T> = (t: T) => void;

export class Signal<T> {
  private listeners = new Set<Callback<T>>();

  sub(cb: Callback<T>) {
    this.listeners.add(cb);
  }

  pub(t: T) {
    this.listeners.forEach((cb) => cb(t));
  }
}

export class SignalSet<T> {
  private set = new Set<T>();
  readonly onAdded = new Signal<T>();
  readonly onDeleted = new Signal<T>();

  has(t: T): boolean {
    return this.set.has(t);
  }

  add(t: T) {
    if (this.set.has(t)) return;
    this.set.add(t);
    this.onAdded.pub(t);
  }

  delete(t: T) {
    if (!this.set.has(t)) return;
    this.set.delete(t);
    this.onDeleted.pub(t);
  }
}
