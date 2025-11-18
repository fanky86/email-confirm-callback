import '../styles/globals.css'
import Head from 'next/head'
import { config, validateConfig } from '../lib/config'
import { useEffect } from 'react'

// Validate config on startup
if (typeof window !== 'undefined') {
  validateConfig();
}

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize analytics if enabled
    if (config.features.enableAnalytics && typeof window !== 'undefined') {
      // Google Analytics initialization
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', config.analytics.googleAnalyticsId);
      
      // Load Google Analytics script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="description" content={`Secure email verification for ${config.app.name}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Email Confirmation - ${config.app.name}`} />
        <meta property="og:description" content={`Secure email verification service for ${config.app.name}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Email Confirmation - ${config.app.name}`} />
        <meta name="twitter:description" content={`Secure email verification service for ${config.app.name}`} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Google Analytics */}
        {config.features.enableAnalytics && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.analytics.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
      </Head>
      <Component {...pageProps} />
    </>
  )
}
