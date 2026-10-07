export type ProposalStatusValue = 'pending' | 'counteroffer' | 'accepted' | 'matched' | 'rejected' | 'closed';

export class ProposalStatus {
  static readonly PENDING: ProposalStatusValue = 'pending';
  static readonly COUNTEROFFER: ProposalStatusValue = 'counteroffer';
  static readonly ACCEPTED: ProposalStatusValue = 'accepted';
  static readonly MATCHED: ProposalStatusValue = 'matched';
  static readonly REJECTED: ProposalStatusValue = 'rejected';
  static readonly CLOSED: ProposalStatusValue = 'closed';
  static readonly VALUES: readonly ProposalStatusValue[] = Object.freeze([
    ProposalStatus.PENDING,
    ProposalStatus.COUNTEROFFER,
    ProposalStatus.ACCEPTED,
    ProposalStatus.MATCHED,
    ProposalStatus.REJECTED,
    ProposalStatus.CLOSED
  ]);

  readonly #value: ProposalStatusValue;

  constructor(value: string) {
    if (!ProposalStatus.VALUES.includes(value as ProposalStatusValue)) throw new Error('validation.status-invalid');
    this.#value = value as ProposalStatusValue;
  }

  get value(): ProposalStatusValue {
    return this.#value;
  }

  get isNegotiating(): boolean {
    return this.#value === ProposalStatus.PENDING || this.#value === ProposalStatus.COUNTEROFFER;
  }

  get isAccepted(): boolean {
    return this.#value === ProposalStatus.ACCEPTED;
  }

  get isOpen(): boolean {
    return this.isNegotiating || this.isAccepted;
  }
}
