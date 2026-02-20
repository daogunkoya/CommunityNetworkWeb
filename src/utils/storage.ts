/**
 * Storage utility functions for handling file URLs
 */

/**
 * Get the storage base URL based on environment configuration
 */
export function getStorageBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Check if we're in production (not localhost/development)
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' &&
                      !window.location.hostname.includes('192.168.') &&
                      !window.location.hostname.includes('10.0.');
  
  // If we're in production and envUrl points to localhost, ignore it
  if (isProduction && envUrl && envUrl.includes('localhost')) {
    console.warn('⚠️ Production environment detected, ignoring localhost storage URL');
    return 'https://matchgrinder.com';
  }
  
  if (envUrl) {
    // If environment variable is set, use it but replace /api with /storage
    if (envUrl.includes('/api')) {
      return envUrl.replace('/api', '');
    }
    return envUrl;
  }
  
  // Fallback to production storage URL
  return 'https://matchgrinder.com';
}

/**
 * Get the full URL for a storage file
 * @param filePath - The relative path to the file (e.g., 'profile-pictures/user.jpg')
 * @returns The full URL to the file
 */
export function getStorageUrl(filePath: string): string {
  if (!filePath) return '';
  
  // If it's already a full URL, return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  
  // Construct the full URL
  const baseUrl = getStorageBaseUrl();
  return `${baseUrl}/storage/${cleanPath}`;
}

/**
 * Get the full URL for a storage file with proper mobile browser handling
 * @param filePath - The relative path to the file
 * @returns The full URL to the file
 */
export function getStorageUrlSafe(filePath: string): string {
  const url = getStorageUrl(filePath);
  
  // Log storage URL resolution for debugging
  console.log('🖼️ Storage URL Resolution:', {
    filePath,
    resolvedUrl: url,
    baseUrl: getStorageBaseUrl(),
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    isSafari: /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent),
    userAgent: navigator.userAgent,
    currentDomain: window.location.hostname
  });
  
  return url;
}
