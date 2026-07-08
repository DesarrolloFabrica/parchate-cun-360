import colombiaMapSvgRaw from '../../assets/maps/colombia-departments.svg?raw';

/** ViewBox del asset @svg-maps/colombia (CC BY 4.0 / MapSVG). */
export const COLOMBIA_MAP_VIEWBOX = { width: 613, height: 694 } as const;

export interface ColombiaDepartmentPath {
  id: string;
  name: string;
  d: string;
}

export function extractColombiaDepartmentPaths(svgRaw: string): ColombiaDepartmentPath[] {
  const paths: ColombiaDepartmentPath[] = [];
  const pattern = /<path\s+id="([^"]+)"\s+aria-label="([^"]+)"\s+d="([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(svgRaw)) !== null) {
    paths.push({ id: match[1], name: match[2], d: match[3] });
  }

  return paths;
}

/** Paths de departamentos extraídos del SVG. Reemplazar el asset en `assets/maps/` si se actualiza el mapa. */
export const colombiaDepartmentPaths = extractColombiaDepartmentPaths(colombiaMapSvgRaw);
