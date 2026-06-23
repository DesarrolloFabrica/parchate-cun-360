import React from "react";
import { motion } from "motion/react";

// Paper airplane lineart design
export const PaperAirplaneLineart: React.FC<{ className?: string; color?: string; delay?: number }> = ({
  className = "",
  color = "currentColor",
  delay = 0,
}) => {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, 80, 120, 180],
        y: [80, 40, -10, -50],
        rotate: [15, 10, -15, -45],
      }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {/* Paper plane fold lines */}
      <path
        d="M 10,50 L 50,45 L 80,15 L 10,50 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 50,45 L 60,70 L 80,15"
        fill="none"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flight dash line trailing behind */}
      <path
        d="M -10,80 Q 20,70 10,50"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.6"
      />
    </motion.svg>
  );
};

// Beautiful minimalistic lineart cityscape representation (for Virtual and General screens)
export const CityLineartBackground: React.FC<{ className?: string; color?: string }> = ({
  className = "",
  color = "rgba(59, 130, 246, 0.08)", // subtle blue outline default
}) => {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      className={`w-full pointer-events-none select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horizontal baseline */}
      <line x1="0" y1="280" x2="1000" y2="280" stroke={color} strokeWidth="2" />

      {/* Buildings outline */}
      <path
        d="M 0,280 
           L 0,200 L 40,200 L 40,280
           L 60,280 L 60,140 L 110,140 L 110,210 L 130,210 L 130,280
           L 160,280 L 160,80 L 220,80 L 220,120 L 240,120 L 240,280
           L 290,280 L 290,160 L 330,160 L 330,280
           L 370,280 L 370,220 L 400,220 L 400,100 L 450,100 L 450,280
           L 490,280 L 490,180 L 530,180 L 530,280
           L 570,280 L 570,90 Q 600,60 630,90 L 630,280
           L 680,280 L 680,150 L 740,150 L 740,280
           L 780,280 L 780,120 L 820,120 L 820,280
           L 860,280 L 860,190 L 910,190 L 910,280
           L 940,280 L 940,130 L 1000,130 L 1000,280"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Windows and technical grid lines in lineart */}
      <line x1="80" y1="140" x2="80" y2="280" stroke={color} strokeWidth="0.5" strokeDasharray="5 5" />
      <line x1="190" y1="80" x2="190" y2="280" stroke={color} strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="425" y1="100" x2="425" y2="280" stroke={color} strokeWidth="0.5" strokeDasharray="6 6" />
      <line x1="600" y1="90" x2="600" y2="280" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="800" y1="120" x2="800" y2="280" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Modern communications towers */}
      <line x1="200" y1="80" x2="200" y2="40" stroke={color} strokeWidth="1" />
      <circle cx="200" cy="40" r="3" fill="none" stroke={color} strokeWidth="1" />

      <line x1="800" y1="120" x2="800" y2="90" stroke={color} strokeWidth="1" />
      <circle cx="800" cy="90" r="2" fill="none" stroke={color} strokeWidth="1" />

      {/* Little clouds or air travel arcs */}
      <path d="M 150,50 Q 180,30 210,50" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
      <path d="M 500,40 Q 540,20 580,40" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
      <path d="M 750,70 Q 770,60 790,70" fill="none" stroke={color} strokeWidth="1" strokeDasharray="1 3" />
    </svg>
  );
};

// Beautiful minimalistic lineart university campus representation (for Presencial screens)
export const UniversityLineartBackground: React.FC<{ className?: string; color?: string }> = ({
  className = "",
  color = "rgba(34, 197, 94, 0.08)", // subtle green outline default
}) => {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      className={`w-full pointer-events-none select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Baseline */}
      <line x1="0" y1="280" x2="1000" y2="280" stroke={color} strokeWidth="2" />

      {/* Classic collegiate facade lineart */}
      <path
        d="M 50,280 
           L 50,150 L 180,150 L 180,280
           L 240,280 
           L 240,180 L 320,180 L 320,280
           L 350,280 
           L 350,110 L 380,110 L 380,80 L 420,50 L 460,80 L 460,110 L 490,110 L 490,280
           L 530,280 
           L 530,160 L 590,160 L 610,130 L 630,160 L 690,160 L 690,280
           L 750,280 
           L 750,120 L 950,120 L 950,280"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* University emblem archway */}
      <path d="M 380,280 C 380,210 460,210 460,280" fill="none" stroke={color} strokeWidth="1.5" />
      {/* Decorative center clock */}
      <circle cx="420" cy="115" r="15" fill="none" stroke={color} strokeWidth="1.2" />
      <line x1="420" y1="115" x2="420" y2="105" stroke={color} strokeWidth="1" />
      <line x1="420" y1="115" x2="428" y2="119" stroke={color} strokeWidth="1" />

      {/* Windows arrays on large university building on the right */}
      <path
        d="M 770,150 H 790 V 170 H 770 Z
           M 820,150 H 840 V 170 H 820 Z
           M 870,150 H 890 V 170 H 870 Z
           M 910,150 H 930 V 170 H 910 Z
           M 770,200 H 790 V 220 H 770 Z
           M 820,200 H 840 V 220 H 820 Z
           M 870,200 H 890 V 220 H 870 Z
           M 910,200 H 930 V 220 H 910 Z"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Classroom rows window on the left */}
      <path
        d="M 70,180 H 95 V 210 H 70 Z
           M 110,180 H 135 V 210 H 110 Z
           M 150,180 H 175 V 210 H 150 Z"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Dome decorations and stylized trees in lineart */}
      <path d="M 280,285 C 260,250 240,285 240,285" fill="none" stroke={color} strokeWidth="1" />
      <path d="M 300,285 C 290,240 280,285 280,285" fill="none" stroke={color} strokeWidth="1" />
      <path d="M 720,285 C 700,230 680,285 680,285" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
};

// Fun tiny doodle stickers to accent borders of the app
export const FloatingDoodles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-40">
      {/* Lightbulb (idea) */}
      <motion.div
        className="absolute top-10 left-[8%] text-blue-500/15"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      </motion.div>

      {/* Graduation cap */}
      <motion.div
        className="absolute bottom-16 right-[10%] text-green-500/20"
        animate={{ y: [0, 8, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      </motion.div>

      {/* Compass / Star */}
      <motion.div
        className="absolute top-1/3 right-[5%] text-amber-500/15"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      </motion.div>

      {/* Notebook / Book */}
      <motion.div
        className="absolute bottom-1/3 left-[4%] text-indigo-500/15"
        animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </motion.div>
    </div>
  );
};
