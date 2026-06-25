import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeftRight, Play, Volume2, SkipForward, ArrowRight, ShieldAlert, Sparkles, Tv, Maximize2, Minimize2, X } from "lucide-react";

// ==========================================================================
// CONFIGURACIÓN DE FOTOS DE INTRO PREESTABLECIDAS (CUN ONBOARDING)
// Modifica de forma ultra-sencilla las URLs aquí para cambiar las imágenes
// ==========================================================================
export const INTRO_PRESET_IMAGES = {
  // Imagen Lado Izquierdo (Modalidad Virtual)
  leftImage: "https://i.ibb.co/84jC2QhZ/8c1f68a1-0b15-4940-b6d3-a7a1ee0f85ad-2026-06-16-1.png",

  // Imagen Lado Derecho (Modalidad Presencial)
  rightImage: "https://i.ibb.co/KpjFmppf/d08915fe-2757-49b1-9cdc-a2f9ffba0c53-2026-06-16.png"
};

const introVideoSrc = "assets/videos/videoplayback.mp4";

export const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  
  // Video popup before the comparison slider
  const [showVideoPopup, setShowVideoPopup] = useState(true);
  const [videoCountdown, setVideoCountdown] = useState(95);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(50); // percentage 0 - 100
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState<number>(1200);

  // Mark completion of the entire intro state when visible turns false
  useEffect(() => {
    if (!visible) {
      localStorage.setItem('cun-intro-completed', 'true');
      localStorage.setItem('cun-intro-completed-time', Date.now().toString());
      window.dispatchEvent(new Event('cun-intro-completed'));
    }
  }, [visible]);

  const updateVideoCountdown = (video: HTMLVideoElement) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    setVideoCountdown(Math.max(0, Math.ceil(video.duration - video.currentTime)));
  };

  const handleVideoProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    updateVideoCountdown(e.currentTarget);
  };

  const handleVideoEnded = () => {
    setVideoCountdown(0);
    setShowVideoPopup(false);
  };

  // Sync container size on mount and resize
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto oscillating preview until user interacts with the slider
  useEffect(() => {
    if (showVideoPopup) return; // Wait until video finishes to oscillate
    if (!hasInteracted) {
      const interval = setInterval(() => {
        setSliderValue(() => {
          const time = Date.now() / 1000;
          return 50 + Math.sin(time) * 15;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [hasInteracted, showVideoPopup]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteracted(true);
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    
    // Auto-enter if slider is pulled to the extremes
    if (val <= 6 || val >= 94) {
      setVisible(false);
    }
  };

  const handleSkipVideo = () => {
    setShowVideoPopup(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="intro-loader-overlay"
          className="fixed inset-0 bg-[#000301] z-[9999] flex flex-col justify-between overflow-hidden select-none"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 1. INTRO INITIAL VIDEO POPUP (40 SECONDS COUNTDOWN) - COMPACT MOBILE OPTIMIZED */}
          <AnimatePresence>
            {showVideoPopup && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-[#020704] bg-radial from-[#041d11] via-[#010603] to-black z-[10000] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto"
              >
                {/* Background ambient futuristic lights */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full bg-[#00ff66]/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
                <div className="absolute top-1/4 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

                {/* Sizable Glass Container */}
                <div className={`w-full ${isExpanded ? 'max-w-5xl' : 'max-w-3xl'} transition-all duration-500 ease-out flex flex-col items-center relative z-10 p-1 sm:p-2`}>
                  
                  {/* High Tech AR Outer Glass Card */}
                  <div className="w-full backdrop-blur-xl bg-black/45 border-2 border-white/10 rounded-[32px] p-3 sm:p-4 shadow-[0_0_80px_rgba(155,255,0,0.15)] flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30 rounded-[30px] pointer-events-none shadow-inner" />

                    {/* AR Minimalist Browser/Console Bar */}
                    <div className="flex items-center justify-between w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-3.5 py-2.5 mb-3.5 shadow-md">
                      {/* Window Controls */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-90 hover:opacity-100 transition-opacity" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-90 hover:opacity-100 transition-opacity" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-90 hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {/* Simulated High-Tech AR Station URL/Heading */}
                      <div className="flex-1 max-w-[45%] bg-black/40 border border-white/5 rounded-xl px-3 py-1 text-center font-mono text-[9px] text-zinc-300 tracking-wider truncate flex items-center justify-center gap-1.5 select-none md:flex">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
                        <span>onboarding.cun.edu.co/virtual_ar_hud</span>
                      </div>

                      {/* Quick controls row: countdown, expand, close */}
                      <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
                        {/* Live Timer Countdown */}
                        <div className="flex items-center gap-1.5 bg-[#00ff66]/10 border border-[#00ff66]/25 px-2.5 py-1 rounded-full text-[9px] font-mono font-black text-white whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>CONTINÚA EN: <span className="text-[#00ff66] font-extrabold">{videoCountdown}s</span></span>
                        </div>

                        {/* Expand Toggle Button */}
                        <button
                          onClick={() => setIsExpanded(prev => !prev)}
                          className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
                          title={isExpanded ? "Reducir" : "Ampliar"}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Close Button */}
                        <button
                          onClick={handleSkipVideo}
                          className="p-1.5 hover:bg-red-500/10 text-white/70 hover:text-red-400 rounded-lg transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
                          title="Cerrar video"
                        >
                          <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* 16:9 Video Canvas Wrapper with Green Glow borders */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_0_30px_rgba(0,255,102,0.15)] ring-1 ring-[#00ff66]/30 transition-all duration-300">
                      {/* Subtle elegant darkening layer to unify colors */}
                      <div className="absolute inset-0 bg-black/10 mix-blend-color-burn z-10 pointer-events-none rounded-2xl" />
                      <video
                        className="absolute inset-0 w-full h-full rounded-2xl object-contain"
                        src={introVideoSrc}
                        autoPlay
                        controls
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={handleVideoProgress}
                        onDurationChange={handleVideoProgress}
                        onTimeUpdate={handleVideoProgress}
                        onEnded={handleVideoEnded}
                      />
                    </div>

                    {/* Futuristic floating underbar */}
                    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4 mt-3">
                      <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                        <div className="p-2.5 rounded-xl bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20">
                          <Tv className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wide leading-tight">Video de Onboarding Oficial</h4>
                          <p className="text-[10px] font-semibold text-[#00ff66] tracking-widest uppercase">Bienvenida a tu primera estación CUNlista</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0 shrink-0">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 select-none">
                          <Volume2 className="w-3.5 h-3.5 text-[#00ff66]" />
                          Audio Recom.
                        </span>

                        {/* skip button */}
                        <button
                          onClick={handleSkipVideo}
                          className="px-4 py-2 bg-gradient-to-r from-[#9BFF00] to-[#00ff66] hover:from-white hover:to-white text-black font-black text-[10px] uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(155,255,0,0.25)] border-none transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <span>SALTAR E IR AL INTRO</span>
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Fullscreen Comparison Interactive Stage */}
          <div ref={containerRef} className="absolute inset-0 w-full h-full">
            
            {/* STAGE A: RIGHT IMAGE (Underneath layer - Modalidad Presencial) */}
            <div className="absolute inset-0 w-full h-full bg-[#010a04]">
              <img 
                src={INTRO_PRESET_IMAGES.rightImage} 
                alt="Modalidad Presencial"
                className="w-full h-full object-cover pointer-events-none scale-105 transition-transform duration-[10s]"
                referrerPolicy="no-referrer"
              />
              {/* Vibrant cinematic deep overlays - REDUCED to make images significantly clearer */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000301] via-transparent to-black/35 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#000301]/25 to-[#000301]/45 z-[5]" />
              <div className="absolute inset-0 bg-[#00ff66]/5 mix-blend-color" />
 
              {/* INTEGRATED SUBTLE NEON Cyber-Lines on the ENVIRONMENT (Stage A overlay) */}
              <div className="absolute inset-0 z-[5] pointer-events-none opacity-50 overflow-hidden">
                <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#00ff66]/65 to-transparent top-1/4 animate-[scan_8s_ease-in-out_infinite] shadow-[0_0_8px_#00ff66]" />
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff66]/45 to-transparent top-2/3 animate-[scan_12s_ease-in-out_infinite_reverse] shadow-[0_0_6px_#00ff66]" />
                
                <svg className="absolute inset-0 w-full h-full text-[#35B84A]/30" xmlns="http://www.w3.org/2000/svg">
                  <line x1="5%" y1="0" x2="15%" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 8" />
                  <line x1="95%" y1="0" x2="85%" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 8" />
                  <line x1="0" y1="35%" x2="100%" y2="35%" stroke="currentColor" strokeWidth="0.4" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="currentColor" strokeWidth="0.4" />
                </svg>
              </div>
            </div>

            {/* STAGE B: LEFT IMAGE CONTAINER (Clipped upper layer - Modalidad Virtual) */}
            <div 
              className="absolute inset-y-0 left-0 h-full overflow-hidden border-r-4 border-[#00ff66] z-10 bg-[#000301] shadow-[5px_0_40px_rgba(0,255,102,0.6)]"
              style={{ width: `${sliderValue}%` }}
            >
              {/* Force inner wrapper to remain fullscreen size so image doesn't stretch/squeeze */}
              <div 
                className="absolute inset-y-0 left-0 h-full overflow-hidden"
                style={{ width: containerWidth }}
              >
                <img 
                  src={INTRO_PRESET_IMAGES.leftImage} 
                  alt="Modalidad Virtual"
                  className="w-full h-full object-cover pointer-events-none scale-105"
                  style={{ width: containerWidth }}
                  referrerPolicy="no-referrer"
                />
                {/* Reduced darkness to make the image stand out beautifully as requested */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000301] via-transparent to-black/35 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000301]/45 via-[#000301]/25 to-transparent z-[5]" />
                <div className="absolute inset-0 bg-[#00ff66]/5 mix-blend-color" />

                {/* Cyber Blueprint style grid subtle overlay on left */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#021a0a_1px,transparent_1px),linear-gradient(to_bottom,#021a0a_1px,transparent_1px)] bg-[size:48px_48px] opacity-25 pointer-events-none" />
              </div>
            </div>

            {/* NEON LASER COMPARISON LINE & HANDLE */}
            <div 
              className="absolute inset-y-0 z-20 pointer-events-none flex flex-col items-center justify-center"
              style={{ left: `${sliderValue}%` }}
            >
            
              {/* Glowing tactile touch point handle */}
              <div className="w-14 h-14 rounded-full bg-[#000501] text-[#00ff66] border-4 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,1)] flex items-center justify-center pointer-events-auto cursor-pointer transform -translate-x-1/2 select-none active:scale-125 hover:bg-emerald-950 transition-all">
                <ArrowLeftRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Vertical neon tracer lasers with high-intensity glow */}
              <div className="absolute top-1/2 bottom-0 w-[2px] bg-gradient-to-b from-[#00ff66] via-[#00ff66] to-transparent shadow-[0_0_8px_#00ff66]" />
              <div className="absolute top-0 bottom-1/2 w-[2px] bg-gradient-to-t from-[#00ff66] via-[#00ff66] to-transparent shadow-[0_0_8px_#00ff66]" />
            </div>

            {/* FULLSCREEN DRAG RANGE DETECTOR COVERS ENTIRE STAGE */}
            <input 
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={sliderValue}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 pointer-events-auto"
              title="Corre el slider para entrar a la aplicación"
            />
          </div>

          {/* HIGH IMPACT HEADLINE LOGO (Overlayed at the extreme top) */}
          <div className="relative w-full z-45 p-6 flex flex-col items-center select-none bg-gradient-to-b from-black/98 to-transparent pt-10">
            <motion.h1
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase text-center"
            >
              SÉ PARTE DE <span className="text-[#00ff66] drop-shadow-[0_0_15px_rgba(0,255,102,0.8)]">PARCHE CUNISTA</span>
            </motion.h1>
            <p className="text-xs sm:text-sm font-mono tracking-widest text-[#00ff66] uppercase mt-2 font-black">
              ⚡ Desliza el control central hacia la izquierda o derecha para ingresar ⚡
            </p>
          </div>

          {/* BOTTOM DIGITAL LEGAL FOOTER */}
          <div className="relative w-full z-45 p-6 bg-gradient-to-t from-black/98 to-transparent flex flex-col sm:flex-row items-center justify-between text-white border-t border-emerald-950/40 gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-ping" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#00ff66] uppercase">MODALIDAD DE INDUCCIÓN UNIFICADA 2026</span>
            </div>              
          </div>

          <style>{`
            @keyframes scan {
              0% { top: 0%; opacity: 0.1; }
              10% { opacity: 0.7; }
              90% { opacity: 0.7; }
              100% { top: 100%; opacity: 0.1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
