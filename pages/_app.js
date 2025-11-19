import '../styles/globals.css'
import Head from 'next/head'
import { config, validateConfig } from '../lib/config'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Validate configuration on app start
    validateConfig();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="description" content={`Secure authentication service for ${config.app.name}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Authentication - ${config.app.name}`} />
        <meta property="og:description" content={`Secure email verification and OAuth service for ${config.app.name}`} />
        <meta property="og:type" content="website" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
