import {LIMA_DISTRICTS} from './lima-districts';
import {GeoLocation} from './geo-location.value-object';

export class Address {
  static readonly MIN_STREET_LENGTH = 5;

  readonly #street: string;
  readonly #district: string;

  constructor(props: { street: string; district: string }) {
    const street = (props.street ?? '').trim();
    if (street.length < Address.MIN_STREET_LENGTH) throw new Error('validation.address-street-required');
    if (!Object.hasOwn(LIMA_DISTRICTS, props.district ?? '')) throw new Error('validation.address-district-invalid');
    this.#street = street;
    this.#district = props.district;
  }

  get street(): string {
    return this.#street;
  }

  get district(): string {
    return this.#district;
  }

  get location(): GeoLocation {
    return new GeoLocation(LIMA_DISTRICTS[this.#district]);
  }

  get fullAddress(): string {
    return `${this.#street}, ${this.#district}`;
  }

  equals(other: Address): boolean {
    return other.street.toLowerCase() === this.#street.toLowerCase() && other.district === this.#district;
  }
}
