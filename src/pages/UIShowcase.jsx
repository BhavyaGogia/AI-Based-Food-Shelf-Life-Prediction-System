import { useState } from 'react'
import { Button, Input, Modal, Toast, Loader } from '../components/ui'

/**
 * UIShowcase page to interactively verify the 5 required UI components.
 * This file is created dynamically for local manual testing and will not be pushed to master.
 */
export default function UIShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg)
    setToastType(type)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    if (val.length < 3) {
      setInputError('Must be at least 3 characters long')
    } else {
      setInputError('')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 bg-cream-50 dark:bg-gray-900 rounded-3xl min-h-screen transition-colors duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-400">UI Component Showcase</h1>
        <p className="text-gray-500 dark:text-gray-400">Interactive live testing of the 5 required components.</p>
        <div className="mt-4 flex gap-2">
          <a href="/" className="text-sm font-semibold text-forest-600 hover:underline">← Back to App</a>
        </div>
      </div>

      {/* 1. Button */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">1. Button Component</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" onClick={() => triggerToast('Primary clicked!')}>Primary</Button>
          <Button variant="secondary" onClick={() => triggerToast('Secondary clicked!')}>Secondary</Button>
          <Button variant="ghost" onClick={() => triggerToast('Ghost clicked!')}>Ghost</Button>
          <Button variant="danger" onClick={() => triggerToast('Danger clicked!', 'error')}>Danger</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" isLoading>Loading</Button>
        </div>
      </section>

      {/* 2. Input */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">2. Input Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Name Input (with validation)" 
            placeholder="Type at least 3 letters..." 
            value={inputValue}
            onChange={handleInputChange}
            error={inputError}
            hint="Input gets styled on success/error validation."
          />
          <Input 
            label="Disabled Input" 
            placeholder="Cannot type here..." 
            disabled 
          />
        </div>
      </section>

      {/* 3. Modal */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">3. Modal Component</h2>
        <div>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            🔬 Open Shelf Life Modal
          </Button>

          <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)}
            title="Analysis Confirmation"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => {
                  setModalOpen(false)
                  triggerToast('Analysis saved!', 'success')
                }}>Save Result</Button>
              </div>
            }
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Are you sure you want to run the shelf life analysis for the millet snack recipe? This counts against your monthly prediction limit.
            </p>
          </Modal>
        </div>
      </section>

      {/* 4. Loader */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">4. Loader Component</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium dark:text-white">Spinner:</span>
            <Loader variant="spinner" size="sm" />
            <Loader variant="spinner" size="md" />
            <Loader variant="spinner" size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium dark:text-white">Dots:</span>
            <Loader variant="dots" size="sm" />
            <Loader variant="dots" size="md" />
            <Loader variant="dots" size="lg" />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium dark:text-white">Progress Bar:</span>
            <Loader variant="bar" />
          </div>
        </div>
      </section>

      {/* 5. Toast (Absolute Notification) */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage('')} 
        />
      )}

    </div>
  )
}
