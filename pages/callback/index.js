import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { config } from '../../lib/config';
import LoadingSpinner from '../../components/LoadingSpinner';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default function Callback() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing your request...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const { token, type, error, error_description } = router.query;

      console.log('Callback received:', { token, type, error });

      if (error) {
        setMessage(`Error: ${error_description || error}`);
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      if (type === 'signup' && token) {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (verifyError) {
            throw new Error(verifyError.message);
          }

          // Track successful verification in analytics
          if (config.features.enableAnalytics && window.gtag) {
            window.gtag('event', 'email_verified', {
              event_category: 'Authentication',
              event_label: 'Signup'
            });
          }

          // Success - redirect to success page
          router.push('/callback/success?type=signup');
          
        } catch (err) {
          console.error('Verification error:', err);
          
          // Track verification failure
          if (config.features.enableAnalytics && window.gtag) {
            window.gtag('event', 'email_verification_failed', {
              event_category: 'Authentication',
              event_label: err.message
            });
          }
          
          setMessage(`Verification failed: ${err.message}`);
          setIsSuccess(false);
          setIsLoading(false);
        }
      } 
      else if (type === 'recovery' && token) {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (verifyError) {
            throw new Error(verifyError.message);
          }

          router.push('/callback/success?type=recovery');
          
        } catch (err) {
          setMessage(`Password reset failed: ${err.message}`);
          setIsSuccess(false);
          setIsLoading(false);
        }
      }
      else {
        setMessage('Invalid or missing parameters');
        setIsSuccess(false);
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query, router]);

  const handleOpenApp = () => {
    // Track app open attempt
    if (config.features.enableAnalytics && window.gtag) {
      window.gtag('event', 'open_app_clicked', {
        event_category: 'Navigation',
        event_label: 'Callback Page'
      });
    }
    
    window.location.href = `${config.app.scheme}://login-callback/`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-soft border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isLoading ? (
              <LoadingSpinner size="large" />
            ) : isSuccess ? (
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {isLoading ? 'Processing...' : isSuccess ? 'Success!' : 'Error'}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
          
          {!isLoading && !isSuccess && (
            <div className="space-y-3">
              <button
                onClick={handleOpenApp}
                className="btn-primary w-full"
              >
                Try Opening {config.app.name}
              </button>
              
              {config.features.enableSupport && (
                <a
                  href={`mailto:${config.app.supportEmail}?subject=Verification Help&body=Hello, I need help with email verification.`}
                  className="btn-secondary w-full"
                >
                  Contact Support
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
