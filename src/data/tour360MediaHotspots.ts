import type { MarkerConfig } from '@photo-sphere-viewer/markers-plugin';

type Tour360MediaHotspot = {
  id: string;
  type: 'infografia' | 'video';
  title: string;
  description: string;
  iframeSrc: string;
  position: {
    yaw: number;
    pitch: number;
  };
  size: {
    width: number;
    height: number;
  };
};

const cun360Resources = [
  {
    id: 'cun360-infografia-1',
    type: 'infografia',
    title: 'CUN360 - Infografia 1',
    description: 'Haz clic para consultar la infografia completa dentro del tour.',
    iframeSrc: 'https://drive.google.com/file/d/1bTR8vK7o4YmvzoisVmRoVUyB2DIf58nc/preview',
  },
  {
    id: 'cun360-infografia-2',
    type: 'infografia',
    title: 'CUN360 - Infografia 2',
    description: 'Haz clic para consultar la infografia completa dentro del tour.',
    iframeSrc: 'https://drive.google.com/file/d/1mz1UtwJ_3QrWdbDaHC8xMfRtLDB2zT3-/preview',
  },
  {
    id: 'cun360-infografia-3',
    type: 'infografia',
    title: 'CUN360 - Infografia 3',
    description: 'Haz clic para consultar la infografia completa dentro del tour.',
    iframeSrc: 'https://drive.google.com/file/d/1WlYluPRG40Hp6fsOtHaLulnOMde1Vg90/preview',
  },
  {
    id: 'cun360-video',
    type: 'video',
    title: 'CUN360 - Video',
    description: 'Haz clic para reproducir el video dentro del tour.',
    iframeSrc: 'https://drive.google.com/file/d/1EUFET7nY21WuybYa6INnEPw-7ja1ul8h/preview',
  },
  {
    id: 'cun360-infografia-4',
    type: 'infografia',
    title: 'CUN360 - Infografia 4',
    description: 'Haz clic para consultar la infografia completa dentro del tour.',
    iframeSrc: 'https://drive.google.com/file/d/1_1z1ynY7f4xtqDaEOCyp0r1xBLGBWdT4/preview',
  },
  {
    id: 'cun360-infografia-5',
    type: 'infografia',
    title: 'CUN360 - Infografia 5',
    description: 'Haz clic para consultar la infografia completa dentro del tour.',
    iframeSrc: 'https://drive.google.com/file/d/1GuURqHHuEe6vrqb5nFLzFn_ZfrE2QzS_/preview',
  },
] satisfies Array<Pick<Tour360MediaHotspot, 'id' | 'type' | 'title' | 'description' | 'iframeSrc'>>;

const createCun360Hotspot = (
  resource: (typeof cun360Resources)[number],
  position: Tour360MediaHotspot['position'],
): Tour360MediaHotspot => ({
  ...resource,
  position,
  size: {
    width: 240,
    height: 140,
  },
});

const escapeHtmlAttribute = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const escapeHtmlText = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const createVideoHotspotHtml = (hotspot: Tour360MediaHotspot) => {
  return `
    <div
      class="tour-video-hotspot"
      role="button"
      tabindex="0"
      data-video-id="${escapeHtmlAttribute(hotspot.id)}"
      data-video-title="${escapeHtmlAttribute(hotspot.title)}"
      data-video-iframe-src="${escapeHtmlAttribute(hotspot.iframeSrc)}"
      data-video-description="${escapeHtmlAttribute(hotspot.description)}"
      data-video-type="${escapeHtmlAttribute(hotspot.type)}"
    >
      <iframe
        class="tour-video-hotspot__video"
        src="${escapeHtmlAttribute(hotspot.iframeSrc)}"
        title="${escapeHtmlAttribute(hotspot.title)}"
        allow="autoplay; fullscreen"
        allowfullscreen
      ></iframe>

      <span class="tour-video-hotspot__overlay">
        <span class="tour-video-hotspot__zoom-icon" aria-hidden="true"></span>
      </span>

      <span class="tour-video-hotspot__label">
        ${escapeHtmlText(hotspot.title)}
      </span>
    </div>
  `;
};

export const tour360MediaHotspots = {
  CalleA: [
    createCun360Hotspot(cun360Resources[0], {
      yaw: 0.2,
      pitch: -0.12,
    }),
  ],
  Entrada_A: [
    createCun360Hotspot(cun360Resources[1], {
      yaw: -0.55,
      pitch: -0.08,
    }),
  ],
  EntradaLobbySA: [
    createCun360Hotspot(cun360Resources[2], {
      // Para mover el contenido integrado:
      // yaw controla izquierda/derecha dentro del panorama.
      // pitch controla arriba/abajo dentro del panorama.
      // Aumentar yaw mueve el elemento hacia la derecha.
      // Disminuir yaw mueve el elemento hacia la izquierda.
      // Aumentar pitch sube el elemento.
      // Disminuir pitch baja el elemento.
      yaw: 0,
      pitch: -0.15,
    }),
  ],
  DescansoSA: [
    createCun360Hotspot(cun360Resources[3], {
      yaw: 0.35,
      pitch: -0.1,
    }),
  ],
  BibliotecaSA: [
    createCun360Hotspot(cun360Resources[4], {
      yaw: -0.25,
      pitch: -0.1,
    }),
  ],
} satisfies Record<string, Tour360MediaHotspot[]>;

const createVideoMarker = (hotspot: Tour360MediaHotspot): MarkerConfig => ({
  id: hotspot.id,
  html: createVideoHotspotHtml(hotspot),
  position: hotspot.position,
  size: hotspot.size,
  anchor: 'center center',
  className: 'tour-video-hotspot-marker',
  tooltip: {
    content: hotspot.description,
    position: 'top center',
    trigger: 'hover',
  },
  hideList: true,
  data: {
    action: 'open-video-modal',
    videoHotspotId: hotspot.id,
    type: hotspot.type,
    title: hotspot.title,
    description: hotspot.description,
    iframeSrc: hotspot.iframeSrc,
  },
});

export const tour360MediaMarkersByNode: Record<string, MarkerConfig[]> = Object.fromEntries(
  Object.entries(tour360MediaHotspots).map(([nodeId, hotspots]) => [
    nodeId,
    hotspots.map(createVideoMarker),
  ]),
);
