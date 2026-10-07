export type RequestStatusValue = 'draft' | 'open' | 'matched' | 'cancelled';

export class RequestStatus {
  static readonly DRAFT: RequestStatusValue = 'draft';
  static readonly OPEN: RequestStatusValue = 'open';
  static readonly MATCHED: RequestStatusValue = 'matched';
  static readonly CANCELLED: RequestStatusValue = 'cancelled';
  static readonly VALUES: readonly RequestStatusValue[] = Object.freeze([RequestStatus.DRAFT, RequestStatus.OPEN, RequestStatus.MATCHED, RequestStatus.CANCELLED]);

  readonly #value: RequestStatusValue;

  constructor(value: string) {
    if (!RequestStatus.VALUES.includes(value as RequestStatusValue)) throw new Error('validation.status-invalid');
    this.#value = value as RequestStatusValue;
  }

  get value(): RequestStatusValue {
    return this.#value;
  }

  get isOpen(): boolean {
    return this.#value === RequestStatus.OPEN;
  }

  get isDraft(): boolean {
    return this.#value === RequestStatus.DRAFT;
  }
}
