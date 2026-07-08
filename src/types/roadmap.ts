import type { HubTab } from '../navigation';

export type RoadmapVariant = 'cun360' | 'cdigital' | 'soporte-cami' | 'parche-virtual';

export type RoadmapUnlockMode = 'sequential' | 'free';

export interface RoadmapPoint {
  id: string;
  number: number;
  title: string;
  coordinateX: number;
  coordinateY: number;
}

export type RoadmapNodeStatus = 'completed' | 'active' | 'available' | 'locked';

export const roadmapUnlockModeByVariant: Record<RoadmapVariant, RoadmapUnlockMode> = {
  cun360: 'sequential',
  cdigital: 'sequential',
  'soporte-cami': 'sequential',
  'parche-virtual': 'sequential',
};

export const SEQUENTIAL_ROADMAP_VARIANTS = (
  Object.entries(roadmapUnlockModeByVariant) as [RoadmapVariant, RoadmapUnlockMode][]
)
  .filter(([, mode]) => mode === 'sequential')
  .map(([variant]) => variant);

export const roadmapVariantIdPrefix: Record<RoadmapVariant, string> = {
  cun360: 'c360',
  cdigital: 'cdig',
  'soporte-cami': 'cami',
  'parche-virtual': 'parche',
};

export const defaultCompletedStationIdsByVariant: Record<RoadmapVariant, string[]> = {
  cun360: [],
  cdigital: [],
  'soporte-cami': [],
  'parche-virtual': [],
};

const ALL_ROADMAP_VARIANTS: RoadmapVariant[] = [
  'cun360',
  'cdigital',
  'soporte-cami',
  'parche-virtual',
];

export function isSequentialRoadmapVariant(variant: RoadmapVariant): boolean {
  return roadmapUnlockModeByVariant[variant] === 'sequential';
}

export function hubTabUsesSequentialUnlock(tab: HubTab): boolean {
  const variant = hubTabToRoadmapVariant(tab);
  return variant ? isSequentialRoadmapVariant(variant) : false;
}

export function getRoadmapProgressStorageKey(variant: RoadmapVariant): string {
  return `roadmap-progress-${variant}`;
}

function normalizeStoredProgressForVariant(
  variant: RoadmapVariant,
  storedIds: string[],
): string[] {
  // Migración: el default antiguo pre-marcaba cdig-1 y desbloqueaba el punto 2 sin interacción.
  if (variant === 'cdigital' && storedIds.length === 1 && storedIds[0] === 'cdig-1') {
    return [];
  }

  return storedIds;
}

export function loadCompletedStationIdsForVariant(variant: RoadmapVariant): string[] {
  try {
    const raw = window.localStorage.getItem(getRoadmapProgressStorageKey(variant));
    if (!raw) {
      return [...defaultCompletedStationIdsByVariant[variant]];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [...defaultCompletedStationIdsByVariant[variant]];
    }

    const storedIds = parsed.filter((id): id is string => typeof id === 'string');
    return normalizeStoredProgressForVariant(variant, storedIds);
  } catch {
    return [...defaultCompletedStationIdsByVariant[variant]];
  }
}

export function loadAllRoadmapCompletedStationIds(): string[] {
  const merged = ALL_ROADMAP_VARIANTS.flatMap((variant) =>
    loadCompletedStationIdsForVariant(variant),
  );
  return [...new Set(merged)];
}

export function saveCompletedStationIdsForVariant(
  variant: RoadmapVariant,
  stationIds: string[],
): void {
  try {
    window.localStorage.setItem(
      getRoadmapProgressStorageKey(variant),
      JSON.stringify([...new Set(stationIds)]),
    );
  } catch {
    // fallback silencioso
  }
}

export function filterCompletedStationIdsForVariant(
  variant: RoadmapVariant,
  allCompletedIds: string[],
): string[] {
  const prefix = `${roadmapVariantIdPrefix[variant]}-`;
  return allCompletedIds.filter((id) => id.startsWith(prefix));
}

export function isStationUnlocked(
  stationIndex: number,
  stations: RoadmapPoint[],
  completedStationIds: string[],
  sequentialUnlock: boolean,
): boolean {
  if (!sequentialUnlock || stationIndex === 0) {
    return true;
  }

  const previousStation = stations[stationIndex - 1];
  return completedStationIds.includes(previousStation.id);
}

/** Deriva el estado visual del nodo según progreso y modo de desbloqueo. */
export function resolveRoadmapNodeStatus(
  stationIndex: number,
  stationId: string,
  stations: RoadmapPoint[],
  completedStationIds: string[],
  sequentialUnlock: boolean,
): RoadmapNodeStatus {
  if (completedStationIds.includes(stationId)) {
    return 'completed';
  }

  if (!isStationUnlocked(stationIndex, stations, completedStationIds, sequentialUnlock)) {
    return 'locked';
  }

  const activeIndex = stations.findIndex((station, idx) => {
    if (completedStationIds.includes(station.id)) {
      return false;
    }

    return isStationUnlocked(idx, stations, completedStationIds, sequentialUnlock);
  });

  return stationIndex === activeIndex ? 'active' : 'available';
}

const ROUTE_MAP_TABS: HubTab[] = ['cun360', 'cdigital', 'soporteCami', 'virtual'];

export const isRouteMapHubTab = (tab: HubTab): tab is (typeof ROUTE_MAP_TABS)[number] =>
  ROUTE_MAP_TABS.includes(tab);

export const hubTabToRoadmapVariant = (tab: HubTab): RoadmapVariant | null => {
  switch (tab) {
    case 'cun360':
      return 'cun360';
    case 'cdigital':
      return 'cdigital';
    case 'soporteCami':
      return 'soporte-cami';
    case 'virtual':
      return 'parche-virtual';
    default:
      return null;
  }
};
