import React from 'react';
import { motion } from 'motion/react';
import { Globe, GraduationCap, MapPin, Cpu, Laptop, Compass, Heart, Award } from 'lucide-react';

interface CalloutCard {
  id: string;
  nodeX: number; // coordinates relative to SVG viewBox (0-800)
  nodeY: number;
  cardX: string; // absolute styling values (left/top/right/bottom)
  cardY: string;
  cardPositionClass: string; // e.g., style wrapper
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'emerald' | 'blue';
}

export const WorldConnectionsMap: React.FC = () => {
  // Define precise relative coordinate coordinates for nodes in viewBox="0 0 800 400"
  const nodes = [
    { id: "bogota", x: 230, y: 260, label: "Hub Bogotá" },
    { id: "miami", x: 210, y: 175, label: "Hub Miami" },
    { id: "madrid", x: 388, y: 140, label: "Nodo España" },
    { id: "tokio", x: 670, y: 165, label: "Sinergia Asia" },
    { id: "sydney", x: 710, y: 320, label: "Sólidos Oceanía" },
  ];

  const callouts: CalloutCard[] = [
    {
      id: "bogota-card",
      nodeX: 230,
      nodeY: 260,
      cardX: "3%",
      cardY: "64%",
      cardPositionClass: "left-[3%] top-[64%] sm:top-[60%] md:top-[64%]",
      icon: <Globe className="w-5 h-5 text-emerald-600" />,
      title: "Sede Bogotá Central",
      description: "Vínculo principal que conecta a más de 15,000 alumnos del campus virtual.",
      color: "emerald"
    },
    {
      id: "miami-card",
      nodeX: 210,
      nodeY: 175,
      cardX: "3%",
      cardY: "18%",
      cardPositionClass: "left-[3%] top-[14%]",
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      title: "Hub Miami Internacional",
      description: "Doble titulación virtual opcional adaptada a estándares académicos globales.",
      color: "blue"
    },
    {
      id: "madrid-card",
      nodeX: 388,
      nodeY: 140,
      cardX: "34%",
      cardY: "4%",
      cardPositionClass: "left-[38%] top-[3%] -translate-x-1/2 md:translate-x-0 md:left-[36%]",
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      title: "Conexión Europa",
      description: "Intercambio virtual continuo con redes formativas y foros universitarios.",
      color: "emerald"
    },
    {
      id: "tokio-card",
      nodeX: 670,
      nodeY: 165,
      cardX: "68%",
      cardY: "22%",
      cardPositionClass: "right-[3%] top-[18%]",
      icon: <Laptop className="w-5 h-5 text-blue-600" />,
      title: "Alianza Digital Asia",
      description: "Recursos didácticos inmersivos y laboratorios interactivos internacionales.",
      color: "blue"
    },
    {
      id: "sydney-card",
      nodeX: 710,
      nodeY: 320,
      cardX: "68%",
      cardY: "68%",
      cardPositionClass: "right-[3%] top-[66%]",
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      title: "Sinergias Globales CUNBRE",
      description: "Avanzada de proyectos estudiantiles y semilleros de investigación en red.",
      color: "emerald"
    }
  ];

  return (
    <div id="world-map-canvas-container" className="relative w-full bg-[#f8fafc] border border-slate-200/90 rounded-3xl p-3 sm:p-6 shadow-sm overflow-hidden min-h-[500px]">
      
      {/* Editorial Watermark background / delicate dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-75 pointer-events-none" />
      
      {/* Decorative technical line in margins */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-400 font-bold hidden md:block">
        GLOBAL ACADEMIC NETWORK PLAN / MODELO DE RED VIRTUAL 2026
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-400 font-bold hidden md:block">
        SCALE: MULTI-REGION CONNECTIVY LINK // LATIN MERIDIAN CUN
      </div>

      {/* SVG Canvas covering full width and height with viewBox aspect ratio */}
      <div className="w-full relative mt-12 md:mt-6 pb-[50%]">
        <svg 
          viewBox="0 0 800 400" 
          className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS FOR ANIMATIONS & EMBELLISHMENTS */}
          <defs>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
            
            {/* World Coordinates Horizontal / Vertical subtle alignment scales */}
            <pattern id="dotpattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.3" />
            </pattern>
          </defs>

          {/* GRID LINES FOR NETWORK BACKGROUND */}
          <rect width="800" height="400" fill="url(#dotpattern)" opacity="0.5" />

          {/* DELICATE MINIMALIST WORLD CONTINENTAL GRAPHICS */}
          {/* North America */}
          <path 
            d="M 60,60 C 100,50 140,40 180,60 C 220,80 230,110 210,140 C 200,150 170,160 160,170 C 150,180 130,190 120,185 C 110,180 110,165 105,155 C 95,150 85,150 78,135 C 70,120 50,110 50,90 Z" 
            fill="rgba(59, 130, 246, 0.03)" 
            stroke="rgba(59, 130, 246, 0.25)" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M 120,40 C 130,30 145,20 160,25 C 170,30 165,45 155,50 C 145,55 130,55 120,40 Z" 
            fill="rgba(59, 130, 246, 0.02)" 
            stroke="rgba(59, 130, 246, 0.18)" 
            strokeWidth="1"
          />

          {/* South America */}
          <polygon 
            points="145,185 160,195 185,190 230,220 250,260 215,310 195,355 185,385 175,370 170,330 150,290 135,260 130,220" 
            fill="rgba(16, 185, 129, 0.03)" 
            stroke="rgba(16, 185, 129, 0.25)" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Africa */}
          <path 
            d="M 335,160 C 360,140 405,145 425,165 C 445,185 450,210 445,235 C 435,260 415,290 400,310 C 390,320 375,320 370,300 C 365,280 355,255 350,230 C 345,205 325,190 325,175 Z" 
            fill="rgba(16, 185, 129, 0.03)" 
            stroke="rgba(16, 185, 129, 0.25)" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Europe */}
          <path 
            d="M 340,110 C 330,80 350,60 380,55 C 410,50 430,70 425,90 C 420,110 395,125 370,120 C 355,115 345,120 340,110 Z" 
            fill="rgba(59, 130, 246, 0.03)" 
            stroke="rgba(59, 130, 246, 0.2)" 
            strokeWidth="1.2"
          />

          {/* Asia / Eurasia */}
          <path 
            d="M 420,90 C 455,75 515,65 575,60 C 635,55 705,65 745,85 C 775,100 785,120 765,140 C 745,160 705,170 685,160 C 665,150 645,142 615,165 C 585,188 565,210 525,215 C 485,220 465,190 445,175 C 425,160 415,130 420,90 Z" 
            fill="rgba(59, 130, 246, 0.04)" 
            stroke="rgba(59, 130, 246, 0.25)" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* India Peninsula */}
          <path d="M 525,215 L 545,215 L 535,245 Z" fill="rgba(59,130,246,0.03)" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />

          {/* Australia & Oceania */}
          <path 
            d="M 660,285 C 690,270 735,275 750,295 C 765,315 760,340 735,350 C 710,360 680,355 665,340 C 650,325 645,300 660,285 Z" 
            fill="rgba(16, 185, 129, 0.03)" 
            stroke="rgba(16, 185, 129, 0.22)" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Indonesia / Philippines Islands Dots */}
          <circle cx="615" cy="225" r="4" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
          <circle cx="630" cy="245" r="3" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
          <circle cx="655" cy="235" r="4.5" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />

          {/* TRACER LINES (Subtle curve lines connecting hubs with each other) */}
          <path d="M 230,260 Q 309,200 388,140" fill="none" stroke="url(#line-grad)" strokeWidth="1.5" strokeDasharray="5, 5" className="opacity-80" />
          <path d="M 210,175 Q 300,160 388,140" fill="none" stroke="url(#line-grad)" strokeWidth="1.2" className="opacity-80" />
          <path d="M 388,140 Q 520,150 670,165" fill="none" stroke="url(#line-grad)" strokeWidth="1.5" strokeDasharray="8, 4" className="opacity-70" />
          <path d="M 230,260 Q 450,220 670,165" fill="none" stroke="url(#line-grad)" strokeWidth="2" className="opacity-60" />
          <path d="M 670,165 Q 690,240 710,320" fill="none" stroke="url(#line-grad)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-85" />
          <path d="M 230,260 Q 470,300 710,320" fill="none" stroke="url(#line-grad)" strokeWidth="1.5" className="opacity-40" />

          {/* ANIMATED PULSES GLIDING ALONG THE TRACERS (Simulated data) */}
          <path d="M 230,260 Q 309,200 388,140" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14, 150" className="animate-[dash_4s_linear_infinite]" />
          <path d="M 230,260 Q 450,220 670,165" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeDasharray="20, 200" className="animate-[dash_6s_linear_infinite]" />
          <path d="M 388,140 Q 520,150 670,165" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15, 120" className="animate-[dash_5s_linear_infinite]" />

          {/* DELICATE POINTER CALLOUT LEADER LINES (Connecting node directly to its absolute layout projection) */}
          {/* Bogota pointer */}
          <line x1="230" y1="260" x2="180" y2="280" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
          <circle cx="180" cy="280" r="2" fill="#10b981" />
          
          {/* Miami pointer */}
          <line x1="210" y1="175" x2="160" y2="155" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
          <circle cx="160" cy="155" r="2" fill="#3b82f6" />

          {/* Madrid pointer */}
          <line x1="388" y1="140" x2="388" y2="90" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
          <circle cx="388" cy="90" r="2" fill="#10b981" />

          {/* Tokio pointer */}
          <line x1="670" y1="165" x2="620" y2="185" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
          <circle cx="620" cy="185" r="2" fill="#3b82f6" />

          {/* Sydney pointer */}
          <line x1="710" y1="320" x2="660" y2="340" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
          <circle cx="660" cy="340" r="2" fill="#10b981" />

          {/* CORE GRAPHIC NODES WITH SHINING RADIAL HALOS */}
          {nodes.map((node) => (
            <g key={node.id} className="cursor-pointer">
              {/* Outer faint signal ring */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r="16" 
                fill="none" 
                stroke={node.id === 'bogota' || node.id === 'madrid' || node.id === 'sydney' ? '#10b981' : '#3b82f6'} 
                strokeWidth="1.5" 
                className="animate-ping opacity-25" 
                style={{ animationDuration: node.id === 'bogota' ? '2s' : '3s' }}
              />
              {/* Secondary delicate stroke halo */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r="7" 
                fill="none" 
                stroke={node.id === 'bogota' || node.id === 'madrid' || node.id === 'sydney' ? '#10b981' : '#3b82f6'} 
                strokeWidth="1.5"
              />
              {/* Solid inner core dot */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r="4.5" 
                fill={node.id === 'bogota' || node.id === 'madrid' || node.id === 'sydney' ? '#10b981' : '#3b82f6'}
              />
              {/* Subtle inner core center light point (white) */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r="1.5" 
                fill="#ffffff"
              />
            </g>
          ))}
        </svg>

        {/* ELEGANT MODULATED CALLOUT CARDS OVERLAID IN THE WORLD GRAPHIC CANVAS */}
        {callouts.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.2 } }}
            className={`absolute ${card.cardPositionClass} bg-white rounded-2xl p-3 sm:p-4 border border-${card.color === 'emerald' ? 'emerald-150' : 'blue-150'} shadow-[0_5px_15px_rgba(30,41,59,0.04)] w-[220px] sm:w-[250px] pointer-events-auto z-40 transition-shadow hover:shadow-md`}
          >
            {/* Header section */}
            <div className="flex items-center space-x-2.5 mb-1.5">
              <div className={`p-1.5 rounded-lg bg-${card.color === 'emerald' ? 'emerald-50 text-emerald-600' : 'blue-50'}`}>
                {card.icon}
              </div>
              <h4 className="font-display font-black text-xs sm:text-sm text-[#172B6B] tracking-tight leading-tight">
                {card.title}
              </h4>
            </div>

            {/* Description constraint */}
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-sans leading-relaxed">
              {card.description}
            </p>

            {/* Micro aesthetic indicator light */}
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
              <span className="uppercase tracking-widest leading-none">CUN DIGITAL HUB</span>
              <span className={`w-1.5 h-1.5 rounded-full bg-${card.color === 'emerald' ? 'emerald-500' : 'blue-500'}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stylized CSS animation triggers directly into head tag */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -300;
          }
        }
      `}</style>
    </div>
  );
};
