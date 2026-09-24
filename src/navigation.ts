export type AppRoute = 'home' | 'hub' | 'virtual' | 'presencial' | 'sedes';

export const appRoutes = ['home', 'hub', 'virtual', 'presencial', 'sedes'] as const;

export type HubTab =
  | 'recorrido360'
  | 'cun360'
  | 'cdigital'
  | 'cronograma'
  | 'soporteCami'
  | 'virtual'
  | 'servicioComplementario'
  | 'sinu'
  | 'bienestarLocked';

export const hubTabs = [
  'recorrido360',
  'cun360',
  'cdigital',
  'cronograma',
  'soporteCami',
  'virtual',
  'servicioComplementario',
  'sinu',
  'bienestarLocked',
] as const satisfies readonly HubTab[];

export const DEFAULT_HUB_TAB: HubTab = 'recorrido360';

export const isAppRoute = (value: string): value is AppRoute => {
  return (appRoutes as readonly string[]).includes(value as AppRoute);
};

export const isHubTab = (value: string): value is HubTab => {
  return (hubTabs as readonly string[]).includes(value as HubTab);
};

export const getRouteFromHash = (hash: string): AppRoute => {
  const route = hash.replace(/^#/, '').trim();
  return isAppRoute(route) ? route : 'home';
};

export const getRouteFromPathname = (pathname: string): AppRoute => {
  switch (pathname) {
    case '/':
      return 'home';
    case '/hub':
      return 'hub';
    case '/virtual':
      return 'virtual';
    case '/presencial':
      return 'presencial';
    case '/sedes':
      return 'sedes';
    default:
      return 'home';
  }
};

export const getPathForRoute = (route: AppRoute): string => {
  switch (route) {
    case 'home':
      return '/';
    case 'hub':
      return '/hub';
    case 'virtual':
      return '/virtual';
    case 'presencial':
      return '/presencial';
    case 'sedes':
      return '/sedes';
  }
};

export const buildHubUrl = (sedeId: string, tab: HubTab = DEFAULT_HUB_TAB): string => {
  const params = new URLSearchParams();
  params.set('sede', sedeId);
  params.set('tab', tab);
  return `/?${params.toString()}`;
};
