import React from 'react';
import { Compass, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CAMPUS_ID } from '../data/sedes';
import type { CampusConfig } from '../types/sede';

interface SedeUnavailableFallbackProps {
  sede: CampusConfig;
}

export const SedeUnavailableFallback: React.FC<SedeUnavailableFallbackProps> = ({ sede }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-black/35 p-8 text-center shadow-panel backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
          <Lock className="h-7 w-7 text-amber-300" strokeWidth={1.8} />
        </div>

        <span className="section-eyebrow text-amber-300">Recorrido no disponible</span>
        <h2 className="section-title mt-2 text-xl sm:text-2xl">{sede.narrative.title}</h2>
        <p className="section-description mx-auto mt-3 max-w-md text-sm text-text-secondary">
          {sede.narrative.description}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate(`/?sede=${DEFAULT_CAMPUS_ID}&tab=recorrido360`)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white/85 transition hover:border-brand-green-main hover:bg-white/10"
          >
            <Compass className="h-4 w-4 text-brand-green-neon" />
            Explorar Sede A
          </button>
        </div>
      </div>
    </div>
  );
};
