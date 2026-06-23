import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Monitor, FileText, LifeBuoy, Users, Heart, Sparkles, 
  Play, ExternalLink, ArrowRight, Clock, Calendar, HelpCircle, 
  MapPin, Compass, GraduationCap, ChevronRight, Eye, ChevronLeft, Award, Lock, Check
} from 'lucide-react';
import { DEFAULT_HUB_TAB, isHubTab, type HubTab } from '../navigation';
import { useSearchParams } from 'react-router-dom';
import VirtualTour360 from './VirtualTour360';
import localPanoramaUrl from '../../assets/imagenes/Calle_A.png';
import nextPanoramaUrl from '../../assets/imagenes/6SA.png';

type StationType = 'video' | 'pdf' | 'infografia';

interface Station {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  type: StationType;
  videoUrl?: string;
  pdfPages?: string[];
  pdfTitle?: string;
  infogData?: { title: string; desc: string }[];
  accentColor: string;
  extraTip?: string;
  coordinateX: number; 
  coordinateY: number; 
}

interface CalendarActivity {
  day: number;
  title: string;
  type: 'academic' | 'wellness' | 'tech';
  desc: string;
  hour: string;
}

interface UnifiedOnboardingHubProps {
}

export const UnifiedOnboardingHub: React.FC<UnifiedOnboardingHubProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTab = searchParams.get('tab') ?? '';
  const activeTab: HubTab = isHubTab(requestedTab) ? requestedTab : DEFAULT_HUB_TAB;

  const onTabChange = (tab: HubTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    setSearchParams(nextParams, { replace: true });
  };

  // Track completed stations globally
  const [completedStations, setCompletedStations] = useState<string[]>(['c360-1', 'cdig-1']); // First station auto-started
  
  // Modal State for popped up station content
  const [activePopupStation, setActivePopupStation] = useState<Station | null>(null);
  const [activePdfPage, setActivePdfPage] = useState<number>(0);

  // Active chosen calendar activity day
  const [selectedDay, setSelectedDay] = useState<number>(8);

  // Lock progression alert warning state
  const [stationLockWarning, setStationLockWarning] = useState<{
    stationName: string;
    previousStationName: string;
    stationNumber: number;
  } | null>(null);

  // 9 Stations for CUN 360 (Physical Campus Track)
  const cun360Stations: Station[] = [
    {
      id: 'c360-1', number: 1,
      title: 'Sede Central Bogotá (Bloque F)', subtitle: 'Vídeo Orientación de Ingreso',
      description: 'Entrada principal Bogotá. Ubica Admisiones, Ventanillas de Caja y Registro Académico para tus necesidades del primer día.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#9BFF00', extraTip: 'El carnet digital es obligatorio para ingresar de forma veloz al campus.',
      coordinateX: 10, coordinateY: 70
    },
    {
      id: 'c360-2', number: 2,
      title: 'Biblioteca e Innovación Interactiva', subtitle: 'Manual PDF de Espacios',
      description: 'Salas multimedia, áreas colaborativas y préstamos. Aprende a usar las salas MAC de diseño de alta gama de la CUN.',
      type: 'pdf', pdfTitle: 'Induccion_Biblioteca_CUN.pdf',
      pdfPages: [
        'Página 1: Bienvenido a Biblioteca CUN. Tienes préstamo libre de computadores portátiles y acceso a 120,000 libros virtuales con tu clave única.',
        'Página 2: Reserva salas MAC. Lunes a Sábados presentando tu carnet digital estudiantil en el mesón de información.'
      ],
      accentColor: '#35B84A', extraTip: 'Las salas MAC se pueden separar en bloques de hasta 2 horas diarias.',
      coordinateX: 20, coordinateY: 40
    },
    {
      id: 'c360-3', number: 3,
      title: 'El Ágora CUNlista / Coworking', subtitle: 'Infografía de Áreas Comunes',
      description: 'Zonas de descanso, ocio activo, ping-pong y mesas colaborativas al aire libre.',
      type: 'infografia',
      infogData: [
        { title: 'Mesas de Ping-Pong', desc: 'Espacio activo para despejarte entre clases junto a tus nuevos compañeros.' },
        { title: 'Auditorio Central', desc: 'Sede de charlas, conferencias técnicas de invitados y graduaciones.' }
      ],
      accentColor: '#FF9500', coordinateX: 30, coordinateY: 65
    },
    {
      id: 'c360-4', number: 4,
      title: 'Gimnasio y Zonas Lúdicas (Sede H)', subtitle: 'Vídeo Beneficios Físicos',
      description: 'Convenios deportivos, acondicionamiento físico guiado y torneos de microfútbol estudiantiles.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#FF2D55', extraTip: 'Inscríbete gratis los primeros 10 días hábiles del semestre.',
      coordinateX: 42, coordinateY: 35
    },
    {
      id: 'c360-5', number: 5,
      title: 'Oficina Registro y Control', subtitle: 'Manual PDF Académico',
      description: 'Pautas oficiales para homologación de materias, certificados de estudio y reingresos.',
      type: 'pdf', pdfTitle: 'Reglamento_Sinu_Notas.pdf',
      pdfPages: [
        'Página 1: Las notas oficiales se registran directamente en la plataforma SINU Académica.',
        'Página 2: Tienes derecho a solicitar revisión de notas en un plazo de 3 días calendario después de publicadas.'
      ],
      accentColor: '#5856D6', extraTip: 'Evita perder materias por fallas, tu asistencia cuenta en la nota virtual.',
      coordinateX: 54, coordinateY: 60
    },
    {
      id: 'c360-6', number: 6,
      title: 'Relaciones Internacionales (ORI)', subtitle: 'Infografía de Becas Académicas',
      description: 'Convenios de movilidad académica con México, España y Argentina para estancias estudiantiles.',
      type: 'infografia',
      infogData: [
        { title: 'Intercambio Virtual', desc: 'Cursa materias extracurriculares con universidades aliadas sin salir de casa o pagar más.' },
        { title: 'Club de Idiomas', desc: 'Clases gratuitas semanales conversacionales de inglés y francés.' }
      ],
      accentColor: '#007AFF', coordinateX: 66, coordinateY: 30
    },
    {
      id: 'c360-7', number: 7,
      title: 'Bienestar y Apoyo Psicológico', subtitle: 'Vídeo Salud Estudiantil',
      description: 'Línea de acompañamiento psicológico privado, talleres de manejo del estrés académico y tutorías emocionales.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#AF52DE', extraTip: 'Servicio 100% gratuito y confidencial para todo el Parche CUN.',
      coordinateX: 76, coordinateY: 60
    },
    {
      id: 'c360-8', number: 8,
      title: 'Fondo de Emprendimiento CUNbre', subtitle: 'Resumen PDF Convocatorias',
      description: 'Capital semilla e incubación de proyectos de negocio creados por estudiantes nuevos.',
      type: 'pdf', pdfTitle: 'Convocatoria_Cunbre_2026.pdf',
      pdfPages: [
        'Página 1: El programa te capacita en metodologías ágiles de negocio para crear tu propio emprendimiento.',
        'Página 2: Puedes sustituir tu práctica profesional obligatoria si tu modelo es validado por el comité de CUNbre.'
      ],
      accentColor: '#FFCC00', extraTip: 'Presenta tu idea estrella en la feria de fin de cuatrimestre.',
      coordinateX: 86, coordinateY: 45
    },
    {
      id: 'c360-9', number: 9,
      title: 'Ubicación y Vida Bogotá Colectiva', subtitle: 'Infografía de Rutas de Bogotá',
      description: 'Estaciones de Transmilenio recomendadas, parqueaderos seguros para ciclistas en la Sede Central.',
      type: 'infografia',
      infogData: [
        { title: 'Estaciones Clave', desc: 'Estación Las Aguas y Calle 19 son las más cercanas a los accesos principales.' },
        { title: 'Bici-CUN Gratis', desc: 'Parqueaderos vigilados gratuitos para asegurar tu patineta o bicicleta escolar.' }
      ],
      accentColor: '#00E5FF', coordinateX: 95, coordinateY: 70
    }
  ];

  // 9 Stations for CDigital (Virtual Ecosistema Track)
  const cdigitalStations: Station[] = [
    {
      id: 'cdig-1', number: 1,
      title: 'Ingreso Seguro al Aula Virtual', subtitle: 'Vídeo Tutorial Clave',
      description: 'Aprende los pasos correctos para activar tu cuenta de correo @cun.edu.co e ingresar por primera vez al aula interactiva.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#9BFF00', extraTip: 'Configura tu autenticación de dos factores al primer ingreso para resguardar notas.',
      coordinateX: 10, coordinateY: 35
    },
    {
      id: 'cdig-2', number: 2,
      title: 'Metodología Simplificada del ACA', subtitle: 'Manual PDF para Estudiantes',
      description: 'Entiende cómo la Actividad de Construcción Aplicada reparte tu nota en tres fases para validar tus competencias.',
      type: 'pdf', pdfTitle: 'Metodologia_ACA_2026.pdf',
      pdfPages: [
        'Página 1: El ACA es un entregable de aplicación práctica para la industria, dividido en Cortes de 30%, 30% y 40%.',
        'Página 2: Súbelo antes del domingo a media noche en cada semana asignada por tu docente tutor en la plataforma.'
      ],
      accentColor: '#35B84A', extraTip: 'Comienza a desarrollarlo desde la primera semana para resolver dudas con tutores.',
      coordinateX: 20, coordinateY: 60
    },
    {
      id: 'cdig-3', number: 3,
      title: 'Maletín Tecnológico Digital', subtitle: 'Infografía Ecosistema Gratis',
      description: 'Licencias premium completamente gratis de Office 365, Google Suite, espacio ilimitado y SINU.',
      type: 'infografia',
      infogData: [
        { title: 'Google Suite Educativa', desc: 'Correo electrónico con dominio oficial y videoconferencias Meet ILIMITADAS.' },
        { title: 'SINU Académico', desc: 'Tu oficina de auto-servicio para programar horarios, ver calificaciones y extractos.' }
      ],
      accentColor: '#FF9500', coordinateX: 30, coordinateY: 40
    },
    {
      id: 'cdig-4', number: 4,
      title: 'Soporte con Cami y Canal Ticket', subtitle: 'Vídeo de Trámites Rápidos',
      description: 'Conoce cómo levantar un ticket para solucionar problemas de inscripción o cambio de clave rápidamente.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#FF2D55', extraTip: 'Usa el agente de IA para solucionar dudas en 5 segundos sin filas.',
      coordinateX: 42, coordinateY: 65
    },
    {
      id: 'cdig-5', number: 5,
      title: 'Duración e Inducción Modular', subtitle: 'Esquema PDF del Período',
      description: 'Aprende cómo funciona el régimen dividiendo las materias en bloques semanales de alta concentración académica.',
      type: 'pdf', pdfTitle: 'Guia_Estudio_Bloques.pdf',
      pdfPages: [
        'Página 1: Los bloques duran exactamente 8 semanas. Estudiarás 2 o 3 materias simultáneas para optimizar tu tiempo.',
        'Página 2: Las tutorías presenciales/sincrónicas quedan grabadas en el aula por si no te puedes conectar en vivo.'
      ],
      accentColor: '#5856D6', extraTip: 'Dedica por lo menos 1 hora diaria a revisar el foro de anuncios corporativo.',
      coordinateX: 54, coordinateY: 45
    },
    {
      id: 'cdig-6', number: 6,
      title: 'Canales del Parche en Redes', subtitle: 'Infografía de Socialización',
      description: 'Comunidades oficiales en WhatsApp, Discord y TikTok para interactuar con estudiantes de tu misma carrera.',
      type: 'infografia',
      infogData: [
        { title: 'Canal Discord', desc: 'Espacios de estudio virtual grupal temático abierto 24/7.' },
        { title: 'Grupo Informativo Telegram', desc: 'Notificaciones en tiempo real sobre becas, eventos y recesos.' }
      ],
      accentColor: '#007AFF', coordinateX: 66, coordinateY: 60
    },
    {
      id: 'cdig-7', number: 7,
      title: 'Framework de Aprendizaje Remoto', subtitle: 'Vídeo Tips de Alto Impacto',
      description: 'Metodologías de hábitos ágiles probadas por estudiantes virtuales de alto rendimiento en Colombia.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#AF52DE', extraTip: 'Crea un espacio físico libre de distracciones en casa para estudiar.',
      coordinateX: 76, coordinateY: 40
    },
    {
      id: 'cdig-8', number: 8,
      title: 'Estándares de Ética Estudiantil', subtitle: 'Compendio PDF Institucional',
      description: 'Evita problemas de derechos de autor y aprende normas APA reglamentarias vigentes.',
      type: 'pdf', pdfTitle: 'Normograma_Etica_Academica.pdf',
      pdfPages: [
        'Página 1: El plagio académico acarrea sanciones de pérdida de bloque y amonestación en hoja de vida.',
        'Página 2: Conoce las plantillas APA descargables y generadores automáticos en la biblioteca virtual.'
      ],
      accentColor: '#FFCC00', extraTip: 'Toda cita bibliográfica debe contener autor, año y enlace persistente.',
      coordinateX: 86, coordinateY: 65
    },
    {
      id: 'cdig-9', number: 9,
      title: 'Insignias Cortas de Empleabilidad', subtitle: 'Infografía de Credenciales',
      description: 'Acreditaciones complementarias que expide la CUN para certificar tus habilidades en plataformas asociadas.',
      type: 'infografia',
      infogData: [
        { title: 'Certificaciones Cisco', desc: 'Rutas gratuitas de ciberseguridad, IoT y redes con certificación internacional.' },
        { title: 'Insignia de Liderazgo', desc: 'Insignia digital para tu LinkedIn oficial que demuestra tus virtudes directivas.' }
      ],
      accentColor: '#00E5FF', coordinateX: 95, coordinateY: 35
    }
  ];

  // Activities database for calendar (Cronograma)
  const calendarActivities: CalendarActivity[] = [
    { day: 5, title: 'Último Plazo Matrículas Extraordinarias', type: 'academic', desc: 'Fecha límite para radicar soportes de pago y homologaciones de asignaturas.', hour: '11:59 PM - Virtual' },
    { day: 8, title: 'Inauguración General del Semestre - Parche CUN', type: 'academic', desc: 'Discurso de directivos nacionales y entrega de credenciales a estudiantes.', hour: '06:00 PM - Sede Central/Streaming' },
    { day: 12, title: 'Cierre Inducción Presencial (Retos y Premiación)', type: 'wellness', desc: 'Retos presenciales por equipos de pregrado en Bogotá con incentivos tecnológicos.', hour: '02:00 PM - Bloque Central' },
    { day: 16, title: 'Día de Carnetización y Fotografía Oficial', type: 'wellness', desc: 'Entrega física de carnet escolar a estudiantes registrados para acceso prioritario.', hour: '08:00 AM a 05:00 PM - Hall Bloque F' },
    { day: 20, title: 'Taller Sincrónico: Éxito en tu entrega ACA', type: 'tech', desc: 'Taller virtual dictado por tutores estrella de ingeniería para resolver dudas del ACA.', hour: '07:30 PM - Meet Virtual Aula' },
    { day: 24, title: 'Festival de la Creatividad y Música CUN', type: 'wellness', desc: 'Exhibiciones de arte estudiantil, stand-up comedy, bandas en vivo y food-trucks.', hour: '03:00 PM - Patio Ágora Sede Central' },
    { day: 28, title: 'Entrega Final del Primer ACA (Corte 1)', type: 'academic', desc: 'Fecha de subida obligatoria del archivo PDF o comprimido en la plataforma del Aula virtual.', hour: '11:59 PM - Aula Virtual SINU' }
  ];

  const handleOpenStation = (station: Station) => {
    // ENFORCE LINEAL FLOW PATH (can't advance without completing preceding station contents)
    const activeTrack = activeTab === 'cun360' ? cun360Stations : cdigitalStations;
    const currentIdx = activeTrack.findIndex(s => s.id === station.id);

    if (currentIdx > 0) {
      const precedingStation = activeTrack[currentIdx - 1];
      const isPrecedingCompleted = completedStations.includes(precedingStation.id);

      if (!isPrecedingCompleted) {
        // Trigger locked warnings, prevent showing video/PDF content popup
        setStationLockWarning({
          stationName: station.title,
          previousStationName: precedingStation.title,
          stationNumber: station.number
        });
        return;
      }
    }

    setActivePdfPage(0);
    setActivePopupStation(station);
    // Mark station as completed
    if (!completedStations.includes(station.id)) {
      setCompletedStations(prev => [...prev, station.id]);
    }
  };

  const currentTrackStations = activeTab === 'cun360' ? cun360Stations : cdigitalStations;
  const currentActivity = calendarActivities.find(act => act.day === selectedDay);

  // Folder design Tabs Definition
  const tabsList: Array<{ id: HubTab; label: string; icon: typeof Compass; isLockedOption: boolean }> = [
    { id: 'recorrido360', label: 'Tour 360', icon: Compass, isLockedOption: false },
    { id: 'cun360', label: 'Campus 360', icon: Building, isLockedOption: false },
    { id: 'cdigital', label: 'CDigital', icon: Monitor, isLockedOption: false },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar, isLockedOption: false },
    { id: 'soporteLocked', label: 'Soporte Cami 🔒', icon: LifeBuoy, isLockedOption: true },
    { id: 'parcheLocked', label: 'Parche Virtual 🔒', icon: Users, isLockedOption: true },
    { id: 'bienestarLocked', label: 'Bienestar 🔒', icon: Heart, isLockedOption: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 flex flex-col h-[calc(100vh-140px)] min-h-[640px] overflow-hidden" id="onboarding-viewport-fixed">
      
      {/* 🌟 PREMIUM MINIMAL HEADER AREA - Compact heights, elegant design */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 border border-[#9BFF00]/15 rounded-2xl p-3 sm:p-4 mb-4 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#9BFF00]/10 text-[#9BFF00] hidden sm:block shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-mono tracking-widest text-[#9BFF00] font-black uppercase">
              UNIVERSIDAD CUN • INDUCCIÓN DE AVANCE CUATRIMESTRAL
            </span>
            <h1 className="font-display font-black text-lg sm:text-2xl text-white uppercase tracking-tight leading-none mt-0.5">
              PARCHE DIGITAL INTEGRADO
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 bg-black/30 border border-white/5 py-1.5 px-3.5 rounded-full text-[10px] font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Onboarding Lineal Controlado 2026</span>
        </div>
      </div>

      {/* 📁 NEW FOLDER TAB SELECTOR LIST HEADER */}
      <div className="flex bg-transparent overflow-x-auto max-w-full scrollbar-none select-none z-10 -mb-[2px] items-end px-1 sm:px-4 shrink-0 gap-1 sm:gap-1.5">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-mono font-black uppercase flex items-center gap-1.5 transition-all relative border-t border-x rounded-t-xl cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#1b233a] to-[#121824] border-[#9BFF00] text-white z-20 shadow-[0_-3px_10px_rgba(155,255,0,0.12)]'
                  : 'bg-zinc-950/80 border-slate-800/80 text-zinc-500 hover:text-zinc-300 hover:bg-[#121824]/40 z-10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#9BFF00]' : 'text-zinc-500'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 📁 TAB WORKSPACE BOX - MODIFIED: NOT COMPLETELY DARK PURE BLACK (ELEGANT DEEP SLATE GRADIENT) */}
      <div className="flex-1 bg-gradient-to-b from-[#121824] to-[#0d121c] border-2 border-[#1b233a] rounded-b-3xl rounded-tr-3xl relative overflow-hidden flex flex-col p-3 sm:p-5 shadow-2xl backdrop-blur-sm">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PANOEE 360 ONLY VISOR */}
          {activeTab === 'recorrido360' && (
            <motion.div
              key="recorrido360"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="w-full h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest pb-1 border-b border-white/5 shrink-0 select-none">
                <span className="flex items-center gap-1.5 text-[#9BFF00] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9BFF00] animate-ping" />
                  RECORRIDO 360 INTERACTIVO • VISOR PANOEE
                </span>
                <span className="hidden sm:inline">Panoee Platform Live View</span>
              </div>

              {/* Photo Sphere Viewer + VirtualTourPlugin integration */}
              <div className="flex-1 bg-black rounded-xl overflow-hidden relative border border-slate-800/80 my-2 shadow-2xl">
                <VirtualTour360
                  scenes={[
                    {
                      id: 'pano-main',
                      panoramaUrl: localPanoramaUrl,
                      name: 'Recorrido CUN 360',
                      yaw: 0,
                      pitch: 0,
                      hotspots: [
                        { id: 'h-entrance', yaw: 0.35, pitch: -0.12, label: 'ENTRADA', targetSceneId: 'pano-6sa' }
                      ],
                      zones: [
                        { id: 'zone-6sa', label: 'Entrada 6SA', yaw: 0.15, pitch: -0.08, targetSceneId: 'pano-6sa' }
                      ]
                    },
                    {
                      id: 'pano-6sa',
                      panoramaUrl: nextPanoramaUrl,
                      name: 'Entrada 6SA',
                      yaw: 0,
                      pitch: 0,
                      hotspots: [
                        { id: 'h-back', yaw: -1.5, pitch: 0.05, label: 'Regresar', targetSceneId: 'pano-main' }
                      ],
                      zones: [
                        { id: 'zone-back', label: 'Volver a la calle', yaw: -1.5, pitch: 0.05, targetSceneId: 'pano-main' }
                      ]
                    }
                  ]}
                  onHotspotClick={(hotspotId: string, targetStationId?: string) => {
                    const station = cun360Stations.find(s => s.id === targetStationId) || cdigitalStations.find(s => s.id === targetStationId);
                    if (station) handleOpenStation(station);
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-2 shrink-0 select-none bg-[#172033]/60 p-2.5 rounded-xl border border-white/5 text-left">
                <p className="text-[10px] font-mono text-slate-300 m-0">
                  📍 Usa los botones para rotar y explora las zonas interactivas del tour local.
                </p>
                <a 
                  href={localPanoramaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] font-mono font-black text-black bg-[#9BFF00] hover:bg-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all border-none"
                >
                  Ver imagen local <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}

          {/* TAB 2 & 3: CUN 360 / CDIGITAL CAMPUS MAPS (Popup driven) */}
          {(activeTab === 'cun360' || activeTab === 'cdigital') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-between relative"
            >
              {/* Header guides */}
              <div className="flex items-center justify-between pb-1 border-b border-white/5 shrink-0 select-none text-[10px] font-mono text-zinc-400">
                <span className="text-[#9BFF00] uppercase font-black tracking-widest">
                  👉 MUEVE TU CARÁCTER: {activeTab === 'cun360' ? 'RECORRIDO CAMPUS FÍSICO BOGOTÁ' : 'INDUCCIÓN DE HERRAMIENTAS DIGITALES'}
                </span>
                
                <button
                  onClick={() => handleOpenStation(currentTrackStations[0])}
                  className="text-[9px] font-mono font-black bg-[#9BFF00]/10 border border-[#9BFF00]/40 text-[#9BFF00] py-0.5 px-2.5 rounded-md hover:bg-[#9BFF00] hover:text-black transition-all cursor-pointer"
                >
                  Comenzar por Estación 1 🚀
                </button>
              </div>

              {/* INTEGRATED MAP BOARD (NO SCROLLING) */}
              <div className="flex-1 bg-slate-900/20 border border-slate-800 rounded-2xl relative overflow-hidden my-2 select-none">
                
                {/* SVG Route Blueprint */}
                <div className="absolute inset-0 z-0">
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 1000 400" fill="none" preserveAspectRatio="none">
                    <defs>
                      <pattern id="grid-dots-blue" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.0" fill="rgba(155, 255, 0, 0.04)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-dots-blue)" />

                    <g stroke="rgba(255,255,255,0.02)" strokeWidth="1">
                      <rect x="70" y="40" width="130" height="190" rx="4" />
                      <rect x="430" y="80" width="150" height="100" rx="5" />
                      <rect x="760" y="80" width="130" height="150" rx="3" />
                    </g>

                    <path 
                      d="M 100,220 C 220,70 380,330 520,200 C 660,70 780,260 900,120" 
                      stroke="rgba(155, 255, 0, 0.05)" 
                      strokeWidth="12" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                    <path 
                      d="M 100,220 C 220,70 380,330 520,200 C 660,70 780,260 900,120" 
                      stroke="#9BFF00" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeDasharray="5 7"
                      fill="none" 
                    />
                  </svg>
                </div>

                {/* PLOTTED NODES */}
                <div className="absolute inset-0 z-10">
                  {currentTrackStations.map((station, idx) => {
                    const isCompleted = completedStations.includes(station.id);
                    
                    // A station is sequentially locked if previous station exists and isn't completed
                    let isLocked = false;
                    if (idx > 0) {
                      const prevSt = currentTrackStations[idx - 1];
                      isLocked = !completedStations.includes(prevSt.id);
                    }

                    return (
                      <div
                        key={station.id}
                        onClick={() => handleOpenStation(station)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group active:scale-95"
                        style={{ left: `${station.coordinateX}%`, top: `${station.coordinateY}%` }}
                      >
                        <div className="relative">
                          {/* Label info */}
                          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-slate-950 border border-[#9BFF00]/20 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-extrabold whitespace-nowrap opacity-85 text-zinc-300 group-hover:opacity-100 group-hover:border-[#9BFF00] transition-colors shadow-lg">
                            {idx + 1}. {station.title.split(' ')[0]} {isLocked && '🔒'}
                          </div>

                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm border-2 transition-all duration-200 ${
                            isCompleted 
                              ? 'bg-emerald-500 text-black border-[#9BFF00] shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                              : isLocked
                                ? 'bg-[#1b2234] text-zinc-600 border-zinc-800 cursor-not-allowed opacity-60'
                                : 'bg-[#172033]/90 text-[#9BFF00] border-[#9BFF00]/40 hover:border-[#9BFF00] hover:scale-110 shadow-lg'
                          }`}>
                            {isCompleted ? '✓' : isLocked ? '🔒' : station.number}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Hints banner */}
                <div className="absolute bottom-3 left-3 bg-slate-950/95 border border-white/5 p-2 rounded-lg text-left pointer-events-none text-[9px] font-mono">
                  <p className="text-zinc-400 font-extrabold m-0">ESTACIONES DE LA RUTA</p>
                  <p className="text-[#9BFF00] font-black m-0">DEBES COMPLETAR EN ORDEN (1 al 9)</p>
                </div>
              </div>

              {/* Progress visualizer */}
              <div className="bg-[#172033]/60 border border-slate-800/65 rounded-xl p-2.5 px-4 flex items-center justify-between gap-4 text-left shrink-0 font-mono select-none">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#9BFF00]" />
                  <span className="text-[10px] text-zinc-300 font-bold uppercase">PROGRESO COMPLETADO:</span>
                </div>
                <div className="flex-1 max-w-xs bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${(completedStations.filter(id => id.startsWith(activeTab === 'cun360' ? 'c360' : 'cdig')).length / 9) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#9BFF00] font-black bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 shrink-0">
                  {completedStations.filter(id => id.startsWith(activeTab === 'cun360' ? 'c360' : 'cdig')).length} / 9
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 4: CALENDAR / CRONOGRAMA DE ACTIVIDADES */}
          {activeTab === 'cronograma' && (
            <motion.div
              key="cronograma"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest pb-1 border-b border-white/5 shrink-0 select-none mb-1">
                <span className="text-[#9BFF00] font-black">📅 CRONOGRAMA DE ACTIVIDADES INSTITUCIONALES CUN • 2026</span>
                <span>Bogotá / Virtual</span>
              </div>

              {/* Layout splits into compact calendar grid on left and selected day description on right */}
              <div className="flex-1 grid md:grid-cols-12 gap-3 min-h-0 relative my-1">
                
                {/* 30-day Calendar board */}
                <div className="md:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between min-h-0 select-none">
                  
                  {/* Days grid headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-zinc-400 font-extrabold border-b border-white/5 pb-1 shrink-0">
                    <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                  </div>

                  {/* 30 Days of Grid representing our university month */}
                  <div className="grid grid-cols-7 gap-1 mt-1 flex-1">
                    {Array.from({ length: 30 }, (_, index) => {
                      const dayNumber = index + 1;
                      const hasActivity = calendarActivities.some(act => act.day === dayNumber);
                      const isSelected = selectedDay === dayNumber;
                      const matchedAct = calendarActivities.find(act => act.day === dayNumber);

                      return (
                        <div
                          key={dayNumber}
                          onClick={() => {
                            if (hasActivity) {
                              setSelectedDay(dayNumber);
                            }
                          }}
                          className={`relative rounded-lg flex flex-col items-center justify-center p-1 border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#9BFF00] text-black border-white font-black scale-102 z-10 shadow-lg shadow-[#9BFF00]/10'
                              : hasActivity
                                ? matchedAct?.type === 'academic'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/35 hover:bg-amber-500/20'
                                  : matchedAct?.type === 'wellness'
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/35 hover:bg-rose-500/20'
                                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 hover:bg-cyan-500/20'
                                : 'bg-slate-950/40 text-slate-400 border-[#1b233a] hover:border-slate-800'
                          }`}
                        >
                          <span className="text-[11px] sm:text-xs">{dayNumber}</span>
                          
                          {/* Mini indicator dot */}
                          {hasActivity && !isSelected && (
                            <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                              matchedAct?.type === 'academic' ? 'bg-amber-450' : matchedAct?.type === 'wellness' ? 'bg-rose-450' : 'bg-cyan-450'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Color Key Guide */}
                  <div className="flex flex-wrap gap-3 mt-2 pt-1.5 border-t border-white/5 text-[8px] font-mono tracking-wider text-slate-400 uppercase justify-center font-bold shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Académico-ACA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>Bienestar-Parche</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Tecnológico-Meet</span>
                    </div>
                  </div>
                </div>

                {/* Day Details Workspace */}
                <div className="md:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-3 sm:p-4 text-left flex flex-col justify-between min-h-[160px] sm:min-h-0">
                  {currentActivity ? (
                    <div className="space-y-2 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-black tracking-widest ${
                            currentActivity.type === 'academic' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            currentActivity.type === 'wellness' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          }`}>
                            {currentActivity.type === 'academic' ? 'Académico CUN' : currentActivity.type === 'wellness' ? 'Bienestar CUNISTA' : 'Sincrónico Digital'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">DÍA {currentActivity.day}</span>
                        </div>

                        <h4 className="text-white text-sm sm:text-base font-display font-black uppercase tracking-tight mt-1">
                          {currentActivity.title}
                        </h4>

                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-2 font-semibold">
                          {currentActivity.desc}
                        </p>
                      </div>

                      <div className="bg-slate-950 p-2 border border-white/5 rounded-lg flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-black">HORARIO/LUGAR:</span>
                        <span className="text-white font-black">{currentActivity.hour}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full text-zinc-500 space-y-2 py-4">
                      <Clock className="w-8 h-8 text-zinc-600 animate-pulse" />
                      <div>
                        <p className="text-[10px] font-mono uppercase font-black text-slate-400">Sin evento crítico el día de hoy</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5 font-semibold">Haz clic en los números de color del calendario para ver las inducciones de ese día.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* DISPLAY FOR LOCKED CUSTOM APARTMENTS */}
          {(activeTab === 'soporteLocked' || activeTab === 'parcheLocked' || activeTab === 'bienestarLocked') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto"
            >
              <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
                <Lock className="w-7 h-7" />
              </div>

              <span className="text-[10px] font-mono font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-2">
                APARTADO BLOQUEADO • ACTIVACIÓN SEMESTRAL
              </span>

              <h2 className="text-lg sm:text-2xl font-display font-black text-white uppercase tracking-tight leading-tight mb-2">
                {activeTab === 'soporteLocked' && 'SOPORTE DE TRÁMITES CON CAMI'}
                {activeTab === 'parcheLocked' && 'UNIÓN DEL PARCHE CUNISTA'}
                {activeTab === 'bienestarLocked' && 'BIENESTAR Y SALUD INTEGRAL'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold mb-6">
                {activeTab === 'soporteLocked' && 'Esta sección interactiva te conectará directamente con Cami, el gestor inteligente de IA, y el sistema oficial de tickets CUN para homologaciones de asignaturas y consultas de caja.'}
                {activeTab === 'parcheLocked' && 'Pronto podrás reclamar tu invitación a los servidores de Discord oficiales y comunidades de WhatsApp de tu carrera para relacionarte con todo tu parche de estudios.'}
                {activeTab === 'bienestarLocked' && 'Descubre actividades extraescolares gratis, torneos deportivos en Bogotá, clases de danza, orientación sicológica y convenios médicos organizados por la CUN.'}
              </p>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-[#1b233a] text-[10px] font-mono text-slate-300 flex items-center gap-2 max-w-sm text-left shadow-lg">
                <Clock className="w-4 h-4 text-[#9BFF00]" />
                <span>Se habilitará automáticamente al registrarse las primeras asistencias al aula oficial.</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* ⚠️ STATION PROGRESSION WARNING OVERLAY (ZERO SCROLL COUPLING) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {stationLockWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#121824] border-2 border-amber-400 rounded-2xl p-5 sm:p-6 text-left shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col gap-4"
            >
              <div className="flex items-center gap-2.5 text-amber-400 border-b border-white/10 pb-3">
                <Lock className="w-5 h-5" />
                <h3 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider">Estación No Desbloqueada</h3>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                No puedes saltar a la <span className="text-[#9BFF00] font-black">Estación {stationLockWarning.stationNumber}: {stationLockWarning.stationName}</span> sin haber visto los contenidos de la estación anterior de tu ruta oficial:
              </p>

              <div className="p-3 bg-black/40 border border-[#1b233a] rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center text-xs font-mono font-black border border-amber-400/20">
                  {stationLockWarning.stationNumber - 1}
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase leading-none">Debes Completar Primero</p>
                  <p className="text-xs text-white font-extrabold mt-1">{stationLockWarning.previousStationName}</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-mono italic leading-normal">
                💡 En la CUN fomentamos el aprendizaje estructurado. Visualiza las estaciones secuencialmente para consolidar tu onboarding.
              </p>

              <button
                onClick={() => setStationLockWarning(null)}
                className="w-full py-2.5 bg-amber-400 hover:bg-white text-black font-mono font-black text-xs uppercase rounded-xl transition-all border-none cursor-pointer active:scale-95"
              >
                Entendido, completaré la ruta en orden
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 💥 STATIONS FILE DEEP RESOURCE POP-UP MODAL (ZERO SCROLL COUPLING) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {activePopupStation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-[#121824] border-2 border-[#9BFF00] rounded-2xl w-full max-w-xl shadow-2xl p-4 sm:p-5 text-left font-sans flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
            >
              {/* Header metadata row */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#9BFF00] animate-ping" />
                  <span className="text-[9px] font-mono font-black text-slate-400 tracking-wider uppercase">
                    ESTACIÓN {activePopupStation.number} / INDUCCIÓN ACTIVA
                  </span>
                </div>
                <button
                  onClick={() => setActivePopupStation(null)}
                  className="bg-black/30 border border-slate-800 text-zinc-300 hover:text-white transition-colors py-1 px-3 text-[10px] font-mono font-black uppercase rounded-md cursor-pointer"
                >
                  Cerrar [X]
                </button>
              </div>

              {/* Station General Info */}
              <div>
                <span className="text-[9px] bg-[#9BFF00]/10 text-[#9BFF00] px-2 py-0.5 rounded-md font-mono uppercase tracking-widest font-black border border-[#9BFF00]/20">
                  {activePopupStation.subtitle}
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl uppercase text-white mt-1.5 leading-none">
                  {activePopupStation.title}
                </h3>
              </div>

              {/* Main Embed Content Wrapper */}
              <div className="bg-[#172033] border border-[#1b233a] rounded-xl overflow-hidden min-h-[220px] flex flex-col justify-between">
                
                {/* VIDEO HANDLER */}
                {activePopupStation.type === 'video' && (
                  <div className="w-full flex-1 flex flex-col justify-between p-2">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-inner border border-slate-800">
                      <iframe
                        src={activePopupStation.videoUrl}
                        title={activePopupStation.title}
                        className="absolute inset-0 w-full h-full border-none select-none"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* PDF READER SIMULATOR */}
                {activePopupStation.type === 'pdf' && activePopupStation.pdfPages && (
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase pb-1.5 border-b border-white/5">
                      <span>DOCUMENTO: {activePopupStation.pdfTitle}</span>
                      <span>PÁG {activePdfPage + 1} DE {activePopupStation.pdfPages.length}</span>
                    </div>

                    <div className="bg-slate-950/80 rounded-lg p-3 my-2 text-xs text-slate-100 font-sans leading-relaxed min-h-[100px] border-l-2 border-[#9BFF00]">
                      <div className="font-semibold">{activePopupStation.pdfPages[activePdfPage]}</div>
                    </div>

                    {/* Pagination controller */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        disabled={activePdfPage === 0}
                        onClick={() => setActivePdfPage(prev => Math.max(0, prev - 1))}
                        className="px-2 py-1 bg-black/40 border border-slate-800 text-white disabled:opacity-35 text-[9px] font-mono font-black rounded cursor-pointer"
                      >
                        ← Anterior
                      </button>
                      <button
                        disabled={activePdfPage === activePopupStation.pdfPages.length - 1}
                        onClick={() => setActivePdfPage(prev => Math.min(activePopupStation.pdfPages!.length - 1, prev + 1))}
                        className="px-2 py-1 bg-[#9BFF00] text-black disabled:opacity-35 text-[9px] font-mono font-black rounded cursor-pointer border-none"
                      >
                        Siguiente →
                      </button>
                    </div>
                  </div>
                )}

                {/* INFOGRAPHIC GRID LIST */}
                {activePopupStation.type === 'infografia' && activePopupStation.infogData && (
                  <div className="p-3 sm:p-4 flex-1 space-y-2.5">
                    {activePopupStation.infogData.map((info, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 border border-white/5 rounded-lg text-left">
                        <h4 className="text-xs text-[#9BFF00] font-mono uppercase font-black">{info.title}</h4>
                        <p className="text-[11px] text-zinc-200 mt-0.5 leading-relaxed font-semibold">{info.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Tips and modal confirm */}
              {activePopupStation.extraTip && (
                <div className="bg-amber-400/5 border border-amber-400/30 p-2.5 rounded-lg text-[10px] text-amber-300 leading-relaxed font-semibold">
                  <strong>💡 CONSEJO CUNISTA:</strong> {activePopupStation.extraTip}
                </div>
              )}

              <button
                onClick={() => setActivePopupStation(null)}
                className="w-full py-3 bg-[#9BFF00] text-black hover:bg-white font-mono font-black text-xs uppercase rounded-xl transition-all cursor-pointer border-none"
              >
                Completar y Volver a la Ruta ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
