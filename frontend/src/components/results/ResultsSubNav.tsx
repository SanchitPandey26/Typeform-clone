"use client";

import { ShieldCheck } from "lucide-react";
import clsx from "clsx";

export type ResultsTab = "insights" | "summary" | "responses";

export default function ResultsSubNav({ tab, onChange }: { tab: ResultsTab; onChange: (t: ResultsTab) => void }) {
  return (
    <div className="flex items-center gap-8 px-6 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-1.5 text-sm text-gray-400 py-4 cursor-not-allowed">
        Smart Insights
        <ShieldCheck size={14} className="text-teal-500" />
      </div>

      {(["insights", "summary", "responses"] as ResultsTab[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={clsx(
            "relative py-4 text-sm capitalize transition-colors",
            tab === t ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-800"
          )}
        >
          {t}
          {tab === t && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink rounded-full" />}
        </button>
      ))}
    </div>
  );
}