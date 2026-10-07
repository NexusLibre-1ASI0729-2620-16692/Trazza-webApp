export class Detour {
  readonly #distanceKm: number;
  readonly #durationMinutes: number;

  constructor(props: { distanceKm: number; durationMinutes: number }) {
    const distance = Number(props.distanceKm);
    const duration = Number(props.durationMinutes);
    if (!Number.isFinite(distance) || distance < 0) throw new Error('validation.detour-invalid');
    if (!Number.isFinite(duration) || duration < 0) throw new Error('validation.detour-invalid');
    this.#distanceKm = Math.round(distance * 10) / 10;
    this.#durationMinutes = Math.round(duration);
  }

  get distanceKm(): number {
    return this.#distanceKm;
  }

  get durationMinutes(): number {
    return this.#durationMinutes;
  }

  get label(): string {
    return `+${this.#distanceKm} km (+${this.#durationMinutes} min)`;
  }

  isWithin(maxDistanceKm: number): boolean {
    return this.#distanceKm <= maxDistanceKm;
  }
}
