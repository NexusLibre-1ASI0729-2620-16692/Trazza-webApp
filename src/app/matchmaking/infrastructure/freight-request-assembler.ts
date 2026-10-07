import {FreightRequest} from '../domain/model/freight-request.entity';
import {TimeWindow} from '../domain/model/time-window.value-object';
import {Cargo} from '../domain/model/cargo.value-object';
import {CargoType} from '../domain/model/cargo-type.value-object';
import {RequestStatus} from '../domain/model/request-status.value-object';
import {SharedAssembler} from '../../shared/infrastructure/shared-assembler';
import {FreightRequestResource, FreightRequestsResponse} from './freight-requests-response';

export class FreightRequestAssembler {
  static toEntityFromResource(resource: FreightRequestResource): FreightRequest {
    return new FreightRequest({
      id: resource.id,
      code: resource.code,
      merchantId: resource.merchantId,
      pickup: SharedAssembler.toAddress(resource.pickup),
      delivery: SharedAssembler.toAddress(resource.delivery),
      pickupDate: resource.pickupDate,
      pickupWindow: new TimeWindow(resource.pickupWindow),
      cargo: new Cargo({
        type: new CargoType(resource.cargo.type),
        weightKg: resource.cargo.weightKg,
        volumeM3: resource.cargo.volumeM3,
        description: resource.cargo.description
      }),
      offeredRate: resource.offeredRate ? SharedAssembler.toMoney(resource.offeredRate) : null,
      status: new RequestStatus(resource.status),
      distanceKm: resource.distanceKm,
      createdAt: resource.createdAt
    });
  }

  static toEntitiesFromResponse(response: FreightRequestsResponse): FreightRequest[] {
    return response.freightRequests.map(resource => FreightRequestAssembler.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: FreightRequest): FreightRequestResource {
    return {
      id: entity.id,
      code: entity.code,
      merchantId: entity.merchantId,
      pickup: SharedAssembler.toAddressResource(entity.pickup),
      delivery: SharedAssembler.toAddressResource(entity.delivery),
      pickupDate: entity.pickupDate,
      pickupWindow: { start: entity.pickupWindow.start, end: entity.pickupWindow.end },
      cargo: {
        type: entity.cargo.type.value,
        weightKg: entity.cargo.weightKg,
        volumeM3: entity.cargo.volumeM3,
        description: entity.cargo.description
      },
      offeredRate: entity.offeredRate ? SharedAssembler.toMoneyResource(entity.offeredRate) : null,
      status: entity.status.value,
      distanceKm: entity.distanceKm,
      createdAt: entity.createdAt
    };
  }

  static clone(entity: FreightRequest): FreightRequest {
    return FreightRequestAssembler.toEntityFromResource(FreightRequestAssembler.toResourceFromEntity(entity));
  }
}
