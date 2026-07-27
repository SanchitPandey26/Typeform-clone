"use client";

import { Calendar, Laptop, ShieldCheck } from "lucide-react";

export default function InsightsTab({ submissions }: { submissions: number }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 cursor-not-allowed">
          <Calendar size={14} /> All time
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 cursor-not-allowed">
          <Laptop size={14} /> All devices
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">Big picture</h2>

      <div className="grid grid-cols-5 gap-6 mb-10">
        {[
          { label: "Views", value: "—" },
          { label: "Starts", value: "—" },
          { label: "Submissions", value: submissions },
          { label: "Completion rate", value: "—" },
          { label: "Time to complete", value: "—" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-teal-50 rounded-2xl p-10 flex items-center justify-between gap-10 cursor-not-allowed">
        <div className="max-w-sm">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Question-by-question insights</h3>
          <p className="text-sm text-gray-600 mb-5">
            See where people abandon your form — the first step to improving your questions so you get more responses
          </p>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 bg-ink text-white text-sm font-medium px-4 py-2 rounded-full">
              <ShieldCheck size={14} /> Upgrade plan
            </span>
            <span className="text-sm text-gray-700 border border-gray-300 rounded-full px-4 py-2">Learn more</span>
          </div>
          <p className="text-xs text-gray-400">
            Available on these plans: Business, Talent, Growth Flow, Growth Custom
          </p>
        </div>
        <div className="w-64 h-72 bg-teal-100 rounded-xl shrink-0" />
      </div>
    </div>
  );
}