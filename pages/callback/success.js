import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
          window.location.href = 'yourapp://login-callback/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSuccessMessage = () => {
    switch (type) {
      case 'signup':
        return {
          title: 'Email Verified Successfully!',
          message: 'Your email has been verified. You can now use all features of the app.',
          buttonText: 'Open App'
        };
      case 'recovery':
        return {
          title: 'Password Reset Ready!',
          message: 'You can now set a new password in the app.',
          buttonText: 'Open App to Reset Password'
        };
      default:
        return {
          title: 'Success!',
          message: 'Your action was completed successfully.',
          buttonText: 'Open App'
        };
    }
  };

  const { title, message, buttonText } = getSuccessMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          
          <p className="text-gray-600 mb-4">{message}</p>
          
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to app in {countdown} seconds...
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = 'yourapp://login-callback/'}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            >
              {buttonText}
            </button>
            
            <button
              onClick={() => window.close()}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Close Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
