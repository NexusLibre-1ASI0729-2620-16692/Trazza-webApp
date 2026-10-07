import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {FreightRequest} from '../domain/model/freight-request.entity';
import {FreightRequestResource, FreightRequestsResponse} from './freight-requests-response';
import {FreightRequestAssembler} from './freight-request-assembler';

export class FreightRequestsApiEndpoint extends BaseApiEndpoint<FreightRequest, FreightRequestResource, FreightRequestsResponse, typeof FreightRequestAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderFreightRequestsEndpointPath}`, FreightRequestAssembler);
  }
}
