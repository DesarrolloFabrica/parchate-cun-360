import type { RoadmapPoint } from '../types/roadmap';

/**
 * Construye un path SVG en espacio 0–100 alineado con coordinateX / coordinateY (%).
 * Conecta el centro visual de cada estación en orden de `number`.
 */
export function buildRoadmapPath(points: RoadmapPoint[]): string {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => a.number - b.number);

  return sortedPoints
    .map((point, index) => {
      const x = point.coordinateX;
      const y = point.coordinateY;

      if (index === 0) {
        return `M ${x} ${y}`;
      }

      const previous = sortedPoints[index - 1];
      const prevX = previous.coordinateX;
      const prevY = previous.coordinateY;

      const controlX1 = prevX + (x - prevX) * 0.35;
      const controlY1 = prevY + (y - prevY) * 0.15;
      const controlX2 = prevX + (x - prevX) * 0.65;
      const controlY2 = prevY + (y - prevY) * 0.85;

      return `C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${y}`;
    })
    .join(' ');
}
