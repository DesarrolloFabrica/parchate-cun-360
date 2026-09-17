import { getPublicPanoramaUrl } from '../panoramaUrls';
import type { GpsPosition, Tour360Config, Tour360Link, Tour360Node } from '../types';

const sedeFphPanoramaPath = (fileName: string) => getPublicPanoramaUrl(`Sede_FPH_optimized/${fileName}`);

const InicioSf = sedeFphPanoramaPath('1-InicioSf.jpg');
const LlegadaSf = sedeFphPanoramaPath('2-LlegadaSf.jpg');
const EntradaSf = sedeFphPanoramaPath('3-EntradaSf.jpg');
const EntradaSedeSf = sedeFphPanoramaPath('4-entrada-sedeSf.jpg');
const PatioSf = sedeFphPanoramaPath('4-patio.jpg');
const ZonaVerdeSf = sedeFphPanoramaPath('5-zonaverde.jpg');
const DoceSSf = sedeFphPanoramaPath('6-12S.jpg');
const TreceSSf = sedeFphPanoramaPath('7-13S.jpg');

const inicioSfGps: GpsPosition = [-74.08228, 4.648, 0];
const llegadaSfGps: GpsPosition = [-74.08218, 4.64804, 0];
const entradaSfGps: GpsPosition = [-74.08208, 4.64808, 0];
const entradaSedeSfGps: GpsPosition = [-74.08198, 4.64812, 0];
const patioSfGps: GpsPosition = [-74.08188, 4.64816, 0];
const zonaVerdeSfGps: GpsPosition = [-74.08178, 4.6482, 0];
const doceSSfGps: GpsPosition = [-74.08168, 4.64824, 0];
const treceSSfGps: GpsPosition = [-74.08158, 4.64828, 0];

const inicioNextArrowGps: GpsPosition = [-74.08214, 4.64806, 0];
const llegadaBackArrowGps: GpsPosition = [-74.08232, 4.64799, 0];
const llegadaNextArrowGps: GpsPosition = [-74.08203, 4.6481, 0];
const entradaBackArrowGps: GpsPosition = [-74.0822, 4.64803, 0];
const entradaNextArrowGps: GpsPosition = [-74.08193, 4.64815, 0];
const entradaSedeBackArrowGps: GpsPosition = [-74.08207, 4.64807, 0];
const entradaSedeNextArrowGps: GpsPosition = [-74.08182, 4.6482, 0];
const patioBackArrowGps: GpsPosition = [-74.08199, 4.64811, 0];
const patioNextArrowGps: GpsPosition = [-74.08172, 4.64824, 0];
const zonaVerdeBackArrowGps: GpsPosition = [-74.0819, 4.64815, 0];
const zonaVerdeNextArrowGps: GpsPosition = [-74.08162, 4.64828, 0];
const doceSBackArrowGps: GpsPosition = [-74.0818, 4.64819, 0];
const doceSNextArrowGps: GpsPosition = [-74.08152, 4.64832, 0];
const treceSBackArrowGps: GpsPosition = [-74.08172, 4.64823, 0];

export const BOGOTA_SEDE_2_START_NODE_ID = '1-InicioSf';

type TourLinkInput = {
  from: string;
  to: string;
  targetGps: GpsPosition;
  targetImage: string;
  label: string;
  tooltipTitle: string;
  direction: 'forward' | 'back';
  styleVariant: 'floor-arrow' | 'three-d-arrow';
  rotationDeg: number;
  scale?: number;
};

const createTourLink = ({
  from,
  to,
  targetGps,
  targetImage,
  label,
  tooltipTitle,
  direction,
  styleVariant,
  rotationDeg,
  scale = 1,
}: TourLinkInput): Tour360Link => ({
  nodeId: to,
  gps: targetGps,
  data: {
    id: `${from}-to-${to}`,
    originSceneId: from,
    destinationSceneId: to,
    label,
    visibleText: label,
    tooltipTitle,
    tooltipImage: targetImage,
    rotationDeg,
    scale,
    direction,
    styleVariant,
  },
});

export const bogotaSede2Nodes: Tour360Node[] = [
  {
    id: '1-InicioSf',
    panorama: InicioSf,
    thumbnail: InicioSf,
    name: 'Sede F-G-H',
    caption: 'Inicio del recorrido',
    description: 'Punto inicial del recorrido 360 de la Sede F-G-H.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: inicioSfGps,
    links: [
      createTourLink({
        from: '1-InicioSf',
        to: '2-LlegadaSf',
        targetGps: inicioNextArrowGps,
        targetImage: LlegadaSf,
        label: 'Avanzar',
        tooltipTitle: 'Avanzar a llegada de sede',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  },
  {
    id: '2-LlegadaSf',
    panorama: LlegadaSf,
    thumbnail: LlegadaSf,
    name: 'Llegada Sede F-G-H',
    caption: 'Llegada a la sede',
    description: 'Llegada exterior para continuar hacia la entrada.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: llegadaSfGps,
    links: [
      createTourLink({
        from: '2-LlegadaSf',
        to: '1-InicioSf',
        targetGps: llegadaBackArrowGps,
        targetImage: InicioSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar al inicio',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 180,
        scale: 1,
      }),
      createTourLink({
        from: '2-LlegadaSf',
        to: '3-EntradaSf',
        targetGps: llegadaNextArrowGps,
        targetImage: EntradaSf,
        label: 'Avanzar',
        tooltipTitle: 'Avanzar a entrada exterior',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 180,
      }),
    ],
  },
  { //3ER ENTRADA 
    id: '3-EntradaSf',
    panorama: EntradaSf,
    thumbnail: EntradaSf,
    name: 'Entrada Sede F-G-H',
    caption: 'Entrada exterior',
    description: 'Acceso exterior antes de ingresar a la sede.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaSfGps,
    links: [
      createTourLink({
        from: '3-EntradaSf',
        to: '4-entrada-sedeSf',
        targetGps: entradaBackArrowGps,
        targetImage: EntradaSedeSf,
        label: 'Entrar a la sede',
        tooltipTitle: 'Ingresar a la sede',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '3-EntradaSf',
        to: '2-LlegadaSf',
        targetGps: entradaNextArrowGps,
        targetImage: LlegadaSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar a llegada',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -20,
      }),
    ],
  },
  { //ENTRADA LOBBY F-G-H
    id: '4-entrada-sedeSf',
    panorama: EntradaSedeSf,
    thumbnail: EntradaSedeSf,
    name: 'Ingreso Sede F-G-H',
    caption: 'Entrada de la sede',
    description: 'Ingreso principal para avanzar hacia el patio.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaSedeSfGps,
    links: [
      createTourLink({
        from: '4-entrada-sedeSf',
        to: '3-EntradaSf',
        targetGps: entradaSedeSfGps,
        targetImage: EntradaSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar a entrada exterior',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '4-entrada-sedeSf',
        to: '4-patio',
        targetGps: [0,0,0],
        targetImage: PatioSf,
        label: 'Ir al patio',
        tooltipTitle: 'Avanzar al patio',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  { //patio cancha 
    id: '4-patio',
    panorama: PatioSf,
    thumbnail: PatioSf,
    name: 'Patio Sede F-G-H',
    caption: 'Patio',
    description: 'Patio interior del recorrido.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: patioSfGps,
    links: [
      createTourLink({
        from: '4-patio',
        to: '4-entrada-sedeSf',
        targetGps: entradaSedeSfGps,
        targetImage: EntradaSedeSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar a la entrada',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '4-patio',
        to: '5-zonaverde',
        targetGps: [0,0,0],
        targetImage: ZonaVerdeSf,
        label: 'Ir a zona verde',
        tooltipTitle: 'Avanzar a zona verde',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  { //zona verde 
    id: '5-zonaverde',
    panorama: ZonaVerdeSf,
    thumbnail: ZonaVerdeSf,
    name: 'Zona Verde Sede F-G-H',
    caption: 'Zona verde',
    description: 'Zona verde de la sede dentro del recorrido.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: zonaVerdeSfGps,
    links: [
      createTourLink({
        from: '5-zonaverde',
        to: '4-patio',
        targetGps: zonaVerdeBackArrowGps,
        targetImage: PatioSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar al patio',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '5-zonaverde',
        to: '6-12S',
        targetGps: zonaVerdeNextArrowGps,
        targetImage: DoceSSf,
        label: 'Ir a salon 12',
        tooltipTitle: 'Avanzar al salon 12S',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  {
    id: '6-12S',
    panorama: DoceSSf,
    thumbnail: DoceSSf,
    name: 'Salon 12S',
    caption: 'Salon 12S',
    description: 'Salon 12S del recorrido Sede F-G-H.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: doceSSfGps,
    links: [
      createTourLink({
        from: '6-12S',
        to: '5-zonaverde',
        targetGps: doceSBackArrowGps,
        targetImage: ZonaVerdeSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar a zona verde',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '6-12S',
        to: '7-13S',
        targetGps: doceSNextArrowGps,
        targetImage: TreceSSf,
        label: 'Ir a salon 13',
        tooltipTitle: 'Avanzar al salon 13S',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  {
    id: '7-13S',
    panorama: TreceSSf,
    thumbnail: TreceSSf,
    name: 'Salon 13S',
    caption: 'Salon 13S',
    description: 'Ultima estacion del recorrido Sede F-G-H.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: treceSSfGps,
    links: [
      createTourLink({
        from: '7-13S',
        to: '6-12S',
        targetGps: treceSBackArrowGps,
        targetImage: DoceSSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar al salon 12S',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
    ],
  },
];

export const bogotaSede2TourConfig: Tour360Config = {
  id: 'bogota-sede-2',
  label: 'Sede F-G-H',
  startNodeId: BOGOTA_SEDE_2_START_NODE_ID,
  thumbnail: InicioSf,
  nodes: bogotaSede2Nodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
