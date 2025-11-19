// Central configuration management
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'FanApp',
    scheme: process.env.NEXT_PUBLIC_APP_SCHEME || 'FanApp',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'radenmanis123@gmail.com',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  
  // URLs
  urls: {
    callback: '/callback',
    success: '/callback/success',
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
  
  if (!config.supabase.url?.includes('supabase.co')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL appears to be invalid');
  }
  
  if (!config.supabase.anonKey?.startsWith('eyJ')) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);
    if (typeof window !== 'undefined') {
      // Show friendly error in browser
      const errorDiv = document.createElement('div');
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
      `;
      errorDiv.innerHTML = `
        <strong>Configuration Error:</strong> 
        Please check your environment variables. 
        <br>Errors: ${errors.join(', ')}
      `;
      document.body.prepend(errorDiv);
    }
    return false;
  }
  
  console.log('✅ Configuration validated successfully');
  console.log('App Name:', config.app.name);
  console.log('Supabase URL:', config.supabase.url ? '✓ Set' : '✗ Missing');
  console.log('Supabase Anon Key:', config.supabase.anonKey ? '✓ Set' : '✗ Missing');
  
  return true;
};

export default config;
