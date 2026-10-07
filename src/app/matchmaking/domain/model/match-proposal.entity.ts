import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Money} from '../../../shared/domain/model/money.value-object';
import {Detour} from './detour.value-object';
import {ProposalStatus} from './proposal-status.value-object';
import {isParty, Party} from './party';
import {FreightRequest} from './freight-request.entity';
import {ReturnRoute} from './return-route.entity';

export interface MatchProposalProps {
  id?: number;
  freightRequestId: number;
  returnRouteId: number;
  carrierId: number;
  merchantId: number;
  initiatedBy: string;
  currentRate: Money;
  previousRate?: Money | null;
  lastOfferBy: string;
  status: ProposalStatus;
  detour: Detour;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export class MatchProposal implements BaseEntity {
  readonly #id: number;
  readonly #freightRequestId: number;
  readonly #returnRouteId: number;
  readonly #carrierId: number;
  readonly #merchantId: number;
  readonly #initiatedBy: Party;
  #currentRate: Money;
  #previousRate: Money | null;
  #lastOfferBy: Party;
  #status: ProposalStatus;
  readonly #detour: Detour;
  readonly #createdAt: string | null;
  #updatedAt: string | null;

  constructor(props: MatchProposalProps) {
    const previousRate = props.previousRate ?? null;
    if (!props.freightRequestId) throw new Error('validation.request-required');
    if (!props.returnRouteId) throw new Error('validation.route-required');
    if (!props.carrierId) throw new Error('validation.carrier-required');
    if (!props.merchantId) throw new Error('validation.merchant-required');
    if (props.carrierId === props.merchantId) throw new Error('validation.same-parties');
    if (!isParty(props.initiatedBy) || !isParty(props.lastOfferBy)) throw new Error('validation.party-invalid');
    if (!(props.currentRate instanceof Money) || props.currentRate.amount <= 0) throw new Error('validation.rate-positive');
    if (previousRate !== null && !(previousRate instanceof Money)) throw new Error('validation.money-invalid');
    if (!(props.status instanceof ProposalStatus)) throw new Error('validation.status-invalid');
    if (!(props.detour instanceof Detour)) throw new Error('validation.detour-invalid');
    this.#id = props.id ?? 0;
    this.#freightRequestId = props.freightRequestId;
    this.#returnRouteId = props.returnRouteId;
    this.#carrierId = props.carrierId;
    this.#merchantId = props.merchantId;
    this.#initiatedBy = props.initiatedBy;
    this.#currentRate = props.currentRate;
    this.#previousRate = previousRate;
    this.#lastOfferBy = props.lastOfferBy;
    this.#status = props.status;
    this.#detour = props.detour;
    this.#createdAt = props.createdAt ?? null;
    this.#updatedAt = props.updatedAt ?? null;
  }

  static create(props: { freightRequest: FreightRequest; returnRoute: ReturnRoute; rate: Money; by: Party; detour: Detour }): MatchProposal {
    const { freightRequest, returnRoute, rate, by, detour } = props;
    if (!freightRequest.status.isOpen) throw new Error('validation.request-not-open');
    if (!returnRoute.status.isActive) throw new Error('validation.route-not-active');
    if (!returnRoute.canCarry(freightRequest.cargo.weightKg, freightRequest.cargo.volumeM3)) throw new Error('validation.route-capacity-insufficient');
    const acceptsPublishedRate = by === 'carrier' && freightRequest.offeredRate !== null && freightRequest.offeredRate.equals(rate);
    const now = new Date().toISOString();
    return new MatchProposal({
      freightRequestId: freightRequest.id,
      returnRouteId: returnRoute.id,
      carrierId: returnRoute.carrierId,
      merchantId: freightRequest.merchantId,
      initiatedBy: by,
      currentRate: rate,
      lastOfferBy: by,
      status: new ProposalStatus(acceptsPublishedRate ? ProposalStatus.ACCEPTED : ProposalStatus.PENDING),
      detour,
      createdAt: now,
      updatedAt: now
    });
  }

  get id(): number {
    return this.#id;
  }

  get freightRequestId(): number {
    return this.#freightRequestId;
  }

  get returnRouteId(): number {
    return this.#returnRouteId;
  }

  get carrierId(): number {
    return this.#carrierId;
  }

  get merchantId(): number {
    return this.#merchantId;
  }

  get initiatedBy(): Party {
    return this.#initiatedBy;
  }

  get currentRate(): Money {
    return this.#currentRate;
  }

  get previousRate(): Money | null {
    return this.#previousRate;
  }

  get lastOfferBy(): Party {
    return this.#lastOfferBy;
  }

  get status(): ProposalStatus {
    return this.#status;
  }

  get detour(): Detour {
    return this.#detour;
  }

  get createdAt(): string | null {
    return this.#createdAt;
  }

  get updatedAt(): string | null {
    return this.#updatedAt;
  }

  isAwaiting(party: string | null): boolean {
    return this.#status.isNegotiating && this.#lastOfferBy !== party;
  }

  accept(by: string): void {
    this.#assertCanAnswer(by);
    this.#status = new ProposalStatus(ProposalStatus.ACCEPTED);
    this.#touch();
  }

  counter(rate: Money, by: string): void {
    this.#assertCanAnswer(by);
    if (!(rate instanceof Money) || rate.amount <= 0) throw new Error('validation.rate-positive');
    if (rate.equals(this.#currentRate)) throw new Error('validation.counteroffer-same-rate');
    this.#previousRate = this.#currentRate;
    this.#currentRate = rate;
    this.#lastOfferBy = by as Party;
    this.#status = new ProposalStatus(ProposalStatus.COUNTEROFFER);
    this.#touch();
  }

  reject(by: string): void {
    if (!isParty(by)) throw new Error('validation.party-invalid');
    if (!this.#status.isOpen) throw new Error('validation.proposal-closed');
    this.#status = new ProposalStatus(ProposalStatus.REJECTED);
    this.#touch();
  }

  confirm(by: string): void {
    if (by !== 'merchant') throw new Error('validation.only-merchant-confirms');
    if (!this.#status.isAccepted) throw new Error('validation.proposal-not-accepted');
    this.#status = new ProposalStatus(ProposalStatus.MATCHED);
    this.#touch();
  }

  close(): void {
    if (!this.#status.isOpen) return;
    this.#status = new ProposalStatus(ProposalStatus.CLOSED);
    this.#touch();
  }

  #assertCanAnswer(by: string): void {
    if (!isParty(by)) throw new Error('validation.party-invalid');
    if (!this.#status.isNegotiating) throw new Error('validation.proposal-closed');
    if (by === this.#lastOfferBy) throw new Error('validation.not-your-turn');
  }

  #touch(): void {
    this.#updatedAt = new Date().toISOString();
  }
}
