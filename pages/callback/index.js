import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { config } from '../../lib/config';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default function Callback() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing your request...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const { token, type, error, error_description, code } = router.query;

      console.log('🔐 Callback received:', { 
        hasToken: !!token,
        type, 
        hasError: !!error,
        hasCode: !!code 
      });

      // Handle error cases first
      if (error) {
        console.error('❌ OAuth error:', error, error_description);
        setMessage(`Authentication failed: ${error_description || error}`);
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      // Handle OAuth callback (Google, GitHub, etc) - FIXED APPROACH
      if (code) {
        try {
          console.log('🔄 Processing OAuth callback...');
          
          // For OAuth, we need to redirect back to app with the code
          // Let the Flutter app handle the session exchange
          const deepLinkUrl = `${config.app.scheme}://login-callback?code=${code}&type=oauth`;
          console.log('🔗 Redirecting to app:', deepLinkUrl);
          
          setIsSuccess(true);
          setMessage('OAuth authentication successful! Redirecting to app...');
          
          // Redirect to app immediately
          window.location.href = deepLinkUrl;
          return;

        } catch (err) {
          console.error('❌ OAuth processing error:', err);
          setMessage(`OAuth processing failed: ${err.message}`);
          setIsSuccess(false);
          setIsLoading(false);
        }
        return;
      }

      // Handle email verification (Magic Link/OTP)
      if (type === 'signup' && token) {
        try {
          console.log('📧 Verifying email...');
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (verifyError) {
            throw new Error(verifyError.message);
          }

          console.log('✅ Email verified successfully');
          setIsSuccess(true);
          setMessage('Email verified successfully! Redirecting to app...');

          // Redirect to app
          window.location.href = `${config.app.scheme}://login-callback?type=signup&status=success`;
          return;
          
        } catch (err) {
          console.error('❌ Verification error:', err);
          setMessage(`Verification failed: ${err.message}`);
          setIsSuccess(false);
          setIsLoading(false);
        }
      } 
      else if (type === 'magiclink' && token) {
        try {
          console.log('🔗 Processing Magic Link...');
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'magiclink'
          });

          if (verifyError) {
            throw new Error(verifyError.message);
          }

          console.log('✅ Magic Link authentication successful');
          setIsSuccess(true);
          setMessage('Login successful! Redirecting to app...');

          window.location.href = `${config.app.scheme}://login-callback?type=magiclink&status=success`;
          return;
          
        } catch (err) {
          console.error('❌ Magic Link error:', err);
          setMessage(`Magic Link authentication failed: ${err.message}`);
          setIsSuccess(false);
          setIsLoading(false);
        }
      }
      else if (type === 'recovery' && token) {
        try {
          console.log('🔑 Processing password recovery...');
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (verifyError) {
            throw new Error(verifyError.message);
          }

          console.log('✅ Password recovery verified');
          setIsSuccess(true);
          setMessage('Password reset verified! You can now set a new password in the app.');

          window.location.href = `${config.app.scheme}://login-callback?type=recovery&status=success`;
          return;
          
        } catch (err) {
          console.error('❌ Password recovery error:', err);
          setMessage(`Password reset failed: ${err.message}`);
          setIsSuccess(false);
          setIsLoading(false);
        }
      }
      else {
        console.warn('⚠️ Unhandled callback parameters:', router.query);
        setMessage('Invalid or unsupported callback parameters. Please try again.');
        setIsSuccess(false);
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  const handleOpenApp = () => {
    window.location.href = `${config.app.scheme}://login-callback`;
  };

  const handleRetry = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-soft border border-gray-100 p-8">
        <div className="text-center">
          {/* Status Icon */}
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isSuccess ? (
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {isLoading ? 'Processing...' : isSuccess ? 'Success!' : 'Authentication Failed'}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
          
          {/* Actions */}
          {!isLoading && (
            <div className="space-y-3">
              <button
                onClick={handleOpenApp}
                className="btn-primary w-full"
              >
                Open App
              </button>
              
              {!isSuccess && (
                <button
                  onClick={handleRetry}
                  className="btn-secondary w-full"
                >
                  Back to Home
                </button>
              )}
            </div>
          )}

          {/* Loading Progress */}
          {isLoading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-500 text-xs mt-2">Processing authentication...</p>
            </div>
          )}
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs font-mono text-gray-600 break-all">
              <strong>Debug Info:</strong><br/>
              Query: {JSON.stringify(router.query)}<br/>
              App Scheme: {config.app.scheme}<br/>
              Has Code: {!!router.query.code}<br/>
              Has Token: {!!router.query.token}<br/>
              Type: {router.query.type}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
