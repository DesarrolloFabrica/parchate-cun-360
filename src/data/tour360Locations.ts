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
): Tour360Campus => {
  const tourConfigId = `bogota-sede-${sedeNumber}`;
  const config = getTour360ConfigById(tourConfigId);

  return {
    id: `sede-bogota-${sedeNumber}`,
    title,
    thumbnail: config ? getTour360ConfigThumbnail(config) : KNOWN_GOOD_PLACEHOLDER_PANORAMA,
    tourConfigId,
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
      buildCampus(1, 'Sede Bogotá 1'),
      buildCampus(2, 'Sede Bogotá 2'),
      buildCampus(3, 'Sede Bogotá 3'),
      buildCampus(4, 'Sede Bogotá 4'),
      buildCampus(5, 'Sede Bogotá 5'),
      buildCampus(6, 'Sede Bogotá 6'),
      buildCampus(7, 'Sede Bogotá 7'),
      buildCampus(8, 'Sede Bogotá 8'),
    ],
  },
];

export { getTour360ConfigById } from './tour360';
