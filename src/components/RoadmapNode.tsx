import React from 'react';
import type { RoadmapNodeStatus, RoadmapPoint } from '../types/roadmap';

export interface RoadmapNodeProps<T extends RoadmapPoint = RoadmapPoint> {
  station: T;
  index: number;
  status: RoadmapNodeStatus;
  onOpen: (station: T) => void;
}

export function RoadmapNode<T extends RoadmapPoint>({
  station,
  index,
  status,
  onOpen,
}: RoadmapNodeProps<T>) {
  const isLocked = status === 'locked';
  const shortTitle = station.title.split(' ')[0];
  const labelText = `${index + 1}. ${shortTitle}`;

  return (
    <div
      className={`roadmap-node roadmap-node--${status}`}
      style={{ left: `${station.coordinateX}%`, top: `${station.coordinateY}%` }}
    >
      <div className="roadmap-node__label">
        {labelText}
        {isLocked && <span className="roadmap-node__label-lock" aria-hidden="true"> 🔒</span>}
      </div>

      <button
        type="button"
        className="roadmap-node__button"
        onClick={() => onOpen(station)}
        disabled={isLocked}
        tabIndex={isLocked ? -1 : 0}
        aria-disabled={isLocked}
        aria-label={`Abrir estación ${station.number}: ${station.title}${isLocked ? ' (bloqueada)' : ''}`}
      >
        <span className="roadmap-node__inner-ring" aria-hidden="true" />
        <span className="roadmap-node__icon" aria-hidden="true">
          {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : station.number}
        </span>
      </button>
    </div>
  );
}

export default RoadmapNode;
