import type { MarkerConfig } from '@photo-sphere-viewer/markers-plugin';

export const entradaLobbyVideoIframeSrc =
  'https://drive.google.com/file/d/1p5_Mf2ZMYNl6SnllZaCTEsHTRndKpO54/preview';

type Tour360MediaHotspot = {
  id: string;
  type: 'video';
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
  EntradaLobbySA: [
    {
      id: 'entrada-lobby-video',
      type: 'video',
      title: 'Video entrada lobby',
      description: 'Haz clic para ver el video en grande.',
      iframeSrc: entradaLobbyVideoIframeSrc,
      // Para mover el video integrado:
      // yaw controla izquierda/derecha dentro del panorama.
      // pitch controla arriba/abajo dentro del panorama.
      // Aumentar yaw mueve el elemento hacia la derecha.
      // Disminuir yaw mueve el elemento hacia la izquierda.
      // Aumentar pitch sube el elemento.
      // Disminuir pitch baja el elemento.
      position: {
        yaw: 2.50,
        pitch: -0.15,
      },
      size: {
        width: 360,
        height: 210,
      },
    },
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
    title: hotspot.title,
    description: hotspot.description,
    iframeSrc: hotspot.iframeSrc,
  },
});

export const tour360MediaMarkersByNode: Record<string, MarkerConfig[]> = {
  EntradaLobbySA: tour360MediaHotspots.EntradaLobbySA.map(createVideoMarker),
};
