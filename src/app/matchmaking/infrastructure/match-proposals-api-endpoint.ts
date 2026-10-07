import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {MatchProposal} from '../domain/model/match-proposal.entity';
import {MatchProposalResource, MatchProposalsResponse} from './match-proposals-response';
import {MatchProposalAssembler} from './match-proposal-assembler';

export class MatchProposalsApiEndpoint extends BaseApiEndpoint<MatchProposal, MatchProposalResource, MatchProposalsResponse, typeof MatchProposalAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderMatchProposalsEndpointPath}`, MatchProposalAssembler);
  }
}
