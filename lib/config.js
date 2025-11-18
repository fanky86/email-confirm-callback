// Central configuration management
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Flutter Supabase App',
    scheme: process.env.NEXT_PUBLIC_APP_SCHEME || 'yourapp',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@yourapp.com',
    website: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://yourapp.com',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  
  // URLs
  urls: {
    callback: process.env.NEXT_PUBLIC_APP_URL ? 
      `${process.env.NEXT_PUBLIC_APP_URL}/callback` : 
      'https://your-vercel-app.vercel.app/callback',
    success: process.env.NEXT_PUBLIC_APP_URL ? 
      `${process.env.NEXT_PUBLIC_APP_URL}/callback/success` : 
      'https://your-vercel-app.vercel.app/callback/success',
  },
  
  // Features
  features: {
    enableAnalytics: !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    enableSupport: true,
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
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    return false;
  }
  
  return true;
};

export default config;
