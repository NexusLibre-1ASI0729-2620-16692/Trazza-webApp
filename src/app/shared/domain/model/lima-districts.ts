export interface DistrictCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export const LIMA_DISTRICTS: Readonly<Record<string, DistrictCoordinates>> = Object.freeze({
  'Ate': { latitude: -12.0256, longitude: -76.918 },
  'Barranco': { latitude: -12.149, longitude: -77.021 },
  'Bellavista': { latitude: -12.06, longitude: -77.11 },
  'Breña': { latitude: -12.06, longitude: -77.05 },
  'Callao': { latitude: -12.0566, longitude: -77.1181 },
  'Carabayllo': { latitude: -11.85, longitude: -77.03 },
  'Chorrillos': { latitude: -12.17, longitude: -77.02 },
  'Chosica': { latitude: -11.94, longitude: -76.7 },
  'Comas': { latitude: -11.9333, longitude: -77.05 },
  'El Agustino': { latitude: -12.045, longitude: -76.995 },
  'Independencia': { latitude: -11.99, longitude: -77.05 },
  'Jesús María': { latitude: -12.077, longitude: -77.049 },
  'La Molina': { latitude: -12.08, longitude: -76.93 },
  'La Victoria': { latitude: -12.07, longitude: -77.017 },
  'Lima': { latitude: -12.0464, longitude: -77.0428 },
  'Lince': { latitude: -12.085, longitude: -77.036 },
  'Los Olivos': { latitude: -11.97, longitude: -77.07 },
  'Lurín': { latitude: -12.2747, longitude: -76.8706 },
  'Magdalena del Mar': { latitude: -12.091, longitude: -77.07 },
  'Miraflores': { latitude: -12.1211, longitude: -77.0297 },
  'Pachacámac': { latitude: -12.23, longitude: -76.86 },
  'Pueblo Libre': { latitude: -12.075, longitude: -77.063 },
  'Puente Piedra': { latitude: -11.865, longitude: -77.075 },
  'Rímac': { latitude: -12.03, longitude: -77.03 },
  'San Borja': { latitude: -12.1, longitude: -77.0 },
  'San Isidro': { latitude: -12.097, longitude: -77.036 },
  'San Juan de Lurigancho': { latitude: -11.98, longitude: -77.0 },
  'San Juan de Miraflores': { latitude: -12.155, longitude: -76.97 },
  'San Martín de Porres': { latitude: -12.005, longitude: -77.08 },
  'San Miguel': { latitude: -12.077, longitude: -77.09 },
  'Santa Anita': { latitude: -12.043, longitude: -76.971 },
  'Santiago de Surco': { latitude: -12.145, longitude: -76.99 },
  'Surquillo': { latitude: -12.113, longitude: -77.02 },
  'Ventanilla': { latitude: -11.875, longitude: -77.13 },
  'Villa El Salvador': { latitude: -12.213, longitude: -76.936 },
  'Villa María del Triunfo': { latitude: -12.16, longitude: -76.94 }
});

export const DISTRICT_NAMES: readonly string[] = Object.freeze(Object.keys(LIMA_DISTRICTS).sort((a, b) => a.localeCompare(b)));
