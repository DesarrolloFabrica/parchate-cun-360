import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Compass, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColombiaMapSvg } from './ColombiaMapSvg';
import {
  cityHasMultipleCampuses,
  DEFAULT_CAMPUS_ID,
  getAllCities,
  getCampusesByCityId,
  getCampusConfig,
  getCityConfig,
  getMapCityPins,
  isValidCityId,
} from '../data/sedes';
import { DEFAULT_HUB_TAB } from '../navigation';
import type { CampusConfig, CampusId, CityConfig, CityId } from '../types/sede';

/** Altura útil en desktop: viewport − header sticky (4.5rem). */
const SEDES_VIEWPORT_HEIGHT = 'calc(100vh - 4.5rem)';

export const SedeSelectorMap: React.FC = () => {
  const navigate = useNavigate();
  const cities = getAllCities();
  const mapCityPins = getMapCityPins();

  const [selectedCityId, setSelectedCityId] = useState<CityId>('bogota');
  const [selectedCampusId, setSelectedCampusId] = useState<CampusId | null>(DEFAULT_CAMPUS_ID);
  const [expandedCityIds, setExpandedCityIds] = useState<Set<CityId>>(() => new Set(['bogota']));

  const selectedCity = getCityConfig(selectedCityId);
  const campusesForCity = getCampusesByCityId(selectedCityId);
  const selectedCampus =
    selectedCampusId !== null ? getCampusConfig(selectedCampusId) : null;

  const isCityExpanded = (cityId: CityId) => expandedCityIds.has(cityId);

  const navigateToCampusHub = (campusId: CampusId) => {
    navigate(`/?sede=${campusId}&tab=${DEFAULT_HUB_TAB}`);
  };

  const handleSelectCity = (cityId: string) => {
    if (!isValidCityId(cityId)) {
      return;
    }

    const isSameCity = cityId === selectedCityId;

    if (cityHasMultipleCampuses(cityId)) {
      setSelectedCityId(cityId);

      setExpandedCityIds((prev) => {
        const next = new Set<CityId>();
        if (isSameCity) {
          if (prev.has(cityId)) {
            return next;
          }
          next.add(cityId);
          return next;
        }
        next.add(cityId);
        return next;
      });

      if (!isSameCity) {
        setSelectedCampusId(null);
      }
      return;
    }

    const campusId = getCampusesByCityId(cityId)[0]?.id;
    if (campusId) {
      navigateToCampusHub(campusId);
    }
  };

  const handleSelectCampus = (campusId: CampusId) => {
    navigateToCampusHub(campusId);
  };

  const handleExplore = () => {
    const campus = selectedCampus ?? campusesForCity[0];
    if (campus) {
      navigateToCampusHub(campus.id);
    }
  };

  const exploreEnabled =
    selectedCampus !== null || !cityHasMultipleCampuses(selectedCityId);

  return (
    <div
      className="sedes-selector relative isolate overflow-x-hidden px-3 py-3 sm:px-4 lg:-mb-16 lg:h-[var(--sedes-viewport-height)] lg:max-h-[var(--sedes-viewport-height)] lg:overflow-hidden lg:py-3"
      style={{ ['--sedes-viewport-height' as string]: SEDES_VIEWPORT_HEIGHT }}
    >
      {/* Capas atmosféricas — mismo lenguaje que el hub (sin bloque verde plano) */}
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(53,184,74,0.11),transparent_42%),radial-gradient(circle_at_14%_78%,rgba(24,66,84,0.1),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_42%)]" />
        <div className="absolute top-[10%] right-[8%] h-56 w-56 rounded-full bg-brand-green-main/[0.07] blur-[110px]" />
        <div className="absolute bottom-[14%] left-[4%] h-64 w-64 rounded-full bg-[rgba(24,66,84,0.14)] blur-[120px]" />
        <div className="absolute inset-x-[8%] top-[38%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col lg:min-h-0">
        <div className="mb-3 shrink-0 lg:mb-2">
          <span className="section-eyebrow">Selecciona tu campus</span>
          <h1 className="section-title mt-1 text-xl sm:text-2xl lg:text-[1.65rem]">
            Explora tu sede en Colombia
          </h1>
          <p className="section-description mt-1 max-w-2xl text-xs sm:text-sm">
            Elige tu ciudad y campus para abrir el panel Tour 360. En Bogotá, Sede A ya tiene
            recorrido disponible.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
          {/* Columna izquierda ~40% — lista con scroll propio */}
          <div className="flex w-full min-h-0 flex-col gap-3 lg:w-[40%]">
            <p className="m-0 flex min-h-[14px] shrink-0 items-center text-[10px] font-mono font-black uppercase tracking-widest text-brand-green-neon">
              Ciudades CUN en Colombia
            </p>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1 lg:max-h-full">
              <div className="grid grid-cols-1 gap-1.5 pb-1">
                {cities.map((city) => {
                  const isAccordion = cityHasMultipleCampuses(city.id);
                  const isSelected = city.id === selectedCityId;
                  const isExpanded = isAccordion && isCityExpanded(city.id);

                  return (
                    <div key={city.id} className="flex flex-col gap-0">
                      <CityListButton
                        city={city}
                        isSelected={isSelected}
                        isExpanded={isExpanded}
                        isAccordion={isAccordion}
                        onSelect={() => handleSelectCity(city.id)}
                      />

                      <AnimatePresence initial={false}>
                        {isAccordion && isExpanded ? (
                          <motion.div
                            key={`${city.id}-campuses`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="ml-2 mt-1 space-y-1 border-l border-brand-green-main/25 bg-white/[0.02] py-1.5 pl-2.5 pr-0.5 backdrop-blur-sm">
                              {getCampusesByCityId(city.id).map((campus) => (
                                <CampusListButton
                                  key={campus.id}
                                  campus={campus}
                                  isSelected={campus.id === selectedCampusId}
                                  onSelect={() => handleSelectCampus(campus.id)}
                                />
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <SelectionDetailCard
              city={selectedCity}
              campus={selectedCampus}
              requiresCampusSelection={cityHasMultipleCampuses(selectedCityId)}
              exploreEnabled={exploreEnabled}
              onExplore={handleExplore}
            />
          </div>

          {/* Columna derecha ~60% — mapa fijo */}
          <div className="flex min-h-0 w-full flex-col gap-3 lg:w-[60%] lg:shrink-0">
            <div className="m-0 flex min-h-[14px] shrink-0 items-center justify-between gap-2">
              <p className="m-0 text-[10px] font-mono font-black uppercase tracking-widest text-white/50">
                Mapa de ciudades
              </p>
              <div className="hidden items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-white/40 sm:flex">
                <Sparkles className="h-3 w-3 text-brand-green-main/60" />
                Colombia
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center lg:sticky lg:top-0">
              <ColombiaMapSvg
                cities={mapCityPins}
                selectedCityId={selectedCityId}
                onSelectCity={handleSelectCity}
                className="h-auto w-full max-h-[min(70vh,620px)] max-w-[min(100%,520px)] lg:max-h-[min(calc(100vh-11rem),620px)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CityListButtonProps {
  city: CityConfig;
  isSelected: boolean;
  isExpanded: boolean;
  isAccordion: boolean;
  onSelect: () => void;
}

const CityListButton: React.FC<CityListButtonProps> = ({
  city,
  isSelected,
  isExpanded,
  isAccordion,
  onSelect,
}) => {
  const hasActiveCampus = getCampusesByCityId(city.id).some((campus) => campus.status === 'active');

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
        isSelected
          ? 'border-brand-green-main bg-white/[0.08] shadow-[0_0_0_1px_rgba(53,184,74,0.25)]'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
      }`}
    >
      <div>
        <p className="text-xs font-black text-white">{city.name}</p>
        <p className="text-[10px] font-mono font-bold uppercase tracking-wide text-text-muted">
          {city.region} · {hasActiveCampus ? 'Con recorridos' : 'Próximamente'}
        </p>
      </div>
      <ChevronRight
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isSelected ? 'text-brand-green-neon' : 'text-text-muted'
        } ${isAccordion && isExpanded ? 'rotate-90' : ''}`}
      />
    </button>
  );
};

interface CampusListButtonProps {
  campus: CampusConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const CampusListButton: React.FC<CampusListButtonProps> = ({ campus, isSelected, onSelect }) => {
  const isActive = campus.status === 'active';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left transition-all ${
        isSelected
          ? 'border-brand-green-main/80 bg-white/[0.07] shadow-[0_0_0_1px_rgba(53,184,74,0.2)]'
          : isActive
            ? 'border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]'
            : 'border-white/6 bg-white/[0.015] text-white/70 hover:border-amber-400/20 hover:bg-amber-400/5'
      }`}
    >
      <div className="min-w-0">
        <p
          className={`truncate text-[11px] font-bold ${isSelected ? 'text-white' : isActive ? 'text-white/90' : 'text-white/65'}`}
        >
          {campus.shortName}
        </p>
        <p
          className={`text-[10px] font-mono uppercase tracking-wide ${
            isActive ? 'text-brand-green-neon/80' : 'text-amber-400/80'
          }`}
        >
          {isActive ? 'Disponible' : 'Próximamente'}
        </p>
      </div>
      <ChevronRight
        className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-brand-green-neon' : 'text-text-muted/70'}`}
      />
    </button>
  );
};

interface SelectionDetailCardProps {
  city: CityConfig;
  campus: CampusConfig | null;
  requiresCampusSelection: boolean;
  exploreEnabled: boolean;
  onExplore: () => void;
}

const SelectionDetailCard: React.FC<SelectionDetailCardProps> = ({
  city,
  campus,
  requiresCampusSelection,
  exploreEnabled,
  onExplore,
}) => {
  const title = campus?.name ?? city.name;
  const description =
    campus?.narrative.description ??
    (requiresCampusSelection
      ? `Bogotá cuenta con varios campus. Despliega la ciudad y elige uno para abrir el Tour 360.`
      : 'El recorrido 360 de esta ciudad estará disponible pronto.');

  const statusLabel = campus
    ? campus.status === 'active' && campus.tour360.enabled
      ? 'Recorrido activo'
      : 'Próximamente'
    : requiresCampusSelection
      ? 'Selecciona campus'
      : 'Próximamente';

  const isActiveStatus = campus?.status === 'active' && campus.tour360.enabled;

  const exploreLabel = isActiveStatus
    ? 'Explorar sede'
    : campus
      ? 'Ver próximamente'
      : requiresCampusSelection
        ? 'Selecciona un campus'
        : 'Ver próximamente';

  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(53,184,74,0.08),transparent_48%)]" />
      <div className="absolute top-0 right-0 p-2 text-white/5">
        <MapPin className="h-12 w-12" />
      </div>

      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isActiveStatus
                ? 'bg-brand-green-neon'
                : requiresCampusSelection && !campus
                  ? 'bg-sky-400'
                  : 'bg-amber-400'
            }`}
          />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-text-muted">
            {statusLabel}
          </span>
        </div>

        <h4 className="font-display text-base font-black text-white">{title}</h4>
        <p className="text-[11px] leading-relaxed text-text-secondary">{description}</p>

        <button
          type="button"
          onClick={onExplore}
          disabled={!exploreEnabled}
          className="action-primary w-full justify-center py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Compass className="h-4 w-4" />
          {exploreLabel}
        </button>
      </div>
    </div>
  );
};
