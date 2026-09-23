import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

const sedeFphPanoramaPath = (fileName: string) => getPublicPanoramaUrl(`Sede_FPH_optimized/${fileName}`);

const InicioSf = sedeFphPanoramaPath('1-InicioSf.jpg');
const LlegadaSf = sedeFphPanoramaPath('2-LlegadaSf.jpg');
const EntradaSf = sedeFphPanoramaPath('3-EntradaSf.jpg');
const EntradaSedeSf = sedeFphPanoramaPath('4-entrada-sedeSf.jpg');
const PatioSf = sedeFphPanoramaPath('4-patio.jpg');
const Patio2Sf = sedeFphPanoramaPath('4-patio2.jpg');
const Patio3Sf = sedeFphPanoramaPath('4-patio-3.jpg');
const ZonaVerdeSf = sedeFphPanoramaPath('5-zonaverde.jpg');
const InteriorSf = sedeFphPanoramaPath('6-Interior.jpg');

// gps de cada nodo: se conserva por compatibilidad de tipos (Tour360Node.gps
// es obligatorio) y por si en el futuro se usa un mapa/plano, pero ya NO se
// usa para ubicar las flechas (ver bogota-sede-1.ts para el mismo cambio).
// Este tour usa positionMode "manual": cada link trae su propio
// `position: { yaw, pitch }` en grados, mucho mas simple que mantener un
// segundo punto lat/lon por flecha.
const inicioSfGps: GpsPosition = [-74.08228, 4.648, 0];
const llegadaSfGps: GpsPosition = [-74.08218, 4.64804, 0];
const entradaSfGps: GpsPosition = [-74.08208, 4.64808, 0];
const entradaSedeSfGps: GpsPosition = [-74.08198, 4.64812, 0];
const patioSfGps: GpsPosition = [-74.08188, 4.64816, 0];
const patio2SfGps: GpsPosition = [-74.08184, 4.64818, 0];
const patio3SfGps: GpsPosition = [-74.0818, 4.6482, 0];
const zonaVerdeSfGps: GpsPosition = [-74.08178, 4.6482, 0];
const interiorSfGps: GpsPosition = [-74.08168, 4.64824, 0];

export const BOGOTA_SEDE_2_START_NODE_ID = '1-InicioSf';

type TourLinkInput = {
  from: string;
  to: string;
  position: Tour360ManualPosition;
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
  position,
  targetImage,
  label,
  tooltipTitle,
  direction,
  styleVariant,
  rotationDeg,
  scale = 1,
}: TourLinkInput): Tour360Link => ({
  nodeId: to,
  // UBICACION de la flecha: { yaw, pitch } en grados. yaw = izquierda/derecha
  // alrededor del panorama (0-360°), pitch = arriba/abajo (negativo = piso).
  // `data.rotationDeg` (abajo) solo gira el icono, no lo desplaza.
  position,
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
        position: { yaw: '67deg', pitch: '0deg' },
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
        position: {
          "yaw": "119.4deg",
          "pitch": "-3.5deg"
      },
        targetImage: InicioSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar al inicio',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 1,
      }),
      createTourLink({
        from: '2-LlegadaSf',
        to: '3-EntradaSf',
        position: {
          "yaw": "351.0deg",
          "pitch": "1.8deg"
      },
        targetImage: EntradaSf,
        label: 'Avanzar',
        tooltipTitle: 'Avanzar a entrada exterior',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 260,
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
        position: { yaw: '247deg', pitch: '0deg' },
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
        position: { yaw: '65deg', pitch: '0deg' },
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
        // FIX: antes usaba `entradaSedeSfGps`, el gps del propio nodo origen
        // (bearing consigo mismo = direccion indefinida/al azar). Yaw
        // calculado con el punto que de verdad estaba pensado para esta
        // flecha (`entradaSedeBackArrowGps`, ya sin uso tras este cambio).
        position: {
          "yaw": "11.5deg",
          "pitch": "-9.2deg"
      },
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
        // FIX: antes era `[0, 0, 0]` (placeholder sin usar, bearing hacia
        // "null island" = direccion sin sentido). Yaw calculado con el punto
        // que de verdad estaba pensado para esta flecha
        // (`entradaSedeNextArrowGps`, ya sin uso tras este cambio).
        position: {
          "yaw": "79.1deg",
          "pitch": "-2.0deg"
      },
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
        position:  { yaw: '165.5deg', pitch: '-11.7deg' } ,
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
        // FIX: antes era `[0, 0, 0]` (mismo problema que el link anterior).
        // Yaw calculado con `patioNextArrowGps` (ya sin uso tras este cambio).
        position: {
          "yaw": "20.0deg",
          "pitch": "5.5deg"
      },
        targetImage: ZonaVerdeSf,
        label: 'Ir a zona verde',
        tooltipTitle: 'Avanzar a zona verde',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '4-patio',
        to: '4-patio2',
        position: { yaw: '248deg', pitch: '0deg' },
        targetImage: Patio2Sf,
        label: 'Avanzar al patio 2',
        tooltipTitle: 'Ir a patio 2',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  {
    id: '4-patio2',
    panorama: Patio2Sf,
    thumbnail: Patio2Sf,
    name: 'Patio 2 Sede F-G-H',
    caption: 'Patio 2',
    description: 'Continuación del patio hacia el salón / patio 3.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: patio2SfGps,
    links: [
      createTourLink({
        from: '4-patio2',
        to: '4-patio',
        position: {
          "yaw": "195.6deg",
          "pitch": "-16.2deg"
      },
        targetImage: PatioSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar al patio',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '4-patio2',
        to: '4-patio-3',
        position: {
          "yaw": "42.2deg",
          "pitch": "-10.9deg"
      },
        targetImage: Patio3Sf,
        label: 'Avanzar a patio 3',
        tooltipTitle: 'Ir a patio 3',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  {
    id: '4-patio-3',
    panorama: Patio3Sf,
    thumbnail: Patio3Sf,
    name: 'Salon',
    caption: 'Salon',
    description: 'Estación patio 3 del recorrido Sede F-G-H.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: patio3SfGps,
    links: [
      createTourLink({
        from: '4-patio-3',
        to: '4-patio2',
        position: {"yaw": "177.6deg",
          "pitch": "-12.2deg"},
        targetImage: Patio2Sf,
        label: 'Regresar',
        tooltipTitle: 'Regresar a patio 2',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
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
        position: { yaw: '247deg', pitch: '0deg' },
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
        to: '6-Interior',
        position: { yaw: '63deg', pitch: '0deg' },
        targetImage: InteriorSf,
        label: 'Ir al interior',
        tooltipTitle: 'Avanzar al interior',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  },
  {
    id: '6-Interior',
    panorama: InteriorSf,
    thumbnail: InteriorSf,
    name: 'Interior Sede F-G-H',
    caption: 'Interior',
    description: 'Interior de la Sede F-G-H.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: interiorSfGps,
    links: [
      createTourLink({
        from: '6-Interior',
        to: '5-zonaverde',
        position: { yaw: '168.3deg', pitch: '-9.8deg' },
        targetImage: ZonaVerdeSf,
        label: 'Regresar',
        tooltipTitle: 'Regresar a zona verde',
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
