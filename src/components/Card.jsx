/**
 * Reusable Card component
 * @param {string} icon - Emoji or icon
 * @param {string} title - Card title
 * @param {string} description - Card body text
 * @param {string} [badge] - Optional badge label (e.g., "New")
 * @param {string} [badgeColor] - Tailwind color class for badge (e.g., "amber")
 */
export default function Card({ icon, title, description, badge, badgeColor = 'forest' }) {
  return (
    <article className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">

      {/* Optional badge */}
      {badge && (
        <span
          className={`absolute top-4 right-4 text-xs font-heading font-semibold px-2.5 py-1 rounded-full
            ${badgeColor === 'amber'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-forest-50 text-forest-700'
            }`}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>

      {/* Content */}
      <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </article>
  )
}
