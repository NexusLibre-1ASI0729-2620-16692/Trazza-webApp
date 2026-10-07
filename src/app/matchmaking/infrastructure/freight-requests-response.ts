import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {AddressResource, MoneyResource} from '../../shared/infrastructure/shared-resources';

export interface CargoResource {
  type: string;
  weightKg: number;
  volumeM3: number;
  description: string;
}

export interface FreightRequestResource extends BaseResource {
  id: number;
  code: string;
  merchantId: number;
  pickup: AddressResource;
  delivery: AddressResource;
  pickupDate: string;
  pickupWindow: { start: string; end: string };
  cargo: CargoResource;
  offeredRate: MoneyResource | null;
  status: string;
  distanceKm: number;
  createdAt: string | null;
}

export interface FreightRequestsResponse extends BaseResponse {
  freightRequests: FreightRequestResource[];
}
