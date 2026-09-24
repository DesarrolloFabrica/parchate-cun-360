import { createComingSoonCampus } from './shared';
import { bogotaSedeACampus } from './bogota-sede-a';
import type { CampusConfig } from '../../../types/sede';

export const bogotaSedeFphCampus = createComingSoonCampus(
  'bogota-sede-fph',
  'bogota',
  'Sede F-P-H / Bellas Artes — Bogotá',
  'Sede F-P-H',
);

export const bogotaSedeGiCampus = createComingSoonCampus(
  'bogota-sede-gi',
  'bogota',
  'Sede G-I — Bogotá',
  'Sede G-I',
);

export const bogotaSedeECampus = createComingSoonCampus(
  'bogota-sede-e',
  'bogota',
  'Sede E — Bogotá',
  'Sede E',
);

export const bogotaSedeJCampus = createComingSoonCampus(
  'bogota-sede-j',
  'bogota',
  'Sede J — Bogotá',
  'Sede J',
);

export const bogotaSedeDCampus = createComingSoonCampus(
  'bogota-sede-d',
  'bogota',
  'Sede D — Bogotá',
  'Sede D',
);

export const bogotaSedeCCampus = createComingSoonCampus(
  'bogota-sede-c',
  'bogota',
  'Sede C — Bogotá',
  'Sede C',
);

export const bogotaCampuses: CampusConfig[] = [
  bogotaSedeACampus,
  bogotaSedeFphCampus,
  bogotaSedeGiCampus,
  bogotaSedeECampus,
  bogotaSedeJCampus,
  bogotaSedeDCampus,
  bogotaSedeCCampus,
];
