export class TimeWindow {
  static readonly PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

  readonly #start: string;
  readonly #end: string;

  constructor(props: { start: string; end: string }) {
    if (!TimeWindow.PATTERN.test(props.start ?? '') || !TimeWindow.PATTERN.test(props.end ?? '')) throw new Error('validation.time-window-invalid');
    if (TimeWindow.toMinutes(props.start) >= TimeWindow.toMinutes(props.end)) throw new Error('validation.time-window-order');
    this.#start = props.start;
    this.#end = props.end;
  }

  static toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  get start(): string {
    return this.#start;
  }

  get end(): string {
    return this.#end;
  }

  get label(): string {
    return `${this.#start} – ${this.#end}`;
  }

  overlaps(other: TimeWindow): boolean {
    return TimeWindow.toMinutes(this.#start) < TimeWindow.toMinutes(other.end)
      && TimeWindow.toMinutes(other.start) < TimeWindow.toMinutes(this.#end);
  }
}
