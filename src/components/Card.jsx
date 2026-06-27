/**
 * Reusable Card component — Master Prompt Glassmorphic edition
 */
export default function Card({ icon, title, description, badge, badgeColor = 'emerald', isProduct = false }) {
  return (
    <article className={`glass-card group relative p-8 sm:p-10 h-full flex flex-col hover:-translate-y-3 hover:shadow-glass-hover transition-all duration-500 overflow-hidden ${
      isProduct ? 'border-t-2 border-t-emerald-500 dark:border-t-neon' : ''
    }`}>
      {/* Decorative gradient sweep on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-transparent dark:from-neon/10 dark:via-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-black/5 dark:bg-white/10 rounded-full blur-xl group-hover:translate-x-80 group-hover:translate-y-80 transition-transform duration-1000 pointer-events-none"></div>

      {/* Optional badge */}
      {badge && (
        <span
          className={`absolute top-6 right-6 text-[11px] font-heading font-bold px-3.5 py-1.5 rounded-full shadow-sm dark:shadow-glow tracking-widest uppercase z-10 backdrop-blur-md
            ${badgeColor === 'amber'
              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-800 dark:text-neon border border-emerald-500/40 dark:border-neon/40'
            }`}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 shadow-inner flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:rotate-[8deg] group-hover:border-emerald-500/50 dark:group-hover:border-neon/50 transition-all duration-500 relative z-10">
        <span className="filter drop-shadow-md">{icon}</span>
      </div>

      {/* Content */}
      <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mb-4 leading-snug group-hover:text-emerald-600 dark:group-hover:text-neon transition-colors relative z-10">
        {title}
      </h3>
      <p className="text-slate-700 dark:text-slate-400 text-base leading-relaxed flex-grow font-medium relative z-10">
        {description}
      </p>

      {/* Product Card specific link */}
      {isProduct && (
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 relative z-10">
          <span className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-neon group-hover:text-slate-900 dark:group-hover:text-white transition-colors cursor-pointer tracking-wide">
            View Details <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </span>
        </div>
      )}
    </article>
  )
}
