import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">

        {/* Page header */}
        <div className="bg-forest-700 text-white py-16 sm:py-20">
          <div className="section-container">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">About This Project</h1>
            <p className="text-white/75 text-lg max-w-xl">
              Understanding the mission behind the AI-Based Food Shelf Life Prediction System.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="section-container py-16">
          <div className="max-w-3xl">

            <section className="mb-10" aria-labelledby="about-company">
              <h2 id="about-company" className="font-heading font-bold text-2xl text-forest-700 mb-4">
                🏢 About HimShakti
              </h2>
              <p className="text-gray-600 leading-relaxed">
                HimShakti Food Processing is a company based in Uttarakhand that produces
                natural Himalayan food products — millet snacks, fruit pickles, and cold-pressed juices —
                using traditional recipes with <strong>no chemical preservatives</strong>.
              </p>
            </section>

            <section className="mb-10" aria-labelledby="about-problem">
              <h2 id="about-problem" className="font-heading font-bold text-2xl text-forest-700 mb-4">
                ❗ The Problem
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Without chemical preservatives, shelf life varies for every batch depending on ingredients,
                processing method, and packaging. HimShakti's production team currently estimates expiry
                dates manually — causing food waste, customer complaints, and inconsistent labeling.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Large companies use expensive lab testing. No affordable tool exists for small food
                companies in India.
              </p>
            </section>

            <section className="mb-10" aria-labelledby="about-solution">
              <h2 id="about-solution" className="font-heading font-bold text-2xl text-forest-700 mb-4">
                🤖 Our Solution
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This web application allows production staff to enter recipe and processing details,
                and uses the <strong>Google Gemini AI API</strong> to predict exact shelf life — giving
                the correct expiry date, risk warnings, and suggestions to make products last longer naturally.
              </p>
            </section>

            <section aria-labelledby="about-intern">
              <h2 id="about-intern" className="font-heading font-bold text-2xl text-forest-700 mb-4">
                👤 Internship Context
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This project is built as part of the <strong>TBI-GEU Summer Internship 2026</strong>,
                Track S26_FSD (Frontend + Full Stack Development). The goal is to demonstrate real-world
                problem solving using React, Tailwind CSS, and the Gemini API.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
