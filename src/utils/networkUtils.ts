// Network utilities for mobile development

export const getNetworkInfo = () => {
  return {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
    userAgent: navigator.userAgent,
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  };
};

export const detectNetworkIssues = () => {
  const info = getNetworkInfo();
  const issues = [];

  // Check for localhost on mobile
  if (info.isMobile && info.isLocalhost) {
    issues.push({
      type: 'localhost-mobile',
      message: 'Mobile devices cannot access localhost. Use your computer\'s IP address.',
      solution: 'Change VITE_API_URL to use your computer\'s IP address (e.g., http://192.168.1.100:8001/api)'
    });
  }

  // Check for mixed content
  if (info.protocol === 'https:' && import.meta.env.VITE_API_URL?.startsWith('http:')) {
    issues.push({
      type: 'mixed-content',
      message: 'HTTPS page trying to access HTTP API (Mixed Content Error)',
      solution: 'Either use HTTP for both or HTTPS for both'
    });
  }

  return {
    info,
    issues,
    hasIssues: issues.length > 0
  };
};

export const logNetworkDiagnostics = () => {
  const diagnostics = detectNetworkIssues();
  
  console.group('🔍 NETWORK DIAGNOSTICS');
  console.log('Network Info:', diagnostics.info);
  
  if (diagnostics.hasIssues) {
    console.group('❌ DETECTED ISSUES:');
    diagnostics.issues.forEach((issue, index) => {
      console.error(`${index + 1}. ${issue.type.toUpperCase()}:`, issue.message);
      console.log('💡 Solution:', issue.solution);
    });
    console.groupEnd();
  } else {
    console.log('✅ No network issues detected');
  }
  
  console.groupEnd();
  
  return diagnostics;
};






