export const APP_CONFIG = {
  name: 'MatchGrinder',
  description: 'Connect with local athletes, join exciting games, and build lasting friendships through sports',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
  },
  features: {
    enableNotifications: true,
    enableRealTimeChat: true,
    enableLocationServices: true,
  },
} as const;

export const getAppName = () => APP_CONFIG.name;
export const getAppDescription = () => APP_CONFIG.description;


