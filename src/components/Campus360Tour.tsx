import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, ExternalLink, MapPin, Building } from 'lucide-react';
import { campusHotspots } from '../data';
import { CampusHotspot } from '../types';

export const Campus360Tour: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<CampusHotspot>(campusHotspots[0]);

  return (
    <div className="space-y-8 animate-fadeIn" id="campus-360-tour-panel">
      
      {/* Title Header with brand-aligned labels */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black text-[#0f701e] bg-emerald-50 border border-emerald-200 mb-2 font-mono uppercase tracking-wider">
            🏛️ EXPERIENCIA INMERSIVA 360° REAL
          </span>
          <h3 className="font-display font-black text-2xl md:text-3xl text-[#172B6B] tracking-tight">
            Recorrido Interactivo Sede Bogotá
          </h3>
          <p className="text-sm text-slate-500 max-w-2xl mt-1 font-medium">
            Siente el ambiente del aula, laboratorios y zonas comunes. Explora con total libertad de movimiento en nuestra plataforma virtual oficial Panoee.
          </p>
        </div>
      </div>

      {/* Main Beautiful Real Panoee 360 Viewer Centerpiece (Full Width) */}
      <div className="relative bg-[#000501] border-4 border-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden flex flex-col justify-between">
        
        {/* Iframe Header */}
        <div className="bg-slate-950 p-4 px-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-slate-300 font-bold font-display">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#35B84A] animate-ping" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-white">RECORRIDO INSTITUCIONAL ACTIVADO</span>
          </div>
          <div className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-emerald-400">
            Sede Bogotá Central • Control Inmersivo
          </div>
        </div>

        {/* Real responsive iframe container embedding Panoee 360 Tour */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video min-h-[380px] sm:min-h-[520px] bg-slate-950">
          <iframe
            src="https://tour.panoee.net/6a2b33069c100674e3aa202f"
            title="Recorrido Virtual 360 Panoee"
            className="absolute inset-0 w-full h-full border-0 select-none bg-slate-950"
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Iframe Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 text-left flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest font-black">
            📍 Bogotá, Colombia • Solución Multi-Sede CUN
          </span>
          <a 
            href="https://tour.panoee.net/6a2b33069c100674e3aa202f"
            target="_blank" 
            rel="noreferrer"
            className="text-xs font-mono font-black text-emerald-405 hover:text-emerald-300 flex items-center space-x-1.5 transition-colors uppercase tracking-widest bg-emerald-950/40 hover:bg-emerald-950 py-1.5 px-3.5 border border-emerald-800 rounded-xl"
          >
            <span>Abrir en Nueva Pestaña</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Spots Explorator Section below */}
      <div className="bg-slate-50/60 border border-slate-150 p-6 rounded-[2rem] space-y-6">
        <div>
          <h4 className="font-display font-black text-xl text-[#172B6B] tracking-tight">
            Guía de Espacios del Campus CUN 🗺️
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Haz clic en cualquiera de los puntos principales para conocer los servicios y ubicaciones destacadas que verás en tu recorrido.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* Facilities Interactive selection Menu (Span 5) */}
          <div className="md:col-span-5 flex flex-col gap-2">
            {campusHotspots.map((spot) => {
              const isActive = activeHotspot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot)}
                  className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center space-x-3 select-none ${
                    isActive 
                      ? 'border-[#9BFF00] bg-white text-[#172B6B] shadow-[0_5px_15px_rgba(155,255,0,0.15)] ring-2 ring-[#9BFF00]' 
                      : 'border-slate-100 hover:border-slate-200 bg-white/70 text-slate-655'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-[#9BFF00]/25 text-[#172B6B]' : 'bg-slate-100 text-slate-400'}`}>
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-display font-black tracking-tight">{spot.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">{spot.amenities.length} Servicios clave</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Card for selected spot (Span 7) */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border-2 border-slate-150 rounded-[1.8rem] overflow-hidden flex flex-col justify-between h-full shadow-sm"
              >
                <div>
                  
                  {/* Photo representation */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                    <img 
                      src={activeHotspot.imageUri} 
                      alt={activeHotspot.name} 
                      className="w-full h-full object-cover transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="px-2 py-0.5 rounded bg-brand-green-500 text-white text-[9px] font-mono font-black uppercase tracking-widest">
                        ZONA RELEVANTE
                      </span>
                      <h4 className="font-display font-black text-xl text-white tracking-tight mt-0.5 leading-none">
                        {activeHotspot.name}
                      </h4>
                    </div>
                  </div>

                  {/* Amenities/Benefits description info */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                      {activeHotspot.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black border-b border-slate-100 pb-1.5">
                        SERVICIOS DISPONIBLES EN ESTE ESPACIO:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                        {activeHotspot.amenities.map((amenity, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center space-x-2 bg-slate-50 border border-slate-100 p-2 rounded-xl text-slate-700"
                          >
                            <div className="p-0.5 rounded-full bg-[#35B84A] text-white shrink-0">
                              <CheckCircle className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="text-xs font-semibold leading-tight font-sans text-ellipsis overflow-hidden whitespace-nowrap">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-left">
                  <div className="flex items-start space-x-2 text-slate-500">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed italic">
                      Usa el panel de navegación de 360° en la parte de arriba para visualizar este espacio real en vivo o interactuar con los portales de paso.
                    </p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
};
