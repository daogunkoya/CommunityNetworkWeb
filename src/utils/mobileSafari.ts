// Basic browser detection utilities

export const isMobile = (): boolean => {
  return /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  return {
    userAgent,
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isChrome: /Chrome/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isEdge: /Edg/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    localStorageAvailable: typeof Storage !== 'undefined'
  };
};



