import { resolveLegacyPanoramaUrl, KNOWN_GOOD_PLACEHOLDER_PANORAMA } from '../panoramaUrls';
import type { GpsPosition, Tour360Config, Tour360Node } from '../types';

const CalleA = resolveLegacyPanoramaUrl('Calle_A.png');
const Entrada_A = resolveLegacyPanoramaUrl('3SA.jpeg');
const DescansoSA = resolveLegacyPanoramaUrl('5SA.png');
const BibliotecaSA = resolveLegacyPanoramaUrl('6SA.png');
const EntradaLobbySA = resolveLegacyPanoramaUrl('Sede_A/LobbySA.png');
const MarcoInfo = resolveLegacyPanoramaUrl('MARCO.png');
const GuiaAS = resolveLegacyPanoramaUrl('AS.png');
const GuiaEntradaSA = resolveLegacyPanoramaUrl('panoramas/iconos/alizon.png');

// gps de cada nodo: se conserva por compatibilidad de tipos (Tour360Node.gps
// es obligatorio) y por si en el futuro se usa un mapa/plano, pero ya NO se
// usa para ubicar las flechas: este tour usa positionMode "manual"
// (yaw/pitch directos en cada link, ver mas abajo), no "gps". Con gps había
// que inventar un segundo punto lat/lon solo para fijar el rumbo de cada
// flecha (rebuscado y dificil de ajustar); con yaw/pitch se edita
// directamente el angulo en grados de cada flecha en su propio link.
const calleAGps: GpsPosition = [-75.0819, 4.64802, 0];
const entradaAGps: GpsPosition = [-74.07184, 4.64802, 0];
const entradaLobbySAGps: GpsPosition = [-74.0818, 4.648055, 0];
const descansoSAGps: GpsPosition = [-74.08176, 4.64809, 0];
const bibliotecaSAGps: GpsPosition = [-74.08171, 4.64813, 0];

export const BOGOTA_SEDE_1_START_NODE_ID = 'CalleA';

export const bogotaSede1Nodes: Tour360Node[] = [
  {
    id: 'CalleA',
    panorama: CalleA,
    thumbnail: CalleA,
    name: 'Ruta Sede A',
    caption: 'Primera calle',
    description: 'Primera calle del recorrido 360 local.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: calleAGps,
    markers: [
      {
        id: 'calle-a-marco-image-layer',
        imageLayer: MarcoInfo,
        position: { yaw: 90, pitch: 0 },
        size: { width: 820, height: 440 },
        tooltip: 'Haz clic para ver más información',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: MarcoInfo,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
      {
        id: 'Presentador',
        imageLayer: GuiaAS,
        position: { yaw: 1.49, pitch: -0.25 },
        size: { width: 341, height: 567 },
        tooltip: 'Haz clic para ver más información',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: GuiaAS,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
    ],
    links: [
      {
        nodeId: 'Entrada_A',
        // yaw/pitch manual: mismo angulo que daba el gps anterior (~90°),
        // ahora escrito directo en grados en vez de un segundo punto lat/lon.
        position: { yaw: '90deg', pitch: '0deg' },
        data: {
          id: 'CalleA-to-Entrada_A',
          originSceneId: 'CalleA',
          destinationSceneId: 'Entrada_A',
          label: 'Entrada sede principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Entrada para la sede principal',
          tooltipImage: Entrada_A,
          rotationDeg: 180,
          scale: 1,
          direction: 'forward',
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },
  {
    id: 'Entrada_A',
    panorama: Entrada_A,
    thumbnail: Entrada_A,
    name: 'Sede A',
    caption: 'Entrada para la sede principal',
    description: 'Acceso hacia la sede principal desde la primera calle.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaAGps,
    markers: [
      {
        id: 'Presentador',
        imageLayer: GuiaEntradaSA,
        position: { yaw: -0.4, pitch: -0.25 },
        size: { width: 341, height: 767 },
        tooltip: 'Alison: ¿Estas Listo?',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: GuiaEntradaSA,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
    ],
    // Guia rapida de parametros para las flechas (links) de este nodo:
    // - data.position: UBICACION de la flecha en la escena, como
    //   { yaw, pitch } en grados (ej. '90deg'). yaw = izquierda/derecha
    //   alrededor del panorama (0-360\u00b0), pitch = arriba/abajo (negativo =
    //   hacia el piso). Cambia estos dos numeros para DESPLAZAR la flecha;
    //   ya no hace falta inventar un segundo punto gps como antes.
    // - data.rotationDeg: ROTA el icono de la flecha sobre si mismo (grados),
    //   sin mover su posicion en la escena. Se aplica como
    //   `--hotspot-rotation` en createTourArrowElement (VirtualTour360.tsx).
    // - data.direction / data.styleVariant: ORIENTACION/estilo visual del
    //   hotspot ('forward'|'back' cambia el look de ida/regreso;
    //   'floor-arrow'|'three-d-arrow' cambia la plantilla del icono). No
    //   afectan la posicion, solo la apariencia.
    // - data.scale: tamano del hotspot.
    links: [
      {
        nodeId: 'EntradaLobbySA',
        // UBICACION (antes: gps `entradaANextArrowGps`). Mismo yaw que daba
        // ese punto (~0\u00b0); pitch a -10\u00b0 para que la flecha "floor-arrow"
        // quede mirando mas hacia el piso.
        position: { yaw: '0deg', pitch: '-10deg' },
        data: {
          id: 'Entrada_A-to-EntradaLobbySA',
          originSceneId: 'Entrada_A',
          destinationSceneId: 'EntradaLobbySA',
          label: 'Lobby principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Lobby de la sede principal',
          tooltipImage: EntradaLobbySA,
          // ROTACION del icono (no mueve la flecha, solo la gira).
          rotationDeg: -90,
          scale: 1,
          // ORIENTACION/estilo: 'forward' = flecha de avance (ver TOUR_NODE_ORDER
          // en VirtualTour360.tsx si se omite, para el calculo automatico).
          direction: 'forward',
          // ORIENTACION/estilo: plantilla visual del icono.
          styleVariant: 'floor-arrow',
        },
      },
      {
        nodeId: 'CalleA',
        // UBICACION (antes: gps `entradaABackArrowGps`). Esta es la flecha
        // de prueba pedida: mismo yaw que daba ese punto (180\u00b0, opuesto a la
        // de arriba, asi siguen sin pegarse) pero ahora se ajusta con dos
        // numeros directos en vez de coordenadas gps inventadas. pitch a
        // -10\u00b0 por la misma razon que la flecha de arriba (mirar al piso).
        // Para moverla: sube/baja `yaw` (izquierda/derecha) o `pitch`
        // (arriba/abajo).
        position: {
          "yaw": "81.7deg",
          "pitch": "-0.7deg"
      },
        data: {
          id: 'Entrada_A-to-CalleA',
          originSceneId: 'Entrada_A',
          destinationSceneId: 'CalleA',
          label: 'Primera calle',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Volver a la primera calle',
          tooltipImage: CalleA,
          // ROTACION del icono (no mueve la flecha, solo la gira).
          rotationDeg: -90,
          scale: 1,
          // ORIENTACION/estilo: 'back' = flecha de regreso.
          direction: 'back',
          // ORIENTACION/estilo: plantilla visual del icono.
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },
  {
    id: 'EntradaLobbySA',
    panorama: EntradaLobbySA,
    thumbnail: EntradaLobbySA,
    name: 'Lobby Sede A',
    caption: 'Lobby de la sede principal',
    description: 'Lobby de la sede principal y punto de conexion hacia la sala de descanso.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaLobbySAGps,
    // Igual que en Entrada_A: `position: { yaw, pitch }` ubica la flecha,
    // `data.rotationDeg` solo la rota sobre si misma.
    links: [
      {
        nodeId: 'Entrada_A',
        // yaw/pitch equivalente al gps anterior (`entradaLobbyBackArrowGps`, ~115°).
        position: { yaw: '115deg', pitch: '0deg' },
        data: {
          id: 'EntradaLobbySA-to-Entrada_A',
          originSceneId: 'EntradaLobbySA',
          destinationSceneId: 'Entrada_A',
          label: 'Entrada sede principal',
          visibleText: 'REGRESAR',
          tooltipTitle: 'Regresar a Entrada_A',
          tooltipImage: Entrada_A,
          rotationDeg: 0,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
      {
        nodeId: 'DescansoSA',
        // yaw/pitch equivalente al gps anterior (`entradaLobbyNextArrowGps`, ~299°).
        position: { yaw: '299deg', pitch: '0deg' },
        data: {
          id: 'EntradaLobbySA-to-DescansoSA',
          originSceneId: 'EntradaLobbySA',
          destinationSceneId: 'DescansoSA',
          label: 'Sala de descanso',
          visibleText: 'SALA DE DESCANSO',
          tooltipTitle: 'Sala de descanso',
          tooltipImage: DescansoSA,
          rotationDeg: 0,
          scale: 1,
          direction: 'forward',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
  {
    id: 'DescansoSA',
    panorama: DescansoSA,
    thumbnail: DescansoSA,
    name: 'Sala de Descanso - Sede A',
    caption: 'Sala de descanso',
    description: 'Sala de descanso dentro del recorrido 360.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: descansoSAGps,
    links: [
      {
        nodeId: 'EntradaLobbySA',
        // yaw/pitch equivalente al gps anterior (`entradaLobbySAGps`, ~229°).
        position: { yaw: '229deg', pitch: '0deg' },
        data: {
          id: 'DescansoSA-to-EntradaLobbySA',
          originSceneId: 'DescansoSA',
          destinationSceneId: 'EntradaLobbySA',
          label: 'Lobby principal',
          visibleText: 'REGRESAR A LOBBY.',
          tooltipTitle: 'Regresar al lobby',
          tooltipImage: EntradaLobbySA,
          rotationDeg: 0,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
      {
        nodeId: 'BibliotecaSA',
        // yaw/pitch equivalente al gps anterior (`bibliotecaSAGps`, ~51°).
        position: { yaw: '51deg', pitch: '0deg' },
        data: {
          id: 'DescansoSA-to-BibliotecaSA',
          originSceneId: 'DescansoSA',
          destinationSceneId: 'BibliotecaSA',
          label: 'Biblioteca',
          visibleText: 'BIBLIOTECA.',
          tooltipTitle: 'Biblioteca',
          tooltipImage: BibliotecaSA,
          rotationDeg: 0,
          scale: 1,
          direction: 'forward',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
  {
    id: 'BibliotecaSA',
    panorama: BibliotecaSA,
    thumbnail: BibliotecaSA,
    name: 'Biblioteca - Sede A',
    caption: 'Biblioteca',
    description: 'Biblioteca de la sede principal.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: bibliotecaSAGps,
    links: [
      {
        nodeId: 'DescansoSA',
        // yaw/pitch equivalente al gps anterior (`descansoSAGps`, ~231°).
        position: { yaw: '231deg', pitch: '0deg' },
        data: {
          id: 'BibliotecaSA-to-DescansoSA',
          originSceneId: 'BibliotecaSA',
          destinationSceneId: 'DescansoSA',
          label: 'Sala de descanso',
          visibleText: 'REGRESAR.',
          tooltipTitle: 'Volver a la sala de descanso',
          tooltipImage: DescansoSA,
          rotationDeg: 180,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
];

export const bogotaSede1TourConfig: Tour360Config = {
  id: 'bogota-sede-1',
  label: 'Sede Bogotá 1',
  startNodeId: BOGOTA_SEDE_1_START_NODE_ID,
  thumbnail: KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  nodes: bogotaSede1Nodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};

export const bogotaSede1AvailablePanoramaFiles = [
  { id: 'CalleA', panorama: CalleA, name: 'CalleA', fileName: 'Calle_A.png' },
  { id: 'Entrada_A', panorama: Entrada_A, name: 'Entrada_A', fileName: '3SA.jpeg' },
  { id: 'EntradaLobbySA', panorama: EntradaLobbySA, name: 'EntradaLobbySA', fileName: 'LobbySA.png' },
  { id: 'DescansoSA', panorama: DescansoSA, name: 'DescansoSA', fileName: '5SA.png' },
  { id: 'BibliotecaSA', panorama: BibliotecaSA, name: 'BibliotecaSA', fileName: '6SA.png' },
];
