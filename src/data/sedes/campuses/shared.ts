import { onboardingConfig } from '../../../data';
import type { CampusConfig, CampusId, CityId } from '../../../types/sede';

export function createComingSoonCampus(
  id: CampusId,
  cityId: CityId,
  name: string,
  shortName: string,
): CampusConfig {
  return {
    id,
    cityId,
    name,
    shortName,
    status: 'coming_soon',
    previewImage: onboardingConfig.defaultTour360Url,
    tour360: {
      enabled: false,
      startNodeId: '',
      nodes: [],
    },
    narrative: {
      mission: 'Explora tu sede',
      title: `${shortName} — Próximamente`,
      description: `El recorrido 360 de ${name} estará disponible muy pronto. Mientras tanto, puedes explorar Sede A en Bogotá.`,
      guide: `Estamos preparando el recorrido virtual de ${shortName} para ti.`,
    },
  };
}
