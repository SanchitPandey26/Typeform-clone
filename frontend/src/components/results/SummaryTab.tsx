"use client";

import { useState } from "react";
import { List, ArrowUp, ArrowDown, Filter, Calendar, Palette, ShieldCheck } from "lucide-react";
import { FormSummary } from "@/lib/results";
import SummaryCard from "./SummaryCard";
import clsx from "clsx";

export default function SummaryTab({
  summary, onViewResponses,
}: {
  summary: FormSummary | null;
  onViewResponses: () => void;
}) {
  const [showPercent, setShowPercent] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Summary</h1>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-full px-3 py-1.5 cursor-not-allowed">
          <Palette size={14} /> Design
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-full px-3 py-1.5 cursor-not-allowed">
            <Calendar size={14} /> All time
          </button>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-full px-3 py-1.5 cursor-not-allowed">
            <Filter size={14} /> Filters
          </button>
          <ShieldCheck size={16} className="text-teal-500 cursor-not-allowed" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-full p-1 gap-0.5">
            <button className="p-1 rounded-md text-gray-500 cursor-not-allowed"><List size={14} /></button>
            <button className="p-1 rounded-md text-gray-500 cursor-not-allowed"><ArrowUp size={14} /></button>
            <button className="p-1 rounded-md text-gray-500 cursor-not-allowed"><ArrowDown size={14} /></button>
          </div>
          <div className="flex items-center border border-gray-200 rounded-full p-0.5">
            <button
              onClick={() => setShowPercent(false)}
              className={clsx("text-xs px-3 py-1 rounded-full font-medium", !showPercent ? "bg-gray-100 text-gray-900" : "text-gray-400")}
            >
              #
            </button>
            <button
              onClick={() => setShowPercent(true)}
              className={clsx("text-xs px-3 py-1 rounded-full font-medium", showPercent ? "bg-gray-100 text-gray-900" : "text-gray-400")}
            >
              %
            </button>
          </div>
        </div>
      </div>

      {!bannerDismissed && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-gray-900 text-sm mb-1">Contact details and integration questions</p>
            <p className="text-sm text-gray-600 mb-3">
              We've moved any contact or integration data to the Responses tab. This keeps your Summary focused on insights.
            </p>
            <button onClick={onViewResponses} className="bg-ink text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800">
              View Responses
            </button>
          </div>
          <button onClick={() => setBannerDismissed(true)} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>
      )}

      {summary && summary.questions.length > 0 ? (
        summary.questions.map((q) => (
          <SummaryCard key={q.question_id} summary={q} showPercent={showPercent} />
        ))
      ) : (
        <p className="text-sm text-gray-400 text-center py-16">No questions yet.</p>
      )}
    </div>
  );
}