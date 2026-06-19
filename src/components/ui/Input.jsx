import { forwardRef } from 'react'

/**
 * Input UI Component
 *
 * @param {string} [label] - Label text shown above the input
 * @param {string} [error] - Error message shown below the input (also applies error styling)
 * @param {string} [hint] - Helper text shown below the input when there is no error
 * @param {string} [className=''] - Extra classes applied to the wrapper div
 * @param {React.InputHTMLAttributes} [...props] - Native input attributes (id, type, placeholder, value, onChange, etc.)
 */
const Input = forwardRef(function Input(
  { label, error, hint, className = '', ...props },
  ref
) {
  const inputId = props.id || props.name || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-150
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 dark:border-red-500'
              : 'border-gray-200 dark:border-gray-600 focus:ring-forest-500 focus:border-forest-500'
          }
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-gray-400 dark:text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
