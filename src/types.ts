export interface TutorialShort {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string; // Embeddable video URL or video file
  iconName: string; // Lucide icon identifier
  accentColor: 'blue' | 'green';
}

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  details: string[]; // Specific sub-details student will find
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
  x: number; // percentage coordinates (0-100) for custom panorama positioning
  y: number; // percentage coordinates (0-100)
  imageUri: string; // Preview image of that hotspot
  amenities: string[]; // key information points
}

export interface OnboardingConfig {
  institutionName: string;
  portalTitle: string;
  portalSubtitle: string;
  powerBiEmbedUrl: string;
  defaultTour360Url: string;
}
