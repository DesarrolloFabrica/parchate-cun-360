import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import '../styles/tour360.css';
import '../styles/tour360-hotspots.css';
import {
  TOUR360_START_NODE_ID,
  tour360Nodes,
  type Tour360Node,
  type TourHotspotDirection,
  type TourHotspotStyleVariant,
} from '../data/tour360Nodes';

interface VirtualTour360Props {
  nodes?: Tour360Node[];
  initialNodeId?: string;
}

type TourArrowLink = {
  nodeId: string;
  data?: {
    id?: string;
    originSceneId?: string;
    destinationSceneId?: string;
    label?: string;
    visibleText?: string;
    tooltipTitle?: string;
    tooltipImage?: string;
    rotationDeg?: number;
    scale?: number;
    direction?: TourHotspotDirection;
    styleVariant?: TourHotspotStyleVariant;
  };
};

type ImageMarkerPopup = {
  title: string;
  image: string;
  alt: string;
};

type VideoMarkerPopup = {
  title: string;
  iframeSrc: string;
  description?: string;
};

const TOUR_NODE_ORDER = ['CalleA', 'Entrada_A', 'EntradaLobbySA', 'DescansoSA', 'BibliotecaSA'];

const getLinkLabel = (link: TourArrowLink) => {
  return typeof link.data?.label === 'string' ? link.data.label : link.nodeId;
};

const getHotspotDirection = (link: TourArrowLink): TourHotspotDirection => {
  if (link.data?.direction) {
    return link.data.direction;
  }

  const originIndex = TOUR_NODE_ORDER.indexOf(link.data?.originSceneId ?? '');
  const destinationIndex = TOUR_NODE_ORDER.indexOf(link.data?.destinationSceneId ?? link.nodeId);

  if (originIndex >= 0 && destinationIndex >= 0 && destinationIndex < originIndex) {
    return 'back';
  }

  return 'forward';
};

const getHotspotStyleVariant = (link: TourArrowLink): TourHotspotStyleVariant => {
  if (link.data?.styleVariant) {
    return link.data.styleVariant;
  }

  return link.data?.originSceneId === 'CalleA' || link.data?.originSceneId === 'Entrada_A'
    ? 'floor-arrow'
    : 'three-d-arrow';
};

const getVisibleText = (link: TourArrowLink) => {
  return link.data?.visibleText ?? link.data?.label ?? (getHotspotDirection(link) === 'back' ? 'Regresar' : 'Ingresar');
};

/**
 * Usa el tooltip HTML por defecto del VirtualTourPlugin (name + thumbnail + caption
 * del nodo destino) y agrega la descripción cuando existe.
 */
const enhanceTourLinkTooltip = (
  content: string,
  _link: TourArrowLink,
  node: Tour360Node,
) => {
  if (!content || !node.description || content.includes(node.description)) {
    return content;
  }

  return `${content}<p class="psv-virtual-tour-tooltip-desc">${node.description}</p>`;
};

const createTourArrowElement = (link: TourArrowLink) => {
  const labelText = getVisibleText(link);
  const direction = getHotspotDirection(link);
  const styleVariant = getHotspotStyleVariant(link);
  const rotationDeg = link.data?.rotationDeg ?? 0;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `tour-hotspot tour-hotspot--${styleVariant}`;
  button.setAttribute('aria-label', `${labelText}: ${getLinkLabel(link)}`);
  button.dataset.hotspotId = link.data?.id ?? 'hotspot-to-' + link.nodeId;
  button.dataset.originSceneId = link.data?.originSceneId ?? '';
  button.dataset.destinationSceneId = link.data?.destinationSceneId ?? link.nodeId;
  button.dataset.direction = direction;
  button.dataset.styleVariant = styleVariant;
  button.style.setProperty('--hotspot-rotation', `${rotationDeg}deg`);

  const label = document.createElement('span');
  label.className = 'tour-hotspot__label';
  label.textContent = labelText;

  const visual = document.createElement('span');
  visual.className = 'tour-hotspot__visual tour-hotspot__circle';

  const icon = document.createElement('span');
  icon.className = 'tour-hotspot__icon tour-hotspot__arrow';
  icon.setAttribute('aria-hidden', 'true');

  visual.append(icon);
  button.append(label, visual);

  return button;
};

export const VirtualTour360: React.FC<VirtualTour360Props> = ({
  nodes = tour360Nodes,
  initialNodeId = TOUR360_START_NODE_ID,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId);
  const [activeImagePopup, setActiveImagePopup] = useState<ImageMarkerPopup | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoMarkerPopup | null>(null);
  const currentNode = nodes.find((node) => node.id === currentNodeId) ?? nodes[0];
  const currentNodeTitle = currentNode?.name || currentNode?.caption || currentNode?.id || 'Recorrido 360';

  useEffect(() => {
    if (!activeVideo) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeVideo]);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current || nodes.length === 0) return;

    const startNode = nodes.find((node) => node.id === initialNodeId) ?? nodes[0];
    setCurrentNodeId(startNode.id);

    const points = [
    { yaw: 0.1029, pitch: 0.3158 },
    { yaw: 0.8532, pitch: -0.1646 },
    { yaw: 2.7755, pitch: 0.7840 },
    { yaw: 3.3742, pitch: 0.4757 },
    { yaw: 4.6591, pitch: 0.6579 },
    { yaw: 5.7976, pitch: -0.0401 },
];

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: startNode.panorama,
      defaultYaw: startNode.defaultYaw ?? 0,
      defaultPitch: startNode.defaultPitch ?? 0,
      navbar: [
        'zoom',
        'move',
      /*
        {
          id: 'test-mode',
          title: 'Modo test',
          content: 'TEST',
          onClick(viewer) {
            const virtualTour = viewer.getPlugin(VirtualTourPlugin) as any;
            virtualTour?.setCurrentNode?.('SphereTest');
          },
        },
        */
        'fullscreen',
        'gallery',
        'autorotate',
        'markers',
      ],
      mousewheel: true,
      size: { width: '100%', height: '100%' },
      plugins: [
        
      AutorotatePlugin.withConfig({
            autostartDelay: 1000,
            autorotateSpeed: '0.5rpm',
            keypoints: points.map((pt, i) => ({
                position: pt,
                pause: i % 3 === 1 ? 2000 : 0,
                tooltip: 'Test tooltip',
            })),
        }),
        [
          GalleryPlugin,
          {
            thumbnailSize: { width: 200, height: 100 },
            visibleOnLoad: false,
            hideOnClick: true,
          },
        ],
        MarkersPlugin.withConfig({
          clickEventOnMarker: false,
        }),
        [
          VirtualTourPlugin,
          {
            positionMode: 'gps',
            renderMode: '3d',
            nodes,
            startNodeId: startNode.id,
            preload: true,
            // Hover nativo del plugin: muestra name + thumbnail + caption del nodo destino.
            showLinkTooltip: true,
            getLinkTooltip: enhanceTourLinkTooltip,
            transitionOptions: {
              showLoader: true,
              effect: 'fade',
              speed: '20rpm',
              rotation: true,
            },
            arrowStyle: {
              element: createTourArrowElement,
              className: 'tour-hotspot-link',
              size: { width: 130, height: 112 },
            },
          },
        ],
      ],
    });

    viewerRef.current = viewer;

    const virtualTourPlugin = viewer.getPlugin(VirtualTourPlugin) as any;
    const handleNodeChanged = (event: { node?: { id?: string } }) => {
      if (typeof event.node?.id === 'string') {
        setCurrentNodeId(event.node.id);
        setActiveVideo(null);
      }
    };

    virtualTourPlugin?.addEventListener?.('node-changed', handleNodeChanged);

    const activeNode = virtualTourPlugin?.getCurrentNode?.();
    if (typeof activeNode?.id === 'string') {
      setCurrentNodeId(activeNode.id);
    }

    // Debug temporal para ubicar el video dentro de la escena.
    // Descomentar solo mientras se ajusta la posicion.
    /*
    viewer.addEventListener('click', ({ data }) => {
      console.log('Coordenadas para video:', {
        yaw: data.yaw,
        pitch: data.pitch,
      });
    });
    */

    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | undefined;
    const openVideoFromMarkerData = (data: any) => {
      if (data?.action !== 'open-video-modal' || typeof data.iframeSrc !== 'string') {
        return false;
      }

      setActiveVideo({
        title: typeof data.title === 'string' ? data.title : 'Video del recorrido',
        iframeSrc: data.iframeSrc,
        description: typeof data.description === 'string' ? data.description : undefined,
      });

      return true;
    };

    const handleMarkerSelect = (event: any) => {
      const data = event.marker?.data ?? event.marker?.config?.data;

      if (openVideoFromMarkerData(data)) {
        return;
      }

      if (event.marker?.id !== 'calle-a-marco-image-layer' || data?.action !== 'open-image-popup' || typeof data.image !== 'string') {
        return;
      }

      console.log('Marker MARCO seleccionado');

      setActiveImagePopup({
        title: typeof data.title === 'string' ? data.title : 'Imagen informativa',
        image: data.image,
        alt: typeof data.alt === 'string' ? data.alt : 'Imagen informativa del tour 360',
      });
    };

    const handleVideoHotspotKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const target = event.target as HTMLElement | null;
      const hotspot = target?.closest?.('.tour-video-hotspot') as HTMLElement | null;

      if (!hotspot) {
        return;
      }

      event.preventDefault();
      setActiveVideo({
        title: hotspot.dataset.videoTitle || 'Video del recorrido',
        iframeSrc: hotspot.dataset.videoIframeSrc || '',
        description: hotspot.dataset.videoDescription,
      });
    };

    markersPlugin?.addEventListener('select-marker', handleMarkerSelect);
    viewer.container.addEventListener('keydown', handleVideoHotspotKeydown);

    return () => {
      virtualTourPlugin?.removeEventListener?.('node-changed', handleNodeChanged);
      markersPlugin?.removeEventListener('select-marker', handleMarkerSelect);
      viewer.container.removeEventListener('keydown', handleVideoHotspotKeydown);
      viewerRef.current = null;
      viewer.destroy();
    };
  }, [initialNodeId, nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-sm font-semibold text-white">
        No hay escenas configuradas para el tour 360.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black">
      <div ref={containerRef} className="h-full w-full bg-black" />

      <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:left-4 sm:top-4 sm:max-w-[24rem] sm:px-5">
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 sm:text-xs">
          Tour 360
        </p>
        <h2 className="m-0 mt-1 truncate font-['Montserrat'] text-lg font-black leading-tight text-white sm:text-xl md:text-2xl">
          {currentNodeTitle}
        </h2>
      </div>

      {activeVideo && (
        <div
          className="tour-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="tour-video-modal__content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="tour-video-modal__close"
              onClick={() => setActiveVideo(null)}
              aria-label="Cerrar video"
            >
              X
            </button>

            <h2 className="tour-video-modal__title">
              {activeVideo.title}
            </h2>

            {activeVideo.description && (
              <p className="tour-video-modal__description">
                {activeVideo.description}
              </p>
            )}

            <iframe
              className="tour-video-modal__player"
              src={activeVideo.iframeSrc}
              title={activeVideo.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {activeImagePopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur-md">
          <button
            type="button"
            className="absolute inset-0 cursor-default border-0 bg-transparent"
            aria-label="Cerrar imagen"
            onClick={() => setActiveImagePopup(null)}
          />

          <div className="relative z-10 flex max-h-[92%] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <h3 className="m-0 text-sm font-black uppercase tracking-wide text-white">
                {activeImagePopup.title}
              </h3>
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white transition hover:bg-white/20"
                onClick={() => setActiveImagePopup(null)}
              >
                Cerrar
              </button>
            </div>

            <div className="min-h-0 bg-black p-3">
              <img
                src={activeImagePopup.image}
                alt={activeImagePopup.alt}
                className="max-h-[76vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTour360;
