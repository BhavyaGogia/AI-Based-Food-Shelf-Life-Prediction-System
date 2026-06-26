import React from 'react'

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="glass-panel p-8 border-l-4 border-l-emerald-500 dark:border-l-emerald-400 animate-fade-up">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-200">
            {result.product_name || 'Analysis Completed'}
          </h3>
          {result.sku && (
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded text-slate-500 dark:text-slate-400">
              {result.sku}
            </span>
          )}
        </div>
        {/* Confidence Score Badge */}
        {result.sealed_shelf_life?.confidence && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            result.sealed_shelf_life.confidence === 'High' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : result.sealed_shelf_life.confidence === 'Medium'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}>
            {result.sealed_shelf_life.confidence} Conf
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Shelf Life Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Sealed Shelf Life</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{result.sealed_shelf_life?.duration_display || 'N/A'}</span>
            {result.sealed_shelf_life?.best_before_date && (
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Best before: {result.sealed_shelf_life.best_before_date}</span>
            )}
          </div>

          {result.after_opening_shelf_life && (
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">After Opening</span>
              <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                {result.after_opening_shelf_life.display_refrigerated || result.after_opening_shelf_life.display_room_temp || result.after_opening_shelf_life.label_instruction || 'N/A'}
              </span>
              {result.after_opening_shelf_life.label_instruction && (
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{result.after_opening_shelf_life.label_instruction}</span>
              )}
            </div>
          )}
        </div>

        {/* Highlighted Label Ready Text */}
        {result.label_ready_text && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-5 rounded-2xl">
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">📜 Generated Label Statement</span>
            <p className="text-sm font-semibold italic text-emerald-900 dark:text-emerald-300">
              "{result.label_ready_text}"
            </p>
          </div>
        )}

        {/* Improvement Suggestions / Storage Tips */}
        {(result.improvement_suggestions || result.storage_tips) && (
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300 mb-2.5">💡 Storage Recommendations</h4>
            <ul className="space-y-1.5 pl-1.5 text-sm text-slate-600 dark:text-slate-400 list-none">
              {(result.improvement_suggestions || result.storage_tips || []).map((tip, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {result.risk_factors && result.risk_factors.length > 0 && (
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">⚠️ Critical Hazards & Risks</h4>
            <div className="space-y-2.5">
              {result.risk_factors.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950 rounded-xl">
                  <span className="text-xl flex-shrink-0 text-rose-500">⚠️</span>
                  <div className="text-sm">
                    <span className={`font-bold uppercase text-xs mr-2 ${
                      risk.severity === 'critical' ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                    }`}>
                      [{risk.severity || 'warning'}]
                    </span>
                    <span className="text-rose-900 dark:text-slate-300 font-medium">{risk.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
