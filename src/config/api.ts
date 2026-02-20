// API Configuration
export const API_CONFIG = {
  BASE_URL: (() => {
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
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Environment configuration
export const ENV_CONFIG = {
  IS_DEV: import.meta.env.DEV,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Community Sport',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
}; 