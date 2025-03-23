// src/utils/navigation.ts
/**
 * Navigate to the app with direct redirection to auth
 */
export const goToApp = async () => {
  try {
    // Direct redirect to app auth page
    window.location.href = 'https://app.360code.io/auth';
  } catch (error) {
    console.error('Error during app navigation:', error);
    // Fallback in case of error
    window.location.href = 'https://app.360code.io/auth';
  }
};