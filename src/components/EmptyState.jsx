import React from 'react';

export default function EmptyState({ 
  icon = "📦", 
  title = "No Data Found", 
  message = "There are no items to display at this moment.", 
  actionLabel = null, 
  onAction = null 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/10 backdrop-blur-md my-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl mb-4 shadow-inner animate-bounce">
        {icon}
      </div>
      <h4 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-medium">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.03] transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
