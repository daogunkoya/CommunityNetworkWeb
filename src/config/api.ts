// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Environment configuration
export const ENV_CONFIG = {
  IS_DEV: import.meta.env.DEV,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Community Sport',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
}; 