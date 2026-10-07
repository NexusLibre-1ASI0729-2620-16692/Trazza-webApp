export type CargoTypeValue = 'general' | 'textiles' | 'food' | 'fragile' | 'hardware' | 'electronics';

export class CargoType {
  static readonly VALUES: readonly CargoTypeValue[] = Object.freeze(['general', 'textiles', 'food', 'fragile', 'hardware', 'electronics']);

  readonly #value: CargoTypeValue;

  constructor(value: string) {
    if (!CargoType.VALUES.includes(value as CargoTypeValue)) throw new Error('validation.cargo-type-invalid');
    this.#value = value as CargoTypeValue;
  }

  get value(): CargoTypeValue {
    return this.#value;
  }

  equals(other: CargoType): boolean {
    return other.value === this.#value;
  }
}
