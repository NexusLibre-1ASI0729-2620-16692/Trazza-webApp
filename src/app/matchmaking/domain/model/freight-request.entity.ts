import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Address} from '../../../shared/domain/model/address.value-object';
import {Money} from '../../../shared/domain/model/money.value-object';
import {TimeWindow} from './time-window.value-object';
import {Cargo} from './cargo.value-object';
import {RequestStatus} from './request-status.value-object';
import {RouteMatchingService} from '../services/route-matching.service';

export interface FreightRequestProps {
  id?: number;
  code: string;
  merchantId: number;
  pickup: Address;
  delivery: Address;
  pickupDate: string;
  pickupWindow: TimeWindow;
  cargo: Cargo;
  offeredRate?: Money | null;
  status: RequestStatus;
  distanceKm?: number;
  createdAt?: string | null;
}

export class FreightRequest implements BaseEntity {
  static readonly DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  readonly #id: number;
  readonly #code: string;
  readonly #merchantId: number;
  readonly #pickup: Address;
  readonly #delivery: Address;
  readonly #pickupDate: string;
  readonly #pickupWindow: TimeWindow;
  readonly #cargo: Cargo;
  readonly #offeredRate: Money | null;
  #status: RequestStatus;
  readonly #distanceKm: number;
  readonly #createdAt: string | null;

  constructor(props: FreightRequestProps) {
    const offeredRate = props.offeredRate ?? null;
    if (!props.code) throw new Error('validation.code-required');
    if (!props.merchantId) throw new Error('validation.merchant-required');
    if (!(props.pickup instanceof Address)) throw new Error('validation.pickup-required');
    if (!(props.delivery instanceof Address)) throw new Error('validation.delivery-required');
    if (props.pickup.equals(props.delivery)) throw new Error('validation.same-pickup-delivery');
    if (!FreightRequest.DATE_PATTERN.test(props.pickupDate ?? '')) throw new Error('validation.date-required');
    if (!(props.pickupWindow instanceof TimeWindow)) throw new Error('validation.time-window-invalid');
    if (!(props.cargo instanceof Cargo)) throw new Error('validation.cargo-required');
    if (offeredRate !== null && !(offeredRate instanceof Money)) throw new Error('validation.money-invalid');
    if (offeredRate !== null && offeredRate.amount === 0) throw new Error('validation.rate-positive');
    if (!(props.status instanceof RequestStatus)) throw new Error('validation.status-invalid');
    this.#id = props.id ?? 0;
    this.#code = props.code;
    this.#merchantId = props.merchantId;
    this.#pickup = props.pickup;
    this.#delivery = props.delivery;
    this.#pickupDate = props.pickupDate;
    this.#pickupWindow = props.pickupWindow;
    this.#cargo = props.cargo;
    this.#offeredRate = offeredRate;
    this.#status = props.status;
    this.#distanceKm = props.distanceKm ?? 0;
    this.#createdAt = props.createdAt ?? null;
  }

  static create(props: Omit<FreightRequestProps, 'status' | 'distanceKm' | 'code'> & { code?: string; today: string; publish: boolean }): FreightRequest {
    const { today, publish, ...params } = props;
    if (!params.pickupDate || params.pickupDate < today) throw new Error('validation.date-in-past');
    const estimation = RouteMatchingService.estimateTrip(params.pickup, params.delivery);
    return new FreightRequest({
      ...params,
      code: params.code ?? `FR-${String(Date.now()).slice(-4)}`,
      status: new RequestStatus(publish ? RequestStatus.OPEN : RequestStatus.DRAFT),
      distanceKm: estimation.distanceKm,
      createdAt: params.createdAt ?? new Date().toISOString()
    });
  }

  get id(): number {
    return this.#id;
  }

  get code(): string {
    return this.#code;
  }

  get merchantId(): number {
    return this.#merchantId;
  }

  get pickup(): Address {
    return this.#pickup;
  }

  get delivery(): Address {
    return this.#delivery;
  }

  get pickupDate(): string {
    return this.#pickupDate;
  }

  get pickupWindow(): TimeWindow {
    return this.#pickupWindow;
  }

  get cargo(): Cargo {
    return this.#cargo;
  }

  get offeredRate(): Money | null {
    return this.#offeredRate;
  }

  get status(): RequestStatus {
    return this.#status;
  }

  get distanceKm(): number {
    return this.#distanceKm;
  }

  get createdAt(): string | null {
    return this.#createdAt;
  }

  get label(): string {
    return `${this.#pickup.district} → ${this.#delivery.district}`;
  }

  publish(): void {
    if (!this.#status.isDraft) throw new Error('validation.request-not-draft');
    this.#status = new RequestStatus(RequestStatus.OPEN);
  }

  markMatched(): void {
    if (!this.#status.isOpen) throw new Error('validation.request-not-open');
    this.#status = new RequestStatus(RequestStatus.MATCHED);
  }

  cancel(): void {
    if (!this.#status.isOpen && !this.#status.isDraft) throw new Error('validation.request-cannot-cancel');
    this.#status = new RequestStatus(RequestStatus.CANCELLED);
  }
}
