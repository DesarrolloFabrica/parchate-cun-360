import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, X, Info, CheckCircle } from 'lucide-react';
import { TutorialShort } from '../types';
import * as LucideIcons from 'lucide-react';

interface ShortsTutorialsProps {
  tutorials: TutorialShort[];
  accentColor: 'blue' | 'green';
  titleSection: string;
}

export const ShortsTutorials: React.FC<ShortsTutorialsProps> = ({ tutorials, accentColor, titleSection }) => {
  const [activeVideo, setActiveVideo] = useState<TutorialShort | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  const isBlue = accentColor === 'blue';
  const borderClass = isBlue ? 'border-sky-500' : 'border-[#9BFF00]';
  const textAccent = isBlue ? 'text-sky-400' : 'text-[#9BFF00]';
  const bgAccentLight = isBlue ? 'bg-sky-950/40' : 'bg-[#9BFF00]/10';
  const borderAccentLight = isBlue ? 'border-sky-500/30' : 'border-[#9BFF00]/35';
  const hoverClass = isBlue ? 'hover:border-sky-400' : 'hover:border-[#9BFF00] hover:shadow-[0_0_20px_rgba(155,255,0,0.25)]';

  const handlePlayVideo = (tut: TutorialShort) => {
    setActiveVideo(tut);
    if (!watchedVideos.includes(tut.id)) {
      setWatchedVideos([...watchedVideos, tut.id]);
    }
  };

  return (
    <div className="space-y-8" id={`onboarding-shorts-${accentColor}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
                   <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            {titleSection}
          </h3>
          <p className="text-sm text-slate-300">
            Aprende de inmediato deslizando estas guías interactivas sobre nuestras plataformas principales.
          </p>
        </div>
        
        {/* Progress Tracker Widget in modern white card */}
        <div className="flex items-center space-x-3 bg-white p-3.5 rounded-[1.5rem] border-2 border-[#9BFF00]/30 shadow-lg shrink-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#0B3D2E]/10 border border-[#35B84A]/20">
            <span className="text-xs font-black text-[#172B6B]">
              {watchedVideos.length}/{tutorials.length}
            </span>
          </div>
          <div>
            <p className="text-xs font-black text-[#172B6B] leading-none mb-1">Tu Inducción</p>
            <p className="text-[9px] text-[#35B84A] font-mono font-black uppercase tracking-widest leading-none">PÍLDORAS VISTAS</p>
          </div>
        </div>
      </div>

      {/* Grid containing the responsive vertical shorts cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {tutorials.map((tut, index) => {
          // Dynamic icon retrieval safely
          const IconComponent = (LucideIcons as any)[tut.iconName] || Play;
          const isWatched = watchedVideos.includes(tut.id);
          
          // Define hover shadows and glow colors
          const activeGlowLine = isBlue ? 'bg-sky-400 shadow-[0_0_10px_#38bdf8]' : 'bg-[#9BFF00] shadow-[0_0_12px_#9BFF00]';

          return (
            <motion.div
              key={tut.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`relative bg-white border-2 border-slate-100 ${hoverClass} rounded-[2rem] p-4.5 flex flex-col justify-between transition-all duration-300 shadow-md overflow-hidden group cursor-pointer`}
              onClick={() => handlePlayVideo(tut)}
            >
              {/* Cyber tech lineart accents that light up on hover */}
              <div className={`absolute top-0 right-0 w-8 h-[2px] ${activeGlowLine} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
              <div className={`absolute top-0 right-0 w-[2px] h-8 ${activeGlowLine} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
              <div className={`absolute bottom-0 left-0 w-8 h-[2px] ${activeGlowLine} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
              <div className={`absolute bottom-0 left-0 w-[2px] h-8 ${activeGlowLine} opacity-0 group-hover:opacity-100 transition-all duration-300`} />

              {/* Vertical Thumbnail Area with sticker feel */}
              <div className="relative w-full h-64 rounded-2xl mb-4 overflow-hidden bg-[#0B3D2E]/5 border border-slate-100 flex flex-col items-center justify-center">
                {/* Abstract lineart pattern as video thumbnail */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-emerald-950 to-transparent pointer-events-none" />
                <svg className="absolute inset-x-0 bottom-0 w-full text-[#35B84A]/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,100 C30,70 70,80 100,100 Z" fill="currentColor" />
                  <path d="M0,100 C40,40 60,60 100,100 Z" fill="currentColor" opacity="0.6" />
                </svg>
                
                {/* Simulated vertical neon glow strip inside thumbnail frame */}
                <div className={`absolute left-0 inset-y-0 w-[1px] ${isBlue ? 'bg-sky-450/40' : 'bg-[#9BFF00]/40'} group-hover:opacity-100 group-hover:scale-y-110 transition-all duration-500`} />

                {/* Floating indicators */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-[#0B3D2E]/90 border border-[#9BFF00]/30 px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono text-[#9BFF00]">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{tut.duration}</span>
                </div>

                {isWatched && (
                  <div className="absolute top-3 right-3 bg-[#35B84A] text-white p-1 rounded-full shadow-lg z-15 border border-[#9BFF00]/40">
                    <CheckCircle className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                )}

                {/* Central Play circle with glowing neon style */}
                <div className={`p-4 rounded-full border-2 ${isBlue ? 'border-sky-400 bg-sky-950/70 text-sky-400 group-hover:scale-110' : 'border-[#9BFF00] bg-[#0B3D2E]/90 text-[#9BFF00] group-hover:scale-110 shadow-[0_0_15px_rgba(155,255,0,0.4)]'} transition-all duration-300 z-10`}>
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>

                {/* Linear Floating Icon representing topics */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 px-3 bg-white border border-slate-150 rounded-xl flex items-center space-x-1.5 shadow-md text-[#172B6B]">
                    <IconComponent className="w-3.5 h-3.5 text-[#35B84A]" strokeWidth={2.5} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider">{tut.title.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Text Areas using Azul Oscuro suggested color */}
              <div className="grow flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-black text-lg text-[#172B6B] leading-tight mb-1.5 group-hover:text-[#35B84A] transition-colors">
                    {tut.title}
                  </h4>
                  <p className="text-xs text-[#172B6B]/80 line-clamp-3 leading-relaxed">
                    {tut.description}
                  </p>
                </div>
                
                <div className={`mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest ${isBlue ? 'text-sky-500' : 'text-[#0f701e]'} group-hover:text-[#9BFF00]`}>
                  <span>VER CÁPSULA</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </div>

              {/* Institutional Lineart corner details */}
              <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-25 transition-opacity text-[#35B84A]">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                  <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Overlay Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-[#0B3D2E]/90 backdrop-blur-sm"
            />

            {/* Modal Body styled with sticker theme */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] border-4 border-[#9BFF00] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 flex flex-col"
            >
              {/* Modular Header */}
              <div className="px-6 py-4.5 bg-[#0B3D2E]/5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl bg-[#0B3D2E] border border-[#9BFF00]/40 text-[#9BFF00]`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-[#172B6B] leading-tight">
                      {activeVideo.title}
                    </h4>
                    <p className="text-[9px] text-[#35B84A] font-mono font-black tracking-widest uppercase">
                      CÁPSULA DE ORIENTACIÓN • {activeVideo.duration}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Video Sandbox iframe container */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <iframe
                  title={activeVideo.title}
                  src={`${activeVideo.videoUrl}?autoplay=1`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Custom Guide note */}
              <div className="p-6 bg-[#0B3D2E]/5 text-slate-700 border-t border-slate-100 text-xs">
                <div className="flex items-start space-x-2.5">
                  <Info className="w-5 h-5 text-[#35B84A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-black text-[#172B6B]">Detalles de la herramienta:</p>
                    <p className="leading-relaxed text-slate-600 font-medium">
                      {activeVideo.description}
                    </p>
                    <div className="mt-3 inline-flex items-center space-x-1 py-1 px-2 rounded bg-emerald-50 text-[10px] text-emerald-800 border border-emerald-200">
                      <span>✓ Portal Autenticado CUN 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom actionable check button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-6 py-2.5 bg-[#35B84A] hover:bg-[#2fa341] hover:scale-105 active:scale-95 text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-md border-none cursor-pointer transition-all"
                >
                  ¡Entendido! Cerrar 🎯
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
