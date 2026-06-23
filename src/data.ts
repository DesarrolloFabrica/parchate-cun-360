import { OnboardingConfig, TutorialShort, PlatformFeature, CalendarEvent, CampusHotspot } from './types';

export const onboardingConfig: OnboardingConfig = {
  institutionName: "CUN",
  portalTitle: "ON-BOARDING CUN",
  portalSubtitle: "Párchate CUN • Tu experiencia universitaria Interactiva",
  powerBiEmbedUrl: "https://app.powerbi.com/view?r=eyJrIjoiOGM1ZGViY2MtZmVlOS00NDQ5LWI4NWEtODYxMWFmNjRlYmI4IiwidCI6IjUyMDlhOGNhLTc1ZGQtNGVhMy05MDc0LTZjMDAwMzMzMzQ4YiIsImMiOjR9",
  defaultTour360Url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1600&q=80" // High quality panorama
};

// Quick platform shorts for Home Screen (Cdigital, SINU, CamiTicket)
export interface HomeToolShort {
  id: string;
  title: string;
  tagline: string;
  videoUrl: string;
  duration: string;
  iconName: string;
  description: string;
  steps: string[];
}

export const homeToolShorts: HomeToolShort[] = [
  {
    id: "cdigital",
    title: "CDigital",
    tagline: "Tu aula virtual principal",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:05 min",
    iconName: "Monitor",
    description: "Es el aula de aprendizaje donde asistes a tus clases virtuales, descargas la guía de estudio del docente y participas con tus compañeros.",
    steps: ["Accede con tu correo @cun.edu.co", "Ubica tus materias matriculadas", "Consulta el primer entregable / ACA"]
  },
  {
    id: "sinu",
    title: "SINU",
    tagline: "Sistema Académico Administrativo",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:18 min",
    iconName: "FileText",
    description: "La plataforma de gestión oficial. Aquí registras tus materias del ciclo, generas recibos de matrícula y consultas tu sábana de notas oficial.",
    steps: ["Inicia sesión con tu carnet/cédula", "Revisa tu horario del periodo", "Descarga tu sábana de calificaciones finales"]
  },
  {
    id: "camiticket",
    title: "CamiTicket",
    tagline: "Centro de Soluciones y Soporte",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "0:52 min",
    iconName: "LifeBuoy",
    description: "Nuestra mesa de ayuda institucional. Si tienes inconvenientes técnicos, financieros o académicos, abre un ticket para atención prioritaria.",
    steps: ["Ingresa a la sección de soporte", "Escribe tu caso de forma clara con anexos", "Haz seguimiento en menos de 24 horas"]
  }
];

export const virtualTutorials: TutorialShort[] = [
  {
    id: "v1",
    title: "Primeros Pasos",
    duration: "1:24 min",
    description: "Cómo ingresar por primera vez a la plataforma virtual y recuperar tu contraseña institucional sin complicaciones.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "blue",
    iconName: "Compass"
  },
  {
    id: "v2",
    title: "Mi Perfil Académico",
    duration: "0:58 min",
    description: "Aprende a configurar tus datos, subir tu foto estudiantil y activar las notificaciones vía WhatsApp y Correo.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "blue",
    iconName: "User"
  },
  {
    id: "v3",
    title: "Mis Cursos en el Aula",
    duration: "1:45 min",
    description: "Navegación general por el campus digital, descarga de material de apoyo y participación en videoconferencias.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "blue",
    iconName: "BookOpen"
  },
  {
    id: "v4",
    title: "Presentación de Actividades",
    duration: "1:12 min",
    description: "Aprende el proceso correcto para subir tus talleres ACA, solucionar cuestionarios en línea y confirmar envíos.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "blue",
    iconName: "FileSpreadsheet"
  }
];

export const presencialTutorials: TutorialShort[] = [
  {
    id: "p1",
    title: "Bienvenida al Campus",
    duration: "1:30 min",
    description: "El rector y líderes académicos te abren las puertas al campus de estudio interactivo y dinámico.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "green",
    iconName: "Sparkles"
  },
  {
    id: "p2",
    title: "Servicios del Estudiante",
    duration: "1:15 min",
    description: "Uso de salas de sistemas, biblioteca física, cafetería estudiantil, auditorios de eventos.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "green",
    iconName: "HandHelping"
  },
  {
    id: "p3",
    title: "Carnetización Virtual",
    duration: "1:02 min",
    description: "Cómo descargar tu credencial digital CUN en tu teléfono celular para ingresar ágilmente.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "green",
    iconName: "ShieldAlert"
  },
  {
    id: "p4",
    title: "Vida Universitaria",
    duration: "1:40 min",
    description: "Descubre talleres deportivos, muestras folclóricas, agrupaciones musicales y de bienestar estudiantil.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "green",
    iconName: "Laugh"
  }
];

export const platformFeatures: PlatformFeature[] = [
  {
    id: "f1",
    title: "Tus cursos",
    description: "Listado completo de asignaturas matriculadas durante el periodo académico vigente.",
    iconName: "BookOpen",
    details: ["Código de asignatura", "Horas semanales", "Grupo asignado", "Nombre del docente"]
  },
  {
    id: "f2",
    title: "Contenidos",
    description: "Materiales multimedia estructurados por semanas para guiar tu proceso educativo autónomo.",
    iconName: "FolderKanban",
    details: ["Lecturas PDF", "Videos explicativos", "Infografías de resumen", "Bibliografía externa"]
  },
  {
    id: "f3",
    title: "Actividades",
    description: "Espacios interactivos de evaluación diseñados para consolidar tus competencias teóricas.",
    iconName: "CheckSquare",
    details: ["Cuestionarios interactivos", "Foros de debate obligatorio", "Talleres grupales", "Proyectos de aula"]
  }
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Bienvenida Institucional en Vivo",
    date: "2026-06-15",
    time: "09:00 AM",
    type: "activity",
    category: "General",
    description: "Evento central donde rectores y directores académicos te dan la bienvenida a tu nueva casa.",
    important: true
  },
  {
    id: "e2",
    title: "Primer Entregable Académico (ACA 1)",
    date: "2026-06-18",
    time: "11:59 PM",
    type: "delivery",
    category: "General",
    description: "Fecha límite para cargar el primer avance del proyecto integrador en el aula virtual.",
    important: true
  },
  {
    id: "e3",
    title: "Taller Cero: Manejo de Microsoft Teams",
    date: "2026-06-22",
    time: "06:00 PM",
    type: "activity",
    category: "Virtual",
    description: "Aprende cómo conectarte a las tutorías y clases virtuales por Teams con tu correo institucional.",
    important: true
  },
  {
    id: "e4",
    title: "Cargar Foto para el Carnet Físico",
    date: "2026-06-25",
    time: "05:00 PM",
    type: "pending",
    category: "Presencial",
    description: "Imprescindible subir tu autofoto con fondo blanco en tu portal SINU para procesar la credencial.",
    important: true
  }
];

export const campusHotspots: CampusHotspot[] = [
  {
    id: "h1",
    name: "Entrada principal",
    description: "Tu puerta de entrada a un universo de saberes y experiencias. Puestos de control cómodos.",
    x: 18,
    y: 65,
    imageUri: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
    amenities: ["Tornos de control inteligente facial", "Oficinas de Matrícula y Admisiones", "Señalización de bloques académicos"]
  },
  {
    id: "h2",
    name: "Biblioteca General",
    description: "Ambiente moderno de estudio con miles de libros físicos y acceso digital ilimitado.",
    x: 35,
    y: 40,
    imageUri: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
    amenities: ["Salas de co-working académico", "Préstamo ágil de portátiles", "Repositorios científicos"]
  },
  {
    id: "h3",
    name: "Aulas Interactivos",
    description: "Salones equipados con videoproyectores de alta gama y mobiliario de confort modular.",
    x: 52,
    y: 55,
    imageUri: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    amenities: ["Sillas ergonómicas ajustables", "Conectores eléctricos por módulo", "Wifi de fibra óptica dedicado"]
  },
  {
    id: "h4",
    name: "Zonas Deportivas y Wellness",
    description: "Área de acondicionamiento físico, deportes y esparcimiento saludable.",
    x: 65,
    y: 35,
    imageUri: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    amenities: ["Mesas de tenis y futbolito", "Oficina de orientación psicopedagógica", "Consultorio médico de bienestar"]
  }
];

// Rich interactive materials for the new "Ecosistema CUN" Tab section in VIRTUAL
export interface CunInteractiveMaterial {
  title: string;
  category: "Revistas" | "Fichas" | "FunCUN" | "Glosario" | "Documentos";
  description: string;
  iconName: string;
  interactiveAttributes: string[];
  visualPreset: string; // Describes layout pattern to draw beautiful custom lineart widgets
  downloadableName?: string;
}

export const virtualMaterials: CunInteractiveMaterial[] = [
  // CUN Revistas
  {
    title: "Revista Conexión CUN",
    category: "Revistas",
    description: "Publicación cultural y científica semestral de la comunidad CUNista. Diseños, proyectos estudiantiles y artículos de opinión.",
    iconName: "Newspaper",
    interactiveAttributes: ["Última Edición Junio 2026", "Más de 45 artículos seleccionados", "Formato digital descargable PDF y FlipBook"],
    visualPreset: "magazine_red"
  },
  {
    title: "Revista INNOVA-TECH",
    category: "Revistas",
    description: "Saber investigativo e innovación en ingeniería, diseño y emprendimiento aplicado de base tecnológica.",
    iconName: "Cpu",
    interactiveAttributes: ["Especial Inteligencia Artificial", "Proyectos destacados de semilleros", "Enlace a biblioteca virtual"],
    visualPreset: "magazine_blue"
  },
  // Fichas
  {
    title: "Ficha Académica de Asignatura",
    category: "Fichas",
    description: "Resumen didáctico para organizar tu tiempo. Detalla las semanas de estudio, entregables obligatorios y rúbricas.",
    iconName: "FileSpreadsheet",
    interactiveAttributes: ["Estructura de Tres Cortes", "Fechas límites de ACA 1, 2 y 3", "Porcentajes de evaluación (30%, 30%, 40%)"],
    visualPreset: "card_blue"
  },
  {
    title: "Ficha de Ruta Tutorial",
    category: "Fichas",
    description: "Infografía de autogestión. Explica paso a paso el ciclo de tutorías sincrónicas semanales de libre acceso.",
    iconName: "Navigation",
    interactiveAttributes: ["Horarios fijos rotativos", "Enlace directo Teams", "Grabación disponible en Office 365"],
    visualPreset: "card_green"
  },
  // FunCUN
  {
    title: "Módulo Cátedra CUNista",
    category: "FunCUN",
    description: "Nuestra unidad de valores y diversión institucional. Aprende la historia CUN de manera gamificada con retos interactivos.",
    iconName: "Gamepad2",
    interactiveAttributes: ["Trivia de historia corporativa", "Medallas virtuales acumulables", "100% interactivo en tu aula"],
    visualPreset: "game_gold"
  },
  {
    title: "FunCUN: Emprendedores de Acero",
    category: "FunCUN",
    description: "Retos de ideación de negocios. Diseña un prototipo mínimo viable con herramientas de mentoría ágil.",
    iconName: "Lightbulb",
    interactiveAttributes: ["Metodología Lean Startup", "Pitch de 1 minuto simulador", "Inscripción a feria CUNbre"],
    visualPreset: "game_emerald"
  },
  // Glosario
  {
    title: "Términos CUNistas indispensables",
    category: "Glosario",
    description: "Vocabulario académico y argot de la institución para que te comuniques como un CUNista pro desde el primer día.",
    iconName: "BookOpen",
    interactiveAttributes: ["ACA: Proyecto de Evaluación Continua", "SINU: Portal Oficial de Trámites", "Corte: Período de notas de cada materia"],
    visualPreset: "glossary_slate"
  },
  // Documentos
  {
    title: "Reglamento Estudiantil Oficial",
    category: "Documentos",
    description: "Tus derechos, deberes, políticas de permanencia y reglamentos para becas de excelencia académica.",
    iconName: "Scale",
    interactiveAttributes: ["Derechos y Deberes explicados", "Proceso de solicitudes académicas", "Condiciones para homologar"],
    downloadableName: "reglamento_estudiantil_cun.pdf",
    visualPreset: "doc_red"
  },
  {
    title: "Guía de Alivios y Becas",
    category: "Documentos",
    description: "Instrucciones detalladas para postularte a las convocatorias de descuento o becas de monitor académico.",
    iconName: "BadgeCent",
    interactiveAttributes: ["Beca Excelencia (Promedio > 4.5)", "Descuento por convenio institucional", "Apoyo socioeconómico Bienestar"],
    downloadableName: "guia_alivios_financieros.pdf",
    visualPreset: "doc_teal"
  }
];
