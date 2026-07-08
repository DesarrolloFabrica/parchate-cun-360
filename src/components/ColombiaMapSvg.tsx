import React from 'react';
import {
  COLOMBIA_MAP_VIEWBOX,
  colombiaDepartmentPaths,
} from '../data/sedes/colombiaMapPaths';
import type { MapCityPin } from '../types/sede';
import '../styles/colombia-map.css';

interface ColombiaMapSvgProps {
  cities: MapCityPin[];
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
  className?: string;
}

const { width: MAP_WIDTH, height: MAP_HEIGHT } = COLOMBIA_MAP_VIEWBOX;

const toMapX = (percent: number) => (percent / 100) * MAP_WIDTH;
const toMapY = (percent: number) => (percent / 100) * MAP_HEIGHT;

/**
 * Mapa de Colombia por departamentos con pins de sedes CUN.
 * Asset: `src/assets/maps/colombia-departments.svg` (reemplazable).
 */
export const ColombiaMapSvg: React.FC<ColombiaMapSvgProps> = ({
  cities,
  selectedCityId,
  onSelectCity,
  className,
}) => {
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className={`colombia-map-svg ${className ?? ''}`}
      role="img"
      aria-label="Mapa de Colombia con sedes CUN"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="sede-pin-glow-active" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sede-pin-glow-soon" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="colombia-map-vignette" cx="50%" cy="50%" r="68%">
          <stop offset="0%" stopColor="rgba(53,184,74,0.06)" />
          <stop offset="100%" stopColor="rgba(1,12,8,0.35)" />
        </radialGradient>
      </defs>

      {/* Fondo atmosférico */}
      <rect
        x={0}
        y={0}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        fill="url(#colombia-map-vignette)"
        rx={12}
      />

      {/* Departamentos */}
      <g className="colombia-departments" aria-hidden="true">
        {colombiaDepartmentPaths.map((department) => (
          <path
            key={department.id}
            id={department.id}
            data-name={department.name}
            d={department.d}
            className="colombia-dept-path"
          />
        ))}
      </g>

      {/* Pins de ciudades */}
      <g className="colombia-sede-pins">
        {cities.map((city) => {
          const isSelected = city.id === selectedCityId;
          const isActive = city.status === 'active';
          const cx = toMapX(city.mapPosition.x);
          const cy = toMapY(city.mapPosition.y);

          return (
            <g
              key={city.id}
              className="cursor-pointer"
              onClick={() => onSelectCity(city.id)}
              role="button"
              tabIndex={0}
              aria-label={`${city.shortName}${isActive ? ', disponible' : ', próximamente'}`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectCity(city.id);
                }
              }}
            >
              {isActive && isSelected && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={22}
                  fill="none"
                  stroke="rgba(155,255,0,0.5)"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
              )}
              {!isActive && isSelected && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={20}
                  fill="none"
                  stroke="rgba(251,191,36,0.5)"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
              )}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 16 : 12}
                  fill="rgba(155,255,0,0.2)"
                  stroke="rgba(155,255,0,0.4)"
                  strokeWidth="1.25"
                  filter={isSelected ? 'url(#sede-pin-glow-active)' : undefined}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 10 : 8}
                fill={isActive ? '#9BFF00' : '#fbbf24'}
                stroke="#0B3D2E"
                strokeWidth="2.25"
                filter={
                  isSelected
                    ? isActive
                      ? 'url(#sede-pin-glow-active)'
                      : 'url(#sede-pin-glow-soon)'
                    : undefined
                }
              />
              <text
                x={cx}
                y={cy - 16}
                textAnchor="middle"
                className="colombia-sede-pin-label"
              >
                {city.shortName}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
