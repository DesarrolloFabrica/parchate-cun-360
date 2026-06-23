import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Map
} from 'lucide-react';
import { VirtualIllustration, PresencialIllustration } from './LineArtDecorations';
import { CityLineartBackground, UniversityLineartBackground, PaperAirplaneLineart, FloatingDoodles } from './LineartBackgrounds';

interface HomeOnboardingProps {
  onSelectModality: (modality: 'virtual' | 'presencial') => void;
  onOpenHub: () => void;
}

export const HomeOnboarding: React.FC<HomeOnboardingProps> = ({ onSelectModality, onOpenHub }) => {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#072a1f] to-[#010c08]">
      
      {/* Decorative full-backdrop lineart backgrounds with subtle glowing green cyber-lines */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#9BFF00]/50 to-transparent" />
        <CityLineartBackground className="absolute bottom-0 inset-x-0 h-72 opacity-20 text-brand-green-main" />
        <UniversityLineartBackground className="absolute top-10 inset-x-0 h-64 opacity-15 text-brand-green-neon" />
        <FloatingDoodles />
        
        {/* Animated lineart paper planes flight path */}
        <PaperAirplaneLineart className="absolute top-24 left-1/4 w-16 h-16 text-[#9BFF00]/30" delay={0} />
        <PaperAirplaneLineart className="absolute bottom-40 right-1/4 w-20 h-20 text-[#35B84A]/30" delay={3} />

        {/* Elegant subtle cyber glowing light circles for visual depth */}
        <div className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-[#9BFF00]/10 blur-[130px]" />
        <div className="absolute bottom-1/3 left-[5%] w-[450px] h-[450px] rounded-full bg-[#35B84A]/10 blur-[150px]" />
        
        {/* Waves effect on background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 bg-[radial-gradient(ellipse_at_bottom,rgba(155,255,0,0.15),transparent_70%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 font-sans">
        
        {/* Main onboarding banner with direct high impact text in place of welcoming greetings */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
         
          {/* Sloganesque Direct visual heading with Neon Highlight Block */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display font-black text-5xl sm:text-6xl tracking-tight text-white leading-tight mb-5"
          >
            <span className="relative inline-block px-4 py-1.5 mx-1.5 bg-[#9BFF00] text-[#0B3D2E] rounded-2xl transform -rotate-1 skew-x-2 hover:rotate-0 transition-transform duration-300 shadow-[0_4px_20px_rgba(155,255,0,0.4)] font-extrabold">
              ¡PÁRCHATE CUN
            </span>!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs sm:text-sm text-emerald-200/90 font-mono tracking-widest uppercase max-w-2xl mx-auto leading-relaxed border-t border-b border-white/10 py-3 block bg-[#0B3D2E]/40 backdrop-blur-xs rounded-xl"
          >
          Selecciona tu modalidad de estudio o entra al hub integrado.
          </motion.p>
        </div>

        {/* Double Entrance Buttons / Modality Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          
          {/* VIRTUAL Card with thin futuristic neon green hover border */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring' }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative bg-white border-4 border-slate-100 hover:border-[#9BFF00] rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_rgba(155,255,0,0.4)] group overflow-hidden"
          >
            {/* Sticker background accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#35B84A]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="absolute top-5 right-5 text-[#172B6B]/25 group-hover:text-[#35B84A]/30 transition-colors pointer-events-none">
              <Globe className="w-16 h-16 stroke-[1]" />
            </div>

            <div>
              {/* Illustration container with sticker border styling */}
              <div className="w-full flex justify-center items-center mb-6 h-40 bg-[#0B3D2E]/5 rounded-3xl border-2 border-dashed border-[#35B84A]/30 group-hover:border-[#9BFF00]/80 p-3 overflow-hidden transition-all duration-300 relative">
                {/* Sticker glow reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_8px_15px_rgba(11,61,46,0.15)] filter saturate-110">
                  <VirtualIllustration className="max-h-full max-w-full" />
                </div>
              </div>

              {/* Tag circular badge inside container */}
              <div className="flex justify-center mb-2">
                <span className="px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest text-[#35B84A] bg-emerald-50 border border-emerald-200 rounded-full">
                  100% ONLINE
                </span>
              </div>

              {/* Header Title with rich dark blue color */}
              <h2 className="font-display font-black text-3xl text-[#172B6B] tracking-tight text-center leading-none">
                MODALIDAD VIRTUAL
              </h2>
            </div>

            {/* Selection Action Button with intense green hover */}
            <button
              onClick={() => onSelectModality('virtual')}
              className="w-full mt-5 py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-[#35B84A] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl transition-all shadow-[0_4px_12px_rgba(53,184,74,0.25)] hover:shadow-[0_0_15px_rgba(155,255,0,0.4)] active:scale-[0.98] cursor-pointer text-center group-hover:translate-y-[-1px] border-none flex flex-col items-center justify-center gap-0.5"
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-mono tracking-wider font-extrabold text-emerald-100 uppercase">
                <span>100% ONLINE</span>
                <span className="text-[#9BFF00]">-</span>
                <span>MODALIDAD VIRTUAL</span>
              </div>
              <span className="text-xs font-display font-black tracking-widest text-[#9BFF00] uppercase mt-0.5 flex items-center justify-center gap-1.5">
                COMENZAR <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>

            {/* ON-BOARDING underneath buttons */}
            <div className="mt-5 text-center border-t border-slate-100 pt-3">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#35B84A] font-black">
                ★ DESPEGUE VIRTUAL ★
              </span>
            </div>
          </motion.div>

          {/* PRESENCIAL Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative bg-white border-4 border-slate-100 hover:border-[#9BFF00] rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_rgba(155,255,0,0.4)] group overflow-hidden"
          >
            {/* Sticker background accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#35B84A]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="absolute top-5 right-5 text-[#172B6B]/25 group-hover:text-[#35B84A]/30 transition-colors pointer-events-none">
              <Map className="w-16 h-16 stroke-[1]" />
            </div>

            <div>
              {/* Illustration container with sticker border styling */}
              <div className="w-full flex justify-center items-center mb-6 h-40 bg-[#0B3D2E]/5 rounded-3xl border-2 border-dashed border-[#35B84A]/30 group-hover:border-[#9BFF00]/80 p-3 overflow-hidden transition-all duration-300 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_8px_15px_rgba(11,61,46,0.15)] filter saturate-110">
                  <PresencialIllustration className="max-h-full max-w-full" />
                </div>
              </div>

              {/* Tag circular badge inside container */}
              <div className="flex justify-center mb-2">
                <span className="px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest text-[#172B6B] bg-blue-55/10 border border-blue-200 rounded-full">
                  CAMPUS FÍSICO
                </span>
              </div>

              {/* Header Title with rich dark blue color */}
              <h2 className="font-display font-black text-3xl text-[#172B6B] tracking-tight text-center leading-none">
                MODALIDAD PRESENCIAL
              </h2>
            </div>

            {/* Selection Action Button with high contrast Neon style */}
            <button
              onClick={() => onSelectModality('presencial')}
              className="w-full mt-5 py-2.5 px-4 bg-gradient-to-r from-[#172B6B] via-[#213a8f] to-[#122152] hover:from-[#1b317a] hover:to-[#2846ab] text-white rounded-xl transition-all shadow-[0_4px_12px_rgba(23,43,107,0.25)] hover:shadow-[0_0_15px_rgba(155,255,0,0.3)] active:scale-[0.98] cursor-pointer text-center group-hover:translate-y-[-1px] border-none flex flex-col items-center justify-center gap-0.5"
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-mono tracking-wider font-extrabold text-[#9BFF00] uppercase">
                <span>CAMPUS FÍSICO</span>
                <span className="text-sky-305">-</span>
                <span>MODALIDAD PRESENCIAL</span>
              </div>
              <span className="text-xs font-display font-black tracking-widest text-white uppercase mt-0.5 flex items-center justify-center gap-1.5">
                COMENZAR <span className="text-[#9BFF00] group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>

            {/* ON-BOARDING underneath buttons */}
            <div className="mt-5 text-center border-t border-slate-100 pt-3">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#172B6B] font-black">
                ★ DESPEGUE CAMPUS ★
              </span>
            </div>
          </motion.div>
          
        </div>

        <div className="max-w-4xl mx-auto flex justify-center">
          <button
            onClick={onOpenHub}
            className="px-6 py-3 rounded-full border border-[#9BFF00]/35 bg-[#0B3D2E]/70 text-[#9BFF00] font-mono font-black uppercase tracking-widest text-[10px] hover:bg-[#9BFF00] hover:text-[#0B3D2E] transition-all shadow-[0_0_18px_rgba(155,255,0,0.12)]"
          >
            Explorar hub integrado
          </button>
        </div>

        {/* Brand visual ticker footer lines */}
        <div className="mt-16 pt-8 border-t border-dashed border-emerald-500/30 text-center">
          <p className="text-[#9BFF00] text-[11px] font-mono uppercase tracking-[0.4em] font-extrabold mb-1">
            Corporación Unificada Nacional de Educación Superior
          </p>
          <p className="text-emerald-300/60 text-[10px] font-mono">
            Párchate CUN On-Boarding 2026 • © Todos los derechos reservados.
          </p>
        </div>

      </div>
    </div>
  );
};
