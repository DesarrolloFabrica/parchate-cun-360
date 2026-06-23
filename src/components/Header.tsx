import React from 'react';
import { Sparkles, Globe, Compass, GraduationCap, ArrowLeft, HeartHandshake } from 'lucide-react';
import type { AppRoute } from '../navigation';

interface HeaderProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setRoute }) => {
  return (
    <header className="sticky top-0 z-50 bg-brand-green-dark/95 backdrop-blur-md border-b-2 border-brand-green-main/30 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left Side: Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setRoute('home')}>
          {/* Custom Modern LineArt CUN style logo with neon highlight */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-brand-green-dark border-2 border-brand-green-neon overflow-hidden shadow-[0_0_10px_rgba(155,255,0,0.3)]">
            <GraduationCap className="w-6 h-6 text-brand-green-neon animate-pulse" strokeWidth={2} />
            <div className="absolute bottom-0 inset-x-0 h-1 bg-brand-green-main" />
            <span className="sr-only">CUN Onboarding</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-xl tracking-tight text-white">
                PÁRCHATE <span className="text-brand-green-neon drop-shadow-[0_0_8px_#9BFF00]">CUN</span>
              </span>
              <span className="h-4 w-0.5 bg-brand-green-main/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* Center: Interactive Modality Badge in modern tech pill with neon neon glow */}
        {currentRoute !== 'home' && (
          <div className="hidden md:flex items-center py-1.5 px-4 rounded-full bg-brand-green-dark/80 border border-brand-green-neon/50 text-xs shadow-[0_0_8px_rgba(155,255,0,0.15)]">
            <span className="text-slate-300 mr-2 font-mono uppercase tracking-wider">MODO:</span>
            {currentRoute === 'virtual' ? (
              <span className="flex items-center font-black text-brand-green-neon uppercase tracking-widest font-mono">
                <Globe className="w-4 h-4 mr-1.5 animate-spin-slow text-brand-green-neon" />
                VIRTUAL 100% ONLINE
              </span>
            ) : currentRoute === 'hub' ? (
              <span className="flex items-center font-black text-brand-green-neon uppercase tracking-widest font-mono">
                <Sparkles className="w-4 h-4 mr-1.5 animate-pulse text-brand-green-neon" />
                HUB INTEGRADO
              </span>
            ) : (
              <span className="flex items-center font-black text-brand-green-neon uppercase tracking-widest font-mono">
                <Compass className="w-4 h-4 mr-1.5 animate-pulse text-brand-green-neon" />
                CAMPUS PRESENCIAL
              </span>
            )}
          </div>
        )}

        {/* Right Side: Back/Home Controls + Help Support */}
        <div className="flex items-center space-x-3 text-white">
          {currentRoute !== 'home' ? (
            <button
              onClick={() => setRoute('home')}
              className="flex items-center px-4 py-2 text-xs font-black font-display text-brand-blue-dark bg-brand-green-neon hover:bg-brand-green-neon/90 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(155,255,0,0.4)] hover:shadow-[0_0_20px_rgba(155,255,0,0.6)] group border-none cursor-pointer uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 stroke-[3px]" />
              Inicio
            </button>
          ) : null}

          {/* Contact help lineart badge */}
          <div className="relative group p-2 text-white hover:text-brand-green-neon rounded-xl border border-brand-green-main/30 hover:border-brand-green-neon hover:shadow-[0_0_10px_rgba(155,255,0,0.3)] transition-all bg-brand-green-dark/50 cursor-pointer">
            <HeartHandshake className="w-5 h-5 pointer-events-none" strokeWidth={1.8} />
            <span className="absolute right-0 top-12 w-48 p-3 text-[10px] font-mono leading-relaxed text-brand-blue-dark bg-white border-2 border-brand-green-neon rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 text-center font-bold">
              ¿DUDAS O PREGUNTAS? <br/>
              <span className="text-brand-green-main">Contáctanos con Bienestar CUN para guiarte de inmediato.</span>
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
