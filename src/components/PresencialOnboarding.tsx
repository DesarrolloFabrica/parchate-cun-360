import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Building, AlertCircle, Play, Calendar, 
  Clock,   GraduationCap, 
  CalendarDays, Star
} from 'lucide-react';
import { ShortsTutorials } from './ShortsTutorials';
import { Campus360Tour } from './Campus360Tour';
import { PowerBIEmbed } from './PowerBIEmbed';
import { presencialTutorials } from '../data';
import { DecorativeLeafGrid, CornerDottedDecoration } from './LineArtDecorations';
import { UniversityLineartBackground, FloatingDoodles, PaperAirplaneLineart } from './LineartBackgrounds';

interface CalendarEvent {
  day: number;
  title: string;
  time: string;
  room: string;
  description: string;
  type: 'Académico' | 'Lúdico' | 'Bienvenida' | 'Soporte' | 'Emprendimiento';
}

const cronogramaEvents: { [month: string]: CalendarEvent[] } = {
  "Junio 2026": [
    { day: 1, title: "Bienvenida General de Inducción", time: "08:00 AM - 10:00 AM", room: "Auditorio Principal (Bloque A)", description: "Inauguración de inducción, palabras de directores e himnos oficiales.", type: "Bienvenida" },
    { day: 3, title: "Taller de Robótica y Tecnología", time: "10:00 AM - 12:00 PM", room: "Laboratorio de Innovación 3 (Bloque B)", description: "Demo interactiva del semillero de robótica de Ingeniería de Sistemas.", type: "Académico" },
    { day: 5, title: "Cine Foro Temático: Innovación", time: "02:00 PM - 04:00 PM", room: "Sala de Medios Interactivos (Bloque C)", description: "Proyección y debate guiado por egresados destacados.", type: "Lúdico" },
    { day: 8, title: "Feria de Emprendimiento CUNBRE", time: "09:00 AM - 01:00 PM", room: "Plaza Central del Campus", description: "Inspírate con los proyectos de compañeros y aprende cómo incubar tu idea.", type: "Emprendimiento" },
    { day: 10, title: "Recorrido Fotográfico & Selfie con Cami", time: "11:00 AM - 12:30 PM", room: "Zonas Verdes del Bloque A", description: "Conoce a Cami, la icónica mascota CUNista, sácate fotos y gana regalitos.", type: "Lúdico" },
    { day: 12, title: "Guías Prácticas del SINU y Soporte Técnico", time: "01:00 PM - 03:00 PM", room: "Laboratorio de Cómputo 5 (Bloque D)", description: "Configuración presencial de credenciales y resolución de dudas sobre matrículas.", type: "Soporte" },
    { day: 15, title: "Copa de E-Sports: Fifa & LoL Presencial", time: "03:00 PM - 06:00 PM", room: "Arena Digital de Bienestar", description: "Participa y compite contra otros estudiantes nuevos de ingeniería.", type: "Lúdico" },
    { day: 18, title: "Ritmo CUN: Sesión de Rumba de Integración", time: "05:00 PM - 06:30 PM", room: "Cancha Múltiple de Zonas Verdes", description: "Pasa una tarde activa con instructores de baile y música regional.", type: "Lúdico" },
    { day: 22, title: "Operativo Masivo de Carnetización Física", time: "08:00 AM - 04:00 PM", room: "Ventanillas de Bienestar Estudiantil", description: "Toma de fotografía y entrega inmediata del carné físico universitario.", type: "Soporte" },
    { day: 26, title: "Muestra Expositiva de Proyectos ACA", time: "10:00 AM - 01:00 PM", room: "Pasillo del Bloque A", description: "Ejemplos de ideas aplicadas para entender los entregables de semestre.", type: "Académico" },
    { day: 30, title: "Cóctel de Cierre de Bienvenida", time: "04:00 PM - 06:00 PM", room: "Terraza del Bloque Central", description: "Celebración y brindis por el inicio de este gran viaje profesional.", type: "Bienvenida" }
  ],
  "Julio 2026": [
    { day: 1, title: "Inicio de Clases - Inducción de Consejeros", time: "09:00 AM - 11:00 AM", room: "Salón Académico 301 (Bloque A)", description: "Primera sesión oficial de acompañamiento con tu consejero asignado.", type: "Bienvenida" },
    { day: 3, title: "Conferencia: Becas y Viajes Internacionales", time: "02:00 PM - 03:30 PM", room: "Auditorio de Idiomas (Bloque B)", description: "Descubre convenios de intercambio en el exterior disponibles para ti.", type: "Académico" },
    { day: 6, title: "Laboratorio de Liderazgo y Oratoria", time: "11:00 AM - 01:00 PM", room: "Salón de Tareas Colectivas 102", description: "Aprende tips para perder el miedo a hablar en público.", type: "Académico" },
    { day: 9, title: "Feria de Acción Social y Voluntariado", time: "10:00 AM - 02:00 PM", room: "Patio Interno Central", description: "Súmate a proyectos comunitarios y deja tu huella positiva en la ciudad.", type: "Lúdico" },
    { day: 15, title: "Taller Práctico de Consultoría y Prácticas", time: "03:00 PM - 05:00 PM", room: "Sala de Juntas Empresariales", description: "Charla para entender el mundo de las prácticas laborales desde primer semestre.", type: "Académico" },
    { day: 19, title: "Día de la Independencia - Receso del Campus", time: "Todo el día", room: "Campus Cerrado", description: "Día festivo nacional sin actividades programadas en las instalaciones primarias.", type: "Lúdico" },
    { day: 20, title: "Día de la Familia y Amigos CUNistas", time: "09:00 AM - 03:00 PM", room: "Campus Total y Zonas de Picnic", description: "Trae a tu familia a conocer tu sede universitaria, juegos de mesa y comida gratis.", type: "Lúdico" },
    { day: 24, title: "Asesoría para Resolver Casos de Notas", time: "02:00 PM - 04:00 PM", room: "Aula Central de Sistemas 7", description: "Resolución de inconvenientes académicos por parte de directores.", type: "Soporte" },
    { day: 31, title: "Clausura del Onboarding de Nuevos Estudiantes", time: "11:00 AM - 01:00 PM", room: "Gimnasio Universitario Central", description: "Último hito del mes con entrega de premios por participación interactiva.", type: "Bienvenida" }
  ]
};

interface PresencialOnboardingProps {
  onBackToHome: () => void;
}

export const PresencialOnboarding: React.FC<PresencialOnboardingProps> = ({ onBackToHome }) => {
  // Navigation Menu tabs inside Presencial
  const [activeMenu, setActiveMenu] = useState<'recorrido' | 'calendario' | 'horario'>('recorrido');
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [currentMonth, setCurrentMonth] = useState<'Junio 2026' | 'Julio 2026'>('Junio 2026');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);

  // Sparkly decorative items list representing animations
  const [stars, setStars] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const handleSparkleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const colors = ['#35B84A', '#9BFF00', '#FFFFFF', '#172B6B', '#22c55e'];
    const newStar = {
      id: Date.now(),
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setStars((prev) => [...prev, newStar].slice(-15)); // Keep last 15
  };

  // Mock schedule data for the "Grilla de Horarios" view
  const weeklySchedule = {
    Lunes: [
      { time: "07:00 AM - 09:00 AM", subject: "Pensamiento CUNista", room: "Bloque A - Salón 301", teacher: "Prof. Alberto Gómez", type: "Teórica" },
      { time: "09:00 AM - 11:00 AM", subject: "Cátedra de Paz", room: "Bloque B - Auditorio", teacher: "Prof. María Restrepo", type: "General" }
    ],
    Martes: [
      { time: "08:00 AM - 10:00 AM", subject: "Álgebra Lineal", room: "Bloque C - Laboratorio 3", teacher: "Prof. Ricardo Pérez", type: "Práctica" },
      { time: "10:00 AM - 12:00 PM", subject: "Introducción a la Programación", room: "Bloque D - Salón 105", teacher: "Prof. Diana Silva", type: "Práctica" }
    ],
    Miércoles: [
      { time: "07:00 AM - 09:00 AM", subject: "Habilidades Comunicativas", room: "Bloque A - Salón 201", teacher: "Prof. Clara Valencia", type: "Teórica" }
    ],
    Jueves: [
      { time: "09:00 AM - 11:00 AM", subject: "Inglés I", room: "Bloque E - Lab de Idiomas", teacher: "Prof. John Doe", type: "Idioma" },
      { time: "11:00 AM - 01:00 PM", subject: "Higiene y Salud", room: "Bloque F - Enfermería", teacher: "Prof. Marta Ortiz", type: "General" }
    ],
    Viernes: [
      { time: "08:00 AM - 11:05 AM", subject: "Proyecto Integrador (Taller)", room: "Bloque A - Salón de Proyectos", teacher: "Prof. Carlos Vega", type: "Taller" }
    ],
    Sábado: [
      { time: "09:00 AM - 01:00 PM", subject: "Actividad Lúdica / Deportes", room: "Zonas Verdes", teacher: "Instructor Bienestar", type: "Deportivo" }
    ]
  };

  return (
    <div 
      className="relative min-h-[calc(100vh-4.5rem)] py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#072a1f] to-[#010c08] cursor-crosshair"
      onClick={handleSparkleClick}
    >
      
      {/* Interactive Sparkle Click Animations */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 1, scale: 0, x: star.x - 10, y: star.y - 10 }}
            animate={{ opacity: 0, scale: 2.2, y: star.y - 65, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute pointer-events-none z-50 flex items-center justify-center"
            style={{ left: 0, top: 0 }}
          >
            <Star className="w-5 h-5 fill-current" style={{ color: star.color }} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative Lineart Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <UniversityLineartBackground className="absolute bottom-0 inset-x-0 h-64 opacity-15 text-brand-green-neon" />
        <DecorativeLeafGrid color="green" className="absolute top-20 left-10 w-32 h-32 opacity-10 text-[#9BFF00]" />
        <CornerDottedDecoration color="green" className="absolute bottom-12 right-12 w-28 h-28 rotate-180 opacity-10 text-[#9BFF00]" />
        <FloatingDoodles />
        
        {/* Animated lineart paper planes */}
        <PaperAirplaneLineart className="absolute top-24 left-1/3 w-16 h-16 text-[#9BFF00]/20" delay={1} />
        <PaperAirplaneLineart className="absolute bottom-20 right-1/3 w-20 h-20 text-[#35B84A]/20" delay={4} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Onboarding Header Title Card - styled as a beautiful crisp white card */}
        <div className="bg-white border-4 border-[#35B84A] rounded-[2rem] p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#9BFF00]" />
          
          <div className="space-y-1.5 pl-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35B84A] animate-ping" />
              <span className="text-[10px] font-mono font-black tracking-widest text-[#35B84A] uppercase bg-[#9BFF00]/10 px-2 py-0.5 rounded-md">
                MODALIDAD PRESENCIAL • INDUCCIÓN CUNISTA
              </span>
            </div>
            <h2 className="font-display font-black text-3xl text-[#172B6B] tracking-tight leading-none">
              Párchate Campus: Tu inducción in situ 🏛️
            </h2>
            <p className="text-xs text-[#172B6B]/80 font-medium leading-relaxed">
              Descubre los salones, bloques académicos y laboratorios antes del primer día. Camina por la sede con el recorrido interactivo de 360°, mira los tutoriales cortos y confirma tus horarios académicos.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="self-start md:self-center shrink-0 flex items-center px-5 py-3 text-xs font-black font-display bg-[#172B6B] hover:bg-[#1E306E] text-white rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider border-none hover:scale-105 active:scale-95"
          >
            ← Cambiar Modalidad
          </button>
        </div>

        {/* PRIMARY PHYSICAL FOLDER TAB SELECTOR - Folder look against dark layout */}
        <div className="flex flex-wrap items-end pl-2 sm:pl-6 -mb-[4px] z-20 relative gap-1.5">
          <button
            onClick={() => setActiveMenu('recorrido')}
            className={`px-5 py-3.5 rounded-t-2xl font-display font-black text-xs transition-all flex items-center space-x-2 border-none cursor-pointer select-none ${
              activeMenu === 'recorrido'
                ? 'bg-white text-[#172B6B] shadow-[0_-5px_15px_rgba(155,255,0,0.15)] translate-y-[2px] z-30 ring-2 ring-t ring-[#9BFF00]'
                : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E] text-slate-300 hover:text-white z-10'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${activeMenu === 'recorrido' ? 'text-[#35B84A]' : 'text-slate-400'}`} />
            <span>1. Recorrido 360</span>
          </button>

          <button
            onClick={() => setActiveMenu('calendario')}
            className={`px-5 py-3.5 rounded-t-2xl font-display font-black text-xs transition-all flex items-center space-x-2 border-none cursor-pointer select-none ${
              activeMenu === 'calendario'
                ? 'bg-white text-[#172B6B] shadow-[0_-5px_15px_rgba(155,255,0,0.15)] translate-y-[2px] z-30 ring-2 ring-t ring-[#9BFF00]'
                : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E] text-slate-300 hover:text-white z-10'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeMenu === 'calendario' ? 'text-[#35B84A]' : 'text-slate-400'}`} />
            <span>2. Calendario Power BI</span>
          </button>

          <button
            onClick={() => {
              setActiveMenu('horario');
              setSelectedDayNum(1); // Default to 1st when switching
            }}
            className={`px-5 py-3.5 rounded-t-2xl font-display font-black text-xs transition-all flex items-center space-x-2 border-none cursor-pointer select-none ${
              activeMenu === 'horario'
                ? 'bg-white text-[#172B6B] shadow-[0_-5px_15px_rgba(155,255,0,0.15)] translate-y-[2px] z-30 ring-2 ring-t ring-[#9BFF00]'
                : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E] text-slate-300 hover:text-white z-10'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeMenu === 'horario' ? 'text-[#35B84A]' : 'text-slate-400'}`} />
            <span>3. Cronograma de Actividades</span>
          </button>
        </div>

        {/* ACTIVE SUBMENU DISPLAY BLOCK - drawer body */}
        <div className="bg-white border-4 border-[#9BFF00]/50 rounded-b-[2.5rem] rounded-tr-[2.5rem] rounded-tl-none p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] min-h-[460px] flex flex-col justify-between relative z-10">
          
          {/* Sparkles floating notification hint */}
          <div className="absolute top-3 right-5 text-[10px] text-emerald-800 font-mono font-black flex items-center bg-[#9BFF00]/15 px-3 py-1 rounded-full border border-[#9BFF00]/40 pointer-events-none">
            <Star className="w-3_5 h-3_5 text-[#35B84A] mr-1.5 animate-spin-slow fill-[#35B84A]" />
            <span>¡Toca la pantalla para lanzar estrellas! ✨</span>
          </div>

          <AnimatePresence mode="wait">
            
            {/* VIEW A: RECORRIDO 360 */}
            {activeMenu === 'recorrido' && (
              <motion.div
                key="recorrido-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3 mb-2 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#172B6B]">
                      Sede Realidad Virtual 360° 🧭
                    </h3>
                    <p className="text-xs text-[#172B6B]/80 font-medium">
                      Camina interactivamente por las bloques docentes y salas de cómputos de la universidad.
                    </p>
                  </div>
                  <div className="text-[10px] bg-[#9BFF00]/15 text-[#0B3D2E] font-mono border border-[#9BFF00]/30 px-3 py-1 rounded-md font-black mt-2 sm:mt-0 uppercase">
                    Campus Central • Bogotá Nacional
                  </div>
                </div>

                <Campus360Tour />
              </motion.div>
            )}

            {/* VIEW C: CALENDARIO (PowerBI) */}
            {activeMenu === 'calendario' && (
              <motion.div
                key="calendario-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-display font-black text-2xl text-[#172B6B]">
                    Reporte de Calendario Oficial Power BI 📅
                  </h3>
                  <p className="text-xs text-[#172B6B]/80 font-medium">
                    Navega por las fechas claves de corte de notas mediante gráficos dinámicos e interactivos de PowerBI.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-[#9BFF00]/10 border border-[#9BFF00]/30 p-4 rounded-2xl text-[#0B3D2E] text-xs leading-relaxed">
                    <CalendarDays className="w-5 h-5 text-[#35B84A] shrink-0" />
                    <span>
                      <strong>Panel Dinámico CUN 2026:</strong> Este reporte consolida las fechas de inducción, acuerdos evaluativos (ACA) y cierres administrativos del ciclo actual.
                    </span>
                  </div>

                  <div className="rounded-3xl overflow-hidden border-4 border-slate-100 shadow-lg">
                    <PowerBIEmbed />
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW D: CRONOGRAMA */}
            {activeMenu === 'horario' && (() => {
              const totalDays = currentMonth === "Junio 2026" ? 30 : 31;
              const startOffset = currentMonth === "Junio 2026" ? 0 : 2; // June starts on Mon (0 offset), July on Wed (2 offset)
              const eventsForMonth = cronogramaEvents[currentMonth] || [];
              const selectedDayEvent = eventsForMonth.find(e => e.day === selectedDayNum);

              return (
                <motion.div
                  key="horario-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-black text-2xl text-[#172B6B]">
                        Cronograma Mensual de Actividades 📅
                      </h3>
                      <p className="text-xs text-[#172B6B]/80 font-medium">
                        Calendario interactivo completo de 31 días con eventos presenciales, integraciones y talleres en campus.
                      </p>
                    </div>

                    {/* Month selector toggle */}
                    <div className="flex bg-[#0B3D2E]/15 p-1 rounded-xl self-start shrink-0 border border-[#0B3D2E]/10">
                      {["Junio 2026", "Julio 2026"].map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setCurrentMonth(month as 'Junio 2026' | 'Julio 2026');
                            setSelectedDayNum(1); // reset to 1st
                          }}
                          className={`px-4 py-2 rounded-lg text-xs font-black tracking-tight transition-all cursor-pointer border-none ${
                            currentMonth === month
                              ? 'bg-[#172B6B] text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 bg-transparent'
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: INTERACTIVE MONTHLY CALENDAR (Span 7) */}
                    <div className="md:col-span-7 bg-slate-50/70 p-4.5 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-mono font-black text-[#172B6B] uppercase tracking-widest">
                          🧭 Navegación Diaria • Click para ver actividad
                        </span>
                        <span className="text-xs font-black text-[#35B84A] bg-[#9BFF00]/20 px-2.5 py-0.5 rounded-full font-mono uppercase">
                          {currentMonth}
                        </span>
                      </div>

                      {/* Header row of days */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                          <div key={d} className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 py-1">
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid itself */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* Empty offset spaces */}
                        {Array.from({ length: startOffset }).map((_, i) => (
                          <div key={`empty-${i}`} className="aspect-square bg-slate-100/30 rounded-xl border border-dotted border-slate-150" />
                        ))}

                        {/* Real days 1 to totalDays */}
                        {Array.from({ length: totalDays }, (_, i) => {
                          const dayNum = i + 1;
                          const hasEvent = eventsForMonth.some(e => e.day === dayNum);
                          const isSelected = selectedDayNum === dayNum;
                          const event = eventsForMonth.find(e => e.day === dayNum);

                          let eventColorClass = "text-slate-600 hover:bg-slate-100 bg-white border border-slate-100";
                          if (hasEvent) {
                            if (event?.type === 'Bienvenida') eventColorClass = "bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/40 hover:bg-[#ff4444]/25 font-black";
                            else if (event?.type === 'Académico') eventColorClass = "bg-sky-100/70 text-sky-700 border border-sky-300 hover:bg-sky-200/90 font-black";
                            else if (event?.type === 'Lúdico') eventColorClass = "bg-[#35B84A]/10 text-[#0f701e] border border-[#35B84A]/40 hover:bg-[#35B84A]/25 font-black";
                            else if (event?.type === 'Soporte') eventColorClass = "bg-violet-50 text-violet-700 border border-violet-300 hover:bg-violet-200 font-black";
                            else if (event?.type === 'Emprendimiento') eventColorClass = "bg-amber-100/80 text-amber-705 border border-amber-350 hover:bg-amber-150 font-black";
                          }

                          return (
                            <button
                              key={`day-${dayNum}`}
                              onClick={() => setSelectedDayNum(dayNum)}
                              className={`aspect-square rounded-xl text-xs font-display transition-all cursor-pointer flex flex-col items-center justify-between p-2 focus:outline-none relative border-none ${eventColorClass} ${
                                isSelected 
                                  ? 'ring-4 ring-[#9BFF00] scale-105 shadow-md bg-[#172B6B]! text-white!' 
                                  : ''
                              }`}
                            >
                              <span className={`font-mono font-black text-sm ${isSelected ? 'text-white' : ''}`}>{dayNum}</span>
                              {hasEvent && (
                                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#9BFF00]' : 'bg-current'} animate-pulse`} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-150 flex flex-wrap gap-2 text-[9px] font-mono text-slate-500 font-bold uppercase justify-center">
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-amber-500 mr-1 inline-block" /> Emprendimiento</span>
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-[#ff4444] mr-1 inline-block" /> Bienvenida</span>
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-sky-500 mr-1 inline-block" /> Académico</span>
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-[#35B84A] mr-1 inline-block" /> Lúdico</span>
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-violet-500 mr-1 inline-block" /> Soporte</span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: EVENT DETAIL OR CAMPUS VISITATION TIP (Span 5) */}
                    <div className="md:col-span-5 h-full">
                      <AnimatePresence mode="wait">
                        {selectedDayEvent ? (
                          <motion.div
                            key={`event-detail-${selectedDayNum}-${currentMonth}`}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            className="bg-white border-2 border-[#9BFF00]/70 p-5 rounded-[1.8rem] shadow-lg flex flex-col justify-between h-full space-y-4"
                          >
                            <div className="space-y-4 text-left">
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase border ${
                                  selectedDayEvent.type === 'Bienvenida' ? 'bg-[#ff4444]/15 text-[#ff4444] border-[#ff4444]/30' :
                                  selectedDayEvent.type === 'Académico' ? 'bg-sky-50 text-sky-700 border-sky-300' :
                                  selectedDayEvent.type === 'Lúdico' ? 'bg-[#35B84A]/15 text-[#0f701e] border-[#35B84A]/30' :
                                  selectedDayEvent.type === 'Soporte' ? 'bg-violet-50 text-violet-700 border-violet-300' :
                                  'bg-amber-50 text-amber-700 border-amber-300'
                                }`}>
                                  ★ {selectedDayEvent.type}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                  Día {selectedDayNum} • {currentMonth.split(" ")[0]}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-display font-black text-xl text-[#172B6B] tracking-tight leading-snug">
                                  {selectedDayEvent.title}
                                </h4>
                                <p className="text-xs text-slate-500 font-mono mt-1 flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 text-[#35B84A]" />
                                  {selectedDayEvent.time}
                                </p>
                              </div>

                              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold space-y-2 text-slate-700 leading-relaxed">
                                <p className="flex items-start">
                                  <Building className="w-4 h-4 mr-2 text-slate-450 shrink-0 mt-0.5" />
                                  <span><strong>Lugar:</strong> {selectedDayEvent.room}</span>
                                </p>
                                <p className="text-[#172B6B]/90 mt-1 line-clamp-4">
                                  {selectedDayEvent.description}
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Sede Bogotá Campus</span>
                              <span className="text-[#35B84A] font-black text-[9px] uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 rounded-full bg-[#35B84A] mr-1.5 inline-block animate-pulse" /> Confirmado
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={`event-empty-${selectedDayNum}-${currentMonth}`}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            className="bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-[1.8rem] flex flex-col justify-between h-full space-y-4 text-left"
                          >
                            <div className="space-y-3">
                              <span className="text-[10px] font-mono text-slate-400 font-bold">
                                Día {selectedDayNum} • {currentMonth.split(" ")[0]}
                              </span>
                              
                              <h4 className="font-display font-black text-lg text-slate-400 tracking-tight leading-snug">
                                Actividades Libres en Campus 🎴
                              </h4>

                              <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-white p-3.5 rounded-2xl border border-slate-100">
                                No hay eventos institucionales obligatorios programados para hoy. Un gran día para conocer tu facultad, visitar la heladería CUN, probar la conexión de alta velocidad de las salas o coordinar con nuevos amigos del grupo.
                              </p>

                              <p className="text-[10px] text-slate-450 leading-relaxed font-mono">
                                💡 Puedes hacer clic en cualquiera de los días resaltados en color para ver eventos especiales programados.
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
                              <span>Biblioteca Abierta</span>
                              <span>07:00 AM - 10:00 PM</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border text-[#172B6B]/80 text-xs font-semibold text-center sm:text-left">
                    👉 <strong>Tip de Orientación:</strong> Tu horario de bloques presencial completo se sintoniza directamente en el modulo institucional <strong>SINU</strong>.
                  </div>
                </motion.div>
              );
            })()}

          </AnimatePresence>

          {/* Spacer footer matching height layout */}
          <div className="h-4" />
        </div>

        {/* Support footprint notice - Styled as a spectacular white sticker card */}
        <div className="p-5 bg-white border-4 border-[#35B84A] rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4 text-left">
            <div className="p-3 bg-[#9BFF00]/15 rounded-2xl">
              <AlertCircle className="w-7 h-7 text-[#35B84A] shrink-0" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-black text-[#172B6B]">¿Tienes dudas de salones u observaciones de infraestructura?</p>
              <p className="text-xs text-[#172B6B]/80 font-medium">No te preocupes. Acércate a la ventanilla de Bienestar Estudiantil en el Bloque principal de tu sede para ayudarte presencialmente.</p>
            </div>
          </div>
          <a
            href="mailto:bienestar@cun.edu.co"
            className="px-6 py-3 bg-[#35B84A] hover:bg-[#2fa341] text-white hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest rounded-xl transition-all text-center border-none"
          >
            Soporte de Bienestar 🎯
          </a>
        </div>

      </div>
    </div>
  );
};
