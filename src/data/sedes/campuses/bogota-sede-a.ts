import { TOUR360_START_NODE_ID, tour360Nodes } from '../../tour360Nodes';
import { onboardingConfig } from '../../../data';
import type { CampusConfig } from '../../../types/sede';

const startPanorama =
  tour360Nodes.find((node) => node.id === TOUR360_START_NODE_ID)?.panorama ??
  tour360Nodes[0]?.panorama ??
  onboardingConfig.defaultTour360Url;

export const bogotaSedeACampus: CampusConfig = {
  id: 'bogota-sede-a',
  cityId: 'bogota',
  name: 'Sede A — Bogotá',
  shortName: 'Sede A',
  status: 'active',
  previewImage: startPanorama,
  tour360: {
    enabled: true,
    startNodeId: TOUR360_START_NODE_ID,
    nodes: tour360Nodes,
  },
  narrative: {
    chapter: 'Capítulo 1',
    mission: 'Explora tu sede',
    title: 'Sede A — Bogotá',
    description:
      'Recorre los espacios de la Sede A, descubre servicios y familiarízate con tu campus antes de llegar.',
    nextStep: 'Usa las flechas dentro del recorrido para avanzar por la sede.',
    reward: 'Desbloqueas confianza para moverte por el campus.',
    ctaLabel: 'Iniciar exploración',
    guide: 'Hola, soy tu guía. Empecemos por conocer la entrada principal de la Sede A.',
  },
};
