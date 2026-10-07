import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {MoneyResource} from '../../shared/infrastructure/shared-resources';

export interface MatchProposalResource extends BaseResource {
  id: number;
  freightRequestId: number;
  returnRouteId: number;
  carrierId: number;
  merchantId: number;
  initiatedBy: string;
  currentRate: MoneyResource;
  previousRate: MoneyResource | null;
  lastOfferBy: string;
  status: string;
  detour: { distanceKm: number; durationMinutes: number };
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MatchProposalsResponse extends BaseResponse {
  matchProposals: MatchProposalResource[];
}
