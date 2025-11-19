// Application constants
export const CONSTANTS = {
  // Authentication
  AUTH: {
    TOKEN_EXPIRY: 3600, // 1 hour in seconds
    REFRESH_TOKEN_EXPIRY: 2592000, // 30 days in seconds
  },
  
  // OAuth Providers
  PROVIDERS: {
    GOOGLE: 'google',
    GITHUB: 'github', 
    APPLE: 'apple',
    FACEBOOK: 'facebook',
  },
  
  // OTP Types
  OTP_TYPES: {
    SIGNUP: 'signup',
    LOGIN: 'magiclink',
    RECOVERY: 'recovery',
    INVITE: 'invite',
  },
  
  // Error Messages
  ERRORS: {
    INVALID_CONFIG: 'Invalid application configuration',
    NETWORK_ERROR: 'Network connection failed',
    AUTH_FAILED: 'Authentication failed',
    INVALID_EMAIL: 'Invalid email address',
  },
};

// Default configuration fallbacks
export const DEFAULTS = {
  APP_NAME: 'FanApp',
  APP_SCHEME: 'FanApp',
  SUPPORT_EMAIL: 'radenmanis123@gmail.com',
};
