export type RouteStatusValue = 'active' | 'matched' | 'closed';

export class RouteStatus {
  static readonly ACTIVE: RouteStatusValue = 'active';
  static readonly MATCHED: RouteStatusValue = 'matched';
  static readonly CLOSED: RouteStatusValue = 'closed';
  static readonly VALUES: readonly RouteStatusValue[] = Object.freeze([RouteStatus.ACTIVE, RouteStatus.MATCHED, RouteStatus.CLOSED]);

  readonly #value: RouteStatusValue;

  constructor(value: string) {
    if (!RouteStatus.VALUES.includes(value as RouteStatusValue)) throw new Error('validation.status-invalid');
    this.#value = value as RouteStatusValue;
  }

  get value(): RouteStatusValue {
    return this.#value;
  }

  get isActive(): boolean {
    return this.#value === RouteStatus.ACTIVE;
  }

  get isClosed(): boolean {
    return this.#value === RouteStatus.CLOSED;
  }
}
