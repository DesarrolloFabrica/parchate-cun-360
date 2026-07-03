import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Monitor, FileText, LifeBuoy, Users, Heart, 
  Play, ExternalLink, ArrowRight, Clock, Calendar, HelpCircle, 
  MapPin, Compass, GraduationCap, ChevronRight, Eye, ChevronLeft, Lock, Check
} from 'lucide-react';
import lottie from 'lottie-web/build/player/lottie_light';
import { DEFAULT_HUB_TAB, isHubTab, type HubTab } from '../navigation';
import { useSearchParams } from 'react-router-dom';
import VirtualTour360 from './VirtualTour360';
import { HudGlassModal } from './HudGlassModal';
import { RoadmapView } from './RoadmapView';
import { hubTabToRoadmapVariant, hubTabUsesSequentialUnlock, loadAllRoadmapCompletedStationIds, filterCompletedStationIdsForVariant, saveCompletedStationIdsForVariant } from '../types/roadmap';
import { TOUR360_START_NODE_ID, tour360Nodes } from '../data/tour360Nodes';
import EarthAnimation from '../assets/iconos/Earth.json';
import '../styles/hub-tabs.css';

type StationType = 'video' | 'pdf' | 'infografia' | 'drive-video' | 'drive-image' | 'drive-pdf';

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
  driveVideoPreviewUrl?: string;
  driveImageUrl?: string;
  driveImagePreviewUrl?: string;
  drivePdfPreviewUrl?: string;
  accentColor: string;
  extraTip?: string;
  hideContentTitle?: boolean;
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

// Para videos de Google Drive usar formato:
// https://drive.google.com/file/d/ID_DEL_ARCHIVO/preview
// El archivo debe estar compartido como "Cualquier persona con el enlace puede ver".
const CUN360_POINT_1_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1jwATNThvKeZ7fWw3-GIATNxFfcfbKNC4/preview';

// Para imágenes de Google Drive:
// usar formato https://drive.google.com/uc?export=view&id=ID_DEL_ARCHIVO
// y verificar que el archivo esté compartido como "Cualquier persona con el enlace puede ver".
const CUN360_POINT_2_DRIVE_IMAGE_URL = `https://drive.google.com/file/d/1UdH_BVpKr3NHOrV-BiYuCSLkkxaL2G4n/preview`;
const CUN360_POINT_2_DRIVE_IMAGE_PREVIEW_URL = `https://drive.google.com/file/d/1UdH_BVpKr3NHOrV-BiYuCSLkkxaL2G4n/preview`;

// Para PDFs de Google Drive:
// El archivo debe estar compartido como "Cualquier persona con el enlace puede ver".
// Usar formato:
// https://drive.google.com/file/d/ID_DEL_ARCHIVO/preview
const CUN360_POINT_3_DRIVE_PDF_PREVIEW_URL = 'https://drive.google.com/file/d/1-IfwFm4nt4x5tH2kciEzHqZXwm8tZ2x7/preview';

export const UnifiedOnboardingHub: React.FC<UnifiedOnboardingHubProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTab = searchParams.get('tab') ?? '';
  const activeTab: HubTab = isHubTab(requestedTab) ? requestedTab : DEFAULT_HUB_TAB;

  const onTabChange = (tab: HubTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    setSearchParams(nextParams, { replace: true });
  };

  // Track completed stations globally (persistido por variante en localStorage)
  const [completedStations, setCompletedStations] = useState<string[]>(() =>
    loadAllRoadmapCompletedStationIds(),
  );
  
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
      type: 'drive-video', driveVideoPreviewUrl: CUN360_POINT_1_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#9BFF00', extraTip: 'El carnet digital es obligatorio para ingresar de forma veloz al campus.',
      coordinateX: 10, coordinateY: 70
    },
    {
      id: 'c360-2', number: 2,
      title: 'Biblioteca e Innovación Interactiva', subtitle: 'Imagen de Espacios',
      description: 'Imagen externa de Google Drive para visualizar el contenido del punto 2.',
      type: 'drive-image',
      driveImageUrl: CUN360_POINT_2_DRIVE_IMAGE_URL,
      driveImagePreviewUrl: CUN360_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
      hideContentTitle: true,
      accentColor: '#35B84A', extraTip: 'Las salas MAC se pueden separar en bloques de hasta 2 horas diarias.',
      coordinateX: 20, coordinateY: 40
    },
    {
      id: 'c360-3', number: 3,
      title: 'Ágora CUNlista / Coworking', subtitle: 'PDF de Áreas Comunes',
      description: 'PDF externo de Google Drive para visualizar el contenido del punto 3.',
      type: 'drive-pdf',
      drivePdfPreviewUrl: CUN360_POINT_3_DRIVE_PDF_PREVIEW_URL,
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

  // 9 estaciones para Soporte Cami
  const camiticketStations: Station[] = [
    {
      id: 'cami-1', number: 1,
      title: 'Primer contacto con Cami', subtitle: 'Ruta de atención inicial',
      description: 'Contenido pendiente para el punto 1. Aquí se explicará cómo iniciar una conversación efectiva con Cami.',
      type: 'infografia',
      infogData: [
        { title: 'Objetivo', desc: 'Orientar al estudiante en el primer contacto con el canal de soporte.' },
        { title: 'Estado', desc: 'Contenido editable pendiente de reemplazo por información oficial.' }
      ],
      accentColor: '#9BFF00', extraTip: 'Describe el problema con datos concretos para recibir una mejor orientación.',
      coordinateX: 10, coordinateY: 35
    },
    {
      id: 'cami-2', number: 2,
      title: 'Crear un ticket', subtitle: 'Radicación de solicitudes',
      description: 'Contenido pendiente para el punto 2. Este punto debe explicar cuándo crear un ticket y qué información adjuntar.',
      type: 'infografia',
      infogData: [
        { title: 'Datos básicos', desc: 'Nombre, documento, programa, sede y una descripción clara del caso.' },
        { title: 'Adjuntos', desc: 'Capturas, soportes de pago o evidencias que ayuden a resolver el caso.' }
      ],
      accentColor: '#35B84A', extraTip: 'Un ticket bien documentado reduce tiempos de respuesta.',
      coordinateX: 20, coordinateY: 60
    },
    {
      id: 'cami-3', number: 3,
      title: 'Seguimiento del caso', subtitle: 'Consulta de estado',
      description: 'Contenido pendiente para el punto 3. Aquí se explicará cómo revisar avances y responder solicitudes de soporte.',
      type: 'infografia',
      infogData: [
        { title: 'Estado del ticket', desc: 'Verifica si está recibido, en gestión, pendiente de información o cerrado.' },
        { title: 'Respuesta oportuna', desc: 'Contesta las solicitudes de información para evitar pausas en el trámite.' }
      ],
      accentColor: '#FF9500', extraTip: 'Conserva el número de radicado para cualquier consulta posterior.',
      coordinateX: 30, coordinateY: 40
    },
    {
      id: 'cami-4', number: 4,
      title: 'Homologaciones', subtitle: 'Gestión académica',
      description: 'Contenido pendiente para el punto 4. Espacio para explicar solicitudes relacionadas con homologación de asignaturas.',
      type: 'infografia',
      infogData: [
        { title: 'Soportes', desc: 'Ten a la mano certificados, contenidos programáticos y documentos requeridos.' },
        { title: 'Revisión', desc: 'El caso puede requerir validación académica antes de su cierre.' }
      ],
      accentColor: '#FF2D55', extraTip: 'Adjunta documentos completos y legibles.',
      coordinateX: 42, coordinateY: 65
    },
    {
      id: 'cami-5', number: 5,
      title: 'Pagos y caja', subtitle: 'Soporte financiero',
      description: 'Contenido pendiente para el punto 5. Aquí se documentarán dudas frecuentes sobre pagos, recibos y estado financiero.',
      type: 'infografia',
      infogData: [
        { title: 'Consulta', desc: 'Revisa número de recibo, referencia de pago y fecha de transacción.' },
        { title: 'Evidencia', desc: 'Adjunta comprobante si el pago no se ve reflejado.' }
      ],
      accentColor: '#5856D6', extraTip: 'Verifica que el comprobante tenga fecha, valor y referencia.',
      coordinateX: 54, coordinateY: 45
    },
    {
      id: 'cami-6', number: 6,
      title: 'Acceso a plataformas', subtitle: 'Credenciales y sistemas',
      description: 'Contenido pendiente para el punto 6. Punto dedicado a problemas con correo, aula virtual, SINU u otros accesos.',
      type: 'infografia',
      infogData: [
        { title: 'Validación', desc: 'Confirma usuario, correo institucional y mensaje de error.' },
        { title: 'Seguridad', desc: 'No compartas contraseñas; solicita restablecimiento por los canales oficiales.' }
      ],
      accentColor: '#007AFF', extraTip: 'Incluye captura del error para acelerar el diagnóstico.',
      coordinateX: 66, coordinateY: 60
    },
    {
      id: 'cami-7', number: 7,
      title: 'Escalamiento', subtitle: 'Casos especiales',
      description: 'Contenido pendiente para el punto 7. Aquí se explicará cuándo un caso debe pasar a otra dependencia.',
      type: 'infografia',
      infogData: [
        { title: 'Criterio', desc: 'Un caso puede escalarse cuando requiere aprobación o revisión especializada.' },
        { title: 'Trazabilidad', desc: 'El número de ticket conserva el historial de la solicitud.' }
      ],
      accentColor: '#AF52DE', extraTip: 'Evita crear tickets duplicados para el mismo caso.',
      coordinateX: 76, coordinateY: 40
    },
    {
      id: 'cami-8', number: 8,
      title: 'Cierre del ticket', subtitle: 'Confirmación de solución',
      description: 'Contenido pendiente para el punto 8. Espacio para explicar cómo confirmar solución y cerrar solicitudes.',
      type: 'infografia',
      infogData: [
        { title: 'Revisión final', desc: 'Comprueba que la respuesta solucione el caso antes de cerrar.' },
        { title: 'Retroalimentación', desc: 'Registra observaciones si la solución no fue suficiente.' }
      ],
      accentColor: '#FFCC00', extraTip: 'Cierra el ciclo cuando tu solicitud haya quedado resuelta.',
      coordinateX: 86, coordinateY: 65
    },
    {
      id: 'cami-9', number: 9,
      title: 'Buenas prácticas', subtitle: 'Guía rápida de soporte',
      description: 'Contenido pendiente para el punto 9. Recomendaciones generales para usar correctamente Soporte Cami.',
      type: 'infografia',
      infogData: [
        { title: 'Claridad', desc: 'Resume el problema, indica qué intentaste y qué resultado esperas.' },
        { title: 'Un solo canal', desc: 'Usa un mismo ticket para conservar contexto y evitar duplicidad.' }
      ],
      accentColor: '#00E5FF', extraTip: 'Un buen reporte ayuda a resolver mejor y más rápido.',
      coordinateX: 95, coordinateY: 35
    }
  ];

  // 9 estaciones para Parche Virtual
  const parcheVirtualStations: Station[] = [
    {
      id: 'parche-1', number: 1,
      title: 'Bienvenida al Parche Virtual', subtitle: 'Inicio de comunidad',
      description: 'Contenido pendiente para el punto 1. Presentación general de la comunidad virtual CUN.',
      type: 'infografia',
      infogData: [
        { title: 'Propósito', desc: 'Conectar estudiantes nuevos con espacios de acompañamiento y socialización.' },
        { title: 'Estado', desc: 'Contenido placeholder listo para reemplazar.' }
      ],
      accentColor: '#9BFF00', extraTip: 'Participa con respeto y actitud colaborativa.',
      coordinateX: 10, coordinateY: 70
    },
    {
      id: 'parche-2', number: 2,
      title: 'Canales oficiales', subtitle: 'Comunicación de comunidad',
      description: 'Contenido pendiente para el punto 2. Aquí se listarán canales oficiales y normas de uso.',
      type: 'infografia',
      infogData: [
        { title: 'Canales', desc: 'Espacios informativos para avisos, actividades y convocatorias.' },
        { title: 'Cuidado', desc: 'Verifica que los enlaces sean oficiales antes de compartir datos.' }
      ],
      accentColor: '#35B84A', extraTip: 'Guarda los canales oficiales para no perder comunicaciones importantes.',
      coordinateX: 20, coordinateY: 40
    },
    {
      id: 'parche-3', number: 3,
      title: 'Presentación personal', subtitle: 'Primer contacto social',
      description: 'Contenido pendiente para el punto 3. Guía para presentarte y conectar con otros estudiantes.',
      type: 'infografia',
      infogData: [
        { title: 'Perfil', desc: 'Comparte carrera, modalidad, intereses y expectativas.' },
        { title: 'Conexión', desc: 'Busca compañeros con intereses académicos o personales similares.' }
      ],
      accentColor: '#FF9500', extraTip: 'Una buena presentación ayuda a crear red desde el primer día.',
      coordinateX: 30, coordinateY: 65
    },
    {
      id: 'parche-4', number: 4,
      title: 'Grupos por carrera', subtitle: 'Comunidades académicas',
      description: 'Contenido pendiente para el punto 4. Espacio para explicar grupos por programa o facultad.',
      type: 'infografia',
      infogData: [
        { title: 'Ubicación', desc: 'Encuentra comunidades relacionadas con tu programa académico.' },
        { title: 'Participación', desc: 'Haz preguntas, comparte recursos y respeta las reglas del grupo.' }
      ],
      accentColor: '#FF2D55', extraTip: 'Los grupos por carrera son útiles para resolver dudas rápidas.',
      coordinateX: 42, coordinateY: 35
    },
    {
      id: 'parche-5', number: 5,
      title: 'Retos y dinámicas', subtitle: 'Activaciones virtuales',
      description: 'Contenido pendiente para el punto 5. Aquí se describirán retos, trivias y actividades de integración.',
      type: 'infografia',
      infogData: [
        { title: 'Dinámicas', desc: 'Actividades diseñadas para romper el hielo y participar en comunidad.' },
        { title: 'Reconocimiento', desc: 'Algunos retos pueden entregar insignias, menciones o incentivos.' }
      ],
      accentColor: '#5856D6', extraTip: 'Participar te ayuda a conocer personas y recursos útiles.',
      coordinateX: 54, coordinateY: 60
    },
    {
      id: 'parche-6', number: 6,
      title: 'Mentores y aliados', subtitle: 'Acompañamiento entre pares',
      description: 'Contenido pendiente para el punto 6. Explicación de referentes, monitores o compañeros guía.',
      type: 'infografia',
      infogData: [
        { title: 'Apoyo', desc: 'Identifica personas que puedan orientar tus primeras semanas.' },
        { title: 'Alcance', desc: 'Los mentores acompañan, pero no reemplazan canales oficiales.' }
      ],
      accentColor: '#007AFF', extraTip: 'Pregunta a tiempo; no esperes a que la duda crezca.',
      coordinateX: 66, coordinateY: 30
    },
    {
      id: 'parche-7', number: 7,
      title: 'Eventos en vivo', subtitle: 'Encuentros digitales',
      description: 'Contenido pendiente para el punto 7. Programación de lives, charlas y espacios sincrónicos.',
      type: 'infografia',
      infogData: [
        { title: 'Agenda', desc: 'Consulta horarios, enlaces y temas de cada encuentro.' },
        { title: 'Participación', desc: 'Llega con preguntas y aprovecha los espacios en vivo.' }
      ],
      accentColor: '#AF52DE', extraTip: 'Agrega los encuentros importantes a tu calendario.',
      coordinateX: 76, coordinateY: 60
    },
    {
      id: 'parche-8', number: 8,
      title: 'Recursos compartidos', subtitle: 'Biblioteca del parche',
      description: 'Contenido pendiente para el punto 8. Espacio para alojar guías, enlaces y materiales de apoyo.',
      type: 'infografia',
      infogData: [
        { title: 'Materiales', desc: 'Guías de inicio, enlaces frecuentes y recomendaciones de estudio.' },
        { title: 'Actualización', desc: 'Mantén los recursos revisados y vigentes.' }
      ],
      accentColor: '#FFCC00', extraTip: 'Comparte recursos útiles y evita información no verificada.',
      coordinateX: 86, coordinateY: 45
    },
    {
      id: 'parche-9', number: 9,
      title: 'Cierre de integración', subtitle: 'Siguiente paso',
      description: 'Contenido pendiente para el punto 9. Cierre de la ruta del Parche Virtual y próximos pasos.',
      type: 'infografia',
      infogData: [
        { title: 'Resumen', desc: 'Repasa canales, grupos, eventos y recursos clave.' },
        { title: 'Continuidad', desc: 'Mantente activo en los espacios que aporten a tu proceso.' }
      ],
      accentColor: '#00E5FF', extraTip: 'La comunidad se construye con participación constante.',
      coordinateX: 95, coordinateY: 70
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

  const getStationsForTab = (tab: HubTab) => {
    if (tab === 'cun360') return cun360Stations;
    if (tab === 'cdigital') return cdigitalStations;
    if (tab === 'soporteCami') return camiticketStations;
    if (tab === 'virtual') return parcheVirtualStations;
    return cdigitalStations;
  };

  const handleOpenStation = (station: Station) => {
    const activeTrack = getStationsForTab(activeTab);
    const currentIdx = activeTrack.findIndex((s) => s.id === station.id);
    const sequentialUnlock = hubTabUsesSequentialUnlock(activeTab);

    if (sequentialUnlock && currentIdx > 0) {
      const precedingStation = activeTrack[currentIdx - 1];
      const isPrecedingCompleted = completedStations.includes(precedingStation.id);

      if (!isPrecedingCompleted) {
        setStationLockWarning({
          stationName: station.title,
          previousStationName: precedingStation.title,
          stationNumber: station.number,
        });
        return;
      }
    }

    setActivePdfPage(0);
    setActivePopupStation(station);

    setCompletedStations((prev) => {
      if (prev.includes(station.id)) {
        return prev;
      }

      const next = [...prev, station.id];
      const variant = hubTabToRoadmapVariant(activeTab);

      if (variant) {
        saveCompletedStationIdsForVariant(
          variant,
          filterCompletedStationIdsForVariant(variant, next),
        );
      }

      return next;
    });
  };

  const currentTrackStations = getStationsForTab(activeTab);
  const isRouteMapTab = activeTab === 'cun360' || activeTab === 'cdigital' || activeTab === 'soporteCami' || activeTab === 'virtual';
  const shouldShowRouteLocks = hubTabUsesSequentialUnlock(activeTab);
  const roadmapVariant = hubTabToRoadmapVariant(activeTab);
  const routeMapTitle =
    activeTab === 'cun360'
      ? 'RECORRIDO CAMPUS FÍSICO BOGOTÁ'
      : activeTab === 'cdigital'
        ? 'INDUCCIÓN DE HERRAMIENTAS DIGITALES'
        : activeTab === 'soporteCami'
          ? 'RUTA DE SOPORTE CAMI'
          : 'RUTA PARCHE VIRTUAL';
  const routeProgressCompleted = roadmapVariant
    ? filterCompletedStationIdsForVariant(roadmapVariant, completedStations).length
    : 0;
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

  // Folder design Tabs Definition
  const tabsList: Array<{ id: HubTab; label: string; icon: typeof Compass; isLockedOption: boolean }> = [
    { id: 'recorrido360', label: 'Tour 360', icon: Compass, isLockedOption: false },
    { id: 'cun360', label: 'CUN 360', icon: Building, isLockedOption: false },
    { id: 'cdigital', label: 'CDigital', icon: Monitor, isLockedOption: false },
    { id: 'soporteCami', label: 'Soporte Cami', icon: LifeBuoy, isLockedOption: true },
    { id: 'virtual', label: 'Parche Virtual', icon: Users, isLockedOption: true },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar, isLockedOption: false },

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
  const isLockedModule = activeTab === 'bienestarLocked';
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
    soporteCami: {
      chapter: 'Capítulo 5',
      mission: 'Aprende a resolver tus trámites',
      title: 'Ruta de soporte con Cami',
      description: 'Conoce cómo pedir ayuda, radicar solicitudes y resolver tus trámites con el acompañamiento de Cami.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Sabrás resolver cualquier trámite sin complicaciones.',
      ctaLabel: 'Continuar ruta',
      guide: 'Te muestro cómo resolver tus trámites paso a paso.',
    },
    virtual: {
      chapter: 'Capítulo 6',
      mission: 'Conecta con tu parche',
      title: 'Ruta del Parche Virtual',
      description: 'Descubre los espacios y canales para conectar con otros estudiantes y vivir la comunidad CUN en línea.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Harás parte de una comunidad que te acompaña.',
      ctaLabel: 'Continuar ruta',
      guide: 'Aquí conocerás a tu parche y la comunidad CUN.',
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

      {/* MODULE SELECTOR — chips tipo consola tecnológica (solo visual) */}
      <div className="hub-tabs-wrapper w-full min-w-0 max-w-full shrink-0">
        <div className="hub-tabs flex bg-transparent overflow-x-auto max-w-full scrollbar-none select-none z-10 mb-3 items-stretch px-0.5 sm:px-1 py-1 shrink-0 gap-2 sm:gap-2.5">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`hub-tab focus-ring-soft group relative flex items-center gap-2.5 rounded-[14px] border px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer whitespace-nowrap transition-all duration-150 ease-out ${
                isActive
                  ? 'hub-tab-active z-20 -translate-y-0.5 border-brand-green-main bg-white/[0.08] text-white shadow-[0_0_0_1px_rgba(53,184,74,0.3),0_12px_28px_-12px_rgba(53,184,74,0.38),inset_0_1px_0_rgba(255,255,255,0.12)]'
                  : 'z-10 border-white/15 bg-white/[0.03] text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-px hover:border-white/25 hover:bg-white/[0.06] hover:text-text-primary'
              }`}
            >
              <Icon className={`hub-tab__icon w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-colors ${isActive ? 'text-brand-green-neon' : 'text-text-muted group-hover:text-text-secondary'}`} />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wide whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
        </div>
      </div>

      {/* TAB WORKSPACE BOX — Panel/tarjeta para módulos normales; en Tour 360 es un stage sin caja. */}
      <div className={
        isImmersive
          ? 'flex-1 relative flex flex-col min-h-0 p-1.5 sm:p-2.5'
          : 'flex-1 bg-surface-panel border border-border-subtle rounded-3xl relative overflow-hidden flex flex-col p-3 sm:p-5 shadow-panel backdrop-blur-xl min-h-0'
      }>
        {!isImmersive && (
          <div className="hud-layer pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(53,184,74,0.10),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_44%)]" />
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

          {/* ROUTE MAP TABS: CUN 360 / CDIGITAL / SOPORTE CAMI / PARCHE VIRTUAL */}
          {isRouteMapTab && roadmapVariant && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full min-h-0 flex flex-col overflow-hidden"
            >
              <RoadmapView
                variant={roadmapVariant}
                title={routeMapTitle}
                stations={currentTrackStations}
                completedStationIds={completedStations}
                shouldShowRouteLocks={shouldShowRouteLocks}
                progressCompleted={routeProgressCompleted}
                progressTotal={9}
                onOpenStation={handleOpenStation}
                onStartFirstStation={() => handleOpenStation(currentTrackStations[0])}
              />
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
          {activeTab === 'bienestarLocked' && (
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

              <h2 className="text-lg sm:text-2xl font-display font-black text-white uppercase tracking-tight leading-tight mb-2">
                BIENESTAR Y SALUD INTEGRAL
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold mb-6">
                Descubre actividades extraescolares gratis, torneos deportivos en Bogotá, clases de danza, orientación sicológica y convenios médicos organizados por la CUN.
              </p>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-[#1b233a] text-xs text-slate-300 flex items-center gap-2 max-w-sm text-left shadow-lg italic">
                <Clock className="w-4 h-4 text-brand-green-main shrink-0" />
                <span>{activeNarrative.guide}</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      <HudGlassModal
        isOpen={Boolean(stationLockWarning)}
        onClose={() => setStationLockWarning(null)}
        variant="amber"
        size="sm"
        zIndex="warning"
        title={
          <span className="inline-flex items-center gap-2.5">
            <Lock className="h-5 w-5 text-amber-300" />
            Estación no desbloqueada
          </span>
        }
        meta="Ruta secuencial CUN 360"
        footer={
          <button
            onClick={() => setStationLockWarning(null)}
            className="w-full rounded-xl border-none bg-amber-400 py-2.5 font-mono text-xs font-black uppercase text-black transition-all cursor-pointer hover:bg-white active:scale-95"
          >
            Entendido, completaré la ruta en orden
          </button>
        }
      >
        {stationLockWarning && (
          <div className="space-y-4 text-left">
            <p className="text-xs leading-relaxed font-semibold text-slate-100">
              No puedes saltar a la <span className="font-black text-[#9BFF00]">Estación {stationLockWarning.stationNumber}: {stationLockWarning.stationName}</span> sin haber visto los contenidos de la estación anterior de tu ruta oficial:
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-amber-300/15 bg-black/35 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-xs font-mono font-black text-amber-300">
                {stationLockWarning.stationNumber - 1}
              </div>
              <div className="text-left">
                <p className="text-[9px] font-mono uppercase leading-none text-slate-400">Debes completar primero</p>
                <p className="mt-1 text-xs font-extrabold text-white">{stationLockWarning.previousStationName}</p>
              </div>
            </div>

            <p className="text-[10px] font-mono italic leading-normal text-slate-300">
              En la CUN fomentamos el aprendizaje estructurado. Visualiza las estaciones secuencialmente para consolidar tu onboarding.
            </p>
          </div>
        )}
      </HudGlassModal>

      <HudGlassModal
        isOpen={Boolean(activePopupStation)}
        onClose={() => setActivePopupStation(null)}
        panelClassName="hud-glass-modal__panel--roadmap"
        size={
          activePopupStation?.type === 'drive-video' ||
          activePopupStation?.type === 'drive-image' ||
          activePopupStation?.type === 'drive-pdf'
            ? 'lg'
            : 'md'
        }
        title={activePopupStation?.hideContentTitle ? undefined : activePopupStation?.title}
        meta={
          activePopupStation
            ? `Estación ${activePopupStation.number} / Inducción activa`
            : undefined
        }
        bodyClassName="space-y-3"
        footer={
          activePopupStation ? (
            <button
              onClick={() => setActivePopupStation(null)}
              className="w-full rounded-xl border-none bg-[#9BFF00] py-3 font-mono text-xs font-black uppercase text-black transition-all cursor-pointer hover:bg-white"
            >
              Completar y volver a la ruta
            </button>
          ) : undefined
        }
      >
        {activePopupStation && (
          <>
            <div className="hud-glass-modal__media">
                {activePopupStation.type === 'video' && (
                  <div className="hud-glass-modal__media-video">
                    <iframe
                      src={activePopupStation.videoUrl}
                      title={activePopupStation.title}
                      className="hud-glass-modal__iframe"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {activePopupStation.type === 'drive-video' && activePopupStation.driveVideoPreviewUrl && (
                  <iframe
                    src={activePopupStation.driveVideoPreviewUrl}
                    title={activePopupStation.title}
                    className="hud-glass-modal__iframe"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                )}

                {activePopupStation.type === 'drive-image' && activePopupStation.driveImageUrl && (
                  <>
                    <img
                      src={activePopupStation.driveImageUrl}
                      alt={activePopupStation.title}
                      className="hud-glass-modal__image"
                      onError={(event) => {
                        event.currentTarget.classList.add('hidden');
                        event.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {activePopupStation.driveImagePreviewUrl && (
                      <iframe
                        src={activePopupStation.driveImagePreviewUrl}
                        title={activePopupStation.title}
                        className="hidden hud-glass-modal__iframe"
                        allow="autoplay"
                      />
                    )}
                  </>
                )}

                {activePopupStation.type === 'drive-pdf' && activePopupStation.drivePdfPreviewUrl && (
                  <iframe
                    src={activePopupStation.drivePdfPreviewUrl}
                    title={activePopupStation.title}
                    className="hud-glass-modal__iframe hud-glass-modal__iframe--document"
                    allow="autoplay"
                  />
                )}

                {activePopupStation.type === 'pdf' && activePopupStation.pdfPages && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase pb-1.5 border-b border-white/5">
                      <span>DOCUMENTO: {activePopupStation.pdfTitle}</span>
                      <span>PÁG {activePdfPage + 1} DE {activePopupStation.pdfPages.length}</span>
                    </div>

                    <div className="bg-slate-950/80 rounded-lg p-3 text-xs text-slate-100 font-sans leading-relaxed min-h-[100px] border-l-2 border-[#9BFF00]">
                      <div className="font-semibold">{activePopupStation.pdfPages[activePdfPage]}</div>
                    </div>

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

                {activePopupStation.type === 'infografia' && activePopupStation.infogData && (
                  <div className="space-y-2.5">
                    {activePopupStation.infogData.map((info, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 border border-white/5 rounded-lg text-left">
                        <h4 className="text-xs text-[#9BFF00] font-mono uppercase font-black">{info.title}</h4>
                        <p className="text-[11px] text-zinc-200 mt-0.5 leading-relaxed font-semibold">{info.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </>
        )}
      </HudGlassModal>

    </div>
  );
};
