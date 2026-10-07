import {CargoType} from './cargo-type.value-object';

export class Cargo {
  static readonly MAX_WEIGHT_KG = 30000;
  static readonly MAX_DESCRIPTION_LENGTH = 280;

  readonly #type: CargoType;
  readonly #weightKg: number;
  readonly #volumeM3: number;
  readonly #description: string;

  constructor(props: { type: CargoType; weightKg: number; volumeM3?: number; description?: string }) {
    if (!(props.type instanceof CargoType)) throw new Error('validation.cargo-type-invalid');
    const weight = Number(props.weightKg);
    const volume = Number(props.volumeM3 ?? 0);
    const description = props.description ?? '';
    if (!Number.isFinite(weight) || weight <= 0 || weight > Cargo.MAX_WEIGHT_KG) throw new Error('validation.cargo-weight-invalid');
    if (!Number.isFinite(volume) || volume < 0) throw new Error('validation.cargo-volume-invalid');
    if (description.length > Cargo.MAX_DESCRIPTION_LENGTH) throw new Error('validation.description-too-long');
    this.#type = props.type;
    this.#weightKg = weight;
    this.#volumeM3 = volume;
    this.#description = description.trim();
  }

  get type(): CargoType {
    return this.#type;
  }

  get weightKg(): number {
    return this.#weightKg;
  }

  get volumeM3(): number {
    return this.#volumeM3;
  }

  get description(): string {
    return this.#description;
  }
}
