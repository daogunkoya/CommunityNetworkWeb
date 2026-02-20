import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: (() => {
    const envUrl = import.meta.env.VITE_API_URL;

    // Check if we're in production (not localhost/development)
    const isProduction = window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      !window.location.hostname.includes('192.168.') &&
      !window.location.hostname.includes('10.0.');

    // If we're in production and envUrl points to localhost, ignore it
    if (isProduction && envUrl && envUrl.includes('localhost')) {
      console.warn('⚠️ Production environment detected, ignoring localhost API URL');
      console.warn('🔧 Using production API instead:', 'https://matchgrinder.com/api');
      return 'https://matchgrinder.com/api';
    }

    // If environment variable is set and not localhost in production, use it
    if (envUrl) {
      // But if it's HTTP and we're on HTTPS, convert to HTTPS
      if (envUrl.startsWith('http://') && window.location.protocol === 'https:') {
        console.warn('⚠️ Converting HTTP API URL to HTTPS for security');
        return envUrl.replace('http://', 'https://');
      }
      return envUrl;
    }

    // Fallback to HTTPS production API
    return 'https://matchgrinder.com/api';
  })(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Mobile browser configurations
  withCredentials: false, // Disable credentials for CORS
  validateStatus: function (status) {
    // Accept all status codes to handle errors properly
    return status >= 200 && status < 500;
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Enhanced request logging for ALL requests
    console.group('📤 OUTGOING REQUEST');
    console.log('🌐 Request Details:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    });

    console.log('📱 Environment Info:', {
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      isSafari: /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent),
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      currentURL: window.location.href,
      envAPI: import.meta.env.VITE_API_URL || 'NOT SET'
    });

    console.log('⚙️ API Configuration:', {
      configuredBaseURL: config.baseURL,
      environmentVariable: import.meta.env.VITE_API_URL,
      fallbackUsed: !import.meta.env.VITE_API_URL,
      timestamp: new Date().toISOString()
    });

    // Special warnings for common issues
    if (config.baseURL?.includes('localhost') && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      console.error('❌ MOBILE API ISSUE: Mobile device cannot access localhost!');
      console.error('💡 SOLUTION: Use your computer\'s IP address instead of localhost');
      console.error('📱 Example: Change VITE_API_URL to http://192.168.1.100:8001/api');
    }

    if (config.baseURL?.includes('matchgrinder.com') && window.location.hostname === 'localhost') {
      console.warn('⚠️ LOCAL DEVELOPMENT: Using production API from localhost');
      console.warn('💡 CONSIDER: Set VITE_API_URL in .env file for local development');
    }

    if (config.baseURL?.includes('matchgrinder.com') && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      console.warn('⚠️ MOBILE PRODUCTION: Mobile device accessing production API');
      console.warn('💡 NOTE: This should work if the production API is running');
    }

    console.groupEnd();

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses for debugging
    console.group('📥 INCOMING RESPONSE (SUCCESS)');
    console.log('✅ Response Details:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      baseURL: response.config.baseURL,
      fullURL: `${response.config.baseURL}${response.config.url}`,
      data: response.data,
      headers: response.headers
    });
    console.groupEnd();

    return response;
  },
  (error) => {
    // Enhanced error logging for mobile browser debugging
    console.group('📥 INCOMING RESPONSE (ERROR)');
    console.error('❌ Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'UNKNOWN',
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      isSafari: /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent),
      timestamp: new Date().toISOString()
    });

    console.error('🔍 Request Context:', {
      method: error.config?.method?.toUpperCase(),
      headers: error.config?.headers,
      data: error.config?.data,
      timeout: error.config?.timeout,
      withCredentials: error.config?.withCredentials
    });

    console.groupEnd();

    // Handle 401 Unauthorized securely
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const requestBaseUrl = error.config?.baseURL || '';

      // We must immediately return WITHOUT wiping login session if it was a 3rd party widget failure
      const isExternalWidget =
        requestUrl.includes('AppInitializersQuery') ||
        requestBaseUrl.includes('lindy.ai') ||
        requestBaseUrl.includes('stripe.com');

      if (isExternalWidget) {
        console.warn('⚠️ Ignored 401 Unauthorized from external widget/plugin:', requestUrl);
        return Promise.reject(error);
      }

      // If it genuinely was OUR API returning a 401, the session is dead. Clean it up securely.
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Safely dispatch a custom event that `useAuth.tsx` or App logic can listen to, or redirect manually
      window.dispatchEvent(new Event('auth:unauthorized'));

      // Only redirect if we're not already on the signin page
      if (window.location.pathname !== '/signin' && window.location.pathname !== '/') {
        window.location.href = '/signin';
      }
    }

    // Handle CORS errors specifically
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS Error detected - this is common on mobile browsers');
      const endpoint = `${error.config?.baseURL}${error.config?.url}`;
      error.message = `CORS Error - Cannot access ${endpoint}. This is common on mobile browsers due to security restrictions.`;
    }

    // Handle connection refused errors
    if (error.code === 'ECONNREFUSED') {
      const endpoint = `${error.config?.baseURL}${error.config?.url}`;
      error.message = `Connection Refused - Cannot connect to ${endpoint}. The server is not running or not accessible.`;
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      const endpoint = `${error.config?.baseURL}${error.config?.url}`;
      error.message = `Request Timeout - ${endpoint} took too long to respond.`;
    }

    return Promise.reject(error);
  }
);

export { api }; 