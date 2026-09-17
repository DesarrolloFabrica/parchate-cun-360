import { cityMapPositions } from '../mapPositions';
import type { CityConfig } from '../../../types/sede';

export const ibagueCity: CityConfig = {
  id: 'ibague',
  name: 'Ibagué',
  shortName: 'Ibagué',
  region: 'Tolima',
  mapPosition: cityMapPositions.ibague,
  campusIds: ['ibague-campus'],
};

export const medellinCity: CityConfig = {
  id: 'medellin',
  name: 'Medellín',
  shortName: 'Medellín',
  region: 'Antioquia',
  mapPosition: cityMapPositions.medellin,
  campusIds: ['medellin-campus'],
};

export const monteriaCity: CityConfig = {
  id: 'monteria',
  name: 'Montería',
  shortName: 'Montería',
  region: 'Córdoba',
  mapPosition: cityMapPositions.monteria,
  campusIds: ['monteria-campus'],
};

export const neivaCity: CityConfig = {
  id: 'neiva',
  name: 'Neiva',
  shortName: 'Neiva',
  region: 'Huila',
  mapPosition: cityMapPositions.neiva,
  campusIds: ['neiva-campus'],
};

export const santaMartaCity: CityConfig = {
  id: 'santa-marta',
  name: 'Santa Marta',
  shortName: 'Santa Marta',
  region: 'Magdalena',
  mapPosition: cityMapPositions['santa-marta'],
  campusIds: ['santa-marta-campus'],
};

export const sincelejoCity: CityConfig = {
  id: 'sincelejo',
  name: 'Sincelejo',
  shortName: 'Sincelejo',
  region: 'Sucre',
  mapPosition: cityMapPositions.sincelejo,
  campusIds: ['sincelejo-campus'],
};

export const barranquillaCity: CityConfig = {
  id: 'barranquilla',
  name: 'Barranquilla',
  shortName: 'Barranquilla',
  region: 'Atlántico',
  mapPosition: cityMapPositions.barranquilla,
  campusIds: ['barranquilla-campus'],
};
