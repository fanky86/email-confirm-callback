// Central configuration management
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  },
  
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'FanApp',
    scheme: process.env.NEXT_PUBLIC_APP_SCHEME?.trim() || 'FanApp',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || 'radenmanis123@gmail.com',
    website: process.env.NEXT_PUBLIC_WEBSITE_URL?.trim() || 'https://yourapp.com',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim(),
  },
  
  // URLs
  urls: {
    callback: '/callback',
    success: '/callback/success',
    home: '/',
  },
  
  // Features
  features: {
    enableAnalytics: !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    enableSupport: true,
    enableOAuth: true,
    enableMagicLink: true,
  },
  
  // OAuth Providers
  oauth: {
    google: {
      enabled: true,
      name: 'Google',
    },
    github: {
      enabled: true, 
      name: 'GitHub',
    },
    apple: {
      enabled: false, // Set to true if you configure Apple OAuth
      name: 'Apple',
    },
    facebook: {
      enabled: false, // Set to true if you configure Facebook OAuth
      name: 'Facebook',
    }
  }
};

// Validation
export const validateConfig = () => {
  const errors = [];
  
  if (!config.supabase.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }
  
  if (!config.supabase.anonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }
  
  if (config.supabase.url && !config.supabase.url.includes('supabase.co')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL appears to be invalid (should contain supabase.co)');
  }
  
  if (config.supabase.anonKey && !config.supabase.anonKey.startsWith('eyJ')) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (should start with eyJ)');
  }
  
  // Validate email format for support email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (config.app.supportEmail && !emailRegex.test(config.app.supportEmail)) {
    errors.push('NEXT_PUBLIC_SUPPORT_EMAIL appears to be invalid');
  }
  
  // Validate app scheme (should be alphanumeric)
  const schemeRegex = /^[a-zA-Z0-9]+$/;
  if (config.app.scheme && !schemeRegex.test(config.app.scheme)) {
    errors.push('NEXT_PUBLIC_APP_SCHEME should be alphanumeric (no spaces or special characters)');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);
    
    // Show friendly error in browser (development only)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Remove existing error div if any
      const existingError = document.getElementById('config-error-banner');
      if (existingError) existingError.remove();
      
      const errorDiv = document.createElement('div');
      errorDiv.id = 'config-error-banner';
      errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #dc2626;
        color: white;
        padding: 1rem;
        z-index: 10000;
        font-family: system-ui;
        font-size: 14px;
        border-bottom: 2px solid #b91c1c;
      `;
      errorDiv.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
          <strong>🚨 Configuration Error</strong> 
          <div style="margin-top: 0.5rem;">
            ${errors.join('<br>')}
          </div>
          <div style="margin-top: 0.5rem; font-size: 12px;">
            Check your environment variables in Vercel dashboard.
          </div>
        </div>
      `;
      document.body.prepend(errorDiv);
    }
    
    return false;
  }
  
  console.log('✅ Configuration validated successfully');
  console.log('App Name:', config.app.name);
  console.log('App Scheme:', config.app.scheme);
  console.log('Support Email:', config.app.supportEmail);
  console.log('Supabase URL:', config.supabase.url ? '✓ Set' : '✗ Missing');
  console.log('Supabase Anon Key:', config.supabase.anonKey ? '✓ Set' : '✗ Missing');
  console.log('Google Analytics:', config.features.enableAnalytics ? '✓ Enabled' : '✗ Disabled');
  
  return true;
};

// Get enabled OAuth providers
export const getEnabledOAuthProviders = () => {
  return Object.entries(config.oauth)
    .filter(([_, provider]) => provider.enabled)
    .map(([key, provider]) => ({
      id: key,
      name: provider.name,
    }));
};

// Check if specific OAuth provider is enabled
export const isOAuthProviderEnabled = (providerId) => {
  return config.oauth[providerId]?.enabled || false;
};

// Get deep link URL for the app
export const getAppDeepLink = (path = 'login-callback') => {
  return `${config.app.scheme}://${path}`;
};

// Get Supabase OAuth redirect URL
export const getSupabaseOAuthRedirect = () => {
  return `${typeof window !== 'undefined' ? window.location.origin : ''}${config.urls.callback}`;
};

// Runtime configuration check (for client-side)
if (typeof window !== 'undefined') {
  // Validate config on client side in development
  if (process.env.NODE_ENV === 'development') {
    validateConfig();
  }
}

export default config;
