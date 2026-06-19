import { useEffect, useState } from 'react'

/**
 * Toast UI Component — self-dismissing notification banner.
 *
 * @param {string} message - The text content of the toast
 * @param {'success' | 'error' | 'warning' | 'info'} [type='info'] - Visual style and icon
 * @param {number} [duration=3500] - Auto-dismiss delay in milliseconds. Use 0 to disable.
 * @param {() => void} onClose - Callback when the toast is closed (manual or auto)
 * @param {boolean} isVisible - Controls whether this toast is rendered/visible
 */
export default function Toast({ message, type = 'info', duration = 3500, onClose, isVisible }) {
  const [visible, setVisible] = useState(false)

  // Animate in
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setVisible(true), 10)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [isVisible])

  // Auto-dismiss
  useEffect(() => {
    if (!isVisible || duration === 0) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const styles = {
    success: {
      container: 'bg-green-50 border-green-300 dark:bg-green-900/40 dark:border-green-600',
      icon: '✅',
      text: 'text-green-800 dark:text-green-200',
    },
    error: {
      container: 'bg-red-50 border-red-300 dark:bg-red-900/40 dark:border-red-600',
      icon: '❌',
      text: 'text-red-800 dark:text-red-200',
    },
    warning: {
      container: 'bg-amber-50 border-amber-300 dark:bg-amber-900/40 dark:border-amber-600',
      icon: '⚠️',
      text: 'text-amber-800 dark:text-amber-200',
    },
    info: {
      container: 'bg-blue-50 border-blue-300 dark:bg-blue-900/40 dark:border-blue-600',
      icon: 'ℹ️',
      text: 'text-blue-800 dark:text-blue-200',
    },
  }

  const s = styles[type] || styles.info

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 max-w-sm w-full
        border rounded-xl px-4 py-3 shadow-lg transition-all duration-300
        ${s.container}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
      <p className={`flex-1 text-sm font-medium ${s.text}`}>{message}</p>
      <button
        id="toast-close-btn"
        onClick={onClose}
        className={`shrink-0 ${s.text} opacity-60 hover:opacity-100 transition-opacity`}
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
