import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

          // Success - redirect to success page
          router.push('/callback/success?type=signup');
          
        } catch (err) {
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

          // Success - redirect to success page for password reset
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isLoading ? 'Processing...' : isSuccess ? 'Success!' : 'Error'}
          </h1>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          {!isLoading && !isSuccess && (
            <button
              onClick={() => window.location.href = 'yourapp://login-callback/'}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Try Opening App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
