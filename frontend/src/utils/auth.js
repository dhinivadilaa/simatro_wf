// Auth utility functions

export const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT format check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // For development, just check format - skip expiration check
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const getValidAdminToken = () => {
  const token = localStorage.getItem('adminAuthToken');
  return isValidToken(token) ? token : null;
};

export const clearAdminAuth = () => {
  localStorage.removeItem('adminAuthToken');
  // Clear any axios default headers
  delete window.api?.defaults?.headers?.common?.Authorization;
};

export const setAdminAuth = (token) => {
  if (isValidToken(token)) {
    localStorage.setItem('adminAuthToken', token);
    return true;
  }
  return false;
};