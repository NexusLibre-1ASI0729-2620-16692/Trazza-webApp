import {ReturnRoute} from '../domain/model/return-route.entity';
import {TimeWindow} from '../domain/model/time-window.value-object';
import {CargoType} from '../domain/model/cargo-type.value-object';
import {RouteStatus} from '../domain/model/route-status.value-object';
import {SharedAssembler} from '../../shared/infrastructure/shared-assembler';
import {ReturnRouteResource, ReturnRoutesResponse} from './return-routes-response';

export class ReturnRouteAssembler {
  static toEntityFromResource(resource: ReturnRouteResource): ReturnRoute {
    return new ReturnRoute({
      id: resource.id,
      carrierId: resource.carrierId,
      vehicleId: resource.vehicleId,
      vehicleLabel: resource.vehicleLabel,
      origin: SharedAssembler.toAddress(resource.origin),
      destination: SharedAssembler.toAddress(resource.destination),
      departureDate: resource.departureDate,
      timeWindow: new TimeWindow(resource.timeWindow),
      availableWeightKg: resource.availableWeightKg,
      availableVolumeM3: resource.availableVolumeM3,
      maxDetourKm: resource.maxDetourKm,
      acceptedCargoTypes: resource.acceptedCargoTypes.map(type => new CargoType(type)),
      status: new RouteStatus(resource.status),
      distanceKm: resource.distanceKm,
      durationMinutes: resource.durationMinutes,
      createdAt: resource.createdAt
    });
  }

  static toEntitiesFromResponse(response: ReturnRoutesResponse): ReturnRoute[] {
    return response.returnRoutes.map(resource => ReturnRouteAssembler.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: ReturnRoute): ReturnRouteResource {
    return {
      id: entity.id,
      carrierId: entity.carrierId,
      vehicleId: entity.vehicleId,
      vehicleLabel: entity.vehicleLabel,
      origin: SharedAssembler.toAddressResource(entity.origin),
      destination: SharedAssembler.toAddressResource(entity.destination),
      departureDate: entity.departureDate,
      timeWindow: { start: entity.timeWindow.start, end: entity.timeWindow.end },
      availableWeightKg: entity.availableWeightKg,
      availableVolumeM3: entity.availableVolumeM3,
      maxDetourKm: entity.maxDetourKm,
      acceptedCargoTypes: entity.acceptedCargoTypes.map(type => type.value),
      status: entity.status.value,
      distanceKm: entity.distanceKm,
      durationMinutes: entity.durationMinutes,
      createdAt: entity.createdAt
    };
  }

  static clone(entity: ReturnRoute): ReturnRoute {
    return ReturnRouteAssembler.toEntityFromResource(ReturnRouteAssembler.toResourceFromEntity(entity));
  }
}
