export const APP_CONFIG = {
  name: 'MatchGrinder',
  description: 'Connect with local athletes, join exciting games, and build lasting friendships through sports',
  version: '1.0.0',
  api: {
    baseUrl: (() => {
      const envUrl = import.meta.env.VITE_API_URL;
      
      // Check if we're in production (not localhost/development)
      const isProduction = typeof window !== 'undefined' && 
                          window.location.hostname !== 'localhost' && 
                          window.location.hostname !== '127.0.0.1' &&
                          !window.location.hostname.includes('192.168.') &&
                          !window.location.hostname.includes('10.0.');
      
      // If we're in production and envUrl points to localhost, ignore it
      if (isProduction && envUrl && envUrl.includes('localhost')) {
        console.warn('⚠️ Production environment detected, ignoring localhost API URL');
        return 'https://matchgrinder.com/api';
      }
      
      if (envUrl) {
        // Convert HTTP to HTTPS if we're on HTTPS
        if (envUrl.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
          return envUrl.replace('http://', 'https://');
        }
        return envUrl;
      }
      return 'https://matchgrinder.com/api';
    })(),
  },
  features: {
    enableNotifications: true,
    enableRealTimeChat: true,
    enableLocationServices: true,
  },
} as const;

export const getAppName = () => APP_CONFIG.name;
export const getAppDescription = () => APP_CONFIG.description;


