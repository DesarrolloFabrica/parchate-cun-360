import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getCampusConfig,
  resolveCampusId,
} from '../data/sedes';
import { DEFAULT_HUB_TAB, type HubTab } from '../navigation';
import type { CampusConfig, CampusId } from '../types/sede';

export interface SetActiveSedeOptions {
  tab?: HubTab;
  replace?: boolean;
}

export function useActiveSede() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const campusId = useMemo(
    () => resolveCampusId(searchParams.get('sede')),
    [searchParams],
  );

  const activeCampus = useMemo(() => getCampusConfig(campusId), [campusId]);

  const setActiveCampus = useCallback(
    (nextCampusId: CampusId, options?: SetActiveSedeOptions) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('sede', nextCampusId);

      if (options?.tab) {
        nextParams.set('tab', options.tab);
      }

      setSearchParams(nextParams, { replace: options?.replace ?? true });
    },
    [searchParams, setSearchParams],
  );

  const navigateToHubWithCampus = useCallback(
    (nextCampusId: CampusId, tab: HubTab = DEFAULT_HUB_TAB) => {
      const params = new URLSearchParams();
      params.set('sede', nextCampusId);
      params.set('tab', tab);
      navigate(`/?${params.toString()}`);
    },
    [navigate],
  );

  return {
    campusId,
    activeCampus,
    /** @deprecated Usar `campusId`. */
    sedeId: campusId,
    /** @deprecated Usar `activeCampus`. */
    activeSede: activeCampus,
    setActiveCampus,
    /** @deprecated Usar `setActiveCampus`. */
    setActiveSede: setActiveCampus,
    navigateToHubWithCampus,
    /** @deprecated Usar `navigateToHubWithCampus`. */
    navigateToHubWithSede: navigateToHubWithCampus,
  };
}

export type UseActiveSedeReturn = {
  campusId: CampusId;
  activeCampus: CampusConfig;
  setActiveCampus: (nextCampusId: CampusId, options?: SetActiveSedeOptions) => void;
  navigateToHubWithCampus: (nextCampusId: CampusId, tab?: HubTab) => void;
};
