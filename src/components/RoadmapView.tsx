import React, { useMemo } from 'react';
import { Award } from 'lucide-react';
import { RoadmapNode } from './RoadmapNode';
import { RoadmapDecor } from './RoadmapDecor';
import type { RoadmapPoint, RoadmapVariant } from '../types/roadmap';
import { resolveRoadmapNodeStatus } from '../types/roadmap';
import { buildRoadmapPath } from '../utils/roadmapPath';
import '../styles/roadmap.css';

export interface RoadmapViewProps<T extends RoadmapPoint = RoadmapPoint> {
  variant: RoadmapVariant;
  title: string;
  stations: T[];
  completedStationIds: string[];
  shouldShowRouteLocks: boolean;
  progressCompleted: number;
  progressTotal: number;
  onOpenStation: (station: T) => void;
  onStartFirstStation: () => void;
}

export function RoadmapView<T extends RoadmapPoint>({
  variant,
  title,
  stations,
  completedStationIds,
  shouldShowRouteLocks,
  progressCompleted,
  progressTotal,
  onOpenStation,
  onStartFirstStation,
}: RoadmapViewProps<T>) {
  const progressPercent =
    progressTotal > 0 ? (progressCompleted / progressTotal) * 100 : 0;

  const pathD = useMemo(() => buildRoadmapPath(stations), [stations]);

  return (
    <div className={`roadmap-view roadmap-view--${variant}`}>
      <div className="roadmap-view__header">
        <span className="roadmap-view__title">MUEVE TU CARÁCTER: {title}</span>
      </div>

      <section
        className={`roadmap roadmap--${variant}`}
        data-roadmap-variant={variant}
        aria-label={`Mapa de ruta ${title}`}
      >
        <div className="roadmap__grid" aria-hidden="true" />
        <div className="roadmap__ambient roadmap__ambient--one" aria-hidden="true" />
        <div className="roadmap__ambient roadmap__ambient--two" aria-hidden="true" />
        <div className="roadmap__vignette" aria-hidden="true" />
        <RoadmapDecor />

        <div className="roadmap__hint">
          <p className="roadmap__hint-title">ESTACIONES DE LA RUTA</p>
          <p className="roadmap__hint-copy">DEBES COMPLETAR EN ORDEN (1 al 9)</p>
        </div>

        <div className="roadmap__stage">
          <svg
            className="roadmap-path-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ color: 'var(--roadmap-accent-soft)' }}
          >
            <defs>
              <pattern
                id={`roadmap-grid-dots-${variant}`}
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="0.35" cy="0.35" r="0.18" fill="currentColor" opacity="0.45" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#roadmap-grid-dots-${variant})`} />

            <g className="roadmap__blueprint-shapes">
              <rect x="7" y="10" width="13" height="48" rx="0.6" />
              <rect x="43" y="20" width="15" height="25" rx="0.7" />
              <rect x="76" y="20" width="13" height="38" rx="0.5" />
            </g>

            {pathD && (
              <>
                <path className="roadmap-path roadmap-path--glow" d={pathD} />
                <path className="roadmap-path roadmap-path--main" d={pathD} />
              </>
            )}
          </svg>

          <div className="roadmap__nodes roadmap-map">
            {stations.map((station, idx) => (
              <RoadmapNode
                key={station.id}
                station={station}
                index={idx}
                status={resolveRoadmapNodeStatus(
                  idx,
                  station.id,
                  stations,
                  completedStationIds,
                  shouldShowRouteLocks,
                )}
                onOpen={onOpenStation}
              />
            ))}
          </div>
        </div>
      </section>

      <div className={`roadmap-progress roadmap--${variant}`}>
        <div className="roadmap-progress__label">
          <Award className="roadmap-progress__icon" />
          <span>PROGRESO COMPLETADO:</span>
        </div>
        <div className="roadmap-progress__bar">
          <div
            className="roadmap-progress__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="roadmap-progress__count">
          {progressCompleted} / {progressTotal}
        </span>
      </div>
    </div>
  );
}

export default RoadmapView;
