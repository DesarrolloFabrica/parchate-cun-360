import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, MapPin, Navigation, RadioTower } from 'lucide-react';
import {
  tourLocations,
  type Tour360Campus,
  type Tour360Location,
} from '../data/tour360Locations';
import { KNOWN_GOOD_PLACEHOLDER_PANORAMA } from '../data/tour360';

type TourMapSelectorProps = {
  locations?: Tour360Location[];
  /** Ciudad bloqueada (p. ej. Bogotá): oculta otras ciudades y muestra sedes en el mapa. */
  initialLocationId?: string;
  onSelectCampus: (campus: Tour360Campus) => void;
  onBackToMap?: () => void;
};

const resolveCampusMarker = (
  campus: Tour360Campus,
  location: Tour360Location,
  index: number,
  total: number,
): { x: number; y: number } => {
  if (campus.marker) return campus.marker;

  // Fallback: abanico ligero alrededor del pin de la ciudad.
  const spread = Math.min(10, 4 + total);
  const angle = (index / Math.max(total, 1)) * Math.PI * 1.4 - 0.7;
  return {
    x: location.marker.x + Math.cos(angle) * spread * 0.45,
    y: location.marker.y + Math.sin(angle) * spread * 0.55,
  };
};

export const TourMapSelector: React.FC<TourMapSelectorProps> = ({
  locations = tourLocations,
  initialLocationId,
  onSelectCampus,
  onBackToMap,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState(
    initialLocationId ?? locations[0]?.id ?? null,
  );
  const [focusedCampusId, setFocusedCampusId] = useState<string | null>(null);

  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId) ?? locations[0],
    [locations, selectedLocationId],
  );

  const isLocationLocked = Boolean(initialLocationId);

  const mapCampuses = useMemo(() => {
    if (!selectedLocation) return [];
    return selectedLocation.campuses.map((campus, index) => ({
      campus,
      marker: resolveCampusMarker(
        campus,
        selectedLocation,
        index,
        selectedLocation.campuses.length,
      ),
    }));
  }, [selectedLocation]);

  useEffect(() => {
    if (initialLocationId && locations.some((location) => location.id === initialLocationId)) {
      setSelectedLocationId(initialLocationId);
    }
  }, [initialLocationId, locations]);

  useEffect(() => {
    setFocusedCampusId(null);
  }, [selectedLocationId]);

  const headerEyebrow = isLocationLocked ? 'Selector de sedes' : 'Selector nacional';
  const headerTitle = isLocationLocked
    ? `Sedes ${selectedLocation?.city ?? ''}`.trim()
    : 'Elige tu sede 360';
  const availabilityLabel = isLocationLocked
    ? `${mapCampuses.length} sede${mapCampuses.length === 1 ? '' : 's'}`
    : `${locations.length} ciudad${locations.length === 1 ? '' : 'es'}`;

  return (
    <section className="relative h-full min-h-[clamp(500px,72vh,760px)] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#020603] text-white shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(155,255,0,0.16),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(0,255,102,0.12),transparent_34%),linear-gradient(135deg,rgba(8,12,9,0.98),rgba(0,0,0,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(155,255,0,0.38)_1px,transparent_1px)] [background-size:clamp(14px,2vw,20px)_clamp(14px,2vw,20px)] [mask-image:radial-gradient(circle_at_46%_45%,black,transparent_74%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(155,255,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(155,255,0,0.05)_1px,transparent_1px)] bg-[size:clamp(48px,8vw,84px)_clamp(48px,8vw,84px)] opacity-50" />

      <div className="relative z-10 grid h-full min-h-0 grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="relative flex min-h-0 flex-col p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="m-0 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#9BFF00]">
                <RadioTower className="h-4 w-4" />
                {headerEyebrow}
              </p>
              <h2 className="m-0 mt-2 text-3xl font-black leading-none text-white sm:text-4xl">
                {headerTitle}
              </h2>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {onBackToMap && (
                <button
                  type="button"
                  onClick={onBackToMap}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/75 backdrop-blur-md transition hover:border-[#9BFF00]/45 hover:text-[#9BFF00]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Volver al mapa
                </button>
              )}
              <div className="rounded-2xl border border-[#9BFF00]/25 bg-black/35 px-4 py-3 text-right shadow-[0_0_30px_rgba(155,255,0,0.10)] backdrop-blur-md">
                <p className="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                  Disponible
                </p>
                <p className="m-0 mt-1 text-sm font-black text-[#9BFF00]">
                  {availabilityLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-[#9BFF00]/15 bg-black/25 p-3 shadow-[0_0_42px_rgba(155,255,0,0.10),inset_0_0_80px_rgba(155,255,0,0.06)] aspect-[4/5] min-h-[260px] max-h-[min(58vh,480px)] sm:p-4 lg:aspect-auto lg:max-h-[min(62vh,520px)]">
            <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle,rgba(155,255,0,0.34)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]" />
            <div className="relative z-10 mx-auto aspect-[26/31] w-[min(82vw,280px)] max-h-[min(58vh,480px)] max-w-full shrink sm:w-[min(76vw,340px)] md:w-[min(58vw,380px)] lg:w-[min(48vw,420px)] xl:w-[min(42vw,460px)]">
              <svg
                viewBox="0 0 520 620"
                className="h-full w-full drop-shadow-[0_0_30px_rgba(155,255,0,0.34)]"
                role="img"
                aria-label={
                  isLocationLocked
                    ? `Mapa de sedes en ${selectedLocation?.city ?? 'la ciudad'}`
                    : 'Mapa estilizado de Colombia'
                }
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="colombia-neon-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10351d" stopOpacity="0.92" />
                    <stop offset="55%" stopColor="#041208" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#0d2c18" stopOpacity="0.95" />
                  </linearGradient>
                  <filter id="colombia-glow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M251 27 L310 58 L339 110 L323 165 L358 207 L341 256 L375 301 L353 361 L383 417 L348 468 L309 458 L287 516 L237 590 L192 560 L183 502 L139 475 L150 424 L109 392 L128 338 L101 299 L122 252 L104 203 L137 168 L131 116 L177 89 L196 44 Z"
                  fill="url(#colombia-neon-fill)"
                  stroke="#9BFF00"
                  strokeWidth="4"
                  filter="url(#colombia-glow)"
                />
                <path
                  d="M251 27 L310 58 L339 110 L323 165 L358 207 L341 256 L375 301 L353 361 L383 417 L348 468 L309 458 L287 516 L237 590 L192 560 L183 502 L139 475 L150 424 L109 392 L128 338 L101 299 L122 252 L104 203 L137 168 L131 116 L177 89 L196 44 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.5"
                  strokeDasharray="8 10"
                />
              </svg>

              {isLocationLocked
                ? mapCampuses.map(({ campus, marker }) => {
                    const isFocused = campus.id === focusedCampusId;

                    return (
                      <button
                        key={campus.id}
                        type="button"
                        onClick={() => onSelectCampus(campus)}
                        onMouseEnter={() => setFocusedCampusId(campus.id)}
                        onMouseLeave={() => setFocusedCampusId(null)}
                        onFocus={() => setFocusedCampusId(campus.id)}
                        onBlur={() => setFocusedCampusId(null)}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BFF00]"
                        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                        aria-label={`Iniciar recorrido ${campus.title}`}
                      >
                        <span
                          className={`relative flex items-center justify-center rounded-full border-2 border-[#9BFF00] bg-[#041208]/85 shadow-[0_0_24px_rgba(155,255,0,0.55)] transition hover:scale-110 ${
                            isFocused ? 'h-10 w-10 scale-110 sm:h-12 sm:w-12' : 'h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10'
                          }`}
                        >
                          {isFocused && (
                            <span className="absolute inset-[-10px] rounded-full border border-[#9BFF00]/25 animate-ping" />
                          )}
                          <span className="absolute inset-[-14px] rounded-full bg-[#9BFF00]/10 blur-md" />
                          <Building2 className="relative h-3.5 w-3.5 text-[#9BFF00] sm:h-4 sm:w-4" />
                        </span>
                        <span
                          className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] backdrop-blur-md sm:mt-2 sm:px-2.5 sm:py-1 sm:text-[10px] ${
                            isFocused
                              ? 'border-[#9BFF00]/60 bg-[#9BFF00] text-black'
                              : 'border-white/15 bg-black/55 text-white'
                          }`}
                        >
                          {campus.title}
                        </span>
                      </button>
                    );
                  })
                : locations.map((location) => {
                    const isSelected = location.id === selectedLocation?.id;

                    return (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => setSelectedLocationId(location.id)}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BFF00]"
                        style={{ left: `${location.marker.x}%`, top: `${location.marker.y}%` }}
                        aria-label={`Seleccionar ${location.label}`}
                      >
                        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#9BFF00] bg-[#041208]/85 shadow-[0_0_24px_rgba(155,255,0,0.55)] transition hover:scale-110 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                          <span className="absolute inset-[-10px] rounded-full border border-[#9BFF00]/25 animate-ping" />
                          <span className="absolute inset-[-18px] rounded-full bg-[#9BFF00]/10 blur-md" />
                          <MapPin className="relative h-4 w-4 text-[#9BFF00] sm:h-5 sm:w-5" />
                        </span>
                        <span
                          className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] backdrop-blur-md sm:mt-2 sm:px-2.5 sm:py-1 sm:text-[10px] lg:text-[11px] ${
                            isSelected
                              ? 'border-[#9BFF00]/60 bg-[#9BFF00] text-black'
                              : 'border-white/15 bg-black/55 text-white'
                          }`}
                        >
                          {location.label}
                        </span>
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>

        <aside className="relative z-10 max-h-[38vh] overflow-hidden rounded-t-[28px] border-t border-[#9BFF00]/15 bg-black/45 p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:max-h-[40vh] sm:p-5 lg:max-h-none lg:overflow-hidden lg:rounded-none lg:border-l lg:border-t-0 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="m-0 text-[10px] font-black uppercase tracking-[0.25em] text-white/45">
                {selectedLocation?.department ?? 'Departamento'}
              </p>
              <h3 className="m-0 mt-1 text-2xl font-black text-white">
                {selectedLocation?.city ?? 'Ciudad'}
              </h3>
            </div>
            <Navigation className="h-6 w-6 text-[#9BFF00]" />
          </div>

          <div className="mt-4 max-h-[calc(38vh-90px)] space-y-2.5 overflow-y-auto pr-1 sm:max-h-[calc(40vh-96px)] lg:mt-5 lg:max-h-[calc(100vh-260px)] lg:space-y-3">
            {(selectedLocation?.campuses ?? []).map((campus) => {
              const isFocused = campus.id === focusedCampusId;

              return (
                <button
                  key={campus.id}
                  type="button"
                  onClick={() => onSelectCampus(campus)}
                  onMouseEnter={() => setFocusedCampusId(campus.id)}
                  onMouseLeave={() => setFocusedCampusId(null)}
                  onFocus={() => setFocusedCampusId(campus.id)}
                  onBlur={() => setFocusedCampusId(null)}
                  className={`group grid w-full grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-2xl border p-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5 hover:border-[#9BFF00]/45 hover:bg-[#9BFF00]/10 hover:shadow-[0_0_26px_rgba(155,255,0,0.12)] sm:grid-cols-[76px_minmax(0,1fr)] ${
                    isFocused
                      ? 'border-[#9BFF00]/45 bg-[#9BFF00]/10'
                      : 'border-white/10 bg-white/[0.04]'
                  }`}
                >
                  <img
                    src={campus.thumbnail || KNOWN_GOOD_PLACEHOLDER_PANORAMA}
                    alt={campus.title}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = KNOWN_GOOD_PLACEHOLDER_PANORAMA;
                    }}
                    className="h-16 w-[72px] rounded-xl border border-white/10 object-cover shadow-[0_10px_28px_rgba(0,0,0,0.35)] sm:w-[76px]"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-black text-white">
                      <Building2 className="h-4 w-4 shrink-0 text-[#9BFF00]" />
                      <span className="truncate">{campus.title}</span>
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45 group-hover:text-[#9BFF00]">
                      Iniciar recorrido
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default TourMapSelector;
