/**
 * Button UI Component
 *
 * @param {React.ReactNode} children - Button label or content
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} [variant='primary'] - Visual style
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Button size
 * @param {boolean} [loading=false] - Shows a spinner and disables interaction
 * @param {boolean} [disabled=false] - Disables the button
 * @param {string} [className=''] - Extra Tailwind classes
 * @param {React.ButtonHTMLAttributes} [...props] - Native button attributes (onClick, type, id, etc.)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none'

  const variants = {
    primary:
      'bg-forest-700 hover:bg-forest-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-forest-500 dark:bg-forest-600 dark:hover:bg-forest-500',
    secondary:
      'border-2 border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white focus-visible:ring-forest-500 dark:border-forest-400 dark:text-forest-300 dark:hover:bg-forest-700 dark:hover:text-white',
    ghost:
      'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
    danger:
      'bg-red-600 hover:bg-red-500 text-white shadow-md hover:shadow-lg focus-visible:ring-red-400 dark:bg-red-700 dark:hover:bg-red-600',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-8 py-3.5',
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
