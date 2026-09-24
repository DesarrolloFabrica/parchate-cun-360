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
import { TourMapSelector } from './TourMapSelector';
import { ColombiaMapSvg } from './ColombiaMapSvg';
import { HudGlassModal } from './HudGlassModal';
import { RoadmapView } from './RoadmapView';
import { getTour360ConfigById, tourLocations, type Tour360Campus } from '../data/tour360Locations';
import { getMapCityPins } from '../data/sedes';
import { SedeUnavailableFallback } from './SedeUnavailableFallback';
import { hubTabToRoadmapVariant, hubTabUsesSequentialUnlock, loadAllRoadmapCompletedStationIds, filterCompletedStationIdsForVariant, saveCompletedStationIdsForVariant } from '../types/roadmap';
import { useActiveSede } from '../hooks/useActiveSede';
import { tour360Nodes } from '../data/tour360Nodes';
import EarthAnimation from '../assets/lottie/Earth.json';
import '../styles/hub-tabs.css';

type StationType = 'video' | 'pdf' | 'infografia' | 'drive-video' | 'drive-image' | 'drive-pdf' | 'drive-pdf-audio';

interface DriveImageSlide {
  title?: string;
  driveImageUrl?: string;
  driveImagePreviewUrl?: string;
  alt?: string;
}

interface DriveDocumentSlide {
  title?: string;
  drivePdfPreviewUrl: string;
  alt?: string;
}

const stationUsesIframeLayout = (type: StationType): boolean =>
  type === 'video' ||
  type === 'drive-video' ||
  type === 'drive-image' ||
  type === 'drive-pdf' ||
  type === 'drive-pdf-audio';

const isRoadmapDriveImageStation = (station: Station | null | undefined): boolean =>
  station?.type === 'drive-image' ||
  Boolean(station?.driveImageUrl || station?.driveImagePreviewUrl);

const isRoadmapDriveVideoStation = (station: Station | null | undefined): boolean =>
  station?.type === 'drive-video' ||
  Boolean(station?.driveVideoPreviewUrl);

const getRoadmapPanelClassName = (station: Station | null | undefined): string =>
  [
    'hud-glass-modal__panel--roadmap',
    isRoadmapDriveImageStation(station) ? 'hud-glass-modal__panel--roadmap-drive-image' : '',
    isRoadmapDriveVideoStation(station) ? 'hud-glass-modal__panel--roadmap-drive-video' : '',
  ]
    .filter(Boolean)
    .join(' ');

interface Station {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  type: StationType;
  // LEGACY: campos locales mantenidos como fallback temporal fuera del roadmap Drive.
  videoUrl?: string;
  pdfPages?: string[];
  pdfTitle?: string;
  infogData?: { title: string; desc: string }[];
  driveVideoPreviewUrl?: string;
  driveImageUrl?: string;
  driveImagePreviewUrl?: string;
  driveImageSlides?: DriveImageSlide[];
  driveDocumentSlides?: DriveDocumentSlide[];
  drivePdfPreviewUrl?: string;
  driveAudioUrl?: string;
  driveAudioPreviewUrl?: string;
  audioTitle?: string;
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

interface HubTabDefinition {
  id: HubTab;
  label: string;
  icon: typeof Compass;
  isLockedOption: boolean;
  drivePublicUrl?: string;
}

interface UnifiedOnboardingHubProps {
}

type Tour360EntryView = 'colombia-map' | 'bogota-sites';

type CalendarSnapshot = {
  day: number;
  month: number;
  year: number;
  daysInMonth: number;
  monthLabel: string;
};

const formatCalendarMonthLabel = (date: Date) => {
  const label = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
};

const toGoogleDrivePublicViewUrl = (url: string): string =>
  url.replace(/\/preview(?:\?.*)?$/, '/view');

const getCurrentCalendarSnapshot = (): CalendarSnapshot => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return {
    day: now.getDate(),
    month,
    year,
    daysInMonth: new Date(year, month + 1, 0).getDate(),
    monthLabel: formatCalendarMonthLabel(now),
  };
};

const AnimatedEarthIcon: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: EarthAnimation as object,
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
const CUN360_POINT_1_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1EUFET7nY21WuybYa6INnEPw-7ja1ul8h/preview';

// Para imágenes de Google Drive:
// usar formato https://drive.google.com/uc?export=view&id=ID_DEL_ARCHIVO
// y verificar que el archivo esté compartido como "Cualquier persona con el enlace puede ver".
const CUN360_POINT_2_DRIVE_IMAGE_PREVIEW_URL = `https://drive.google.com/file/d/1bTR8vK7o4YmvzoisVmRoVUyB2DIf58nc/preview`;

// Para PDFs de Google Drive:
// El archivo debe estar compartido como "Cualquier persona con el enlace puede ver".
// Usar formato:
// https://drive.google.com/file/d/ID_DEL_ARCHIVO/preview
const CUN360_POINT_3_DRIVE_PDF_PREVIEW_URL = 'https://drive.google.com/file/d/1mz1UtwJ_3QrWdbDaHC8xMfRtLDB2zT3-/preview';
const CUN360_POINT_3_DRIVE_AUDIO_PREVIEW_URL = 'https://drive.google.com/file/d/1BMHCxc-1NNr3qPwj3rSSPB5HQ3vFQh5q/preview';

// Estacion 3 CUN 360: PDF de infografia + audio podcast.
// PDF Drive preview: https://drive.google.com/file/d/ID_DEL_ARCHIVO/preview
// Audio MP3 directo: https://drive.google.com/uc?export=download&id=ID_DEL_ARCHIVO
// Ambos archivos deben estar compartidos como "Cualquier persona con el enlace puede ver".
// TODO Fase podcast: reemplazar por URL directa reproducible MP3 si se requiere <audio>.
const CUN360_POINT_3_DRIVE_AUDIO_URL = '';
// TEMP: podcast fallback reutilizado para estaciones drive-pdf hasta tener audios propios.
const ROADMAP_DEFAULT_PODCAST_DRIVE_PREVIEW_URL = CUN360_POINT_3_DRIVE_AUDIO_PREVIEW_URL;

const CUN360_POINT_4_DRIVE_IMAGE_PREVIEW_URL = `https://drive.google.com/file/d/1WlYluPRG40Hp6fsOtHaLulnOMde1Vg90/preview`;
const CUN360_POINT_5_DRIVE_VIDEO_PREVIEW_URL = `https://drive.google.com/file/d/1_1z1ynY7f4xtqDaEOCyp0r1xBLGBWdT4/preview`;

// TODO Fase 5: reemplazar placeholders por URLs preview reales de Google Drive.
const CUN360_POINT_6_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1pVFecnap-AH7hbmysdjC8nms8HxV1E-F/preview';
const CUN360_POINT_3_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1xrBuCl8CzXBRzRA_-WE7Ewu1GdT7J2hu/preview';
const CUN360_POINT_5_UPDATED_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1OW9Ss7JqlEOv0_JaQWGXC5xodHc8Ijht/preview';
const CUN360_POINT_7_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1bRj4cUTP_zwQDlMhj1hmNOqwDc1vIfxP/preview';
const CUN360_POINT_8_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1GuURqHHuEe6vrqb5nFLzFn_ZfrE2QzS_/preview';
const CDIGITAL_POINT_1_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1NSMa6aPK83ehUNre-GT7mT-LmAPwdrug/preview';
const CDIGITAL_POINT_2_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1bnLQwHzPuRQDh0QRebRy6A-gFKTBzYEl/preview';
const CDIGITAL_POINT_3_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1PBTHR789-kUjbziheDOwJK9irDvL1Ixy/preview';
const CDIGITAL_POINT_4_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1DGNCC3njK5Jv94ViOHZ1Te_xi5fP0ARn/preview';
const CDIGITAL_POINT_5_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1unwpiz3NOOAwn1eUJUzf9sBcm3bnVjCn/preview';
const CDIGITAL_POINT_6_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1pVFecnap-AH7hbmysdjC8nms8HxV1E-F/preview';
const CDIGITAL_POINT_7_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/14Eg-aT8pCKfJ9NEUA5cTXb_SAPZpaarF/preview';
const CAMI_POINT_1_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1zwro4i_jGeY-q9vhHMcRGLeuPDnYvTzb/preview';
const CAMI_POINT_2_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1-9Z0HdUBGGKGgl9gHUtZZmZB5WXItsG7/preview';
const CAMI_POINT_3_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1X8VVKYzHUAlpEmZKqT77eCMd8xywbzSn/preview';
const CAMI_POINT_4_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1pwuSzCLdmUXqNqAbb63bhRwFtgbNHfQX/preview';
const CAMI_POINT_5_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1C4XC3zTRuI-y8OQ-qWrvdhuzhhiGBcPO/preview';
const CAMI_POINT_6_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1UldMoFN2WPKkCEBeD3WMpkmSIiRQkTf9/preview';

const PARCHE_POINT_1_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1fB8GR-HHuSESu_CLOpRp_lWE3XfpRkU-/preview';
const PARCHE_POINT_2_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1JpkucJ6pW2Z5i1aXTpZStprg6k4nvySu/preview';
const PARCHE_POINT_3_DRIVE_PDF_PREVIEW_URL = 'https://drive.google.com/file/d/14aFszFMefV7viEKBV-0oK2uGxGh2o5Jd/preview';
const PARCHE_POINT_3_DRIVE_AUDIO_URL = '';
const PARCHE_POINT_3_DRIVE_AUDIO_PREVIEW_URL = 'https://drive.google.com/file/d/102meBF98jMBNCiRpM__9QKygEC_NTgVO/preview';
const PARCHE_POINT_1_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1jYcr6MYG-hnlByqc8_9XpSyrM28IucfC/preview';
const PARCHE_POINT_4_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1lsgL_ryBaVYa_Kk03XzVyETUNjEPJ0OC/preview';
const PARCHE_POINT_5_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1-HdT-Hr-9U8sJ_roBtn8-BUJ2PfKngfl/preview';
const PARCHE_POINT_6_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1QwLCyNyXaCcv4I5qHqFE8FhGEygzFR8m/preview';
const PARCHE_POINT_7_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/14Nw_B4WaR9FJXwYulYw6Q4Hxy-DU42Es/preview';
const PARCHE_POINT_8_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1tW00TlhyfVcDu9dICwYHChSA-2IVxODO/preview';
const PARCHE_POINT_9_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/16PDjWL96RloQkfoCGMFWy1H5cWV3LFJr/preview';

// TODO: reemplazar por URLs preview reales de Google Drive cuando se entregue el contenido definitivo.
const SERVICIO_COMPLEMENTARIO_PLACEHOLDER_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1pVFecnap-AH7hbmysdjC8nms8HxV1E-F/preview';
const PORTAL_PAGOS_INTRO_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1aSYAI7LEY4afAFw2qaC6ZzBS-oD7i9KP/preview';
const PORTAL_PAGOS_INFOGRAFIA_DRIVE_PREVIEW_URL = 'https://drive.google.com/file/d/1j25XXdbT_iWAP86s2RQMjGwjsb6K8e8E/preview';
const SINU_PLACEHOLDER_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1pVFecnap-AH7hbmysdjC8nms8HxV1E-F/preview';
const SINU_POINT_1_DRIVE_VIDEO_PREVIEW_URL = 'https://drive.google.com/file/d/1nuB0IT932-BLqU_XyG4-Z9Gltmdnx0sW/preview';
const SINU_POINT_2_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1j-i-SH9xClMBsnInPP5QbFhPdjKZTGwq/preview';
const SINU_POINT_3_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1BRO8TefKPv5QGPbixuyiPvs99_UVDMfq/preview';
const SINU_POINT_4_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1bn3q-AxamR_GB7fynPFlkoF7IU7f61bg/preview';
const SINU_POINT_5_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1TXZ3dEqeA3fQHvpD4uo35y0et3vKbRhh/preview';
const SINU_POINT_6_DRIVE_IMAGE_PREVIEW_URL = 'https://drive.google.com/file/d/1Kt9eWVWNG5xR3yCutAWh2CTfa57aoqK8/preview';

export const UnifiedOnboardingHub: React.FC<UnifiedOnboardingHubProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeSede } = useActiveSede();

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
  const [activeDriveImageSlideIndex, setActiveDriveImageSlideIndex] = useState(0);
  const [activeDriveDocumentSlideIndex, setActiveDriveDocumentSlideIndex] = useState(0);

  // Active chosen calendar activity day. Starts on the real current date.
  const [calendarToday, setCalendarToday] = useState<CalendarSnapshot>(() =>
    getCurrentCalendarSnapshot(),
  );
  const [selectedDay, setSelectedDay] = useState<number>(() => getCurrentCalendarSnapshot().day);

  // Lock progression alert warning state
  const [stationLockWarning, setStationLockWarning] = useState<{
    stationName: string;
    previousStationName: string;
    stationNumber: number;
  } | null>(null);

  const [tourEntryView, setTourEntryView] = useState<Tour360EntryView>('colombia-map');
  const [selectedTourCityId, setSelectedTourCityId] = useState('bogota');
  const [tourMapMessage, setTourMapMessage] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Tour360Campus | null>(null);

  const activeTourCityIds = new Set(
    tourLocations
      .filter((location) =>
        location.campuses.some((campus) =>
          Boolean(getTour360ConfigById(campus.tourConfigId)?.nodes?.length),
        ),
      )
      .map((location) => location.id),
  );
  const tourMapCities = getMapCityPins().map((city) =>
    activeTourCityIds.has(city.id)
      ? { ...city, status: 'active' as const }
      : city,
  );
  const activeTourConfig = selectedCampus
    ? getTour360ConfigById(selectedCampus.tourConfigId)
    : null;
  const selectedCampusTourAvailable = Boolean(activeTourConfig?.nodes?.length);

  useEffect(() => {
    if (activeTab !== 'recorrido360') {
      setSelectedCampus(null);
      setTourEntryView('colombia-map');
      setSelectedTourCityId('bogota');
      setTourMapMessage(null);
    }
  }, [activeTab]);

  useEffect(() => {
    setActiveDriveImageSlideIndex(0);
    setActiveDriveDocumentSlideIndex(0);
  }, [activePopupStation?.id]);

  useEffect(() => {
    const syncCalendarDate = () => {
      setCalendarToday((previous) => {
        const next = getCurrentCalendarSnapshot();
        const dateChanged =
          previous.day !== next.day ||
          previous.month !== next.month ||
          previous.year !== next.year;

        if (dateChanged) {
          setSelectedDay(next.day);
          return next;
        }

        return previous;
      });
    };

    syncCalendarDate();
    const intervalId = window.setInterval(syncCalendarDate, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleTourCitySelect = (cityId: string) => {
    setSelectedTourCityId(cityId);

    if (cityId === 'bogota') {
      setTourEntryView('bogota-sites');
      setTourMapMessage(null);
      return;
    }

    const tourLocation = tourLocations.find((location) => location.id === cityId);
    const availableCampus = tourLocation?.campuses.find((campus) =>
      Boolean(getTour360ConfigById(campus.tourConfigId)?.nodes?.length),
    );

    if (availableCampus) {
      setSelectedCampus(availableCampus);
      setTourEntryView('colombia-map');
      setTourMapMessage(null);
      return;
    }

    setTourMapMessage('Esta ciudad estará disponible próximamente. Por ahora puedes explorar Bogotá, Sincelejo, Montería, Santa Marta, Neiva o Ibagué.');
  };

  const handleReturnToColombiaMap = () => {
    setSelectedCampus(null);
    setTourEntryView('colombia-map');
    setSelectedTourCityId('bogota');
    setTourMapMessage(null);
  };

  // 9 Stations for CUN 360 (Physical Campus Track)
  const cun360Stations: Station[] = [
    {
      id: 'c360-1', number: 1,
      title: 'Consulta', subtitle: 'Consulta inicial',
      description: 'Visualizador de infografía para iniciar la ruta CUN 360.',
      type: 'drive-image',
      driveImagePreviewUrl: CUN360_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Infografía CUN 360',
          driveImagePreviewUrl: CUN360_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CUN 360 estación 1',
        },
      ],
      accentColor: '#9BFF00', extraTip: 'El carnet digital es obligatorio para ingresar de forma veloz al campus.',
      coordinateX: 8, coordinateY: 68
    },
    {
      id: 'c360-2', number: 2,
      title: 'Financiera - Video de informacion financiera', subtitle: 'Orientación CUN 360',
      description: 'Video de orientación para reconocer la ruta y sus contenidos principales.',
      type: 'drive-video',
      driveVideoPreviewUrl: CUN360_POINT_1_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#35B84A', extraTip: 'Las salas MAC se pueden separar en bloques de hasta 2 horas diarias.',
      coordinateX: 20, coordinateY: 36
    },
    {
      id: 'c360-3', number: 3,
      title: 'Notas - Historico de notas y promedio total', subtitle: 'Video tutorial',
      description: 'Video guía para consultar horarios dentro de CUN 360.',
      type: 'drive-video',
      driveVideoPreviewUrl: CUN360_POINT_3_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#FF9500', coordinateX: 32, coordinateY: 66
    },
    {
      id: 'c360-4', number: 4,
      title: 'Horario 360', subtitle: 'Video',
      description: 'Visualizador de video para consultar Horario 360.',
      type: 'drive-video',
      driveVideoPreviewUrl: CUN360_POINT_3_DRIVE_AUDIO_PREVIEW_URL,
      accentColor: '#FF2D55', extraTip: 'Inscríbete gratis los primeros 10 días hábiles del semestre.',
      coordinateX: 45, coordinateY: 42
    },
    {
      id: 'c360-5', number: 5,
      title: 'Notas y promedio', subtitle: 'Infografía',
      description: 'Visualizador de infografía para consultar notas y promedio.',
      type: 'drive-image',
      driveImagePreviewUrl: CUN360_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Notas y promedio',
          driveImagePreviewUrl: CUN360_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CUN 360 notas y promedio',
        },
      ],
      accentColor: '#5856D6', extraTip: 'Evita perder materias por fallas, tu asistencia cuenta en la nota virtual.',
      coordinateX: 58, coordinateY: 70
    },
    {
      id: 'c360-6', number: 6,
      title: 'Horario - Consulta de horario academico', subtitle: 'Video tutorial',
      description: 'Video guía para consultar información financiera.',
      type: 'drive-video',
      driveVideoPreviewUrl: CUN360_POINT_5_UPDATED_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#007AFF', coordinateX: 68, coordinateY: 36
    },
    {
      id: 'c360-7', number: 7,
      title: 'Panel financiero', subtitle: 'Infografía',
      description: 'Infografía para consultar asignaturas dentro de CUN 360.',
      type: 'drive-image',
      driveImagePreviewUrl: CUN360_POINT_5_DRIVE_VIDEO_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Consulta de asignaturas',
          driveImagePreviewUrl: CUN360_POINT_5_DRIVE_VIDEO_PREVIEW_URL,
          alt: 'Infografía CUN 360 consulta de asignaturas',
        },
      ],
      accentColor: '#AF52DE', extraTip: 'Revisa periódicamente tus novedades académicas.',
      coordinateX: 78, coordinateY: 62
    },
    {
      id: 'c360-8', number: 8,
      title: 'Links de interes', subtitle: 'Video tutorial',
      description: 'Video guía para continuar el seguimiento de procesos académicos.',
      type: 'drive-video',
      driveVideoPreviewUrl: CUN360_POINT_7_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#FFCC00', extraTip: 'Guarda los enlaces relevantes para consultarlos durante el semestre.',
      coordinateX: 88, coordinateY: 38
    },
    {
      id: 'c360-9', number: 9,
      title: 'Servicios', subtitle: 'Infografía final',
      description: 'Infografía final de apoyo para cerrar la ruta CUN 360.',
      type: 'drive-image',
      driveImagePreviewUrl: CUN360_POINT_8_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Servicios',
          driveImagePreviewUrl: CUN360_POINT_8_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CUN 360 servicios',
        },
      ],
      accentColor: '#00E5FF', extraTip: 'Guarda esta información como referencia durante el semestre.',
      coordinateX: 96, coordinateY: 68
    }
  ];

  // 9 Stations for CDigital (Virtual Ecosistema Track)
  const cdigitalStations: Station[] = [
    {
      id: 'cdig-1', number: 1,
      title: 'Intro', subtitle: 'Video Tutorial Clave',
      description: 'Aprende los pasos correctos para activar tu cuenta de correo @cun.edu.co e ingresar por primera vez al aula interactiva.',
      type: 'drive-video', driveVideoPreviewUrl: CDIGITAL_POINT_1_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#9BFF00', extraTip: 'Configura tu autenticación de dos factores al primer ingreso para resguardar notas.',
      coordinateX: 10, coordinateY: 35
    },
    {
      id: 'cdig-2', number: 2,
      title: 'Actividades - Tutorial de Entrega', subtitle: 'Manual PDF para Estudiantes',
      description: 'Entiende cómo la Actividad de Construcción Aplicada reparte tu nota en tres fases para validar tus competencias.',
      type: 'drive-image',
      driveImagePreviewUrl: CDIGITAL_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#35B84A', extraTip: 'Comienza a desarrollarlo desde la primera semana para resolver dudas con tutores.',
      coordinateX: 20, coordinateY: 60
    },
    {
      id: 'cdig-3', number: 3,
      title: 'Lecturas y actividades', subtitle: 'Infografía Ecosistema Gratis',
      description: 'Licencias premium completamente gratis de Office 365, Google Suite, espacio ilimitado y SINU.',
      type: 'drive-image',
      driveImagePreviewUrl: CDIGITAL_POINT_3_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#FF9500', coordinateX: 30, coordinateY: 40
    },
    {
      id: 'cdig-4', number: 4,
      title: 'Clases - Guia para encontrar tus clases', subtitle: 'Video de Trámites Rápidos',
      description: 'Conoce cómo levantar un ticket para solucionar problemas de inscripción o cambio de clave rápidamente.',
      type: 'drive-image', driveImagePreviewUrl: CDIGITAL_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#FF2D55', extraTip: 'Usa el agente de IA para solucionar dudas en 5 segundos sin filas.',
      coordinateX: 42, coordinateY: 65
    },
    {
      id: 'cdig-5', number: 5,
      title: 'Tareas', subtitle: 'Esquema PDF del Período',
      description: 'Aprende cómo funciona el régimen dividiendo las materias en bloques semanales de alta concentración académica.',
      type: 'drive-video',
      driveVideoPreviewUrl: CDIGITAL_POINT_5_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#5856D6', extraTip: 'Dedica por lo menos 1 hora diaria a revisar el foro de anuncios corporativo.',
      coordinateX: 56, coordinateY: 45
    },
    {
      id: 'cdig-6', number: 6,
      title: 'Materias -Guia para encontrar tus materias', subtitle: 'Infografía de Socialización',
      description: 'Comunidades oficiales en WhatsApp, Discord y TikTok para interactuar con estudiantes de tu misma carrera.',
      type: 'drive-image',
      driveImagePreviewUrl: CDIGITAL_POINT_6_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#007AFF', coordinateX: 70, coordinateY: 60
    },
    {
      id: 'cdig-7', number: 7,
      title: 'Notas - Donde consulto mis notas', subtitle: 'Video Tips de Alto Impacto',
      description: 'Metodologías de hábitos ágiles probadas por estudiantes virtuales de alto rendimiento en Colombia.',
      type: 'drive-image', driveImagePreviewUrl: CDIGITAL_POINT_7_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#AF52DE', extraTip: 'Crea un espacio físico libre de distracciones en casa para estudiar.',
      coordinateX: 86, coordinateY: 40
    }
  ];

  // 9 estaciones para Soporte Cami
  const camiticketStations: Station[] = [
    {
      id: 'cami-1', number: 1,
      title: 'Introducción', subtitle: 'Ruta de atención inicial',
      description: 'Contenido pendiente para el punto 1. Aquí se explicará cómo iniciar una conversación efectiva con Cami.',
      type: 'drive-video',
      driveVideoPreviewUrl: CAMI_POINT_1_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#9BFF00', extraTip: 'Describe el problema con datos concretos para recibir una mejor orientación.',
      coordinateX: 10, coordinateY: 25
    },
    {
      id: 'cami-2', number: 2,
      title: 'Crear un ticket', subtitle: 'Radicación de solicitudes',
      description: 'Contenido pendiente para el punto 2. Este punto debe explicar cuándo crear un ticket y qué información adjuntar.',
      type: 'drive-image',
      driveImagePreviewUrl: CAMI_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#35B84A', extraTip: 'Un ticket bien documentado reduce tiempos de respuesta.',
      coordinateX: 22, coordinateY: 70
    },
    {
      id: 'cami-3', number: 3,
      title: 'Historial', subtitle: 'Consulta de estado',
      description: 'Contenido pendiente para el punto 3. Aquí se explicará cómo revisar avances y responder solicitudes de soporte.',
      type: 'drive-image',
      driveImagePreviewUrl: CAMI_POINT_3_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#FF9500', extraTip: 'Conserva el número de radicado para cualquier consulta posterior.',
      coordinateX: 36, coordinateY: 40
    },
    {
      id: 'cami-4', number: 4,
      title: 'Verificación de titulo', subtitle: 'Gestión académica',
      description: 'Contenido pendiente para el punto 4. Espacio para explicar solicitudes relacionadas con homologación de asignaturas.',
      type: 'drive-image',
      driveImagePreviewUrl: CAMI_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#FF2D55', extraTip: 'Adjunta documentos completos y legibles.',
      coordinateX: 50, coordinateY: 70
    },
    {
      id: 'cami-5', number: 5,
      title: 'Guia Camiticket', subtitle: 'Soporte financiero',
      description: 'Contenido pendiente para el punto 5. Aquí se documentarán dudas frecuentes sobre pagos, recibos y estado financiero.',
      type: 'drive-video',
      driveVideoPreviewUrl: CAMI_POINT_5_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#5856D6', extraTip: 'Verifica que el comprobante tenga fecha, valor y referencia.',
      coordinateX: 65, coordinateY: 35
    },
    {
      id: 'cami-6', number: 6,
      title: 'PQRS', subtitle: 'Credenciales y sistemas',
      description: 'Contenido pendiente para el punto 6. Punto dedicado a problemas con correo, aula virtual, SINU u otros accesos.',
      type: 'drive-image',
      driveImagePreviewUrl: CAMI_POINT_6_DRIVE_IMAGE_PREVIEW_URL,
      accentColor: '#007AFF', extraTip: 'Incluye captura del error para acelerar el diagnóstico.',
      coordinateX: 85, coordinateY: 60
    }
  ];

  // 4 estaciones para CTAYUDA
  const parcheVirtualStations: Station[] = [
    {
      id: 'parche-1', number: 1,
      title: 'Video CTAYUDA', subtitle: 'Inicio de la ruta',
      description: 'Video introductorio para reconocer el proceso CTAYUDA y sus recursos de apoyo.',
      type: 'drive-video',
      driveVideoPreviewUrl: PARCHE_POINT_1_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#9BFF00', extraTip: 'Participa con respeto y actitud colaborativa.',
      coordinateX: 12, coordinateY: 62
    },
    {
      id: 'parche-2', number: 2,
      title: 'Financiación', subtitle: 'Comunicación de comunidad',
      description: 'Visualizador con tres infografías y podcast de apoyo para el proceso de financiación.',
      type: 'drive-pdf-audio',
      drivePdfPreviewUrl: PARCHE_POINT_1_DRIVE_IMAGE_PREVIEW_URL,
      driveDocumentSlides: [
        {
          title: 'Financiación 1',
          drivePdfPreviewUrl: PARCHE_POINT_1_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA financiación 1',
        },
        {
          title: 'Financiación 2',
          drivePdfPreviewUrl: PARCHE_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA financiación 2',
        },
        {
          title: 'Financiación 3',
          drivePdfPreviewUrl: PARCHE_POINT_3_DRIVE_PDF_PREVIEW_URL,
          alt: 'Infografía CTAYUDA financiación 3',
        },
      ],
      driveAudioUrl: PARCHE_POINT_3_DRIVE_AUDIO_URL,
      driveAudioPreviewUrl: PARCHE_POINT_3_DRIVE_AUDIO_PREVIEW_URL,
      audioTitle: 'Podcast',
      accentColor: '#35B84A', extraTip: 'Guarda los canales oficiales para no perder comunicaciones importantes.',
      coordinateX: 38, coordinateY: 34
    },
    {
      id: 'parche-3', number: 3,
      title: 'Documentación', subtitle: 'Primer contacto social',
      description: 'Visualizador con tres infografías para revisar documentación, capacidad y aprobación.',
      type: 'drive-image',
      driveImagePreviewUrl: PARCHE_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Documentación 1',
          driveImagePreviewUrl: PARCHE_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA documentación 1',
        },
        {
          title: 'Documentación 2',
          driveImagePreviewUrl: PARCHE_POINT_5_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA documentación 2',
        },
        {
          title: 'Documentación 3',
          driveImagePreviewUrl: PARCHE_POINT_6_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA documentación 3',
        },
      ],
      accentColor: '#FF9500', extraTip: 'Una buena presentación ayuda a crear red desde el primer día.',
      coordinateX: 64, coordinateY: 64
    },
    {
      id: 'parche-4', number: 4,
      title: 'Credito', subtitle: 'Comunidades académicas',
      description: 'Visualizador con tres infografías para consultar crédito, gestión y beneficios.',
      type: 'drive-image',
      driveImagePreviewUrl: PARCHE_POINT_7_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Crédito 1',
          driveImagePreviewUrl: PARCHE_POINT_7_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA crédito 1',
        },
        {
          title: 'Crédito 2',
          driveImagePreviewUrl: PARCHE_POINT_8_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA crédito 2',
        },
        {
          title: 'Crédito 3',
          driveImagePreviewUrl: PARCHE_POINT_9_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía CTAYUDA crédito 3',
        },
      ],
      accentColor: '#FF2D55', extraTip: 'Los grupos por carrera son útiles para resolver dudas rápidas.',
      coordinateX: 88, coordinateY: 36
    }
  ];

  // 2 estaciones para Portal de Pagos (variante interna "servicioComplementario" / "servicio-complementario")
  const servicioComplementarioStations: Station[] = [
    {
      id: 'servicio-1', number: 1,
      title: 'Introduccion', subtitle: 'Video introductorio',
      description: 'Video introductorio del Portal de Pagos para reconocer sus opciones principales.',
      type: 'drive-video',
      driveVideoPreviewUrl: PORTAL_PAGOS_INTRO_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#2DD4BF', extraTip: 'Revisa el video completo antes de continuar con la infografía.',
      coordinateX: 28, coordinateY: 54
    },
    {
      id: 'servicio-2', number: 2,
      title: 'Infografia - portal de pagos', subtitle: 'Guía visual',
      description: 'Infografía de apoyo para consultar el Portal de Pagos y sus pasos clave.',
      type: 'drive-image',
      driveImagePreviewUrl: PORTAL_PAGOS_INFOGRAFIA_DRIVE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Infografia - portal de pagos',
          driveImagePreviewUrl: PORTAL_PAGOS_INFOGRAFIA_DRIVE_PREVIEW_URL,
          alt: 'Infografía del Portal de Pagos',
        },
      ],
      accentColor: '#35B84A', extraTip: 'Ten a mano tu usuario institucional antes de realizar pagos o consultas.',
      coordinateX: 72, coordinateY: 54
    }
  ];

  // 6 estaciones para SINU
  const sinuStations: Station[] = [
    {
      id: 'sinu-1', number: 1,
      title: 'Introduccion plataforma SINU', subtitle: 'Video',
      description: 'Video introductorio para reconocer la plataforma SINU y sus herramientas principales.',
      type: 'drive-video',
      driveVideoPreviewUrl: SINU_POINT_1_DRIVE_VIDEO_PREVIEW_URL,
      accentColor: '#FACC15', extraTip: 'Guarda el acceso a SINU entre tus favoritos para entrar más rápido.',
      coordinateX: 12, coordinateY: 35
    },
    {
      id: 'sinu-2', number: 2,
      title: 'Ingreso Sinu', subtitle: 'Infografia',
      description: 'Infografía con los pasos para ingresar a SINU con tus credenciales institucionales.',
      type: 'drive-image',
      driveImagePreviewUrl: SINU_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Ingreso Sinu',
          driveImagePreviewUrl: SINU_POINT_2_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía Ingreso Sinu',
        },
      ],
      accentColor: '#35B84A', extraTip: 'Activa la recuperación de contraseña desde el primer ingreso.',
      coordinateX: 24, coordinateY: 62
    },
    {
      id: 'sinu-3', number: 3,
      title: 'Horario', subtitle: 'Infografia',
      description: 'Infografía para consultar y revisar tu horario académico en SINU.',
      type: 'drive-image',
      driveImagePreviewUrl: SINU_POINT_3_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Horario',
          driveImagePreviewUrl: SINU_POINT_3_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía Horario SINU',
        },
      ],
      accentColor: '#FF9500', extraTip: 'Revisa el panel de anuncios cada vez que ingreses.',
      coordinateX: 40, coordinateY: 42
    },
    {
      id: 'sinu-4', number: 4,
      title: 'Plataforma explicacion - Sinu', subtitle: 'Infografia',
      description: 'Infografía de explicación general sobre la navegación y uso de la plataforma SINU.',
      type: 'drive-image',
      driveImagePreviewUrl: SINU_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Plataforma explicacion - Sinu',
          driveImagePreviewUrl: SINU_POINT_4_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía Plataforma explicación SINU',
        },
      ],
      accentColor: '#FF2D55', extraTip: 'Verifica siempre el mensaje de confirmación tras subir un archivo.',
      coordinateX: 56, coordinateY: 65
    },
    {
      id: 'sinu-5', number: 5,
      title: 'Semaforo', subtitle: 'Infografia',
      description: 'Infografía para entender el semáforo académico dentro de SINU.',
      type: 'drive-image',
      driveImagePreviewUrl: SINU_POINT_5_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Semaforo',
          driveImagePreviewUrl: SINU_POINT_5_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía Semaforo SINU',
        },
      ],
      accentColor: '#5856D6', extraTip: 'Revisa tus notas periódicamente para detectar novedades a tiempo.',
      coordinateX: 72, coordinateY: 30
    },
    {
      id: 'sinu-6', number: 6,
      title: 'Inscripcion materia', subtitle: 'Infografia',
      description: 'Infografía con la guía para realizar inscripción de materias en SINU.',
      type: 'drive-image',
      driveImagePreviewUrl: SINU_POINT_6_DRIVE_IMAGE_PREVIEW_URL,
      driveImageSlides: [
        {
          title: 'Inscripcion materia',
          driveImagePreviewUrl: SINU_POINT_6_DRIVE_IMAGE_PREVIEW_URL,
          alt: 'Infografía Inscripcion materia SINU',
        },
      ],
      accentColor: '#007AFF', extraTip: 'Adjunta una captura de pantalla del error para agilizar el soporte.',
      coordinateX: 88, coordinateY: 55
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
    if (tab === 'servicioComplementario') return servicioComplementarioStations;
    if (tab === 'sinu') return sinuStations;
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
  const isRouteMapTab = activeTab === 'cun360' || activeTab === 'cdigital' || activeTab === 'soporteCami' || activeTab === 'virtual' || activeTab === 'servicioComplementario' || activeTab === 'sinu';
  const shouldShowRouteLocks = hubTabUsesSequentialUnlock(activeTab);
  const roadmapVariant = hubTabToRoadmapVariant(activeTab);
  const routeMapTitle =
    activeTab === 'cun360'
      ? 'RECORRIDO CAMPUS FÍSICO BOGOTÁ'
      : activeTab === 'cdigital'
        ? 'INDUCCIÓN DE HERRAMIENTAS DIGITALES'
        : activeTab === 'soporteCami'
          ? 'RUTA DE SOPORTE CAMI'
          : activeTab === 'virtual'
            ? 'RUTA PARCHE VIRTUAL'
            : activeTab === 'servicioComplementario'
              ? 'RUTA PORTAL DE PAGOS'
              : 'RUTA SINU';
  const routeProgressCompleted = roadmapVariant
    ? filterCompletedStationIdsForVariant(roadmapVariant, completedStations).length
    : 0;
  const selectedDayActivities = calendarActivities.filter(act => act.day === selectedDay);
  const selectedDate = new Date(calendarToday.year, calendarToday.month, selectedDay);
  const selectedDateLabel = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDate);
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
  const tabsList: HubTabDefinition[] = [
    { id: 'recorrido360', label: 'Tour 360', icon: Compass, isLockedOption: false },
    {
      id: 'cun360',
      label: 'CUN 360',
      icon: Building,
      isLockedOption: false,
      drivePublicUrl: toGoogleDrivePublicViewUrl(CUN360_POINT_2_DRIVE_IMAGE_PREVIEW_URL),
    },
    {
      id: 'cdigital',
      label: 'CDigital',
      icon: Monitor,
      isLockedOption: false,
      drivePublicUrl: toGoogleDrivePublicViewUrl(CDIGITAL_POINT_1_DRIVE_VIDEO_PREVIEW_URL),
    },
    {
      id: 'soporteCami',
      label: 'Soporte Cami',
      icon: LifeBuoy,
      isLockedOption: true,
      drivePublicUrl: toGoogleDrivePublicViewUrl(CAMI_POINT_1_DRIVE_VIDEO_PREVIEW_URL),
    },
    {
      id: 'virtual',
      label: 'CTAYUDA',
      icon: Users,
      isLockedOption: true,
      drivePublicUrl: toGoogleDrivePublicViewUrl(PARCHE_POINT_1_DRIVE_VIDEO_PREVIEW_URL),
    },
    {
      id: 'servicioComplementario',
      label: 'Portal de Pagos',
      icon: Heart,
      isLockedOption: true,
      drivePublicUrl: toGoogleDrivePublicViewUrl(PORTAL_PAGOS_INTRO_DRIVE_VIDEO_PREVIEW_URL),
    },
    {
      id: 'sinu',
      label: 'SINU',
      icon: GraduationCap,
      isLockedOption: true,
      drivePublicUrl: toGoogleDrivePublicViewUrl(SINU_POINT_1_DRIVE_VIDEO_PREVIEW_URL),
    },
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
  const isNationalMapSelection =
    activeTab === 'recorrido360' &&
    !selectedCampus &&
    tourEntryView === 'colombia-map';
  const getHubTabVariantClass = (tabId: HubTab, isActive = false) =>
    [
      tabId === 'cdigital' ? 'hub-tab--cdigital' : '',
      tabId === 'soporteCami' ? 'hub-tab--cami' : '',
      tabId === 'virtual' ? 'hub-tab--parche' : '',
      tabId === 'servicioComplementario' ? 'hub-tab--servicio' : '',
      tabId === 'sinu' ? 'hub-tab--sinu' : '',
      isActive ? 'is-active' : '',
    ]
      .filter(Boolean)
      .join(' ');

  const hubSectionVariantClass =
    activeTab === 'cdigital'
      ? 'hub-section--cdigital'
      : activeTab === 'soporteCami'
        ? 'hub-section--cami'
        : activeTab === 'virtual'
          ? 'hub-section--parche'
          : activeTab === 'servicioComplementario'
            ? 'hub-section--servicio'
            : activeTab === 'sinu'
              ? 'hub-section--sinu'
              : '';
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
    soporteCami: {
      chapter: 'Capítulo 4',
      mission: 'Aprende a resolver tus trámites',
      title: 'Ruta de soporte con Cami',
      description: 'Conoce cómo pedir ayuda, radicar solicitudes y resolver tus trámites con el acompañamiento de Cami.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Sabrás resolver cualquier trámite sin complicaciones.',
      ctaLabel: 'Continuar ruta',
      guide: 'Te muestro cómo resolver tus trámites paso a paso.',
    },
    virtual: {
      chapter: 'Capítulo 5',
      mission: 'Aprende a usar CTayuda',
      title: 'CTAYDA',
      description: 'Descubre los espacios y canales para conectar con otros estudiantes y vivir la comunidad CUN en línea.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Harás parte de una comunidad que te acompaña.',
      ctaLabel: 'Continuar ruta',
      guide: 'Aquí conocerás a tu parche y la comunidad CUN.',
    },
    servicioComplementario: {
      chapter: 'Capítulo 6',
      mission: 'Gestiona tus pagos',
      title: 'Ruta del Portal de Pagos',
      description: 'Aprende a consultar tu matrícula, pagar con los métodos disponibles y revisar tus recibos y planes de financiación.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Sabrás cómo gestionar tus pagos sin contratiempos.',
      ctaLabel: 'Continuar ruta',
      guide: 'Te muestro cómo usar el Portal de Pagos paso a paso.',
    },
    sinu: {
      chapter: 'Capítulo 7',
      mission: 'Domina tu plataforma académica',
      title: 'Ruta de SINU',
      description: 'Aprende a ingresar, navegar y usar SINU para gestionar tus actividades, notas y asistencia.',
      nextStep: 'Continúa con la siguiente estación disponible.',
      reward: 'Sabrás moverte con confianza dentro de SINU.',
      ctaLabel: 'Continuar ruta',
      guide: 'Aquí aprenderás a usar SINU paso a paso.',
    },
    cronograma: {
      chapter: 'Capítulo 8',
      mission: 'Organiza tu inicio de semestre',
      title: 'Revisa las fechas importantes',
      description: 'Consulta actividades, plazos y momentos clave para iniciar tu proceso académico sin perderte de nada.',
      nextStep: 'Selecciona un día con evento para ver sus detalles.',
      reward: 'Tendrás claridad sobre las fechas más importantes.',
      ctaLabel: 'Ver cronograma',
      guide: 'Recuerda revisar el cronograma para no perder fechas importantes.',
    },
    bienestarLocked: {
      chapter: 'Capítulo 9',
      mission: 'Cuida tu bienestar',
      title: 'Bienestar y apoyo, muy pronto',
      description: 'Encuentra apoyo, actividades y acompañamiento para tu bienestar integral durante tu vida universitaria.',
      nextStep: 'Este capítulo se habilitará durante el semestre.',
      reward: 'Encontrarás apoyo y actividades para ti.',
      ctaLabel: '',
      guide: 'Aquí encontrarás apoyo y actividades para tu bienestar.',
    },
  };
  const baseNarrative = moduleNarrative[activeTab];

  const selectedTourLocation =
    tourLocations.find((location) => location.id === selectedTourCityId) ??
    (selectedCampus
      ? tourLocations.find((location) =>
          location.campuses.some((campus) => campus.id === selectedCampus.id),
        )
      : undefined);

  const tourNarrativeTitle = selectedCampus
    ? selectedTourLocation
      ? `${selectedCampus.title} — ${
          selectedTourLocation.id === 'bogota'
            ? selectedTourLocation.city
            : selectedTourLocation.department
        }`
      : selectedCampus.title
    : selectedTourLocation && tourEntryView !== 'colombia-map'
      ? `Sedes ${selectedTourLocation.city}`
      : 'Explora tu sede CUN';

  const tourNarrativeDescription = selectedCampus
    ? `Recorre los espacios de ${selectedCampus.title}, descubre servicios y familiarízate con tu campus antes de llegar.`
    : selectedTourLocation && tourEntryView !== 'colombia-map'
      ? `Elige una sede de ${selectedTourLocation.city} para iniciar el recorrido 360.`
      : 'Selecciona tu ciudad en el mapa y recorre los espacios de tu sede antes de llegar.';

  const activeNarrative =
    activeTab === 'recorrido360'
      ? {
          ...baseNarrative,
          chapter: activeSede.narrative.chapter ?? baseNarrative.chapter,
          mission: activeSede.narrative.mission ?? baseNarrative.mission,
          title: tourNarrativeTitle,
          description: tourNarrativeDescription,
          nextStep: activeSede.narrative.nextStep ?? baseNarrative.nextStep,
          reward: activeSede.narrative.reward ?? baseNarrative.reward,
          ctaLabel: activeSede.narrative.ctaLabel ?? baseNarrative.ctaLabel,
          guide: selectedCampus
            ? `Estás explorando ${selectedCampus.title}. Avanza con las flechas para conocer cada espacio.`
            : baseNarrative.guide,
        }
      : baseNarrative;

  const driveImageSlides: DriveImageSlide[] =
    activePopupStation?.type === 'drive-image'
      ? activePopupStation.driveImageSlides?.length
        ? activePopupStation.driveImageSlides
        : activePopupStation.driveImagePreviewUrl || activePopupStation.driveImageUrl
          ? [
              {
                title: activePopupStation.title,
                driveImageUrl: activePopupStation.driveImageUrl,
                driveImagePreviewUrl: activePopupStation.driveImagePreviewUrl,
                alt: activePopupStation.title,
              },
            ]
          : []
      : [];

  const activeDriveImageSlide =
    driveImageSlides[activeDriveImageSlideIndex] ?? driveImageSlides[0];

  const hasMultipleDriveImageSlides = driveImageSlides.length > 1;

  const driveDocumentSlides: DriveDocumentSlide[] =
    activePopupStation?.type === 'drive-pdf' || activePopupStation?.type === 'drive-pdf-audio'
      ? activePopupStation.driveDocumentSlides?.length
        ? activePopupStation.driveDocumentSlides
        : activePopupStation.drivePdfPreviewUrl
          ? [
              {
                title: activePopupStation.title,
                drivePdfPreviewUrl: activePopupStation.drivePdfPreviewUrl,
                alt: activePopupStation.title,
              },
            ]
          : []
      : [];

  const activeDriveDocumentSlide =
    driveDocumentSlides[activeDriveDocumentSlideIndex] ?? driveDocumentSlides[0];

  const hasMultipleDriveDocumentSlides = driveDocumentSlides.length > 1;

  const handlePreviousDriveImageSlide = () => {
    setActiveDriveImageSlideIndex((currentIndex) =>
      driveImageSlides.length > 0
        ? (currentIndex - 1 + driveImageSlides.length) % driveImageSlides.length
        : 0,
    );
  };

  const handleNextDriveImageSlide = () => {
    setActiveDriveImageSlideIndex((currentIndex) =>
      driveImageSlides.length > 0
        ? (currentIndex + 1) % driveImageSlides.length
        : 0,
    );
  };

  const handlePreviousDriveDocumentSlide = () => {
    setActiveDriveDocumentSlideIndex((currentIndex) =>
      driveDocumentSlides.length > 0
        ? (currentIndex - 1 + driveDocumentSlides.length) % driveDocumentSlides.length
        : 0,
    );
  };

  const handleNextDriveDocumentSlide = () => {
    setActiveDriveDocumentSlideIndex((currentIndex) =>
      driveDocumentSlides.length > 0
        ? (currentIndex + 1) % driveDocumentSlides.length
        : 0,
    );
  };

  return (
    <div className={`w-full max-w-[1500px] 2xl:max-w-[1680px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-5 relative z-10 flex flex-col h-[calc(100vh-88px)] sm:h-[min(90vh,960px)] min-h-[620px] sm:min-h-[720px] lg:min-h-[760px] overflow-hidden ${isImmersive ? 'tour-immersive-shell' : 'stage-platform'} ${isNationalMapSelection ? 'hub--map-selection-mode' : ''}`} data-chapter={chapterTheme} id="onboarding-viewport-fixed">
      
      {/* ===== HERO EDITORIAL — portada del capítulo (Fase D) ===== */}
      {!isNationalMapSelection && (
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
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => handleOpenStation(nextStation ?? stationTrack[0])}
              className="action-primary py-2.5"
            >
              {activeNarrative.ctaLabel}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      )}

      {/* MODULE SELECTOR — chips tipo consola tecnológica (solo visual) */}
      {!isNationalMapSelection && (
      <div className="hub-tabs-wrapper w-full min-w-0 max-w-full shrink-0">
        <div className="hub-tabs flex bg-transparent overflow-x-auto max-w-full scrollbar-none select-none z-10 mb-3 items-stretch px-0.5 sm:px-1 py-1 shrink-0 gap-2 sm:gap-2.5">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`hub-tab ${getHubTabVariantClass(tab.id, isActive)} focus-ring-soft group relative flex items-center gap-2.5 rounded-[14px] border px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer whitespace-nowrap transition-all duration-150 ease-out ${
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
      )}

      {/* TAB WORKSPACE BOX — Panel/tarjeta para módulos normales; en Tour 360 es un stage sin caja. */}
      <div className={
        isImmersive
          ? 'flex-1 relative flex flex-col min-h-0 p-1.5 sm:p-2.5'
          : `flex-1 bg-surface-panel border border-border-subtle rounded-3xl relative overflow-hidden flex flex-col p-3 sm:p-5 shadow-panel backdrop-blur-xl min-h-0 ${hubSectionVariantClass}`
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
              <div className="tour-immersive-stage relative h-full w-full">
                {!selectedCampus && tourEntryView === 'colombia-map' ? (
                  <section className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#020603] text-white shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(155,255,0,0.14),transparent_30%),radial-gradient(circle_at_76%_76%,rgba(0,255,102,0.10),transparent_34%),linear-gradient(135deg,rgba(8,12,9,0.98),rgba(0,0,0,0.98))]" />
                    <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(155,255,0,0.34)_1px,transparent_1px)] [background-size:clamp(14px,2vw,20px)_clamp(14px,2vw,20px)] [mask-image:radial-gradient(circle_at_50%_48%,black,transparent_78%)]" />

                    <div className="relative z-10 grid h-full min-h-[clamp(560px,78vh,820px)] grid-cols-1 gap-0 lg:grid-cols-[minmax(280px,0.75fr)_minmax(520px,1.25fr)]">
                      <div className="flex flex-col justify-between gap-6 border-b border-[#9BFF00]/15 bg-black/35 p-5 backdrop-blur-xl sm:p-7 lg:border-b-0 lg:border-r">
                        <div>
                          <p className="m-0 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#9BFF00]">
                            <MapPin className="h-4 w-4" />
                            Mapa nacional
                          </p>
                          <h2 className="m-0 mt-3 text-3xl font-black leading-none text-white sm:text-4xl">
                            Selecciona tu ciudad
                          </h2>
                          <p className="m-0 mt-4 max-w-sm text-sm font-semibold leading-relaxed text-white/68">
                            Haz click en Bogotá, Sincelejo, Montería, Santa Marta o Neiva para continuar hacia el recorrido 360.
                          </p>
                        </div>

                        <div className="rounded-3xl border border-[#9BFF00]/15 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                          <p className="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                            Estado
                          </p>
                          <p className="m-0 mt-2 text-base font-black text-white">
                            Bogotá, Sincelejo, Montería, Santa Marta y Neiva disponibles
                          </p>
                          <p className="m-0 mt-2 text-xs font-semibold leading-relaxed text-white/58">
                            Dale click en el departamento que quieras visitar para continuar.
                          </p>
                          {tourMapMessage && (
                            <p className="m-0 mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-100">
                              {tourMapMessage}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="relative flex min-h-[420px] items-center justify-center p-4 sm:p-6 lg:p-8">
                        <div className="absolute inset-4 rounded-[32px] border border-[#9BFF00]/15 bg-black/20 shadow-[0_0_50px_rgba(155,255,0,0.10),inset_0_0_90px_rgba(155,255,0,0.05)]" />
                        {/* TEMP: ajuste de escala del mapa para mejorar encuadre en el visor Tour360. */}
                        <div className="relative z-10 mx-auto flex h-full max-h-[55vh] w-full max-w-[min(92vw,520px)] items-center justify-center sm:max-h-[64vh] sm:max-w-[620px] lg:max-h-[min(72vh,680px)] lg:max-w-[680px]">
                          <ColombiaMapSvg
                            cities={tourMapCities}
                            selectedCityId={selectedTourCityId}
                            onSelectCity={handleTourCitySelect}
                            className="h-auto max-h-full w-full max-w-full drop-shadow-[0_0_34px_rgba(155,255,0,0.18)]"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                ) : !selectedCampus ? (
                  <TourMapSelector
                    initialLocationId={selectedTourCityId}
                    onSelectCampus={setSelectedCampus}
                    onBackToMap={handleReturnToColombiaMap}
                  />
                ) : selectedCampusTourAvailable && activeTourConfig ? (
                  <>
                    <div className="absolute right-3 top-3 z-40 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCampus(null)}
                        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-md transition hover:border-brand-green-main hover:bg-black/60 hover:text-white"
                      >
                        <MapPin className="h-3 w-3 text-brand-green-neon" />
                        Cambiar sede
                      </button>

                      <div className="pointer-events-none hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-green-neon animate-pulse" />
                        <span className="text-[11px] text-white/85">Avanza por la escena para descubrir la sede</span>
                        <span className="ml-1 rounded-full bg-brand-green-neon/90 px-2 py-0.5 text-[9px] font-bold uppercase text-[#06130d]">En recorrido</span>
                      </div>
                    </div>

                    <div className="tour-viewer-scaled">
                      <VirtualTour360
                        key={selectedCampus.id}
                        tourConfig={activeTourConfig}
                        selectedCampus={selectedCampus}
                      />
                    </div>

                    <div className="pointer-events-none absolute left-3 bottom-14 z-30 hidden max-w-[15rem] items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-2.5 py-2 backdrop-blur-sm md:flex">
                      <AnimatedEarthIcon className="h-6 w-6 shrink-0" />
                      <p className="m-0 text-[10px] italic leading-snug text-white/75">{activeNarrative.guide}</p>
                    </div>

                    <a 
                      href={
                        activeTourConfig?.nodes.find((node) => node.id === activeTourConfig.startNodeId)
                          ?.panorama ??
                        activeTourConfig?.nodes[0]?.panorama ??
                        tour360Nodes[0]?.panorama
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="pointer-events-auto absolute right-3 bottom-14 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white/80 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
                    >
                      <ExternalLink className="w-3 h-3" /> Ver imagen
                    </a>
                    
                  </>
                ) : (
                  <SedeUnavailableFallback sede={activeSede} />
                )}
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
                  <h2 className="section-title text-2xl sm:text-3xl m-0">{calendarToday.monthLabel}</h2>
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
                    {Array.from({ length: calendarToday.daysInMonth }, (_, index) => {
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
        panelClassName={getRoadmapPanelClassName(activePopupStation)}
        overlayClassName="hud-glass-modal__overlay--roadmap"
        size="roadmap"
        title={activePopupStation?.hideContentTitle ? undefined : activePopupStation?.title}
        meta={
          activePopupStation
            ? `Estación ${activePopupStation.number} / Inducción activa`
            : undefined
        }
        bodyClassName={
          activePopupStation && stationUsesIframeLayout(activePopupStation.type)
            ? 'hud-glass-modal__content--roadmap hud-glass-modal__content--iframe'
            : 'hud-glass-modal__content--roadmap'
        }
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
            <div
              className={`hud-glass-modal__media${
                activePopupStation.type === 'drive-image'
                  ? ' hud-glass-modal__media--drive-image'
                  : activePopupStation.type === 'drive-pdf' || activePopupStation.type === 'drive-pdf-audio'
                    ? ' hud-glass-modal__media--pdf-audio'
                  : stationUsesIframeLayout(activePopupStation.type)
                    ? ' hud-glass-modal__media--iframe'
                    : ''
              }`}
            >
                {/* LEGACY: render local mantenido como fallback temporal fuera del roadmap Drive. */}
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

                {activePopupStation.type === 'drive-image' && activeDriveImageSlide && (
                  <div className="hud-glass-modal__drive-slider">
                    <div className="hud-glass-modal__drive-slider-frame">
                      {activeDriveImageSlide.driveImageUrl && (
                        <img
                          key={`drive-slide-img-${activePopupStation.id}-${activeDriveImageSlideIndex}-${activeDriveImageSlide.driveImageUrl}`}
                          src={activeDriveImageSlide.driveImageUrl}
                          alt={activeDriveImageSlide.alt ?? activeDriveImageSlide.title ?? activePopupStation.title}
                          className="hud-glass-modal__image"
                          onError={(event) => {
                            event.currentTarget.classList.add('hidden');
                            event.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      )}
                      {activeDriveImageSlide.driveImagePreviewUrl && (
                        <iframe
                          key={`drive-slide-iframe-${activePopupStation.id}-${activeDriveImageSlideIndex}-${activeDriveImageSlide.driveImagePreviewUrl}`}
                          src={activeDriveImageSlide.driveImagePreviewUrl}
                          title={activeDriveImageSlide.title ?? activePopupStation.title}
                          className={`${activeDriveImageSlide.driveImageUrl ? 'hidden ' : ''}hud-glass-modal__iframe`}
                          allow="autoplay"
                        />
                      )}
                    </div>

                    {hasMultipleDriveImageSlides && (
                      <>
                        <button
                          type="button"
                          aria-label="Imagen anterior"
                          className="hud-glass-modal__drive-slider-button hud-glass-modal__drive-slider-button--prev"
                          onClick={handlePreviousDriveImageSlide}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label="Imagen siguiente"
                          className="hud-glass-modal__drive-slider-button hud-glass-modal__drive-slider-button--next"
                          onClick={handleNextDriveImageSlide}
                        >
                          →
                        </button>
                        <span className="hud-glass-modal__drive-slider-counter">
                          {activeDriveImageSlideIndex + 1} / {driveImageSlides.length}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {activePopupStation.type === 'drive-pdf' && activeDriveDocumentSlide && (
                  <div className="hud-glass-modal__pdf-podcast-layout">
                    <div className="hud-glass-modal__pdf-audio-frame hud-glass-modal__pdf-podcast-main">
                      <div className="hud-glass-modal__drive-slider hud-glass-modal__drive-slider--document">
                        <div className="hud-glass-modal__drive-slider-frame">
                          <iframe
                            key={`drive-doc-slide-${activePopupStation.id}-${activeDriveDocumentSlideIndex}-${activeDriveDocumentSlide.drivePdfPreviewUrl}`}
                            src={activeDriveDocumentSlide.drivePdfPreviewUrl}
                            title={activeDriveDocumentSlide.title ?? activePopupStation.title}
                            className="hud-glass-modal__iframe hud-glass-modal__iframe--document"
                            allow="autoplay"
                          />
                        </div>

                        {hasMultipleDriveDocumentSlides && (
                          <>
                            <button
                              type="button"
                              className="hud-glass-modal__drive-slider-button hud-glass-modal__drive-slider-button--prev"
                              onClick={handlePreviousDriveDocumentSlide}
                              aria-label="Documento anterior"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              className="hud-glass-modal__drive-slider-button hud-glass-modal__drive-slider-button--next"
                              onClick={handleNextDriveDocumentSlide}
                              aria-label="Documento siguiente"
                            >
                              ›
                            </button>
                            <span className="hud-glass-modal__drive-slider-counter">
                              {activeDriveDocumentSlideIndex + 1} / {driveDocumentSlides.length}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="hud-glass-modal__podcast-compact hud-glass-modal__podcast-compact--mini">
                      <p className="hud-glass-modal__podcast-title">Podcast</p>

                      {activePopupStation.driveAudioUrl ? (
                        <audio
                          controls
                          preload="metadata"
                          src={activePopupStation.driveAudioUrl}
                          className="hud-glass-modal__podcast-audio"
                        >
                          Tu navegador no soporta el reproductor de audio.
                        </audio>
                      ) : (
                        <iframe
                          src={activePopupStation.driveAudioPreviewUrl ?? ROADMAP_DEFAULT_PODCAST_DRIVE_PREVIEW_URL}
                          title={`Podcast - ${activePopupStation.title}`}
                          className="hud-glass-modal__podcast-iframe"
                          allow="autoplay"
                        />
                      )}
                    </div>
                  </div>
                )}

                {activePopupStation.type === 'drive-pdf-audio' && activeDriveDocumentSlide && (
                  <div className="hud-glass-modal__pdf-podcast-layout">
                    <div className="hud-glass-modal__pdf-audio-frame hud-glass-modal__pdf-podcast-main">
                      <div className="hud-glass-modal__drive-slider hud-glass-modal__drive-slider--document">
                        <div className="hud-glass-modal__drive-slider-frame">
                          <iframe
                            key={`drive-doc-slide-${activePopupStation.id}-${activeDriveDocumentSlideIndex}-${activeDriveDocumentSlide.drivePdfPreviewUrl}`}
                            src={activeDriveDocumentSlide.drivePdfPreviewUrl}
                            title={activeDriveDocumentSlide.title ?? `${activePopupStation.title} - Infografia`}
                            className="hud-glass-modal__iframe hud-glass-modal__iframe--document"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                          />
                        </div>

                        {hasMultipleDriveDocumentSlides && (
                          <>
                            <button
                              type="button"
                              className="hud-glass-modal__drive-slider-button hud-glass-modal__drive-slider-button--prev"
                              onClick={handlePreviousDriveDocumentSlide}
                              aria-label="Documento anterior"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              className="hud-glass-modal__drive-slider-button hud-glass-modal__drive-slider-button--next"
                              onClick={handleNextDriveDocumentSlide}
                              aria-label="Documento siguiente"
                            >
                              ›
                            </button>
                            <span className="hud-glass-modal__drive-slider-counter">
                              {activeDriveDocumentSlideIndex + 1} / {driveDocumentSlides.length}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="hud-glass-modal__podcast-compact hud-glass-modal__podcast-compact--mini">
                      <p className="hud-glass-modal__podcast-title">
                        {activePopupStation.audioTitle ?? 'Podcast'}
                      </p>

                      {activePopupStation.driveAudioUrl ? (
                        <audio
                          controls
                          preload="metadata"
                          src={activePopupStation.driveAudioUrl}
                          className="hud-glass-modal__podcast-audio"
                        >
                          Tu navegador no soporta el reproductor de audio.
                        </audio>
                      ) : (
                        <iframe
                          src={activePopupStation.driveAudioPreviewUrl ?? ROADMAP_DEFAULT_PODCAST_DRIVE_PREVIEW_URL}
                          title={`Podcast - ${activePopupStation.title}`}
                          className="hud-glass-modal__podcast-iframe"
                          allow="autoplay"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* LEGACY: PDF local paginado mantenido como fallback temporal fuera del roadmap Drive. */}
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

                {/* LEGACY: infografía local mantenida como fallback temporal fuera del roadmap Drive. */}
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
