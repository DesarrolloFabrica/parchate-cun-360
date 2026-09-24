import { cityMapPositions } from '../mapPositions';
import type { CityConfig } from '../../../types/sede';

export const bogotaCity: CityConfig = {
  id: 'bogota',
  name: 'Bogotá',
  shortName: 'Bogotá',
  region: 'Cundinamarca',
  mapPosition: cityMapPositions.bogota,
  campusIds: [
    'bogota-sede-a',
    'bogota-sede-fph',
    'bogota-sede-gi',
    'bogota-sede-e',
    'bogota-sede-j',
    'bogota-sede-d',
    'bogota-sede-c',
  ],
};
