import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Monitor, FileText, LifeBuoy, Users, Heart, 
  Play, ExternalLink, ArrowRight, Clock, Calendar, HelpCircle, 
  MapPin, Compass, GraduationCap, ChevronRight, Eye, ChevronLeft, Award, Lock, Check
} from 'lucide-react';
import lottie from 'lottie-web/build/player/lottie_light';
import { DEFAULT_HUB_TAB, isHubTab, type HubTab } from '../navigation';
import { useSearchParams } from 'react-router-dom';
import VirtualTour360 from './VirtualTour360';
import { TOUR360_START_NODE_ID, tour360Nodes } from '../data/tour360Nodes';
import EarthAnimation from '../assets/iconos/Earth.json';

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

const AnimatedEarthIcon: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: EarthAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className={`block shrink-0 overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
    />
  );
};

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

  // Active chosen calendar activity day. Starts with the first configured event.
  const [selectedDay, setSelectedDay] = useState<number>(5);

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
      title: 'Sede Central Bogotá (Bloque F)', subtitle: 'Video Orientación de Ingreso',
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
      title: 'Gimnasio y Zonas Lúdicas (Sede H)', subtitle: 'Video Beneficios Físicos',
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
      title: 'Bienestar y Apoyo Psicológico', subtitle: 'Video Salud Estudiantil',
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
      title: 'Ingreso Seguro al Aula Virtual', subtitle: 'Video Tutorial Clave',
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
      title: 'Soporte con Cami y Canal Ticket', subtitle: 'Video de Trámites Rápidos',
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
        'Página 2: Las tutorías presenciales/sincrúnicas quedan grabadas en el aula por si no te puedes conectar en vivo.'
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
      title: 'Framework de Aprendizaje Remoto', subtitle: 'Video Tips de Alto Impacto',
      description: 'Metodologías de hábitos ágiles probadas por estudiantes virtuales de alto rendimiento en Colombia.',
      type: 'video', videoUrl: 'https://www.youtube.com/embed/Lq_GdgRt_vs',
      accentColor: '#AF52DE', extraTip: 'Crea un espacio físico libre de distracciones en casa para estudiar.',
      coordinateX: 76, coordinateY: 40
    },
    {
      id: 'cdig-8', number: 8,
      title: 'Estándares de í‰tica Estudiantil', subtitle: 'Compendio PDF Institucional',
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
    { day: 20, title: 'Taller Sincrónico: í‰xito en tu entrega ACA', type: 'tech', desc: 'Taller virtual dictado por tutores estrella de ingeniería para resolver dudas del ACA.', hour: '07:30 PM - Meet Virtual Aula' },
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
  const selectedDayActivities = calendarActivities.filter(act => act.day === selectedDay);
  const selectedDateLabel = `Día ${selectedDay} de inducción`;
  const getCalendarTypeLabel = (type: CalendarActivity['type']) => {
    if (type === 'academic') return 'Académico';
    if (type === 'wellness') return 'Bienestar';
    return 'Tecnología';
  };
  // Paleta "agenda premium": viva y luminosa, pero elegante (no alerta).
  // Chip de categoría (panel de detalle).
  const getCalendarTypeClasses = (type: CalendarActivity['type']) => {
    if (type === 'academic') return 'bg-sky-400/15 text-sky-200 border-sky-400/40';
    if (type === 'wellness') return 'bg-violet-400/15 text-violet-200 border-violet-400/40';
    return 'bg-cyan-400/15 text-cyan-200 border-cyan-400/40';
  };
  // Punto de evento con pequeño glow para verse más vivo.
  const getCalendarDotClass = (type?: CalendarActivity['type']) => {
    if (type === 'academic') return 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]';
    if (type === 'wellness') return 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]';
    if (type === 'tech') return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]';
    return 'bg-text-muted';
  };
  // Día con evento: fondo translúcido visible + borde de categoría más claro.
  const getCalendarTileClasses = (type?: CalendarActivity['type']) => {
    if (type === 'academic') return 'border-sky-400/45 bg-sky-400/[0.14]';
    if (type === 'wellness') return 'border-violet-400/45 bg-violet-400/[0.14]';
    if (type === 'tech') return 'border-cyan-400/45 bg-cyan-400/[0.14]';
    return 'border-border-subtle bg-white/[0.03]';
  };
  // Glow interno muy sutil del color de la categoría.
  const getCalendarGlow = (type?: CalendarActivity['type']) => {
    if (type === 'academic') return 'shadow-[inset_0_0_24px_-6px_rgba(56,189,248,0.45)]';
    if (type === 'wellness') return 'shadow-[inset_0_0_24px_-6px_rgba(167,139,250,0.45)]';
    if (type === 'tech') return 'shadow-[inset_0_0_24px_-6px_rgba(34,211,238,0.45)]';
    return '';
  };
  // Día seleccionado: elevación + halo sutil del color del evento (si aplica).
  const getCalendarSelectedShadow = (type?: CalendarActivity['type']) => {
    if (type === 'academic') return 'shadow-[0_12px_30px_-14px_rgba(0,0,0,0.75),inset_0_0_28px_-6px_rgba(56,189,248,0.5)]';
    if (type === 'wellness') return 'shadow-[0_12px_30px_-14px_rgba(0,0,0,0.75),inset_0_0_28px_-6px_rgba(167,139,250,0.5)]';
    if (type === 'tech') return 'shadow-[0_12px_30px_-14px_rgba(0,0,0,0.75),inset_0_0_28px_-6px_rgba(34,211,238,0.5)]';
    return 'shadow-[0_12px_30px_-14px_rgba(0,0,0,0.75)]';
  };
  // Borde/tinte de la tarjeta de evento (panel de detalle) por categoría.
  const getCalendarCardClasses = (type: CalendarActivity['type']) => {
    if (type === 'academic') return 'border-sky-400/30 bg-sky-400/[0.07]';
    if (type === 'wellness') return 'border-violet-400/30 bg-violet-400/[0.07]';
    return 'border-cyan-400/30 bg-cyan-400/[0.07]';
  };

  // Capítulos visuales — misma navegación técnica, presentación narrativa.
  const tabsList: Array<{ id: HubTab; chapterNo: number; short: string; hint: string; icon: typeof Compass; isLockedOption: boolean }> = [
    { id: 'recorrido360', chapterNo: 1, short: 'Explora', hint: 'Tour 360', icon: Compass, isLockedOption: false },
    { id: 'cun360', chapterNo: 2, short: 'Campus', hint: 'Ruta física', icon: Building, isLockedOption: false },
    { id: 'cdigital', chapterNo: 3, short: 'Digital', hint: 'Herramientas', icon: Monitor, isLockedOption: false },
    { id: 'cronograma', chapterNo: 4, short: 'Fechas', hint: 'Cronograma', icon: Calendar, isLockedOption: false },
    { id: 'soporteLocked', chapterNo: 5, short: 'Cami', hint: 'Pronto', icon: LifeBuoy, isLockedOption: true },
    { id: 'parcheLocked', chapterNo: 6, short: 'Comunidad', hint: 'Pronto', icon: Users, isLockedOption: true },
    { id: 'bienestarLocked', chapterNo: 7, short: 'Bienestar', hint: 'Pronto', icon: Heart, isLockedOption: true },
  ];

  // ------------------------------------------------------------------ //
  // FASE 3 — Capa narrativa (solo visual). Datos derivados para el Hero, //
  // la misión actual y el avance inferior. No altera lógica alguna.      //
  // ------------------------------------------------------------------ //
  const trackPrefix = activeTab === 'cun360' ? 'c360' : 'cdig';
  const stationTrack = activeTab === 'cun360' ? cun360Stations : cdigitalStations;
  const completedInTrack = completedStations.filter(id => id.startsWith(trackPrefix)).length;
  const nextStation = stationTrack.find(s => !completedStations.includes(s.id));
  const nextStopName = nextStation ? nextStation.title.split(' ')[0] : null;
  const isStationModule = activeTab === 'cun360' || activeTab === 'cdigital';
  const isLockedModule = activeTab === 'soporteLocked' || activeTab === 'parcheLocked' || activeTab === 'bienestarLocked';
  // Fase 4B — El capítulo Tour 360 usa un layout inmersivo exclusivo.
  const isImmersive = activeTab === 'recorrido360';
  // Fase C — Tema ambiental del escenario según el capítulo (solo visual).
  const chapterTheme =
    activeTab === 'recorrido360' ? 'tour'
    : activeTab === 'cun360' ? 'campus'
    : activeTab === 'cdigital' ? 'digital'
    : activeTab === 'cronograma' ? 'calendar'
    : 'default';

  // Metadata narrativa del viaje de inducción (capítulos guiados).
  interface ModuleNarrative {
    chapter: string;
    mission: string;
    title: string;
    description: string;
    nextStep: string;
    reward: string;
    ctaLabel: string;
    guide: string;
  }

  const moduleNarrative: Record<HubTab, ModuleNarrative> = {
    recorrido360: {
      chapter: 'Capítulo 1',
      mission: 'Explora tu sede',
      title: 'Bienvenido a la Sede Bogotá',
      description: 'Recorre los espacios donde estudiarás, descubre servicios y familiarízate con tu campus antes de llegar.',
      nextStep: 'Usa las flechas dentro del recorrido para avanzar por la sede.',
      reward: 'Desbloqueas confianza para moverte por el campus.',
      ctaLabel: 'Iniciar exploración',
      guide: 'Hola, soy tu guía. Empecemos por conocer la entrada principal.',
    },
    cun360: {
      chapter: 'Capítulo 2',
      mission: 'Reconoce los espacios clave',
      title: 'Completa la ruta Campus 360',
      description: 'Avanza por las estaciones físicas de la universidad y conoce los lugares que harán parte de tu vida académica.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Al completar esta ruta tendrás una guía clara del campus.',
      ctaLabel: 'Continuar ruta',
      guide: 'Vas bien. Sigue la ruta y descubre cada espacio del campus.',
    },
    cdigital: {
      chapter: 'Capítulo 3',
      mission: 'Domina tus herramientas digitales',
      title: 'Prepárate para estudiar en el ecosistema digital CUN',
      description: 'Aprende a usar las plataformas, canales y recursos que necesitarás durante el semestre.',
      nextStep: 'Completa las estaciones digitales en orden.',
      reward: 'Al finalizar sabrás cómo gestionar tu vida académica digital.',
      ctaLabel: 'Continuar ruta digital',
      guide: 'Estas herramientas te acompañarán todo el semestre. ¡Vamos!',
    },
    cronograma: {
      chapter: 'Capítulo 4',
      mission: 'Organiza tu inicio de semestre',
      title: 'Revisa las fechas importantes',
      description: 'Consulta actividades, plazos y momentos clave para iniciar tu proceso académico sin perderte de nada.',
      nextStep: 'Selecciona un día con evento para ver sus detalles.',
      reward: 'Tendrás claridad sobre las fechas más importantes.',
      ctaLabel: 'Ver cronograma',
      guide: 'Recuerda revisar el cronograma para no perder fechas importantes.',
    },
    soporteLocked: {
      chapter: 'Capítulo 5',
      mission: 'Tu acompañante digital',
      title: 'Soporte con Cami, muy pronto',
      description: 'Tu acompañante digital estará disponible pronto para ayudarte con tus trámites y dudas del día a día.',
      nextStep: 'Este capítulo se habilitará durante el semestre.',
      reward: 'Tendrás ayuda inmediata para tus trámites.',
      ctaLabel: '',
      guide: 'Pronto estaré aquí para resolver tus dudas de trámites.',
    },
    parcheLocked: {
      chapter: 'Capítulo 6',
      mission: 'Conecta con otros estudiantes',
      title: 'Comunidad CUNista, muy pronto',
      description: 'Conecta con otros estudiantes de tu carrera, encuentra tu parche y comparte tu proceso de inducción.',
      nextStep: 'Este capítulo se habilitará durante el semestre.',
      reward: 'Harás parte de una comunidad que te acompaña.',
      ctaLabel: '',
      guide: 'Muy pronto podrás conocer a tu parche.',
    },
    bienestarLocked: {
      chapter: 'Capítulo 7',
      mission: 'Cuida tu bienestar',
      title: 'Bienestar y apoyo, muy pronto',
      description: 'Encuentra apoyo, actividades y acompañamiento para tu bienestar integral durante tu vida universitaria.',
      nextStep: 'Este capítulo se habilitará durante el semestre.',
      reward: 'Encontrarás apoyo y actividades para ti.',
      ctaLabel: '',
      guide: 'Aquí encontrarás apoyo y actividades para tu bienestar.',
    },
  };
  const activeNarrative = moduleNarrative[activeTab];

  return (
    <div className={`w-full max-w-[1500px] 2xl:max-w-[1680px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-5 relative z-10 flex flex-col h-[calc(100vh-88px)] sm:h-[min(90vh,960px)] min-h-[620px] sm:min-h-[720px] lg:min-h-[760px] overflow-hidden ${isImmersive ? 'tour-immersive-shell' : 'stage-platform'}`} data-chapter={chapterTheme} id="onboarding-viewport-fixed">
      
      {/* ===== HERO EDITORIAL — portada del capítulo (Fase D) ===== */}
      <div className="relative z-[2] flex items-end justify-between gap-4 sm:gap-8 mb-4 sm:mb-6 shrink-0 pt-1">
        <div className="min-w-0 flex flex-col gap-1.5">
          <span className={`section-eyebrow ${isLockedModule ? 'text-amber-400' : ''}`}>
            {activeNarrative.chapter} · {isLockedModule ? 'Capítulo disponible pronto' : activeNarrative.mission}
          </span>
          <h1 className="section-title text-xl sm:text-2xl lg:text-[1.75rem] max-w-[22ch]">
            {activeNarrative.title}
          </h1>
          <p className="section-description hidden md:block text-sm max-w-2xl m-0">
            {activeNarrative.description}
          </p>
        </div>

        {isStationModule && (
          <button
            onClick={() => handleOpenStation(nextStation ?? stationTrack[0])}
            className="action-primary shrink-0 py-2.5"
          >
            {activeNarrative.ctaLabel}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ===== CAPÍTULOS — misma navegación técnica, presentación narrativa ===== */}
      <div className={`flex bg-transparent overflow-x-auto max-w-full scrollbar-none select-none z-10 -mb-px items-end px-0.5 sm:px-2 shrink-0 gap-0.5 sm:gap-1.5 ${isImmersive ? 'tour-immersive-tabs' : ''}`}>
        {tabsList.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={`${tab.short} · ${tab.hint}`}
              className={`focus-ring-soft group relative flex items-center gap-2.5 px-3 sm:px-4 pt-2 pb-2.5 cursor-pointer whitespace-nowrap transition-all duration-200 border-t border-x rounded-t-2xl ${
                isActive
                  ? 'bg-surface-panel border-border-active z-20'
                  : 'border-transparent z-10'
              }`}
            >
              <span className={`tour-tab-chip font-display leading-none text-lg sm:text-xl transition-colors ${
                isActive ? 'text-brand-green-neon' : 'text-text-muted group-hover:text-text-secondary'
              }`}>
                {tab.chapterNo}
              </span>
              <span className="flex flex-col leading-tight text-left">
                <span className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                  {tab.short}
                </span>
                <span className={`tour-tab-hint hidden sm:block text-[10px] font-medium tracking-normal ${isActive ? 'text-brand-green-main' : 'text-text-muted'}`}>
                  {tab.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB WORKSPACE BOX — Panel/tarjeta para módulos normales; en Tour 360 es un stage sin caja. */}
      <div className={
        isImmersive
          ? 'flex-1 relative flex flex-col min-h-0 p-1.5 sm:p-2.5'
          : 'flex-1 bg-surface-panel border border-border-subtle rounded-b-3xl relative overflow-hidden flex flex-col p-3 sm:p-5 shadow-panel backdrop-blur-xl min-h-0'
      }>
        {!isImmersive && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(53,184,74,0.10),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_44%)]" />
        )}
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: TOUR 360 — STAGE INMERSIVO (el panorama es el protagonista) */}
          {activeTab === 'recorrido360' && (
            <motion.div
              key="recorrido360"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="w-full h-full"
            >
              {/* Stage: el panorama flota sobre el fondo atmosférico */}
              <div className="tour-immersive-stage h-full w-full">
                <VirtualTour360
                  nodes={tour360Nodes}
                  initialNodeId={TOUR360_START_NODE_ID}
                />

                {/* Estado como overlay (no repite lo del Hero) */}
                <div className="pointer-events-none absolute right-3 top-3 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green-neon animate-pulse" />
                  <span className="text-[11px] text-white/85">Avanza por la escena para descubrir la sede</span>
                  <span className="ml-1 rounded-full bg-brand-green-neon/90 px-2 py-0.5 text-[9px] font-bold uppercase text-[#06130d]">En recorrido</span>
                </div>

                {/* Guía como acompañamiento dentro de la escena (oculto en móvil) */}
                <div className="pointer-events-none absolute left-3 bottom-14 z-30 hidden max-w-[15rem] items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-2.5 py-2 backdrop-blur-sm md:flex">
                  <AnimatedEarthIcon className="h-6 w-6 shrink-0" />
                  <p className="m-0 text-[10px] italic leading-snug text-white/75">{activeNarrative.guide}</p>
                </div>

                {/* Acción secundaria muy discreta */}
                <a 
                  href={tour360Nodes[0].panorama}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto absolute right-3 bottom-14 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white/80 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
                >
                  <ExternalLink className="w-3 h-3" /> Ver imagen
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
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-border-subtle shrink-0 select-none">
                <span className="section-eyebrow normal-case tracking-wide text-text-secondary">
                  {activeTab === 'cun360' ? 'Recorrido del campus físico Bogotá' : 'Inducción de herramientas digitales'}
                </span>
                <span className="status-badge status-badge-active shrink-0">
                  Estación {nextStation ? nextStation.number : 9}
                </span>
              </div>

              {/* INTEGRATED MAP BOARD (NO SCROLLING) */}
              <div className={`flex-1 border rounded-2xl relative overflow-hidden my-2 select-none backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${
                activeTab === 'cun360' ? 'bg-emerald-950/42 border-emerald-400/18' : 'bg-sky-950/40 border-cyan-300/18'
              }`}>
                <div className={`pointer-events-none absolute inset-0 z-0 ${
                  activeTab === 'cun360' ? 'bg-[radial-gradient(circle_at_18%_18%,rgba(155,255,0,0.18),transparent_34%),radial-gradient(circle_at_84%_78%,rgba(34,197,94,0.13),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.28),rgba(2,6,23,0.66))]' : 'bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.20),transparent_34%),radial-gradient(circle_at_84%_78%,rgba(155,255,0,0.12),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.25),rgba(2,6,23,0.66))]'
                }`} />
                <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />
                <div className="pointer-events-none absolute inset-0 z-0 bg-black/22" />
                
                {/* SVG Route Blueprint */}
                <div className="absolute inset-0 z-0 origin-center transform-gpu scale-[1.02] md:scale-[1.04] lg:scale-[1.05] transition-transform duration-500">
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
                <div className="absolute inset-0 z-10 origin-center transform-gpu scale-[1.02] md:scale-[1.04] lg:scale-[1.05] transition-transform duration-500">
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
                            isCompleted ? 'bg-emerald-500 text-black border-[#9BFF00] shadow-[0_0_15px_rgba(16,185,129,0.3)]' : isLocked ? 'bg-[#1b2234] text-zinc-600 border-zinc-800 cursor-not-allowed opacity-60' : 'bg-[#172033]/90 text-[#9BFF00] border-[#9BFF00]/40 hover:border-[#9BFF00] hover:scale-110 shadow-lg'
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
                  <p className="text-zinc-400 font-extrabold m-0">Tu ruta de descubrimiento</p>
                  <p className="text-[#9BFF00] font-black m-0">Avanza en orden, una parada a la vez (1 al 9)</p>
                </div>
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
              className="w-full h-full flex flex-col min-h-0"
            >
              <div className="flex flex-col gap-2 border-b border-border-subtle pb-4 text-left sm:flex-row sm:items-end sm:justify-between shrink-0 select-none">
                <div className="flex flex-col gap-1">
                  <span className="section-eyebrow">Cronograma de inducción</span>
                  <h2 className="section-title text-2xl sm:text-3xl m-0">Junio 2026</h2>
                  <p className="section-description text-sm m-0">
                    Consulta las fechas clave de tu proceso de inducción.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 self-end rounded-full border border-border-subtle bg-surface-card px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-green-main" />
                  <span className="section-meta text-text-secondary">{calendarActivities.length} fechas clave</span>
                </div>
              </div>

              <div className="grid flex-1 gap-4 overflow-y-auto pt-4 lg:grid-cols-[minmax(0,3.6fr)_minmax(300px,1fr)] lg:overflow-hidden">
                
                <div className="flex min-h-[500px] flex-col rounded-2xl border border-white/10 bg-[#0e1621]/90 p-4 shadow-soft sm:p-5 lg:min-h-0">
                  <div className="grid grid-cols-7 gap-1.5 pb-2 text-center sm:gap-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((weekday) => (
                      <span key={weekday} className="section-meta text-text-muted">{weekday}</span>
                    ))}
                  </div>

                  <div className="grid flex-1 grid-cols-7 gap-1.5 pt-1 sm:gap-2">
                    {Array.from({ length: 30 }, (_, index) => {
                      const dayNumber = index + 1;
                      const hasActivity = calendarActivities.some(act => act.day === dayNumber);
                      const isSelected = selectedDay === dayNumber;
                      const matchedAct = calendarActivities.find(act => act.day === dayNumber);

                      return (
                        <button
                          type="button"
                          key={dayNumber}
                          onClick={() => setSelectedDay(dayNumber)}
                          aria-pressed={isSelected}
                          className={`focus-ring-soft group relative flex min-h-[62px] flex-col items-start justify-between overflow-hidden rounded-xl border p-2 text-left transition-all duration-200 sm:min-h-[76px] sm:p-2.5 lg:min-h-[70px] ${
                            isSelected
                              ? `z-10 border-white/45 bg-white/[0.12] text-text-primary ${getCalendarSelectedShadow(matchedAct?.type)}`
                              : hasActivity
                                ? `${getCalendarTileClasses(matchedAct?.type)} ${getCalendarGlow(matchedAct?.type)} text-text-primary hover:-translate-y-0.5 hover:brightness-125`
                                : 'border-transparent bg-white/[0.02] text-text-muted hover:bg-white/[0.05]'
                          }`}
                        >
                          {isSelected && (
                            <span className={`pointer-events-none absolute inset-x-2 top-1 h-0.5 rounded-full ${hasActivity ? getCalendarDotClass(matchedAct?.type) : 'bg-white/70'}`} />
                          )}
                          <span className={`font-display leading-none text-lg sm:text-2xl ${
                            isSelected || hasActivity ? 'text-white' : 'text-text-muted'
                          }`}>
                            {dayNumber}
                          </span>

                          {hasActivity ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-text-primary/90">
                              <span className={`h-1.5 w-1.5 rounded-full ${getCalendarDotClass(matchedAct?.type)}`} />
                              Evento
                            </span>
                          ) : (
                            <span className={`text-[9px] font-medium uppercase tracking-wider ${
                              isSelected ? 'text-text-secondary' : 'text-text-muted/50'
                            }`}>
                              Libre
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border-subtle pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-brand-green-main" />
                      <span className="section-meta">Académico</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      <span className="section-meta">Bienestar</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span className="section-meta">Tecnología</span>
                    </div>
                  </div>
                </div>

                <aside className="flex min-h-[280px] flex-col rounded-2xl border border-white/12 bg-[#152232]/85 p-4 sm:p-5 text-left shadow-soft lg:min-h-0 lg:overflow-hidden">
                  <span className="section-eyebrow">Fecha seleccionada</span>
                  <h3 className="section-title text-lg sm:text-xl mt-1.5 m-0">{selectedDateLabel}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-brand-green-main shrink-0" />
                    <span className="section-meta text-text-secondary">
                      {selectedDayActivities.length > 0
                        ? `${selectedDayActivities.length} actividad${selectedDayActivities.length > 1 ? 'es' : ''} programada${selectedDayActivities.length > 1 ? 's' : ''}`
                        : 'Sin actividades programadas'}
                    </span>
                  </div>

                  <div className="mt-4 flex-1 space-y-3 overflow-y-auto border-t border-border-subtle pt-4 pr-1">
                    {selectedDayActivities.length > 0 ? (
                      selectedDayActivities.map((activity) => (
                        <article
                          key={`${activity.day}-${activity.title}`}
                          className={`rounded-xl border p-4 ${getCalendarCardClasses(activity.type)}`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${getCalendarTypeClasses(activity.type)}`}>
                              {getCalendarTypeLabel(activity.type)}
                            </span>
                            <span className="section-meta">Día {activity.day}</span>
                          </div>

                          <h4 className="section-title text-base leading-tight mt-2.5 m-0">
                            {activity.title}
                          </h4>

                          <div className="mt-3 flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 text-brand-green-main shrink-0 mt-0.5" />
                            <span className="text-xs font-medium leading-snug text-text-secondary">{activity.hour}</span>
                          </div>

                          <p className="section-description text-xs mt-2.5 m-0">
                            {activity.desc}
                          </p>

                          <button
                            type="button"
                            className="action-secondary mt-4 w-full"
                          >
                            Más información
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </article>
                      ))
                    ) : (
                      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-white/[0.02] p-5 text-center">
                        <Clock className="h-8 w-8 text-text-muted" />
                        <p className="section-title text-sm mt-3 m-0">Día libre</p>
                        <p className="section-description text-xs mt-1.5 max-w-[220px] m-0">
                          Selecciona una fecha marcada con evento para ver sus actividades.
                        </p>
                      </div>
                    )}
                  </div>
                </aside>

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

              <span className="text-[11px] font-semibold tracking-wide text-amber-400 uppercase bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-2">
                {activeNarrative.chapter} · Capítulo disponible pronto
              </span>

              <h2 className="text-lg sm:text-2xl font-display font-black text-white tracking-tight leading-tight mb-2">
                {activeNarrative.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold mb-6 max-w-md">
                {activeNarrative.description}
              </p>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-[#1b233a] text-xs text-slate-300 flex items-center gap-2 max-w-sm text-left shadow-lg italic">
                <Clock className="w-4 h-4 text-brand-green-main shrink-0" />
                <span>{activeNarrative.guide}</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ===== AVANCE NARRATIVO — zona inferior (oculta en Tour 360: vive como overlay) ===== */}
      {!isImmersive && (
      <div className="surface-card mt-3 shrink-0 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {isStationModule ? (
          <>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Award className="w-4 h-4 text-brand-green-main shrink-0" />
              <span className="text-xs sm:text-sm text-text-secondary leading-snug">
                {nextStation ? (
                  <>Has completado <span className="text-text-primary font-semibold">{completedInTrack} de 9</span> {activeTab === 'cun360' ? 'estaciones' : 'herramientas'}. Tu siguiente parada: <span className="text-brand-green-main font-semibold">{nextStopName}</span>.</>
                ) : (
                  <>¡Completaste las 9 {activeTab === 'cun360' ? 'estaciones del campus' : 'herramientas digitales'}! Buen trabajo.</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="section-meta tabular-nums text-text-secondary">{completedInTrack} / 9</span>
              <div className="w-28 sm:w-40 h-1.5 rounded-full overflow-hidden bg-black/40 border border-border-subtle">
                <div
                  className="h-full bg-gradient-to-r from-brand-green-main to-brand-green-neon transition-all duration-500"
                  style={{ width: `${(completedInTrack / 9) * 100}%` }}
                />
              </div>
            </div>
          </>
        ) : activeTab === 'cronograma' ? (
          <>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Calendar className="w-4 h-4 text-brand-green-main shrink-0" />
              <span className="text-xs sm:text-sm text-text-secondary leading-snug">
                Selecciona una fecha para planear tu inicio de semestre.
              </span>
            </div>
            <span className="status-badge status-badge-completed shrink-0">
              {selectedDayActivities.length > 0 ? `${selectedDayActivities.length} actividad(es)` : 'Elige un día'}
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Lock className="w-4 h-4 text-locked shrink-0" />
              <span className="text-xs sm:text-sm text-text-secondary leading-snug">
                Este capítulo estará disponible próximamente.
              </span>
            </div>
            <span className="status-badge status-badge-locked shrink-0">Capítulo futuro</span>
          </>
        )}
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATION PROGRESSION WARNING OVERLAY (ZERO SCROLL COUPLING) */}
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
                <h3 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider">Estación no desbloqueada</h3>
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
      {/* STATIONS FILE DEEP RESOURCE POP-UP MODAL (ZERO SCROLL COUPLING) */}
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
                className="action-primary w-full py-3 uppercase"
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
