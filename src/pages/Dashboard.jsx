import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const placeholderStats = [
  { icon: '📦', label: 'Analyses Run', value: '—' },
  { icon: '🌾', label: 'Products Tracked', value: '—' },
  { icon: '✅', label: 'Safe Batches', value: '—' },
  { icon: '⚠️', label: 'Risk Warnings', value: '—' },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Navbar />

      <main className="flex-grow">

        {/* Page header */}
        <div className="bg-forest-700 text-white py-16 sm:py-20">
          <div className="section-container">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
              Analysis Dashboard
            </h1>
            <p className="text-white/75 text-lg max-w-xl">
              Shelf life analysis form and results will appear here in Week 3 after Gemini AI integration.
            </p>
          </div>
        </div>

        <div className="section-container py-12">

          {/* Stats row (placeholder) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {placeholderStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100"
              >
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="font-heading font-bold text-2xl text-forest-700">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Placeholder card */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-forest-200 p-12 text-center">
            <div className="text-5xl mb-4">🔬</div>
            <h2 className="font-heading font-bold text-2xl text-forest-700 mb-3">
              Shelf Life Analysis Form
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
              The 6-section ingredient form and AI prediction results will be built here in
              <strong> Week 3</strong> of the internship. This includes:
            </p>
            <ul className="text-left max-w-sm mx-auto text-gray-600 text-sm space-y-2 mb-8">
              <li>✅ Product Identity (Section 1)</li>
              <li>✅ Raw Material Sourcing (Section 2)</li>
              <li>✅ Ingredient Composition with sliders (Section 3)</li>
              <li>✅ Processing Method (Section 4)</li>
              <li>✅ Packaging &amp; Storage (Section 5)</li>
              <li>✅ Additional Notes (Section 6)</li>
              <li className="text-forest-600 font-medium">🤖 Gemini AI shelf life prediction result</li>
            </ul>
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 font-heading font-semibold text-sm px-4 py-2 rounded-full">
              ⏳ Coming in Week 3
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
