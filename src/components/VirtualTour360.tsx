import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
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
  visual.className = 'tour-hotspot__visual';

  const icon = document.createElement('span');
  icon.className = 'tour-hotspot__icon';
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
  const [activeImagePopup, setActiveImagePopup] = useState<ImageMarkerPopup | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current || nodes.length === 0) return;

    const startNode = nodes.find((node) => node.id === initialNodeId) ?? nodes[0];

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

    // Debug temporal para reposicionar markers: descomenta y haz clic en el panorama.
    // viewer.addEventListener('click', ({ data }) => {
    //   console.log('Coordenadas actuales:', {
    //     yaw: data.yaw,
    //     pitch: data.pitch,
    //   });
    // });

    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | undefined;
    const handleMarkerSelect = (event: any) => {
      const data = event.marker?.data ?? event.marker?.config?.data;

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

    markersPlugin?.addEventListener('select-marker', handleMarkerSelect);

    return () => {
      markersPlugin?.removeEventListener('select-marker', handleMarkerSelect);
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
