import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {AddressResource} from '../../shared/infrastructure/shared-resources';

export interface ReturnRouteResource extends BaseResource {
  id: number;
  carrierId: number;
  vehicleId: number;
  vehicleLabel: string;
  origin: AddressResource;
  destination: AddressResource;
  departureDate: string;
  timeWindow: { start: string; end: string };
  availableWeightKg: number;
  availableVolumeM3: number;
  maxDetourKm: number;
  acceptedCargoTypes: string[];
  status: string;
  distanceKm: number;
  durationMinutes: number;
  createdAt: string | null;
}

export interface ReturnRoutesResponse extends BaseResponse {
  returnRoutes: ReturnRouteResource[];
}
