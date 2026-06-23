import React from 'react';

// Modern, sleek thin-line illustration for Virtual Mode (Blue Accent)
export const VirtualIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-80" }) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-all duration-500`}
  >
    {/* Grid Background lines (very subtle) */}
    <path d="M50 0V300M150 0V300M250 0V300M350 0V300" stroke="#e0effe" strokeWidth="0.75" strokeDasharray="4 4" />
    <path d="M0 75H400M0 150H400M0 225H400" stroke="#e0effe" strokeWidth="0.75" strokeDasharray="4 4" />

    {/* Floating decorative paths - connecting knowledge dots */}
    <path
      d="M 80 180 C 140 100, 200 220, 310 110"
      stroke="#0066cc"
      strokeWidth="1.5"
      strokeDasharray="6 4"
      className="path-lineart"
    />

    {/* Laptop Base & screen */}
    <rect x="110" y="80" width="180" height="120" rx="6" stroke="#003d7a" strokeWidth="2" fill="#ffffff" />
    <rect x="120" y="90" width="160" height="100" rx="3" stroke="#0066cc" strokeWidth="1.5" fill="#f0f7ff" />
    
    {/* Keyboard & body */}
    <path d="M80 200H320C320 200, 310 216, 290 216H110C90 216, 80 200, 80 200Z" stroke="#003d7a" strokeWidth="2" fill="#ffffff" />
    <line x1="160" y1="208" x2="240" y2="208" stroke="#003d7a" strokeWidth="2" strokeLinecap="round" />

    {/* Screen Elements: Video Player & Chat lines */}
    <circle cx="200" cy="140" r="22" stroke="#0066cc" strokeWidth="1.5" fill="#ffffff" />
    <polygon points="195,130 212,140 195,150" fill="#0066cc" stroke="#0066cc" strokeWidth="1.5" strokeLinejoin="miter" />
    
    {/* Small floating widgets next to laptop */}
    {/* Widget 1: Cursos (Left) */}
    <g transform="translate(40, 60)">
      <rect x="0" y="0" width="70" height="45" rx="6" stroke="#0066cc" strokeWidth="1.5" fill="#ffffff" />
      <path d="M10 12H40M10 22H60M10 32H30" stroke="#0066cc" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="55" cy="15" r="4" stroke="#00b368" strokeWidth="1.2" />
    </g>

    {/* Widget 2: Student Avatar / Dialog (Right) */}
    <g transform="translate(290, 160)">
      <rect x="0" y="0" width="70" height="50" rx="8" stroke="#003d7a" strokeWidth="1.5" fill="#ffffff" />
      <circle cx="20" cy="22" r="8" stroke="#0066cc" strokeWidth="1.5" />
      <path d="M10 21H50M10 29H60" stroke="#0066cc" strokeWidth="1" strokeLinecap="round" />
      <path d="M35 15 L32 25 L40 25 Z" stroke="#0066cc" strokeWidth="1" fill="#ffffff" />
    </g>

    {/* Floating icons with fine lines */}
    {/* Sparkle (Top-Right) */}
    <path d="M340 50L343 57L350 60L343 63L340 70L337 63L330 60L337 57Z" stroke="#0066cc" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Globe (Top-Left) */}
    <circle cx="70" cy="140" r="14" stroke="#0066cc" strokeWidth="1.5" />
    <path d="M56 140H84M70 126C74 130 76 135 70 154" stroke="#0066cc" strokeWidth="1" />
    <path d="M70 126C66 130 64 135 70 154" stroke="#0066cc" strokeWidth="1" />

    {/* Wi-Fi Waves */}
    <path d="M185 55A25 25 0 0 1 215 55" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M175 45A40 40 0 0 1 225 45" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M165 35A55 55 0 0 1 235 35" stroke="#003d7a" strokeWidth="1.5" strokeLinecap="round" />

    {/* Cloud (Top Left) */}
    <path d="M40 38C38 38 35 40 35 43C31 43 28 46 28 50C28 54 31 57 35 57H55C58 57 60 54 60 51C60 47 57 44 54 44C53 41 49 38 45 38M40 38" stroke="#cbd5e1" strokeWidth="1.2" fill="#ffffff" />
  </svg>
);

// Modern, sleek thin-line illustration for Presencial Mode (Green Accent)
export const PresencialIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-80" }) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-all duration-500`}
  >
    {/* Grid Background lines (very subtle) */}
    <path d="M50 0V300M150 0V300M250 0V300M350 0V300" stroke="#e6f6ee" strokeWidth="0.75" strokeDasharray="4 4" />
    <path d="M0 75H400M0 150H400M0 225H400" stroke="#e6f6ee" strokeWidth="0.75" strokeDasharray="4 4" />

    {/* Floating dashed route (Green Accent) */}
    <path
      d="M 330 200 C 290 120, 200 240, 90 110"
      stroke="#00b368"
      strokeWidth="1.5"
      strokeDasharray="6 4"
      className="path-lineart"
    />

    {/* Main Institutional Facade / Campus Building */}
    {/* Columns */}
    <g transform="translate(100, 100)">
      {/* Triangle Roof */}
      <polygon points="0,30 100,0 200,30" stroke="#007640" strokeWidth="2" fill="#ffffff" />
      <circle cx="100" cy="18" r="4" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />

      {/* Architraves & Steps */}
      <rect x="10" y="30" width="180" height="8" stroke="#007640" strokeWidth="2" fill="#ffffff" />
      
      {/* Pillars */}
      <rect x="25" y="38" width="12" height="65" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />
      <rect x="65" y="38" width="12" height="65" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />
      <rect x="123" y="38" width="12" height="65" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />
      <rect x="163" y="38" width="12" height="65" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />

      {/* Main Door arch */}
      <path d="M90 103V65C90 59, 110 59, 110 65V103" stroke="#007640" strokeWidth="2" fill="#f4fbf7" />

      {/* Base / Stairs */}
      <rect x="5" y="103" width="190" height="8" rx="2" stroke="#007640" strokeWidth="2" fill="#ffffff" />
      <rect x="-5" y="111" width="210" height="8" rx="2" stroke="#007640" strokeWidth="2" fill="#ffffff" />
    </g>

    {/* Tall Clock Tower (Right) */}
    <g transform="translate(295, 60)">
      <rect x="0" y="30" width="35" height="120" rx="3" stroke="#007640" strokeWidth="2" fill="#ffffff" />
      <circle cx="17.5" cy="50" r="9" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />
      {/* Hands */}
      <line x1="17.5" y1="50" x2="17.5" y2="45" stroke="#007640" strokeWidth="1.5" />
      <line x1="17.5" y1="50" x2="22" y2="50" stroke="#007640" strokeWidth="1.5" />
      {/* Roof peak */}
      <polygon points="0,30 17.5,10 35,30" stroke="#007640" strokeWidth="2" fill="#ffffff" />
    </g>

    {/* Precise Floating Pine / Deciduous trees */}
    {/* Left Tree */}
    <g transform="translate(45, 130)">
      <circle cx="25" cy="40" r="25" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" strokeDasharray="4 2" />
      <circle cx="25" cy="40" r="18" stroke="#00b368" strokeWidth="1.5" fill="#ffffff" />
      <line x1="25" y1="65" x2="25" y2="90" stroke="#007640" strokeWidth="2" />
      {/* Leaf lines */}
      <line x1="25" y1="75" x2="20" y2="70" stroke="#007640" strokeWidth="1.5" />
      <line x1="25" y1="80" x2="30" y2="75" stroke="#007640" strokeWidth="1.5" />
    </g>

    {/* Location Pin (Top Left-Center) - Glowing and vibrant */}
    <g transform="translate(180, 20)">
      <path
        d="M20 0C9 0 0 9 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 9 31 0 20 0Z"
        stroke="#00b368"
        strokeWidth="2"
        fill="#ffffff"
      />
      <circle cx="20" cy="18" r="7" stroke="#007640" strokeWidth="2" fill="#e6f6ee" />
    </g>

    {/* Clouds & birds */}
    {/* Mini bird lines */}
    <path d="M70 45Q75 40 80 45Q85 40 90 45" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M250 35Q254 31 258 35Q262 31 266 35" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />

    {/* Sun outline / Circular target */}
    <circle cx="340" cy="35" r="12" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 2" />
  </svg>
);

// General decorative organic leaves / geometric dotted connections (Line-art accents)
export const DecorativeLeafGrid: React.FC<{ color?: 'blue' | 'green', className?: string }> = ({ color = 'blue', className = "" }) => {
  const isBlue = color === 'blue';
  const strokeColor = isBlue ? "#0066cc" : "#00b368";
  const lightColor = isBlue ? "#e0effe" : "#e6f6ee";

  return (
    <svg viewBox="0 0 100 100" fill="none" className={`${className} select-none pointer-events-none opacity-40`}>
      {/* Lineart Leaves cascading */}
      <path d="M20 10 Q35 15, 30 40 Q15 35, 20 10 Z" stroke={strokeColor} strokeWidth="1.2" fill="none" />
      <path d="M30 40 Q45 42, 45 60 Q30 58, 30 40 Z" stroke={strokeColor} strokeWidth="1" fill="none" />
      <line x1="20" x2="30" y1="10" y2="40" stroke={strokeColor} strokeWidth="0.8" />
      <line x1="30" x2="45" y1="40" y2="60" stroke={strokeColor} strokeWidth="0.8" />

      {/* Floating Sparkles and Orbits */}
      <circle cx="75" cy="25" r="8" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="75" cy="25" r="2" fill={strokeColor} />
      
      {/* Decorative Target cross */}
      <line x1="70" x2="80" y1="70" y2="70" stroke={lightColor} strokeWidth="1.5" />
      <line x1="75" x2="75" y1="65" y2="75" stroke={lightColor} strokeWidth="1.5" />
    </svg>
  );
};
export const CornerDottedDecoration: React.FC<{ color?: 'blue' | 'green', className?: string }> = ({ color = 'blue', className = "" }) => {
  const isBlue = color === 'blue';
  const strokeColor = isBlue ? "#0066cc" : "#00b368";

  return (
    <svg viewBox="0 0 120 120" fill="none" className={`${className} select-none pointer-events-none`}>
      {/* A beautiful arc path with concentric layout */}
      <circle cx="0" cy="0" r="100" stroke={strokeColor} strokeWidth="1" strokeDasharray="6 6" className="opacity-30" />
      <circle cx="0" cy="0" r="80" stroke={strokeColor} strokeWidth="1.2" className="opacity-25" />
      <circle cx="0" cy="0" r="60" stroke={strokeColor} strokeWidth="0.75" strokeDasharray="3 3" className="opacity-20" />
      <path d="M10 10 L110 10 L110 110" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="8 4" className="opacity-40 path-lineart" />
      
      {/* Stylized small arrow */}
      <path d="M95 5 L110 10 L95 15" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />
    </svg>
  );
};
