import {Address} from '../domain/model/address.value-object';
import {Money} from '../domain/model/money.value-object';
import {GeoLocation} from '../domain/model/geo-location.value-object';
import {AddressResource, GeoLocationResource, MoneyResource} from './shared-resources';

export class SharedAssembler {
  static toAddress(resource: AddressResource): Address {
    return new Address({ street: resource.street, district: resource.district });
  }

  static toAddressResource(address: Address): AddressResource {
    return { street: address.street, district: address.district };
  }

  static toMoney(resource: MoneyResource): Money {
    return new Money({ amount: resource.amount, currency: resource.currency });
  }

  static toMoneyResource(money: Money): MoneyResource {
    return { amount: money.amount, currency: money.currency };
  }

  static toGeoLocation(resource: GeoLocationResource): GeoLocation {
    return new GeoLocation({ latitude: resource.latitude, longitude: resource.longitude });
  }

  static toGeoLocationResource(location: GeoLocation): GeoLocationResource {
    return { latitude: location.latitude, longitude: location.longitude };
  }
}
