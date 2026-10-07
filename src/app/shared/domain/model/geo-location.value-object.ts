export class GeoLocation {
  static readonly EARTH_RADIUS_KM = 6371;

  readonly #latitude: number;
  readonly #longitude: number;

  constructor(props: { latitude: number; longitude: number }) {
    const latitude = Number(props.latitude);
    const longitude = Number(props.longitude);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) throw new Error('validation.latitude-invalid');
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error('validation.longitude-invalid');
    this.#latitude = latitude;
    this.#longitude = longitude;
  }

  get latitude(): number {
    return this.#latitude;
  }

  get longitude(): number {
    return this.#longitude;
  }

  distanceTo(other: GeoLocation): number {
    const toRadians = (degrees: number): number => degrees * Math.PI / 180;
    const deltaLat = toRadians(other.latitude - this.#latitude);
    const deltaLng = toRadians(other.longitude - this.#longitude);
    const a = Math.sin(deltaLat / 2) ** 2
      + Math.cos(toRadians(this.#latitude)) * Math.cos(toRadians(other.latitude)) * Math.sin(deltaLng / 2) ** 2;
    return 2 * GeoLocation.EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  moveTowards(target: GeoLocation, fraction: number): GeoLocation {
    const ratio = Math.min(Math.max(fraction, 0), 1);
    return new GeoLocation({
      latitude: this.#latitude + (target.latitude - this.#latitude) * ratio,
      longitude: this.#longitude + (target.longitude - this.#longitude) * ratio
    });
  }

  distanceToSegment(start: GeoLocation, end: GeoLocation): number {
    const kmPerDegree = 111.32;
    const cosLat = Math.cos(this.#latitude * Math.PI / 180);
    const project = (location: GeoLocation): { x: number; y: number } => ({
      x: location.longitude * kmPerDegree * cosLat,
      y: location.latitude * kmPerDegree
    });
    const p = project(this);
    const a = project(start);
    const b = project(end);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared === 0 ? 0 : Math.min(Math.max(((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared, 0), 1);
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  }

  equals(other: GeoLocation): boolean {
    return other.latitude === this.#latitude && other.longitude === this.#longitude;
  }
}
