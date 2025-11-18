import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to callback handler if there are query parameters
    if (router.isReady && Object.keys(router.query).length > 0) {
      router.replace({
        pathname: '/callback',
        query: router.query,
      });
    }
  }, [router.isReady, router.query, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verification</h1>
        
        <p className="text-gray-600 mb-6">
          This is the email verification service for the Flutter Supabase App.
          You should access this page through the verification link sent to your email.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = 'yourapp://login-callback/'}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Open App
          </button>
          
          <button
            onClick={() => window.location.href = '/callback/success?type=signup'}
            className="w-full border border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50 transition duration-200"
          >
            Test Success Page
          </button>
        </div>
      </div>
    </div>
  );
}
