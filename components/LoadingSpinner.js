export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary',
  className = '' 
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-200 border-t-gray-600',
    success: 'border-success-200 border-t-success-600',
    error: 'border-error-200 border-t-error-600'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        border-4 rounded-full animate-spin 
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
