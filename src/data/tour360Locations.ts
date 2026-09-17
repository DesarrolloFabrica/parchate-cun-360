import {
  getTour360ConfigById,
  getTour360ConfigThumbnail,
  KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  type Tour360Campus,
  type Tour360Location,
} from './tour360';

export type { Tour360Campus, Tour360Config, Tour360Location } from './tour360';

const buildCampus = (
  sedeNumber: number,
  title: string,
  marker?: Tour360Campus['marker'],
): Tour360Campus => {
  const tourConfigId = `bogota-sede-${sedeNumber}`;
  const config = getTour360ConfigById(tourConfigId);

  return {
    id: `sede-bogota-${sedeNumber}`,
    title,
    thumbnail: config ? getTour360ConfigThumbnail(config) : KNOWN_GOOD_PLACEHOLDER_PANORAMA,
    tourConfigId,
    marker,
  };
};

const buildTourCampus = (
  id: string,
  title: string,
  tourConfigId: string,
  marker?: Tour360Campus['marker'],
): Tour360Campus => {
  const config = getTour360ConfigById(tourConfigId);

  return {
    id,
    title,
    thumbnail: config ? getTour360ConfigThumbnail(config) : KNOWN_GOOD_PLACEHOLDER_PANORAMA,
    tourConfigId,
    marker,
  };
};

export const tourLocations: Tour360Location[] = [
  {
    id: 'bogota',
    department: 'Cundinamarca',
    city: 'Bogotá',
    label: 'Bogotá',
    marker: {
      x: 48,
      y: 42,
    },
    campuses: [
      // Solo sedes con recorrido 360 disponible.
      buildCampus(1, 'Sede A', { x: 44, y: 42 }),
      buildCampus(2, 'Sede F-G-H', { x: 54, y: 44 }),
    ],
  },
  {
    id: 'sincelejo',
    department: 'Sucre',
    city: 'Sincelejo',
    label: 'Sincelejo',
    marker: {
      x: 46,
      y: 16,
    },
    campuses: [
      buildTourCampus('sede-sincelejo-a', 'Sede Sincelejo A', 'sincelejo-sede-a', { x: 46, y: 16 }),
    ],
  },
  {
    id: 'monteria',
    department: 'Córdoba',
    city: 'Montería',
    label: 'Montería',
    marker: {
      x: 40,
      y: 20,
    },
    campuses: [
      buildTourCampus('sede-monteria-a', 'Sede Montería', 'monteria-sede-a', { x: 40, y: 20 }),
    ],
  },
  {
    id: 'santa-marta',
    department: 'Magdalena',
    city: 'Santa Marta',
    label: 'Santa Marta',
    marker: {
      x: 54,
      y: 7,
    },
    campuses: [
      buildTourCampus('sede-santa-marta-a', 'Sede Santa Marta', 'santa-marta-sede-a', { x: 54, y: 7 }),
    ],
  },
  {
    id: 'neiva',
    department: 'Huila',
    city: 'Neiva',
    label: 'Neiva',
    marker: {
      x: 43,
      y: 65,
    },
    campuses: [
      buildTourCampus('sede-neiva-a', 'Sede Neiva', 'neiva-sede-a', { x: 43, y: 65 }),
    ],
  },
];

export { getTour360ConfigById } from './tour360';
