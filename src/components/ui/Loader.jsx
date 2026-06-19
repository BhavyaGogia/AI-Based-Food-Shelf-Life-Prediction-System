/**
 * Loader UI Component — animated loading indicator.
 *
 * @param {'spinner' | 'dots' | 'bar'} [variant='spinner'] - Visual style of the loader
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Size of the loader
 * @param {string} [label='Loading…'] - Accessible screen-reader label
 * @param {string} [className=''] - Extra classes applied to the wrapper
 */
export default function Loader({ variant = 'spinner', size = 'md', label = 'Loading…', className = '' }) {
  const spinnerSizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const dotSizes    = { sm: 'w-1.5 h-1.5', md: 'w-2.5 h-2.5', lg: 'w-4 h-4' }

  if (variant === 'spinner') {
    return (
      <span
        role="status"
        aria-label={label}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <svg
          className={`animate-spin ${spinnerSizes[size]} text-forest-700 dark:text-forest-400`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  if (variant === 'dots') {
    return (
      <span
        role="status"
        aria-label={label}
        className={`inline-flex items-center gap-1.5 ${className}`}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dotSizes[size]} rounded-full bg-forest-700 dark:bg-forest-400`}
            style={{ animation: `bounce 1.2s infinite ${i * 0.2}s` }}
          />
        ))}
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  if (variant === 'bar') {
    return (
      <span
        role="status"
        aria-label={label}
        className={`block w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 h-2 ${className}`}
      >
        <span className="block h-full w-1/3 bg-forest-600 dark:bg-forest-400 rounded-full animate-pulse" />
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  return null
}
