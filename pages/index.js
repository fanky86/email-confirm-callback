import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { config } from '../lib/config';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to callback if there are query parameters
    if (router.isReady && Object.keys(router.query).length > 0) {
      router.replace({
        pathname: '/callback',
        query: router.query,
      });
    }
  }, [router.isReady, router.query, router]);

  const handleOpenApp = () => {
    window.location.href = `${config.app.scheme}://login-callback/`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-soft border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {config.app.name}
        </h1>
        
        <p className="text-gray-600 mb-6">
          Authentication Service
        </p>
        
        <p className="text-gray-500 text-sm mb-6">
          This page handles email verification and OAuth logins for {config.app.name}.
        </p>
        
        <button
          onClick={handleOpenApp}
          className="btn-primary w-full mb-4"
        >
          Open {config.app.name}
        </button>
        
        <p className="text-xs text-gray-400">
          You should access this page through authentication links sent to your email.
        </p>
      </div>
    </div>
  );
}
