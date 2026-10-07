import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {ReturnRoute} from '../domain/model/return-route.entity';
import {FreightRequest} from '../domain/model/freight-request.entity';
import {MatchProposal} from '../domain/model/match-proposal.entity';
import {ReturnRoutesApiEndpoint} from './return-routes-api-endpoint';
import {FreightRequestsApiEndpoint} from './freight-requests-api-endpoint';
import {MatchProposalsApiEndpoint} from './match-proposals-api-endpoint';

@Injectable({providedIn: 'root'})
export class MatchmakingApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly returnRoutesEndpoint = new ReturnRoutesApiEndpoint(this.http);
  private readonly freightRequestsEndpoint = new FreightRequestsApiEndpoint(this.http);
  private readonly matchProposalsEndpoint = new MatchProposalsApiEndpoint(this.http);

  getReturnRoutes = (): Observable<ReturnRoute[]> =>
    this.returnRoutesEndpoint.getAll();

  createReturnRoute = (route: ReturnRoute): Observable<ReturnRoute> =>
    this.returnRoutesEndpoint.create(route);

  updateReturnRoute = (route: ReturnRoute): Observable<ReturnRoute> =>
    this.returnRoutesEndpoint.update(route, route.id);

  getFreightRequests = (): Observable<FreightRequest[]> =>
    this.freightRequestsEndpoint.getAll();

  createFreightRequest = (request: FreightRequest): Observable<FreightRequest> =>
    this.freightRequestsEndpoint.create(request);

  updateFreightRequest = (request: FreightRequest): Observable<FreightRequest> =>
    this.freightRequestsEndpoint.update(request, request.id);

  getMatchProposals = (): Observable<MatchProposal[]> =>
    this.matchProposalsEndpoint.getAll();

  createMatchProposal = (proposal: MatchProposal): Observable<MatchProposal> =>
    this.matchProposalsEndpoint.create(proposal);

  updateMatchProposal = (proposal: MatchProposal): Observable<MatchProposal> =>
    this.matchProposalsEndpoint.update(proposal, proposal.id);
}
