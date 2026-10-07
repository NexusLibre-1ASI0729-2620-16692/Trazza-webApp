import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {ReturnRoute} from '../domain/model/return-route.entity';
import {ReturnRouteResource, ReturnRoutesResponse} from './return-routes-response';
import {ReturnRouteAssembler} from './return-route-assembler';

export class ReturnRoutesApiEndpoint extends BaseApiEndpoint<ReturnRoute, ReturnRouteResource, ReturnRoutesResponse, typeof ReturnRouteAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderReturnRoutesEndpointPath}`, ReturnRouteAssembler);
  }
}
