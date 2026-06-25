export interface TutorialShort {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  iconName: string;
  accentColor: 'blue' | 'green';
}

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  details: string[];
}

export type EventStatus = 'activity' | 'delivery' | 'recommended' | 'pending';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: EventStatus;
  category: 'Virtual' | 'Presencial' | 'General';
  description: string;
  important: boolean;
}

export interface CampusHotspot {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  imageUri: string;
  amenities: string[];
}

export interface OnboardingConfig {
  institutionName: string;
  portalTitle: string;
  portalSubtitle: string;
  powerBiEmbedUrl: string;
  defaultTour360Url: string;
}
