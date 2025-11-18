import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { config } from '../../lib/config';

export default function Success() {
  const router = useRouter();
  const { type } = router.query;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect to app after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          redirectToApp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const redirectToApp = () => {
    // Track successful redirect
    if (config.features.enableAnalytics && window.gtag) {
      window.gtag('event', 'auto_redirect_to_app', {
        event_category: 'Navigation',
        event_label: type || 'unknown'
      });
    }
    
    window.location.href = `${config.app.scheme}://login-callback/`;
  };

  const handleOpenApp = () => {
    // Track manual app open
    if (config.features.enableAnalytics && window.gtag) {
      window.gtag('event', 'manual_open_app', {
        event_category: 'Navigation',
        event_label: type || 'unknown'
      });
    }
    
    redirectToApp();
  };

  const getSuccessConfig = () => {
    switch (type) {
      case 'signup':
        return {
          title: 'Email Verified Successfully! 🎉',
          message: `Your email has been verified. Welcome to ${config.app.name}! You can now use all features of the app.`,
          buttonText: `Open ${config.app.name}`,
          icon: 'check',
          color: 'green'
        };
      case 'recovery':
        return {
          title: 'Password Reset Ready!',
          message: 'You can now set a new password in the app.',
          buttonText: `Open ${config.app.name} to Reset Password`,
          icon: 'key',
          color: 'blue'
        };
      default:
        return {
          title: 'Success!',
          message: 'Your action was completed successfully.',
          buttonText: `Open ${config.app.name}`,
          icon: 'check',
          color: 'green'
        };
    }
  };

  const { title, message, buttonText, icon, color } = getSuccessConfig();

  const getIcon = () => {
    switch (icon) {
      case 'check':
        return (
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'key':
        return (
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-soft border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {getIcon()}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          
          <p className="text-gray-600 mb-4 leading-relaxed">{message}</p>
          
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to {config.app.name} in {countdown} seconds...
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleOpenApp}
              className="btn-success w-full"
            >
              {buttonText}
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.close()}
                className="btn-secondary flex-1"
              >
                Close Page
              </button>
              
              {config.features.enableSupport && (
                <a
                  href={`mailto:${config.app.supportEmail}`}
                  className="btn-secondary flex-1"
                >
                  Contact Support
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Having trouble? Make sure {config.app.name} is installed on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
