import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Address} from '../../../shared/domain/model/address.value-object';
import {TimeWindow} from './time-window.value-object';
import {CargoType} from './cargo-type.value-object';
import {RouteStatus} from './route-status.value-object';
import {RouteMatchingService} from '../services/route-matching.service';

export interface ReturnRouteProps {
  id?: number;
  carrierId: number;
  vehicleId: number;
  vehicleLabel?: string;
  origin: Address;
  destination: Address;
  departureDate: string;
  timeWindow: TimeWindow;
  availableWeightKg: number;
  availableVolumeM3?: number;
  maxDetourKm: number;
  acceptedCargoTypes: CargoType[];
  status: RouteStatus;
  distanceKm?: number;
  durationMinutes?: number;
  createdAt?: string | null;
}

export class ReturnRoute implements BaseEntity {
  static readonly DETOUR_OPTIONS: readonly number[] = Object.freeze([5, 10, 15, 20]);
  static readonly MAX_DETOUR_KM = 30;
  static readonly DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  readonly #id: number;
  readonly #carrierId: number;
  readonly #vehicleId: number;
  readonly #vehicleLabel: string;
  readonly #origin: Address;
  readonly #destination: Address;
  readonly #departureDate: string;
  readonly #timeWindow: TimeWindow;
  #availableWeightKg: number;
  #availableVolumeM3: number;
  readonly #maxDetourKm: number;
  readonly #acceptedCargoTypes: CargoType[];
  #status: RouteStatus;
  readonly #distanceKm: number;
  readonly #durationMinutes: number;
  readonly #createdAt: string | null;

  constructor(props: ReturnRouteProps) {
    if (!props.carrierId) throw new Error('validation.carrier-required');
    if (!props.vehicleId) throw new Error('validation.vehicle-required');
    if (!(props.origin instanceof Address)) throw new Error('validation.origin-required');
    if (!(props.destination instanceof Address)) throw new Error('validation.destination-required');
    if (props.origin.equals(props.destination)) throw new Error('validation.same-origin-destination');
    if (!ReturnRoute.DATE_PATTERN.test(props.departureDate ?? '')) throw new Error('validation.date-required');
    if (!(props.timeWindow instanceof TimeWindow)) throw new Error('validation.time-window-invalid');
    const weight = Number(props.availableWeightKg);
    const volume = Number(props.availableVolumeM3 ?? 0);
    const maxDetour = Number(props.maxDetourKm);
    if (!Number.isFinite(weight) || weight < 0) throw new Error('validation.capacity-weight-invalid');
    if (!Number.isFinite(volume) || volume < 0) throw new Error('validation.capacity-volume-invalid');
    if (!Number.isFinite(maxDetour) || maxDetour <= 0 || maxDetour > ReturnRoute.MAX_DETOUR_KM) throw new Error('validation.detour-invalid');
    if (!Array.isArray(props.acceptedCargoTypes) || props.acceptedCargoTypes.length === 0
      || !props.acceptedCargoTypes.every(type => type instanceof CargoType)) throw new Error('validation.cargo-types-required');
    if (!(props.status instanceof RouteStatus)) throw new Error('validation.status-invalid');
    this.#id = props.id ?? 0;
    this.#carrierId = props.carrierId;
    this.#vehicleId = props.vehicleId;
    this.#vehicleLabel = props.vehicleLabel ?? '';
    this.#origin = props.origin;
    this.#destination = props.destination;
    this.#departureDate = props.departureDate;
    this.#timeWindow = props.timeWindow;
    this.#availableWeightKg = weight;
    this.#availableVolumeM3 = volume;
    this.#maxDetourKm = maxDetour;
    this.#acceptedCargoTypes = [...props.acceptedCargoTypes];
    this.#status = props.status;
    this.#distanceKm = props.distanceKm ?? 0;
    this.#durationMinutes = props.durationMinutes ?? 0;
    this.#createdAt = props.createdAt ?? null;
  }

  static create(props: Omit<ReturnRouteProps, 'status' | 'distanceKm' | 'durationMinutes' | 'createdAt'> & {
    today: string;
    vehicleCapacityKg: number;
    vehicleCapacityM3: number;
  }): ReturnRoute {
    const { today, vehicleCapacityKg, vehicleCapacityM3, ...params } = props;
    if (!params.departureDate || params.departureDate < today) throw new Error('validation.date-in-past');
    if (Number(params.availableWeightKg) <= 0) throw new Error('validation.capacity-weight-invalid');
    if (Number(params.availableWeightKg) > vehicleCapacityKg) throw new Error('validation.capacity-exceeds-vehicle');
    if (Number(params.availableVolumeM3 ?? 0) > vehicleCapacityM3) throw new Error('validation.volume-exceeds-vehicle');
    const estimation = RouteMatchingService.estimateTrip(params.origin, params.destination);
    return new ReturnRoute({
      ...params,
      status: new RouteStatus(RouteStatus.ACTIVE),
      distanceKm: estimation.distanceKm,
      durationMinutes: estimation.durationMinutes,
      createdAt: new Date().toISOString()
    });
  }

  get id(): number {
    return this.#id;
  }

  get carrierId(): number {
    return this.#carrierId;
  }

  get vehicleId(): number {
    return this.#vehicleId;
  }

  get vehicleLabel(): string {
    return this.#vehicleLabel;
  }

  get origin(): Address {
    return this.#origin;
  }

  get destination(): Address {
    return this.#destination;
  }

  get departureDate(): string {
    return this.#departureDate;
  }

  get timeWindow(): TimeWindow {
    return this.#timeWindow;
  }

  get availableWeightKg(): number {
    return this.#availableWeightKg;
  }

  get availableVolumeM3(): number {
    return this.#availableVolumeM3;
  }

  get maxDetourKm(): number {
    return this.#maxDetourKm;
  }

  get acceptedCargoTypes(): CargoType[] {
    return [...this.#acceptedCargoTypes];
  }

  get status(): RouteStatus {
    return this.#status;
  }

  get distanceKm(): number {
    return this.#distanceKm;
  }

  get durationMinutes(): number {
    return this.#durationMinutes;
  }

  get createdAt(): string | null {
    return this.#createdAt;
  }

  get label(): string {
    return `${this.#origin.district} → ${this.#destination.district}`;
  }

  accepts(cargoType: CargoType): boolean {
    return this.#acceptedCargoTypes.some(type => type.equals(cargoType));
  }

  canCarry(weightKg: number, volumeM3 = 0): boolean {
    const volumeFits = this.#availableVolumeM3 === 0 || volumeM3 <= this.#availableVolumeM3;
    return weightKg <= this.#availableWeightKg && volumeFits;
  }

  reserveCapacity(weightKg: number, volumeM3 = 0): void {
    if (!this.#status.isActive) throw new Error('validation.route-not-active');
    if (!this.canCarry(weightKg, volumeM3)) throw new Error('validation.route-capacity-insufficient');
    this.#availableWeightKg = Math.max(0, this.#availableWeightKg - weightKg);
    this.#availableVolumeM3 = Math.max(0, this.#availableVolumeM3 - volumeM3);
    if (this.#availableWeightKg === 0) this.#status = new RouteStatus(RouteStatus.MATCHED);
  }

  close(): void {
    if (this.#status.isClosed) throw new Error('validation.route-already-closed');
    this.#status = new RouteStatus(RouteStatus.CLOSED);
  }
}
