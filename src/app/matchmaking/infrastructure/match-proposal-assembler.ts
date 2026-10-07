import {MatchProposal} from '../domain/model/match-proposal.entity';
import {ProposalStatus} from '../domain/model/proposal-status.value-object';
import {Detour} from '../domain/model/detour.value-object';
import {SharedAssembler} from '../../shared/infrastructure/shared-assembler';
import {MatchProposalResource, MatchProposalsResponse} from './match-proposals-response';

export class MatchProposalAssembler {
  static toEntityFromResource(resource: MatchProposalResource): MatchProposal {
    return new MatchProposal({
      id: resource.id,
      freightRequestId: resource.freightRequestId,
      returnRouteId: resource.returnRouteId,
      carrierId: resource.carrierId,
      merchantId: resource.merchantId,
      initiatedBy: resource.initiatedBy,
      currentRate: SharedAssembler.toMoney(resource.currentRate),
      previousRate: resource.previousRate ? SharedAssembler.toMoney(resource.previousRate) : null,
      lastOfferBy: resource.lastOfferBy,
      status: new ProposalStatus(resource.status),
      detour: new Detour(resource.detour),
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt
    });
  }

  static toEntitiesFromResponse(response: MatchProposalsResponse): MatchProposal[] {
    return response.matchProposals.map(resource => MatchProposalAssembler.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: MatchProposal): MatchProposalResource {
    return {
      id: entity.id,
      freightRequestId: entity.freightRequestId,
      returnRouteId: entity.returnRouteId,
      carrierId: entity.carrierId,
      merchantId: entity.merchantId,
      initiatedBy: entity.initiatedBy,
      currentRate: SharedAssembler.toMoneyResource(entity.currentRate),
      previousRate: entity.previousRate ? SharedAssembler.toMoneyResource(entity.previousRate) : null,
      lastOfferBy: entity.lastOfferBy,
      status: entity.status.value,
      detour: { distanceKm: entity.detour.distanceKm, durationMinutes: entity.detour.durationMinutes },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  static clone(entity: MatchProposal): MatchProposal {
    return MatchProposalAssembler.toEntityFromResource(MatchProposalAssembler.toResourceFromEntity(entity));
  }
}
