// Error configuration - easily toggle detailed error messages
export const ERROR_CONFIG = {
  // Set to false to show simple "Login failed" messages
  // Set to true to show detailed error messages with endpoints and status codes
  SHOW_DETAILED_ERRORS: true,
  
  // Show network diagnostics in console
  SHOW_NETWORK_DIAGNOSTICS: true,
  
  // Show request/response details in console
  SHOW_REQUEST_DETAILS: true
};

// Helper function to get appropriate error message
export const getErrorMessage = (error: any, defaultMessage: string = 'Login failed'): string => {
  if (!ERROR_CONFIG.SHOW_DETAILED_ERRORS) {
    return defaultMessage;
  }
  
  // Return the detailed error message logic here
  // This will be used in the auth service
  return error.message || defaultMessage;
};






