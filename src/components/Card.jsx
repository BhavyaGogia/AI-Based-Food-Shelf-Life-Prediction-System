/**
 * Reusable Card component
 * @param {string} icon - Emoji or icon
 * @param {string} title - Card title
 * @param {string} description - Card body text
 * @param {string} [badge] - Optional badge label (e.g., "New")
 * @param {string} [badgeColor] - Tailwind color class for badge (e.g., "amber")
 */
export default function Card({ icon, title, description, badge, badgeColor = 'emerald' }) {
  return (
    <article className="glass-card group relative p-8 h-full flex flex-col hover:-translate-y-2">
      {/* Decorative gradient blob on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      {/* Optional badge */}
      {badge && (
        <span
          className={`absolute top-5 right-5 text-xs font-heading font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide
            ${badgeColor === 'amber'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
            }`}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        <span className="filter drop-shadow-sm">{icon}</span>
      </div>

      {/* Content */}
      <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-slate-100 mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow font-light">
        {description}
      </p>
    </article>
  )
}
