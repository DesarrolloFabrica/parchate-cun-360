import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, AlertTriangle, CheckSquare, Clock } from 'lucide-react';
import { calendarEvents } from '../data';
import { CalendarEvent, EventStatus } from '../types';

interface ActivityCalendarProps {
  accentColor: 'blue' | 'green';
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ accentColor }) => {
  const [filter, setFilter] = useState<'All' | 'Virtual' | 'Presencial' | 'General'>('All');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(calendarEvents[0]);
  const [markedCompleted, setMarkedCompleted] = useState<string[]>([]);

  const isBlue = accentColor === 'blue';
  const textAccent = isBlue ? 'text-sky-500' : 'text-[#35B84A]';
  const borderAccent = isBlue ? 'border-sky-400' : 'border-[#9BFF00]';
  const bgAccentLight = isBlue ? 'bg-sky-50' : 'bg-[#9BFF00]/15';

  // Toggle completed status as interactive micro-action
  const toggleCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details selection
    if (markedCompleted.includes(id)) {
      setMarkedCompleted(markedCompleted.filter(itemId => itemId !== id));
    } else {
      setMarkedCompleted([...markedCompleted, id]);
    }
  };

  // Filter strategy
  const filteredEvents = calendarEvents.filter(evt => {
    if (filter === 'All') return true;
    return evt.category === filter;
  });

  const getStatusClasses = (status: EventStatus) => {
    switch (status) {
      case 'activity':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-600',
          label: 'Actividad'
        };
      case 'delivery':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-600',
          label: 'Entrega Crítica'
        };
      case 'recommended':
        return {
          bg: 'bg-[#9BFF00]/15 border-[#35B84A]/30 text-emerald-800',
          label: 'Recomendado'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-600',
          label: 'Pendiente'
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          label: 'General'
        };
    }
  };

  return (
    <div className="space-y-8" id="inductive-activity-calendar">
      
      {/* Title & Description */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="text-left">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${textAccent} ${bgAccentLight} mb-2 border border-[#9BFF00]/40 font-mono`}>
            📅 Cronograma General de Inducción
          </span>
          <h3 className="font-display font-black text-2xl md:text-3xl text-[#172B6B] tracking-tight leading-none">
            ¡Agéndate con la CUN!
          </h3>
          <p className="text-xs text-[#172B6B]/80 font-medium max-w-2xl mt-1.5 leading-relaxed">
            Sincroniza tus primeras fechas institucionales importantes. Visualiza talleres de orientación, entregas e inducciones de carnetización digital de inmediato.
          </p>
        </div>

        {/* Calendar Category Toggles */}
        <div className="flex flex-wrap gap-1.5 self-start lg:self-end bg-[#0B3D2E]/5 p-1 rounded-2xl border border-slate-200">
          {(['All', 'Virtual', 'Presencial', 'General'] as const).map((catName) => {
            const isSel = filter === catName;
            return (
              <button
                key={catName}
                onClick={() => setFilter(catName)}
                className={`text-[10px] font-black font-display uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all border-none cursor-pointer ${
                  isSel 
                    ? 'bg-[#172B6B] text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-[#172B6B]/80 hover:text-[#172B6B]'
                }`}
              >
                {catName === 'All' ? 'Ver todo' : catName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Timeline on left, Details expansion on right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative border-l-4 border-[#35B84A]/30 ml-4 pl-6 py-2 space-y-6 text-left">
            
            {filteredEvents.map((evt) => {
              const statusCfg = getStatusClasses(evt.type);
              const isSelected = selectedEvent?.id === evt.id;
              const isComp = markedCompleted.includes(evt.id);

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`relative cursor-pointer transition-all ${
                    isSelected ? 'scale-[1.01]' : 'hover:translate-x-1.5'
                  }`}
                >
                  
                  {/* Outer circle dot placement with glowing neon */}
                  <div className={`absolute -left-[35px] top-2 w-4.5 h-4.5 rounded-full border-2 bg-white transition-colors duration-300 flex items-center justify-center ${
                    isComp 
                      ? 'border-[#35B84A] bg-[#35B84A] text-white scale-115 shadow-[0_0_8px_#35B84A]'
                      : isSelected 
                        ? 'border-[#9BFF00] bg-[#172B6B]' 
                        : 'border-[#35B84A]/40'
                  }`}>
                    {isComp && (
                      <CheckCircle2 className="w-2.5 h-2.5 stroke-[4]" />
                    )}
                  </div>

                  {/* Card Element styled per guide */}
                  <div className={`p-4 bg-white border-2 rounded-2xl transition-all ${
                    isSelected 
                      ? 'border-[#9BFF00] shadow-[0_8px_25px_rgba(23,43,107,0.15)] ring-2 ring-[#9BFF00]/40'
                      : 'border-slate-100 hover:border-slate-200 shadow-md'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Tags block */}
                        <div className="flex items-center flex-wrap gap-1.5 mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border leading-none ${statusCfg.bg}`}>
                            {statusCfg.label}
                          </span>
                          
                          <span className="text-[9px] bg-slate-50 border border-slate-100 text-[#172B6B] px-2 py-0.5 rounded-md font-bold tracking-wide uppercase leading-none">
                            • {evt.category}
                          </span>
                        </div>

                        <h4 className={`font-display font-black text-base text-[#172B6B] leading-snug ${isComp ? 'line-through text-slate-400' : ''}`}>
                          {evt.title}
                        </h4>
                        
                        <div className="flex items-center space-x-4 mt-2 text-[10px] text-[#172B6B]/60 font-mono font-bold uppercase">
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-[#35B84A]" />
                            {evt.date}
                          </span>
                          {evt.time && (
                            <span className="flex items-center">
                              ⏰ {evt.time}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive completion checkbox */}
                      <button
                        onClick={(e) => toggleCompleted(evt.id, e)}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer shrink-0 border-none ${
                          isComp
                            ? 'bg-[#35B84A]/10 border-none text-[#35B84A]'
                            : 'bg-slate-50 hover:bg-[#9BFF00]/10 text-slate-400'
                        }`}
                        title={isComp ? "Marcar como pendiente" : "Marcar como aprobado"}
                      >
                        <CheckSquare className="w-4.5 h-4.5" strokeWidth={isComp ? 3 : 2} />
                      </button>

                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Event detail panel */}
        <div className="lg:col-span-5 sticky top-24">
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border-4 border-[#35B84A] rounded-3xl p-6 shadow-xl overflow-hidden relative text-left"
              >
                {/* Visual Lineart elements */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-slate-900">
                    <circle cx="100" cy="0" r="80" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3"/>
                  </svg>
                </div>

                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
                  <span className="text-[9px] font-mono font-black tracking-widest text-[#172B6B] uppercase">
                    ★ FICHA DE LA SESIÓN ★
                  </span>
                  {selectedEvent.important && (
                    <span className="flex items-center text-rose-600 bg-rose-50 border border-rose-100 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase">
                      ⚠️ CRÍTICO
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] bg-[#9BFF00]/15 text-[#0B3D2E] border border-[#9BFF00] px-2.5 py-1 rounded-md font-black uppercase tracking-wider">
                      Modalidad {selectedEvent.category}
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-[#172B6B] leading-none mt-3">
                      {selectedEvent.title}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-[#172B6B]/90 font-medium leading-relaxed font-sans bg-[#0B3D2E]/5 p-5 rounded-2xl border border-slate-100">
                    <p className="font-black text-[#172B6B]">Instrucciones Claves:</p>
                    <p>{selectedEvent.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Fecha programada</p>
                      <p className="text-xs font-black text-[#172B6B] mt-0.5">{selectedEvent.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase font-black">Hora de encuentro</p>
                      <p className="text-xs font-black text-[#172B6B] mt-0.5">{selectedEvent.time || 'Flexible'}</p>
                    </div>
                  </div>

                  {/* Completion Toggle */}
                  <button
                    onClick={(e) => toggleCompleted(selectedEvent.id, e)}
                    className={`w-full py-3.5 px-4 rounded-xl font-display font-black text-xs tracking-widest uppercase transition-all shadow-md cursor-pointer border-none ${
                      markedCompleted.includes(selectedEvent.id)
                        ? 'bg-[#35B84A] text-white hover:bg-[#2fa341]'
                        : 'bg-[#172B6B] text-white hover:bg-[#1a2d6b]'
                    }`}
                  >
                    {markedCompleted.includes(selectedEvent.id) 
                      ? '✓ Completado (Presiona para reabrir)' 
                      : '✓ Marcar Actividad como Lista'}
                  </button>

                  <p className="text-[9px] text-center text-slate-400 leading-relaxed max-w-xs mx-auto font-mono">
                    *Tus progresos del onboarding se guardan de forma segura para apoyarte.
                  </p>
                </div>

              </motion.div>
            ) : (
              <div className="h-64 rounded-[2rem] border-4 border-dashed border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center">
                <Calendar className="w-10 h-10 text-slate-300 mb-2 animate-bounce" strokeWidth={1.5} />
                <p className="text-sm font-black text-[#172B6B] font-display">Ningún fecha seleccionada</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Haz clic en cualquiera de las actividades del cronograma de la izquierda para ver su detalle oficial.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
