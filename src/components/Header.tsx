import React from 'react';
import { Sparkles, Globe, Compass, GraduationCap, ArrowLeft } from 'lucide-react';
import type { AppRoute } from '../navigation';

interface HeaderProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setRoute }) => {
  return (
    <header className="app-header transition-all">
      <div className="w-full max-w-[1500px] 2xl:max-w-[1680px] mx-auto px-2 sm:px-4 lg:px-6 h-18 flex items-center justify-between gap-4">
        
        {/* Marca institucional — jerarquía: logo → nombre → mensaje */}
        <div className="group flex items-center gap-3 cursor-pointer select-none min-w-0" onClick={() => setRoute('home')}>
          {/* Logo CUN: borde sutil por defecto, acento neón al hover */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-surface-raised border border-border-subtle group-hover:border-brand-green-neon overflow-hidden transition-all group-hover:shadow-[0_0_10px_rgba(155,255,0,0.3)] shrink-0">
            <GraduationCap className="w-6 h-6 text-brand-green-main group-hover:text-brand-green-neon transition-colors" strokeWidth={2} />
            <div className="absolute bottom-0 inset-x-0 h-1 bg-brand-green-main" />
            <span className="sr-only">CUN Onboarding</span>
          </div>
          <div className="flex flex-col min-w-0 leading-none">
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-text-primary leading-none">
              PÁRCHATE <span className="text-brand-green-neon">CUN</span>
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-text-muted tracking-wide mt-1 truncate">
              Inducción institucional para estudiantes nuevos
            </span>
          </div>
        </div>

        {/* Center: píldora de modalidad — borde sutil, neón como acento */}
        {currentRoute !== 'home' && currentRoute !== 'sedes' && (
          <div className="hidden md:flex items-center py-1.5 px-4 rounded-full bg-surface-raised/80 border border-border-subtle text-xs">
            <span className="text-text-muted mr-2 uppercase tracking-wider">Modo:</span>
            {currentRoute === 'virtual' ? (
              <span className="flex items-center font-bold text-brand-green-main uppercase tracking-wider">
                <Globe className="w-4 h-4 mr-1.5 text-brand-green-main" />
                Virtual 100% online
              </span>
            ) : currentRoute === 'hub' ? (
              <span className="flex items-center font-bold text-brand-green-main uppercase tracking-wider">
                <Sparkles className="w-4 h-4 mr-1.5 text-brand-green-main" />
                Hub integrado
              </span>
            ) : (
              <span className="flex items-center font-bold text-brand-green-main uppercase tracking-wider">
                <Compass className="w-4 h-4 mr-1.5 text-brand-green-main" />
                Campus presencial
              </span>
            )}
          </div>
        )}

        {/* Right Side: Back/Home Controls */}
        <div className="flex items-center space-x-3 text-white">
          {currentRoute !== 'home' ? (
            <button
              onClick={() => setRoute('home')}
              className="action-primary group uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 stroke-[3px]" />
              Inicio
            </button>
          ) : null}
        </div>

      </div>
    </header>
  );
};
