import {Address} from '../../../shared/domain/model/address.value-object';
import {Money} from '../../../shared/domain/model/money.value-object';
import {ReturnRoute} from '../model/return-route.entity';
import {FreightRequest} from '../model/freight-request.entity';
import {TimeWindow} from '../model/time-window.value-object';
import {CargoType} from '../model/cargo-type.value-object';
import {Cargo} from '../model/cargo.value-object';
import {RouteStatus} from '../model/route-status.value-object';
import {RequestStatus} from '../model/request-status.value-object';
import {RouteMatchingService} from './route-matching.service';

describe('RouteMatchingService', () => {
  const route = new ReturnRoute({
    id: 1,
    carrierId: 1,
    vehicleId: 1,
    origin: new Address({ street: 'Av. Industrial 120', district: 'Lurín' }),
    destination: new Address({ street: 'Av. Carlos Izaguirre 455', district: 'Los Olivos' }),
    departureDate: '2026-10-08',
    timeWindow: new TimeWindow({ start: '16:00', end: '18:00' }),
    availableWeightKg: 1200,
    availableVolumeM3: 6,
    maxDetourKm: 15,
    acceptedCargoTypes: [new CargoType('food'), new CargoType('general')],
    status: new RouteStatus('active')
  });

  const requestWith = (weightKg: number, cargoType: string): FreightRequest => new FreightRequest({
    id: 3,
    code: 'LD-1044',
    merchantId: 5,
    pickup: new Address({ street: 'Av. Tomás Marsano 2500', district: 'Surquillo' }),
    delivery: new Address({ street: 'Av. Tupac Amaru 1200', district: 'Independencia' }),
    pickupDate: '2026-10-08',
    pickupWindow: new TimeWindow({ start: '16:15', end: '16:45' }),
    cargo: new Cargo({ type: new CargoType(cargoType), weightKg, volumeM3: 1 }),
    offeredRate: new Money({ amount: 90 }),
    status: new RequestStatus('open')
  });

  it('accepts a compatible load on the way back', () => {
    const evaluation = RouteMatchingService.evaluate(route, requestWith(120, 'food'));
    expect(evaluation.compatible).toBeTrue();
    expect(evaluation.detour.distanceKm).toBeLessThan(15);
  });

  it('rejects loads above the free capacity', () => {
    expect(RouteMatchingService.evaluate(route, requestWith(2000, 'food')).reasons).toContain('matching.capacity');
  });

  it('rejects cargo types the carrier does not accept', () => {
    expect(RouteMatchingService.evaluate(route, requestWith(120, 'electronics')).reasons).toContain('matching.cargo-type');
  });
});
