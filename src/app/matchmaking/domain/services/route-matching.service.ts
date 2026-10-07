import {Address} from '../../../shared/domain/model/address.value-object';
import {Detour} from '../model/detour.value-object';
import {ReturnRoute} from '../model/return-route.entity';
import {FreightRequest} from '../model/freight-request.entity';

export interface TripEstimation {
  distanceKm: number;
  durationMinutes: number;
}

export interface MatchEvaluation {
  compatible: boolean;
  reasons: string[];
  detour: Detour;
}

export class RouteMatchingService {
  static readonly ROAD_FACTOR = 1.3;
  static readonly AVERAGE_SPEED_KMH = 30;

  static roadDistance(from: Address, to: Address): number {
    return from.location.distanceTo(to.location) * RouteMatchingService.ROAD_FACTOR;
  }

  static estimateTrip(from: Address, to: Address): TripEstimation {
    const distanceKm = Math.round(RouteMatchingService.roadDistance(from, to) * 10) / 10;
    return { distanceKm, durationMinutes: Math.round(distanceKm / RouteMatchingService.AVERAGE_SPEED_KMH * 60) };
  }

  static calculateDetour(route: ReturnRoute, request: FreightRequest): Detour {
    const direct = RouteMatchingService.roadDistance(route.origin, route.destination);
    const viaLoad = RouteMatchingService.roadDistance(route.origin, request.pickup)
      + RouteMatchingService.roadDistance(request.pickup, request.delivery)
      + RouteMatchingService.roadDistance(request.delivery, route.destination);
    const distanceKm = Math.max(0, viaLoad - direct);
    return new Detour({ distanceKm, durationMinutes: distanceKm / RouteMatchingService.AVERAGE_SPEED_KMH * 60 });
  }

  static evaluate(route: ReturnRoute, request: FreightRequest, options: { maxDetourKm?: number } = {}): MatchEvaluation {
    const detour = RouteMatchingService.calculateDetour(route, request);
    const maxDetourKm = options.maxDetourKm ?? route.maxDetourKm;
    const reasons: string[] = [];
    if (!route.status.isActive) reasons.push('matching.route-not-active');
    if (!request.status.isOpen) reasons.push('matching.request-not-open');
    if (route.departureDate !== request.pickupDate) reasons.push('matching.different-date');
    if (!route.timeWindow.overlaps(request.pickupWindow)) reasons.push('matching.time-window');
    if (!route.accepts(request.cargo.type)) reasons.push('matching.cargo-type');
    if (!route.canCarry(request.cargo.weightKg, request.cargo.volumeM3)) reasons.push('matching.capacity');
    if (!detour.isWithin(maxDetourKm)) reasons.push('matching.detour');
    return { compatible: reasons.length === 0, reasons, detour };
  }
}
