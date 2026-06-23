import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, GraduationCap, Compass, BookOpen, AlertCircle, 
  Newspaper, FileSpreadsheet, Gamepad2, Play, ZoomIn, ZoomOut, RotateCcw, 
  Image as ImageIcon, Sparkles, Clock, Calendar, Info
} from 'lucide-react';
import { ShortsTutorials } from './ShortsTutorials';
import { ActivityCalendar } from './ActivityCalendar';
import { virtualTutorials } from '../data';
import { DecorativeLeafGrid, CornerDottedDecoration } from './LineArtDecorations';
import { WorldConnectionsMap } from './WorldConnectionsMap';

interface VirtualOnboardingProps {
  onBackToHome: () => void;
}

interface SedeVirtual {
  id: string;
  name: string;
  students: number;
  lat: number;
  lng: number;
  programs: string[];
  achievement: string;
}

export const VirtualOnboarding: React.FC<VirtualOnboardingProps> = ({ onBackToHome }) => {
  // Main Navigation Tabs
  const [activeMenu, setActiveMenu] = useState<'mapa' | 'ecosistema' | 'cronograma'>('mapa');
  
  // Ecosistema Sub-tabs
  const [activeMaterialCategory, setActiveMaterialCategory] = useState<
    'Revistas' | 'Fichas' | 'FunCUN' | 'Glosario'
  >('Revistas');

  const sedesVirtuales: SedeVirtual[] = [
    {
      id: "bogota",
      name: "Sede Bogotá Regional",
      students: 15420,
      lat: 58,
      lng: 48,
      programs: ["Administración de Empresas", "Ingeniería de Sistemas", "Contaduría Pública", "Especialización en Gerencia"],
      achievement: "Centro de mayor retención y matrícula digital."
    },
    {
      id: "medellin",
      name: "Sede Medellín / Antioquia",
      students: 6890,
      lat: 44,
      lng: 39,
      programs: ["Diseño Gráfico", "Dirección de Medios", "Negocios Internacionales"],
      achievement: "Líder en proyectos de semilleros tecnológicos CUNBRE."
    },
    {
      id: "cali",
      name: "Sede Cali / Valle del Cauca",
      students: 4120,
      lat: 65,
      lng: 32,
      programs: ["Administración de Servicios de Salud", "Publicidad y Mercadeo", "Ingeniería Industrial"],
      achievement: "Alta participación en talleres folclóricos y deportivos."
    },
    {
      id: "barranquilla",
      name: "Sede Barranquilla / Costa",
      students: 5780,
      lat: 22,
      lng: 45,
      programs: ["Comunicación Social", "Administración Turística", "Diseño de Modas"],
      achievement: "Mayor crecimiento anual de matrículas en 2026."
    }
  ];

  const [selectedSede, setSelectedSede] = useState<SedeVirtual>(sedesVirtuales[0]);

  // Flipbook pages content for Revistas matching requested Azul Oscuro text colors
  const flipbookPagesContent = [
    {
      title: "Cultura Emprendedora CUNBRE",
      type: "Editorial Especial",
      content: "Bienvenidos a la CUN. En este ciclo académico impulsamos tus ideas. Conoce cómo puedes postular tus proyectos a capital semilla institucional que se otorga semestralmente a los mejores emprendedores.",
      tags: ["Emprendimiento", "Becas", "Incentivos"]
    },
    {
      title: "Transformación Digital e IA",
      type: "Artículo de Portada",
      content: "Nuestras salas de computación digital se han actualizado con herramental de Inteligencia Artificial Generativa. Sintoniza tus clases virtuales interactuando con laboratorios inmersivos.",
      tags: ["Ingeniería", "Innovación", "IA"]
    },
    {
      title: "Bienestar al 100% Sin Barreras",
      type: "Iniciativas de Éxito",
      content: "Aún en la virtualidad cuentas con psicólogas, entrenadores físicos y talleres artísticos en vivo. Únete a los clubes de ajedrez, e-sports o de salud física que transmitimos semanalmente.",
      tags: ["Salud", "Deporte", "Comunidad"]
    },
    {
      title: "Tu Ruta de Egreso Profesional",
      type: "Plan de Vida",
      content: "La CUN te gradúa en ciclos propedéuticos: Técnico Profesional en 3 semestres, Tecnólogo en 6 semestres, y Profesional Universitario en 9 semestres. ¡Crece paso a paso!",
      tags: ["Propedéutico", "Carrera", "Futuro"]
    }
  ];

  const [flipbookPage, setFlipbookPage] = useState<number>(0);

  // Fichas (Double Side Study Cards) Status
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const studyCards = [
    {
      id: 1,
      front: "¿Qué significan las siglas del ACA?",
      back: "Acuerdo de Calificación de Aula. Es un proyecto práctico obligatorio dividido en 3 entregables (Corte 1: 30%, Corte 2: 30%, Corte 3: 40%)."
    },
    {
      id: 2,
      front: "¿Cómo operan los Bloques Académicos?",
      back: "Cada semestre académico dura 16 semanas, dividido en dos periodos de 8 semanas llamados Bloque 1 y Bloque 2 para que no te satures de materias."
    },
    {
      id: 3,
      front: "¿Qué es el portal SINU?",
      back: "Es tu plataforma administrativa donde puedes inscribir materias, generar recibos de pago, y descargar tu sábana oficial de calificaciones."
    }
  ];

  const handleFlipCard = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // FunCUN GIF speed simulation
  const [gifPlaySpeed, setGifPlaySpeed] = useState<number>(1);
  const [gifIsPlaying, setGifIsPlaying] = useState<boolean>(true);

  // Glosario State variables
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#072a1f] to-[#010c08]">
      
      {/* Decorative Lineart Floating Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <DecorativeLeafGrid color="green" className="absolute top-24 right-5 w-36 h-36 opacity-10 text-[#9BFF00]" />
        <CornerDottedDecoration color="green" className="absolute bottom-10 left-5 w-24 h-24 opacity-10 text-[#9BFF00]" />
        <div className="absolute top-[40%] right-[15%] w-80 h-80 rounded-full bg-[#9BFF00]/5 blur-[120px]" />
        <div className="absolute bottom-10 left-[10%] w-96 h-96 rounded-full bg-[#35B84A]/5 blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Onboarding Header Title Card - styled as a beautiful crisp white card */}
        <div className="bg-white border-4 border-[#35B84A] rounded-[2rem] p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#9BFF00]" />
          
          <div className="space-y-1.5 pl-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35B84A] animate-ping" />
              <span className="text-[10px] font-mono font-black tracking-widest text-[#35B84A] uppercase bg-[#9BFF00]/20 px-2 py-0.5 rounded-md">
                MODALIDAD DIGITAL • INDUCCIÓN CUNISTA
              </span>
            </div>
            <h2 className="font-display font-black text-3xl text-[#172B6B] tracking-tight leading-none">
              Párchate Virtual: Aula Digital & Autogestión 🌐
            </h2>
            <p className="text-xs text-[#172B6B]/80 font-medium leading-relaxed">
              Maneja tu tiempo con flexibilidad total. Explora el mapa de conexiones, utiliza guías interactivas en tu ecosistema virtual y domina tus portales académicos.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="self-start md:self-center shrink-0 flex items-center px-5 py-3 text-xs font-black font-display bg-[#172B6B] hover:bg-[#1E306E] text-white rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider border-none hover:scale-105 active:scale-95"
          >
            ← Cambiar Modalidad
          </button>
        </div>

        {/* PRIMARY FOLDER TABS BAR - Custom Folder look against dark layout */}
        <div className="flex flex-wrap items-end pl-2 sm:pl-6 -mb-[4px] z-20 relative gap-1.5">
          <button
            onClick={() => setActiveMenu('mapa')}
            className={`px-5 py-3.5 rounded-t-2xl font-display font-black text-xs transition-all flex items-center space-x-2 border-none cursor-pointer select-none ${
              activeMenu === 'mapa'
                ? 'bg-white text-[#172B6B] shadow-[0_-5px_15px_rgba(155,255,0,0.15)] translate-y-[2px] z-30 ring-2 ring-t ring-[#9BFF00]'
                : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E] text-slate-300 hover:text-white z-10'
            }`}
          >
            <Globe className={`w-3.5 h-3.5 ${activeMenu === 'mapa' ? 'text-[#35B84A]' : 'text-slate-400'}`} />
            <span>1. Sedes & Alumnos</span>
          </button>

          <button
            onClick={() => setActiveMenu('ecosistema')}
            className={`px-5 py-3.5 rounded-t-2xl font-display font-black text-xs transition-all flex items-center space-x-2 border-none cursor-pointer select-none ${
              activeMenu === 'ecosistema'
                ? 'bg-white text-[#172B6B] shadow-[0_-5px_15px_rgba(155,255,0,0.15)] translate-y-[2px] z-30 ring-2 ring-t ring-[#9BFF00]'
                : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E] text-slate-300 hover:text-white z-10'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeMenu === 'ecosistema' ? 'text-[#35B84A]' : 'text-slate-400'}`} />
            <span>2. Ecosistema Digital</span>
          </button>

          <button
            onClick={() => setActiveMenu('cronograma')}
            className={`px-5 py-3.5 rounded-t-2xl font-display font-black text-xs transition-all flex items-center space-x-2 border-none cursor-pointer select-none ${
              activeMenu === 'cronograma'
                ? 'bg-white text-[#172B6B] shadow-[0_-5px_15px_rgba(155,255,0,0.15)] translate-y-[2px] z-30 ring-2 ring-t ring-[#9BFF00]'
                : 'bg-[#0B3D2E]/80 hover:bg-[#0B3D2E] text-slate-300 hover:text-white z-10'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeMenu === 'cronograma' ? 'text-[#35B84A]' : 'text-slate-400'}`} />
            <span>3. Cronograma Académico</span>
          </button>
        </div>

        {/* CONTAINER FILE CABINET - Redesigned white drawer block */}
        <div className="bg-white border-4 border-[#9BFF00]/50 rounded-b-[2.5rem] rounded-tr-[2.5rem] rounded-tl-none p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] min-h-[490px] flex flex-col justify-between relative z-10">
          <AnimatePresence mode="wait">
            
            {/* TAB 2: INTERACTIVE MAP */}
            {activeMenu === 'mapa' && (
              <motion.div
                key="mapa-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#172B6B]">
                      Alumnos Virtuales por Colombia y el Mundo 🌐🌎
                    </h3>
                    <p className="text-xs text-[#172B6B]/80 font-medium">
                      Explora la visualización interactiva de nodos y sedes habilitados por la CUN.
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 px-3 py-1.5 bg-[#9BFF00]/15 border border-[#9BFF00]/50 rounded-xl text-[#0B3D2E] text-[10px] font-mono font-black uppercase tracking-wider">
                    🟢 Red Global Activa • 2026
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Selector of cities / Sedes */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-black text-[#35B84A] uppercase tracking-widest block">Selecciona un hub de conexión:</span>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {sedesVirtuales.map((sede) => (
                          <button
                            key={sede.id}
                            onClick={() => setSelectedSede(sede)}
                            className={`p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer text-left ${
                              selectedSede.id === sede.id
                                ? 'bg-[#9BFF00]/10 border-[#9BFF00] shadow-sm'
                                : 'bg-white border-slate-100 hover:border-slate-350'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-black text-[#172B6B]">{sede.name}</p>
                              <p className="text-[10px] font-mono text-slate-450 font-bold">{sede.students.toLocaleString()} ESTUDIANTES DIGITALES</p>
                            </div>
                            <ChevronRightSymbol active={selectedSede.id === sede.id} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#172B6B]/5 border-2 border-[#172B6B]/15 rounded-3xl p-5 relative overflow-hidden shadow-xs">
                      <div className="absolute top-0 right-0 p-3 text-[#172B6B]/10">
                        <GraduationCap className="w-16 h-16" />
                      </div>
                      <h4 className="text-xs font-black text-[#172B6B] uppercase tracking-wide mb-1.5 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#35B84A]" />
                        <span>Ficha del Nodo: {selectedSede.name}</span>
                      </h4>
                      <p className="text-xs text-[#172B6B]/90 font-sans leading-relaxed">
                        <strong>Logros:</strong> {selectedSede.achievement}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {selectedSede.programs.slice(0, 2).map((prog) => (
                          <span key={prog} className="text-[9px] bg-white border border-[#172B6B]/20 text-[#172B6B] px-2 py-0.5 rounded-md font-mono font-bold">
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: World Maps Component */}
                  <div className="lg:col-span-8 bg-slate-50 border-2 border-slate-150 rounded-[2rem] p-4 flex flex-col justify-between shadow-inner min-h-[350px]">
                    <WorldConnectionsMap />
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 3: ECOSISTEMA DIGITAL */}
            {activeMenu === 'ecosistema' && (
              <motion.div
                key="ecosistema-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#172B6B]">
                      Ecosistema de Formación CUNista 🧭
                    </h3>
                    <p className="text-xs text-[#172B6B]/80 font-medium">
                      Prueba los visualizadores interactivos (Revista Flipbook, Fichas 3D, simuladores).
                    </p>
                  </div>
                  
                  {/* PESTAÑITAS */}
                  <div className="flex flex-wrap gap-1 p-1 bg-[#0B3D2E]/10 rounded-xl" id="virtual-sub-tabs">
                    {(['Revistas', 'Fichas', 'FunCUN', 'Glosario'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveMaterialCategory(cat);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black font-display tracking-tight transition-all cursor-pointer ${
                          activeMaterialCategory === cat
                            ? 'bg-[#9BFF00] text-[#0B3D2E] shadow-sm border-none'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left panel */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                    <div className="bg-[#172B6B]/5 border-2 border-[#172B6B]/10 rounded-3xl p-5 space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="p-2.5 bg-[#35B84A] text-white rounded-xl shadow-md">
                          {activeMaterialCategory === 'Revistas' && <Newspaper className="w-5 h-5" />}
                          {activeMaterialCategory === 'Fichas' && <FileSpreadsheet className="w-5 h-5" />}
                          {activeMaterialCategory === 'FunCUN' && <Gamepad2 className="w-5 h-5" />}
                          {activeMaterialCategory === 'Glosario' && <BookOpen className="w-5 h-5" />}
                        </span>
                        <h4 className="font-display font-black text-sm text-[#172B6B] uppercase tracking-widest">
                          {activeMaterialCategory}
                        </h4>
                      </div>

                      <p className="text-xs text-[#172B6B]/85 font-medium leading-relaxed font-sans">
                        {activeMaterialCategory === 'Revistas' && "Navega interactivamente por las páginas del Flipbook estudiantil. Lee artículos especiales de la universidad y consejos curriculares."}
                        {activeMaterialCategory === 'Fichas' && "Interactúa con las fichas académicas bilaterales. Haz clic para girar la tarjeta en 180° y descubrir respuestas rápidas de autogestión."}
                        {activeMaterialCategory === 'FunCUN' && "Asistente visual interactivo de reproducción de animaciones. Modifica la velocidad del bucle del Cami canino de tu aula académica."}
                        {activeMaterialCategory === 'Glosario' && "Ficha de mapa infográfico. Explora abreviaciones técnicas críticas de la CUN con zooms de ajuste y reajuste dinámicos."}
                      </p>
                    </div>

                    <div className="bg-[#9BFF00]/15 border border-[#9BFF00]/55 rounded-[1.5rem] p-4 flex items-center space-x-2.5 shadow-sm">
                      <Sparkles className="w-5 h-5 text-[#35B84A] shrink-0" />
                      <span className="text-[10px] text-[#0B3D2E] font-mono font-black tracking-normal leading-snug">
                        Simulación de recursos didácticos de estudio homologados ante el Ministerio de Educación Nacional.
                      </span>
                    </div>
                  </div>

                  {/* Right panel: Terminal Simulation frame */}
                  <div className="lg:col-span-8 bg-black border-4 border-[#0B3D2E] rounded-3xl p-5 text-white flex flex-col justify-between min-h-[380px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#020503] bg-[radial-gradient(#051a0d_1px,transparent_1px)] [background-size:16px_16px] rounded-2xl pointer-events-none" />

                    <div className="relative z-10 w-full h-[280px] flex flex-col justify-center items-center">
                      
                      {/* SUB-VIEW 1: REVISTAS */}
                      {activeMaterialCategory === 'Revistas' && (
                        <div className="w-full h-full flex flex-col justify-between">
                          <p className="text-[10px] text-[#9BFF00] font-mono text-center uppercase tracking-widest bg-emerald-950/50 py-1.5 rounded-lg border border-[#35B84A]/30">
                            Folleto Flipbook CUN • pág {flipbookPage + 1} de {flipbookPagesContent.length}
                          </p>

                          <div className="my-auto grid sm:grid-cols-2 gap-4 bg-[#071a10] p-4.5 rounded-2xl border border-[#9BFF00]/30 relative shadow-inner overflow-hidden min-h-[170px]">
                            <div className="border-r border-dashed border-[#35B84A]/30 pr-3 flex flex-col justify-between text-left">
                              <div>
                                <span className="text-[9px] font-mono text-[#9BFF00] uppercase font-black tracking-widest bg-[#35B84A]/20 px-1.5 py-0.5 rounded">
                                  {flipbookPagesContent[flipbookPage].type}
                                </span>
                                <h5 className="text-[13px] font-black tracking-tight text-white mt-1.5 leading-tight">
                                  {flipbookPagesContent[flipbookPage].title}
                                </h5>
                                <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5 font-sans italic line-clamp-4">
                                  "{flipbookPagesContent[flipbookPage].content}"
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {flipbookPagesContent[flipbookPage].tags.map(tag => (
                                  <span key={tag} className="text-[8px] font-mono bg-emerald-950 text-[#9BFF00] px-2 py-0.5 rounded border border-emerald-900">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="hidden sm:flex flex-col items-center justify-center text-center p-3 text-slate-450 bg-black/40 rounded-xl border border-emerald-950/20">
                              <BookOpen className="w-8 h-8 text-[#9BFF00] mb-2 animate-bounce" />
                              <span className="text-[9px] font-mono text-[#9BFF00]/80 leading-snug">
                                Edición Informativa de Formación Curricular Oficial • CUN 2026.
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center bg-black/60 p-2 rounded-xl border border-slate-900">
                            <button
                              onClick={() => setFlipbookPage(prev => Math.max(0, prev - 1))}
                              disabled={flipbookPage === 0}
                              className="px-4 py-1.5 bg-[#0B3D2E] border border-[#0B3D2E] hover:border-[#9BFF00] text-[#9BFF00] text-xs font-black rounded-lg disabled:opacity-40 cursor-pointer select-none"
                            >
                              ← Anterior
                            </button>
                            <span className="text-[10px] text-[#9BFF00]/70 font-mono tracking-widest uppercase">PÁGINAS FLIP</span>
                            <button
                              onClick={() => setFlipbookPage(prev => Math.min(flipbookPagesContent.length - 1, prev + 1))}
                              disabled={flipbookPage === flipbookPagesContent.length - 1}
                              className="px-4 py-1.5 bg-[#0B3D2E] border border-[#0B3D2E] hover:border-[#9BFF00] text-[#9BFF00] text-xs font-black rounded-lg disabled:opacity-40 cursor-pointer select-none"
                            >
                              Siguiente →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 2: FICHAS */}
                      {activeMaterialCategory === 'Fichas' && (
                        <div className="w-full h-full flex flex-col justify-between space-y-3">
                          <p className="text-[10px] text-[#9BFF00] font-mono text-center uppercase tracking-widest bg-emerald-950/20 py-1.5 rounded-lg border border-[#35B84A]/30">
                            Haz clic en las tarjetas de autogestión para girarlas (180° Bilateral)
                          </p>

                          <div className="grid sm:grid-cols-3 gap-4 grow my-auto">
                            {studyCards.map((card) => {
                              const isFlipped = flippedCards[card.id] || false;
                              return (
                                <div 
                                  key={card.id}
                                  onClick={() => handleFlipCard(card.id)}
                                  className="h-[175px] w-full [perspective:1000px] cursor-pointer"
                                >
                                  <div 
                                    className={`relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                                  >
                                    {/* Question Front */}
                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#07160f] border-2 border-[#35B84A]/50 rounded-2xl p-3 flex flex-col justify-between shadow-lg">
                                      <div className="flex justify-between items-center text-[#9BFF00] text-[9px] font-mono">
                                        <span>PREGUNTA 🎓</span>
                                        <span>GIRAR</span>
                                      </div>
                                      <p className="text-xs text-white font-display font-black text-center my-auto px-1 tracking-tight leading-snug">
                                        {card.front}
                                      </p>
                                      <div className="text-center text-[8px] font-mono text-[#9BFF00]/40">INICIACIÓN A</div>
                                    </div>

                                    {/* Answer Back */}
                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-emerald-950 border-2 border-[#9BFF00] rounded-2xl p-3 flex flex-col justify-between shadow-lg">
                                      <div className="flex justify-between items-center text-black text-[9px] font-mono font-black bg-[#9BFF00] px-1.5 py-0.5 rounded leading-none">
                                        <span>SOLUCIÓN</span>
                                      </div>
                                      <p className="text-[10px] text-slate-100 font-sans leading-relaxed text-center my-auto px-1">
                                        {card.back}
                                      </p>
                                      <div className="text-center text-[8px] font-mono text-[#9BFF00]/40">INICIACIÓN B</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 3: FUNCUN */}
                      {activeMaterialCategory === 'FunCUN' && (
                        <div className="w-full h-full flex flex-col justify-between">
                          <p className="text-[10px] text-[#9BFF00] font-mono text-center uppercase tracking-widest bg-emerald-950/20 py-1.5 rounded-lg border border-[#35B84A]/30 mb-2">
                             Mascota Animada Loops: Asistencia Digital "Cami"
                          </p>

                          <div className="grow bg-black rounded-2xl border border-emerald-950 flex items-center justify-center p-4 relative overflow-hidden min-h-[150px]">
                            <motion.div 
                              className="text-center space-y-2 select-none"
                              animate={gifIsPlaying ? { 
                                scale: [1, 1.05 * gifPlaySpeed, 0.95, 1],
                                rotate: gifIsPlaying ? [-2 * gifPlaySpeed, 2 * gifPlaySpeed, -1 * gifPlaySpeed, 0] : 0
                              } : {}}
                              transition={{ repeat: Infinity, duration: 1 / gifPlaySpeed }}
                            >
                              <Gamepad2 className="w-16 h-16 text-[#9BFF00] mx-auto drop-shadow-[0_0_15px_#9BFF00]" />
                              <div className="bg-[#08180c] py-1 px-3 rounded-lg border border-[#9BFF00]/30 shadow-md">
                                <span className="text-[11px] font-mono font-black text-[#9BFF00]">
                                  {gifIsPlaying ? "🔋 REPRODUCCIÓN EN DIRECTO" : "⏸️ SIMULACIÓN EN PAUSA"}
                                </span>
                              </div>
                            </motion.div>

                            <span className="absolute bottom-2 left-2 text-[8px] font-mono text-emerald-400/40">LOOP: cami_asistencia.gif</span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 items-center justify-between bg-black/50 p-2.5 rounded-xl border border-slate-900">
                            <button
                              onClick={() => setGifIsPlaying(!gifIsPlaying)}
                              className="px-3.5 py-1.5 bg-[#0a2310] hover:bg-[#12411e] text-[#9BFF00] text-[10px] font-mono font-black rounded cursor-pointer border-none"
                            >
                              {gifIsPlaying ? "PAUSAR BUCLE" : "INICIAR BUCLE"}
                            </button>

                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] font-mono text-emerald-400/70">Frames / seg:</span>
                              <input 
                                type="range" 
                                min="0.5" 
                                max="3" 
                                step="0.5" 
                                value={gifPlaySpeed}
                                onChange={(e) => setGifPlaySpeed(parseFloat(e.target.value))}
                                className="w-20 accent-[#9BFF00] cursor-pointer"
                              />
                              <span className="text-[9px] font-mono text-[#9BFF00] font-black">{gifPlaySpeed}x</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 4: GLOSARIO */}
                      {activeMaterialCategory === 'Glosario' && (
                        <div className="w-full h-full flex flex-col justify-between font-mono">
                          <p className="text-[10px] text-[#9BFF00] font-mono text-center uppercase tracking-widest bg-emerald-950/25 py-1.5 rounded-lg border border-[#35B84A]/30 mb-2">
                             Diagrama de Siglas CUN de Autogestión • .PNG Viewer
                          </p>

                          <div className="grow bg-slate-950 rounded-2xl border border-emerald-950 p-3 flex items-center justify-center relative overflow-hidden min-h-[150px]">
                            <motion.div 
                              className="p-4 bg-[#05150a] rounded-xl border border-dashed border-[#9BFF00]/30 max-w-sm w-full select-none text-left"
                              style={{ scale: zoomLevel }}
                            >
                              <div className="flex items-center space-x-2 border-b border-[#35B84A]/30 pb-1.5 mb-2">
                                <ImageIcon className="w-4 h-4 text-[#9BFF00]" />
                                <span className="text-[10px] text-[#9BFF00] font-black">siglas_cun_diagram.png</span>
                              </div>
                              <div className="space-y-1.5 text-[8.5px] text-slate-300">
                                <p className="leading-tight"><strong className="text-white">• ACA:</strong> Trabajo de calificación dividido en cortes.</p>
                                <p className="leading-tight"><strong className="text-white">• SINU:</strong> Portal de pagos y calificaciones oficiales.</p>
                                <p className="leading-tight"><strong className="text-white">• CUNBRE:</strong> Dirección institucional de becas e incubadora.</p>
                                <p className="leading-tight"><strong className="text-white">• CAMI:</strong> Canal de radicación de tiquetes de dudas.</p>
                              </div>
                            </motion.div>

                            <span className="absolute bottom-2 right-2 text-[8px] text-slate-400">ESCALA: {Math.round(zoomLevel * 100)}%</span>
                          </div>

                          <div className="mt-3 flex justify-between items-center bg-black/60 p-2 rounded-xl border border-slate-900">
                            <span className="text-[9px] text-[#9BFF00]">CONTROLES DE LUPA</span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
                                className="p-1.5 bg-[#0B3D2E] text-[#9BFF00] rounded border border-none hover:bg-emerald-900 cursor-pointer"
                                title="Zoom Out"
                              >
                                <ZoomOut className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setZoomLevel(1)}
                                className="p-1.5 bg-[#0B3D2E] text-[#9BFF00] rounded border border-none hover:bg-emerald-900 cursor-pointer"
                                title="Resetear Zoom"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
                                className="p-1.5 bg-[#0B3D2E] text-[#9BFF00] rounded border border-none hover:bg-emerald-900 cursor-pointer"
                                title="Zoom In"
                              >
                                <ZoomIn className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="text-[10px] font-mono text-[#9BFF00]/70 border-t border-[#35B84A]/10 pt-2 text-center uppercase tracking-widest flex items-center justify-between">
                      <span>CUN Digital Simulator v2.6</span>
                      <span className="text-[#9BFF00] font-black animate-pulse">● EN SEÑAL ACTIVA</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 4: CRONOGRAMA / CALENDARIO */}
            {activeMenu === 'cronograma' && (
              <motion.div
                key="cronograma-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#172B6B]">
                      Calendario de Inducción Digital 📅
                    </h3>
                    <p className="text-xs text-[#172B6B]/80 font-medium">
                      Conoce las fechas claves de corte de notas y tutorías sincrónicas sin perderte de nada.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#35B84A] font-black bg-[#9BFF00]/15 border border-[#35B84A]/30 px-3 py-1 rounded-lg">
                    Filtro Activo: Virtual 2026
                  </span>
                </div>
                
                {/* Embedded ActivityCalendar component */}
                <ActivityCalendar accentColor="green" />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Support footprint notice - Styled as a spectacular white sticker card */}
        <div className="p-5 bg-white border-4 border-[#35B84A] rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4 text-left">
            <div className="p-3 bg-[#9BFF00]/15 rounded-2xl">
              <AlertCircle className="w-7 h-7 text-[#35B84A] shrink-0" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-black text-[#172B6B]">¿Dificultades técnicas para ingresar a tus plataformas?</p>
              <p className="text-xs text-[#172B6B]/80 font-medium">No te preocupes. Escribe de inmediato a soporte@cun.edu.co o abre un CamiTicket para solucionarlo.</p>
            </div>
          </div>
          <a
            href="mailto:soporte@cun.edu.co"
            className="px-6 py-3 bg-[#35B84A] hover:bg-[#2fa341] text-white hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest rounded-xl transition-all text-center border-none"
          >
            Soporte Académico 🎯
          </a>
        </div>

      </div>
    </div>
  );
};

// Helper components keeping types stable
const ChevronRightSymbol: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-[#9BFF00] text-[#0B3D2E]' : 'bg-slate-100 text-slate-400'}`}>
      <span className="font-mono text-xs font-bold font-sans">→</span>
    </div>
  );
};
