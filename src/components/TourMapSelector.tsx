import React, { useMemo, useState } from 'react';
import { Building2, MapPin, Navigation, RadioTower } from 'lucide-react';
import {
  tourLocations,
  type Tour360Campus,
  type Tour360Location,
} from '../data/tour360Locations';
import { KNOWN_GOOD_PLACEHOLDER_PANORAMA } from '../data/tour360';

type TourMapSelectorProps = {
  locations?: Tour360Location[];
  onSelectCampus: (campus: Tour360Campus) => void;
};

export const TourMapSelector: React.FC<TourMapSelectorProps> = ({
  locations = tourLocations,
  onSelectCampus,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id ?? null);
  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId) ?? locations[0],
    [locations, selectedLocationId],
  );

  return (
    <section className="relative h-full min-h-[clamp(560px,78vh,820px)] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#020603] text-white shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(155,255,0,0.16),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(0,255,102,0.12),transparent_34%),linear-gradient(135deg,rgba(8,12,9,0.98),rgba(0,0,0,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(155,255,0,0.38)_1px,transparent_1px)] [background-size:clamp(14px,2vw,20px)_clamp(14px,2vw,20px)] [mask-image:radial-gradient(circle_at_46%_45%,black,transparent_74%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(155,255,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(155,255,0,0.05)_1px,transparent_1px)] bg-[size:clamp(48px,8vw,84px)_clamp(48px,8vw,84px)] opacity-50" />

      <div className="relative z-10 grid h-full min-h-[clamp(560px,78vh,820px)] grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
        <div className="relative flex min-h-[clamp(360px,58vh,640px)] flex-col p-4 sm:p-7 lg:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="m-0 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#9BFF00]">
                <RadioTower className="h-4 w-4" />
                Selector nacional
              </p>
              <h2 className="m-0 mt-2 text-3xl font-black leading-none text-white sm:text-4xl">
                Elige tu sede 360
              </h2>
            </div>
            <div className="rounded-2xl border border-[#9BFF00]/25 bg-black/35 px-4 py-3 text-right shadow-[0_0_30px_rgba(155,255,0,0.10)] backdrop-blur-md">
              <p className="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                Disponible
              </p>
              <p className="m-0 mt-1 text-sm font-black text-[#9BFF00]">
                {locations.length} ciudad{locations.length === 1 ? '' : 'es'}
              </p>
            </div>
          </div>

          <div className="relative mt-7 flex flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-[#9BFF00]/15 bg-black/25 shadow-[0_0_42px_rgba(155,255,0,0.10),inset_0_0_80px_rgba(155,255,0,0.06)] aspect-[4/5] min-h-[320px] max-h-[min(68vh,620px)] lg:aspect-auto lg:max-h-none">
            <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle,rgba(155,255,0,0.34)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]" />
            <svg
              viewBox="0 0 520 620"
              className="relative z-10 h-[min(65vh,560px)] w-[min(88%,520px)] drop-shadow-[0_0_30px_rgba(155,255,0,0.34)]"
              role="img"
              aria-label="Mapa estilizado de Colombia"
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

            {locations.map((location) => {
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
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#9BFF00] bg-[#041208]/85 shadow-[0_0_24px_rgba(155,255,0,0.55)] transition hover:scale-110 sm:h-14 sm:w-14">
                    <span className="absolute inset-[-10px] rounded-full border border-[#9BFF00]/25 animate-ping" />
                    <span className="absolute inset-[-18px] rounded-full bg-[#9BFF00]/10 blur-md" />
                    <MapPin className="relative h-6 w-6 text-[#9BFF00]" />
                  </span>
                  <span className={`absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] backdrop-blur-md ${isSelected ? 'border-[#9BFF00]/60 bg-[#9BFF00] text-black' : 'border-white/15 bg-black/55 text-white'}`}>
                    {location.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="relative z-10 max-h-[44vh] overflow-hidden rounded-t-[28px] border-t border-[#9BFF00]/15 bg-black/45 p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5 lg:max-h-none lg:overflow-hidden lg:rounded-none lg:border-l lg:border-t-0 lg:p-6">
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

          <div className="mt-5 max-h-[calc(44vh-96px)] space-y-3 overflow-y-auto pr-1 lg:max-h-[calc(100vh-260px)]">
            {(selectedLocation?.campuses ?? []).map((campus) => (
              <button
                key={campus.id}
                type="button"
                onClick={() => onSelectCampus(campus)}
                className="group grid w-full grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5 hover:border-[#9BFF00]/45 hover:bg-[#9BFF00]/10 hover:shadow-[0_0_26px_rgba(155,255,0,0.12)] sm:grid-cols-[76px_minmax(0,1fr)]"
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
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default TourMapSelector;
