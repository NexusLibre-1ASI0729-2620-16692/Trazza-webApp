import { Dni } from './dni.value-object';
import { Phone } from './phone.value-object';
import { Vehicle } from './vehicle.entity';

export interface CarrierProfileParams {
  id?: number | null;
  userId: number;
  fullName: string;
  dni: Dni;
  phone: Phone;
  verified?: boolean;
  vehicles?: Vehicle[];
}

export class CarrierProfile {
  private _id: number | null;
  private _userId: number;
  private _fullName: string;
  private _dni: Dni;
  private _phone: Phone;
  private _verified: boolean;
  private _vehicles: Vehicle[];

  constructor(params: CarrierProfileParams) {
    if (!(params.dni instanceof Dni)) throw new Error('validation.dni-invalid');
    if (!(params.phone instanceof Phone)) throw new Error('validation.phone-invalid');

    this._id = params.id ?? null;
    this._userId = params.userId;
    this._fullName = params.fullName.trim();
    this._dni = params.dni;
    this._phone = params.phone;
    this._verified = params.verified ?? false;
    this._vehicles = params.vehicles ?? [];
  }

  get id(): number | null { return this._id; }
  get userId(): number { return this._userId; }
  get fullName(): string { return this._fullName; }
  get dni(): Dni { return this._dni; }
  get phone(): Phone { return this._phone; }
  get verified(): boolean { return this._verified; }
  get vehicles(): Vehicle[] { return this._vehicles; }
}