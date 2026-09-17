import { createComingSoonCampus } from './shared';
import type { CampusConfig } from '../../../types/sede';

export const ibagueCampus = createComingSoonCampus(
  'ibague-campus',
  'ibague',
  'Sede Ibagué — Tolima',
  'Ibagué',
);

export const medellinCampus = createComingSoonCampus(
  'medellin-campus',
  'medellin',
  'Sede Medellín — Antioquia',
  'Medellín',
);

export const monteriaCampus = createComingSoonCampus(
  'monteria-campus',
  'monteria',
  'Sede Montería — Córdoba',
  'Montería',
);

export const neivaCampus = createComingSoonCampus(
  'neiva-campus',
  'neiva',
  'Sede Neiva — Huila',
  'Neiva',
);

export const santaMartaCampus = createComingSoonCampus(
  'santa-marta-campus',
  'santa-marta',
  'Sede Santa Marta — Magdalena',
  'Santa Marta',
);

export const sincelejoCampus = createComingSoonCampus(
  'sincelejo-campus',
  'sincelejo',
  'Sede Sincelejo — Sucre',
  'Sincelejo',
);

export const barranquillaCampus = createComingSoonCampus(
  'barranquilla-campus',
  'barranquilla',
  'Sede Barranquilla — Atlántico',
  'Barranquilla',
);

export const otherCityCampuses: CampusConfig[] = [
  ibagueCampus,
  medellinCampus,
  monteriaCampus,
  neivaCampus,
  santaMartaCampus,
  sincelejoCampus,
  barranquillaCampus,
];
