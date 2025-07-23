import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Checks if the user needs to authenticate
 * This can be expanded to check token expiration, etc.
 */
export const needsAuthentication = async (): Promise<boolean> => {
  try {
    const authData = await AsyncStorage.getItem('auth-storage');
    if (!authData) return true;
    
    const { state } = JSON.parse(authData);
    return !state?.isAuthenticated;
  } catch (error) {
    console.error('Error checking auth state:', error);
    return true; // Default to requiring auth if there's an error
  }
};