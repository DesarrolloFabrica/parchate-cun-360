import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BellRing, 
  BookOpen, 
  Clock, 
  FileText, 
  Play, 
  Sparkles, 
  X, 
  ArrowRight, 
  CalendarDays,
  Settings,
  ChevronRight,
  Info
} from 'lucide-react';
import type { HubTab } from '../navigation';

interface SmartAlert {
  id: string;
  title: string;
  message: string;
  type: 'inscripcion' | 'horario' | 'pendiente' | 'documento' | 'video' | 'recordatorio';
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  prioridad: number;   // 1 to 5 (higher is more critical)
  link?: string;
  tabTarget?: HubTab;  // Target tab ID for programmatically switching tabs
  textoBoton: string;
}

interface MonthlySmartAlertsProps {
  onNavigateToHubTab: (tab: HubTab) => void;
}

// Default seed list of alerts for the year, focusing around the current period (June 2026)
const defaultAlerts: SmartAlert[] = [
  {
    id: 'alert-inscripcion-2026',
    title: 'Inscripción de Materias',
    message: '¡Ponte las pilas! Ya inició el proceso para inscribir tus asignaturas para este cuatrimestre. Consulta el cronograma oficial.',
    type: 'inscripcion',
    fechaInicio: '2026-06-01',
    fechaFin: '2026-06-30',
    prioridad: 4,
    tabTarget: 'cronograma',
    textoBoton: 'Ver fechas'
  },
  {
    id: 'alert-horario-2026',
    title: 'Selección de Horario',
    message: 'Quedan pocos cupos en las mejores jornadas para la Sede Bogotá. No dejes tu horario al azar en el portal SINU.',
    type: 'horario',
    fechaInicio: '2026-06-12',
    fechaFin: '2026-06-25',
    prioridad: 5,
    tabTarget: 'recorrido360',
    textoBoton: 'Ir al Inicio'
  },
  {
    id: 'alert-documento-2026',
    title: 'Verificación de Documentos',
    message: 'Recuerda subir tu carpeta digital de admisión con tu documento de identidad para evitar bloqueos en tus calificaciones.',
    type: 'documento',
    fechaInicio: '2026-06-15',
    fechaFin: '2026-06-29',
    prioridad: 3,
    tabTarget: 'cdigital',
    textoBoton: 'Revisar Cdigital'
  },
  {
    id: 'alert-video-induccion',
    title: 'Video Crítico del ACA',
    message: '¿Tienes dudas de cómo subir el ACA? Un docente experto subió una guía virtual de 2 minutos que te facilitará todo.',
    type: 'video',
    fechaInicio: '2026-06-01',
    fechaFin: '2026-07-15',
    prioridad: 2,
    tabTarget: 'cdigital',
    textoBoton: 'Ver video'
  },
  {
    id: 'alert-bienestar-parche',
    title: 'Novedades de Bienestar',
    message: 'Inscríbete hoy de forma gratuita a los torneos de fútbol sala, talleres de debate o clases de idioma del parche CUN.',
    type: 'recordatorio',
    fechaInicio: '2026-06-05',
    fechaFin: '2026-06-28',
    prioridad: 1,
    tabTarget: 'bienestarLocked',
    textoBoton: 'Consultar bienestar'
  },
  {
    id: 'alert-matricula-extra',
    title: 'Plazo Extraordinario',
    message: 'Esta es tu última llamada para legalizar matrículas con recargos reducidos ante la oficina de Registro.',
    type: 'pendiente',
    fechaInicio: '2026-06-15',
    fechaFin: '2026-06-20',
    prioridad: 5,
    tabTarget: 'cronograma',
    textoBoton: 'Consultar fechas'
  }
];

export function MonthlySmartAlerts({ onNavigateToHubTab }: MonthlySmartAlertsProps) {
  const [activeAlert, setActiveAlert] = useState<SmartAlert | null>(null);
  const [alertsList, setAlertsList] = useState<SmartAlert[]>(() => {
    const saved = localStorage.getItem('cun-custom-smart-alerts');
    return saved ? JSON.parse(saved) : defaultAlerts;
  });

  const [isIntroCompleted, setIsIntroCompleted] = useState<boolean>(() => {
    return localStorage.getItem('cun-intro-completed') === 'true';
  });

  // State to toggle a beautiful simulator panel for demo purposes (easily testing all alert types!)
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [currentSelectedMonth, setCurrentSelectedMonth] = useState<number>(6); // Default: June
  const [triggerCount, setTriggerCount] = useState<number>(0);

  // Sync isIntroCompleted with local storage and listen to the 'cun-intro-completed' custom event
  useEffect(() => {
    const checkIntro = () => {
      const completed = localStorage.getItem('cun-intro-completed') === 'true';
      setIsIntroCompleted(completed);
    };

    window.addEventListener('cun-intro-completed', checkIntro);
    // Poll every 1 second as a bullet-proof fallback
    const interval = setInterval(checkIntro, 1000);

    return () => {
      window.removeEventListener('cun-intro-completed', checkIntro);
      clearInterval(interval);
    };
  }, []);

  // Periodic triggers - re-evaluate candidate alerts every 30 seconds
  useEffect(() => {
    if (!isIntroCompleted && !showSimulator) return;

    const interval = setInterval(() => {
      setTriggerCount((value: number) => value + 1);
    }, 30000); // Check for next periodic pop-up every 30 seconds

    return () => clearInterval(interval);
  }, [isIntroCompleted, showSimulator]);

  // Save alerts list if modified programmatically in simulator
  useEffect(() => {
    localStorage.setItem('cun-custom-smart-alerts', JSON.stringify(alertsList));
  }, [alertsList]);

  // Main evaluation logic to display the current active alert
  useEffect(() => {
    // Only show alerts once the intro is completely finished (unless demo simulator is open)
    if (!isIntroCompleted && !showSimulator) {
      setActiveAlert(null);
      return;
    }

    // Delay first alert after intro is completed to feel elegant (wait at least 8 seconds)
    const introCompleteTime = localStorage.getItem('cun-intro-completed-time');
    const now = Date.now();
    if (introCompleteTime && !showSimulator) {
      const timeSinceIntro = now - parseInt(introCompleteTime, 10);
      if (timeSinceIntro < 8000) {
        // Wait a small delay before first alert
        return;
      }
    } else if (!introCompleteTime && isIntroCompleted) {
      // Set timestamp if missing
      localStorage.setItem('cun-intro-completed-time', now.toString());
    }

    // Check if an alert was closed too recently (wait 35 seconds cooldown in standard mode to prevent spam)
    const lastClosedVal = localStorage.getItem('cun-last-alert-closed');
    if (lastClosedVal && !showSimulator) {
      const diff = now - parseInt(lastClosedVal, 10);
      if (diff < 35000) {
        // Closed too recently, let the user rest
        return;
      }
    }

    const todayStr = `2026-0${currentSelectedMonth}-18`; // Simulated current date based on mock chosen month

    // Filter alerts that cover today's date
    const activeCandidates = alertsList.filter((alert: SmartAlert) => {
      return todayStr >= alert.fechaInicio && todayStr <= alert.fechaFin;
    });

    if (activeCandidates.length === 0) {
      setActiveAlert(null);
      return;
    }

    // Filter out alerts that have been permanently closed or completed by this user
    const closedAlertIds = JSON.parse(localStorage.getItem('cun-closed-alert-ids') || '[]');
    const unshownCandidates = activeCandidates.filter((candidate: SmartAlert) => !closedAlertIds.includes(candidate.id));

    if (unshownCandidates.length === 0) {
      setActiveAlert(null);
      return;
    }

    // Rank candidates by priority (5 is highest, 1 is lowest).
    const sorted = [...unshownCandidates].sort((a, b) => b.prioridad - a.prioridad);
    const highestPriority = sorted[0].prioridad;
    const topTierCandidates = sorted.filter(c => c.prioridad === highestPriority);

    // Random choice among highest priority candidates
    const idx = Math.floor(Math.random() * topTierCandidates.length);
    setActiveAlert(topTierCandidates[idx]);
  }, [alertsList, currentSelectedMonth, showSimulator, isIntroCompleted, triggerCount]);

  const handleCloseAlert = (alertId: string) => {
    // Save closed alert to prevent displaying it again
    const closedAlertIds = JSON.parse(localStorage.getItem('cun-closed-alert-ids') || '[]');
    if (!closedAlertIds.includes(alertId)) {
      closedAlertIds.push(alertId);
      localStorage.setItem('cun-closed-alert-ids', JSON.stringify(closedAlertIds));
    }
    
    // Set timestamp of last closed alert to throttle next appearance
    localStorage.setItem('cun-last-alert-closed', Date.now().toString());
    setActiveAlert(null);
  };

  const handleActionClick = (alert: SmartAlert) => {
    if (alert.tabTarget) {
      onNavigateToHubTab(alert.tabTarget);
    }

    // Close the preview, mark it as viewed
    handleCloseAlert(alert.id);
  };

  // Reset demo storage to re-evaluate the experience immediately
  const handleResetDemoState = () => {
    localStorage.removeItem('cun-closed-alert-ids');
    localStorage.removeItem('cun-last-alert-closed');
    // Force immediate recalculation by cycling state
    const currentList = [...alertsList];
    setAlertsList([]);
    setTimeout(() => {
      setAlertsList(currentList);
    }, 100);
  };

  // Form states to add new custom alerts to database
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<SmartAlert['type']>('recordatorio');
  const [newPriority, setNewPriority] = useState<number>(3);
  const [newTabTarget, setNewTabTarget] = useState<HubTab>('cronograma');
  const [newBtnText, setNewBtnText] = useState('Ver fechas');

  const handleAddCustomAlert = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newTitle || !newMessage) return;

    const newId = `alert-custom-${Date.now()}`;
    const newAlert: SmartAlert = {
      id: newId,
      title: newTitle,
      message: newMessage,
      type: newType,
      fechaInicio: `2026-0${currentSelectedMonth}-01`,
      fechaFin: `2026-0${currentSelectedMonth}-30`,
      prioridad: Number(newPriority),
      tabTarget: newTabTarget,
      textoBoton: newBtnText
    };

    setAlertsList((previousAlerts: SmartAlert[]) => [newAlert, ...previousAlerts]);
    
    // Reset Form fields
    setNewTitle('');
    setNewMessage('');
    
    // Auto preview our newly created custom alert
    setActiveAlert(newAlert);
  };

  // Map type to visual styles and icons
  const getAlertConfig = (type: SmartAlert['type']) => {
    switch (type) {
      case 'inscripcion':
        return {
          icon: BookOpen,
          bgColor: 'from-blue-950 to-slate-900',
          borderColor: 'border-blue-500/40',
          glowColor: 'shadow-blue-500/10',
          accentText: 'text-blue-400',
          iconBg: 'bg-blue-500/10 text-blue-400',
          badgeText: 'Inscripción de Materias'
        };
      case 'horario':
        return {
          icon: Clock,
          bgColor: 'from-amber-950 to-slate-900',
          borderColor: 'border-amber-500/40',
          glowColor: 'shadow-amber-500/10',
          accentText: 'text-amber-400',
          iconBg: 'bg-amber-500/10 text-amber-400',
          badgeText: 'Horario Escolar'
        };
      case 'pendiente':
        return {
          icon: BellRing,
          bgColor: 'from-rose-950 to-slate-900',
          borderColor: 'border-rose-500/40',
          glowColor: 'shadow-rose-500/10',
          accentText: 'text-rose-400',
          iconBg: 'bg-rose-500/10 text-rose-400',
          badgeText: 'Acción Pendiente'
        };
      case 'documento':
        return {
          icon: FileText,
          bgColor: 'from-cyan-950 to-slate-900',
          borderColor: 'border-cyan-500/40',
          glowColor: 'shadow-cyan-500/10',
          accentText: 'text-cyan-400',
          iconBg: 'bg-cyan-500/10 text-cyan-400',
          badgeText: 'Documento Digital'
        };
      case 'video':
        return {
          icon: Play,
          bgColor: 'from-purple-950 to-slate-900',
          borderColor: 'border-purple-500/40',
          glowColor: 'shadow-purple-500/10',
          accentText: 'text-purple-400',
          iconBg: 'bg-purple-500/10 text-purple-400',
          badgeText: 'Video Tutorial'
        };
      case 'recordatorio':
      default:
        return {
          icon: Sparkles,
          bgColor: 'from-[#0e1726] to-[#0c101a]',
          borderColor: 'border-[#9BFF00]/30',
          glowColor: 'shadow-[#9BFF00]/10',
          accentText: 'text-[#9BFF00]',
          iconBg: 'bg-[#9BFF00]/10 text-[#9BFF00]',
          badgeText: 'Recordatorio CUNlista'
        };
    }
  };

  const activeConfig = activeAlert ? getAlertConfig(activeAlert.type) : null;
  const ActiveIconComp = activeConfig ? activeConfig.icon : Sparkles;

  return (
    <>
      {/* 📁 MINI FLOATING FLOATING ALERT CARD WRAPPER */}
      <div className="fixed bottom-4 right-4 z-[9999] w-[calc(100vw-32px)] sm:w-[380px] pointer-events-none flex flex-col gap-2">
        
        <AnimatePresence mode="wait">
          {activeAlert && activeConfig && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: 'spring', stiffness: 260, damping: 20 }
              }}
              exit={{ opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto bg-gradient-to-r ${activeConfig.bgColor} border-2 ${activeConfig.borderColor} rounded-2xl p-4 shadow-2xl ${activeConfig.glowColor} relative overflow-hidden`}
              id={`smart-alert-${activeAlert.id}`}
            >
              {/* Radial gradient background decoration */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-[#9BFF00]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex gap-3">
                {/* Custom Icon Container */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeConfig.iconBg} border border-white/5 shadow-inner`}>
                  <ActiveIconComp className="w-5 h-5 animate-pulse" />
                </div>

                {/* Content block */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${activeConfig.accentText}`}>
                      {activeConfig.badgeText}
                    </span>
                    <button
                      onClick={() => handleCloseAlert(activeAlert.id)}
                      className="text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg p-1 border-none cursor-pointer absolute top-3 right-3"
                      title="Cerrar alerta"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-display font-black text-white uppercase mt-1 tracking-tight leading-tight">
                    {activeAlert.title}
                  </h4>

                  <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-1.5 font-sans">
                    {activeAlert.message}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5 shrink-0 select-none">
                    <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      JUNIO 2026
                    </span>

                    <button
                      onClick={() => handleActionClick(activeAlert)}
                      className="px-3.5 py-1.5 bg-[#9BFF00] hover:bg-white text-black font-mono font-black text-[10px] uppercase rounded-lg flex items-center gap-1 text-right transition-all tracking-wider border-none cursor-pointer shrink-0 active:scale-95"
                    >
                      <span>{activeAlert.textoBoton}</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ⚙️ SIMULATOR ACCESS TRIGGER BAR - Designed discretely at the bottom of alerts screen */}
        <div className="pointer-events-auto self-end">
          <button
            onClick={() => setShowSimulator((value: boolean) => !value)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172033] border border-slate-800 rounded-full text-[9px] font-mono text-zinc-400 hover:text-[#9BFF00] hover:border-[#9BFF00]/40 transition-all uppercase font-bold shadow-md cursor-pointer shrink-0"
            title="Panel de Testeo de Alertas"
          >
            <Settings className={`w-3.5 h-3.5 ${showSimulator ? 'rotate-90 text-[#9BFF00]' : ''} transition-transform duration-300`} />
            <span>Simulador de Alertas {showSimulator ? 'Activo' : ''}</span>
          </button>
        </div>
      </div>

      {/* 📁 INTERACTIVE DEVELOPER SUITE SIMULATOR SLIDEOVER PANEL (COMPLETELY SCROLL INDEPENDENT LAYER) */}
      <AnimatePresence>
        {showSimulator && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 z-[10000] w-full max-w-sm bg-[#0d121c] border-l-2 border-slate-800 shadow-2xl p-5 text-left font-mono flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 overflow-y-auto pr-1">
              {/* Header simulation bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-black text-[#9BFF00] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#9BFF00] animate-ping" />
                  SIMULACIÓN DE ALERTAS CUN
                </span>
                <button
                  onClick={() => setShowSimulator(false)}
                  className="bg-transparent border-none text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Reset helpers */}
              <p className="text-[10px] text-zinc-400 leading-normal">
                Prueba cómo funcionan los pop-ups flotantes para el onboarding del estudiante sin esperar el cambio real de mes o cuatrimestre.
              </p>

              <div className="space-y-2 border border-white/5 bg-slate-900/40 p-3 rounded-lg">
                <p className="text-[10px] text-white font-black uppercase">Acciones Rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleResetDemoState}
                    className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black rounded text-[9px] uppercase font-black transition-all cursor-pointer"
                  >
                    Reiniciar Vista (Limpiar cache)
                  </button>

                  <button
                    onClick={() => {
                      // Trigger random alerts
                      const item = alertsList[Math.floor(Math.random() * alertsList.length)];
                      setActiveAlert(item);
                    }}
                    className="px-2.5 py-1 bg-[#9BFF00]/10 border border-[#9BFF00]/30 text-[#9BFF00] hover:bg-[#9BFF00] hover:text-black rounded text-[9px] uppercase font-black transition-all cursor-pointer"
                  >
                    Lanzar Alerta Random 🎲
                  </button>
                </div>
              </div>

              {/* Months filter selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-extrabold uppercase">Mes de Onboarding Activo:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[4, 5, 6, 7].map(m => (
                    <button
                      key={m}
                      onClick={() => setCurrentSelectedMonth(m)}
                      className={`py-1 text-[9px] uppercase font-black rounded border transition-all cursor-pointer ${
                        currentSelectedMonth === m
                          ? 'bg-[#9BFF00] text-black border-white'
                          : 'bg-black/30 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {m === 4 && 'Abril'}
                      {m === 5 && 'Mayo'}
                      {m === 6 && 'Junio (Actual)'}
                      {m === 7 && 'Julio'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Catalog list */}
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 font-extrabold uppercase">Base de Alertas Registradas:</label>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto border border-white/5 rounded-lg p-2 bg-black/40">
                  {alertsList.map(a => (
                    <div 
                      key={a.id} 
                      onClick={() => setActiveAlert(a)}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-[9px] cursor-pointer"
                    >
                      <span className="text-white font-bold truncate max-w-[120px]">{a.title}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 capitalize">{a.type}</span>
                        <ChevronRight className="w-3 h-3 text-[#9BFF00]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom alert builder panel */}
              <form onSubmit={handleAddCustomAlert} className="space-y-2 border-t border-white/10 pt-3">
                <p className="text-[10px] text-white font-black uppercase">Crear Nueva Alerta Inteligente:</p>
                
                <div>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Título ej. Inscripción materias"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[9px] text-white focus:border-[#9BFF00] outline-none"
                  />
                </div>

                <div>
                  <textarea
                    required
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Cuerpo de la alerta o recordatorio..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[9px] text-white focus:border-[#9BFF00] outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-zinc-500 uppercase font-black">Categoría:</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as SmartAlert['type'])}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] text-slate-350 outline-none"
                    >
                      <option value="inscripcion">Inscripción</option>
                      <option value="horario">Horario</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="documento">Documento</option>
                      <option value="video">Vídeo</option>
                      <option value="recordatorio">Recordatorio</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-500 uppercase font-black">Prioridad (1-5):</label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] text-slate-350 outline-none"
                    >
                      <option value={1}>1 - Normal</option>
                      <option value={2}>2 - Medio</option>
                      <option value={3}>3 - Importante</option>
                      <option value={4}>4 - Muy Alto</option>
                      <option value={5}>5 - Crítico</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-zinc-500 uppercase font-black">Tab Destino:</label>
                    <select
                      value={newTabTarget}
                      onChange={e => setNewTabTarget(e.target.value as HubTab)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] text-slate-350 outline-none"
                    >
                      <option value="recorrido360">Panoee 360</option>
                      <option value="cun360">Campus 360</option>
                      <option value="cdigital">CDigital</option>
                      <option value="cronograma">Cronograma</option>
                      <option value="bienestarLocked">Bienestar</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-500 uppercase font-black">Botón:</label>
                    <input
                      type="text"
                      value={newBtnText}
                      onChange={e => setNewBtnText(e.target.value)}
                      placeholder="Ver fechas"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] text-white focus:border-[#9BFF00] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#9BFF00] hover:bg-white text-black text-[9px] uppercase font-black rounded transition-all border-none cursor-pointer"
                >
                  Registrar e Ir a Alerta 🚀
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-1 text-[8px] text-zinc-600 select-none">
              <span>CUN Onboarding Engine © 2026</span>
              <span className="text-lime-500 animate-pulse">● Live Workspace</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
