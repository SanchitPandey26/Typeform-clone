"use client";

import { useState } from "react";
import { QuestionSummary } from "@/lib/results";
import { getQuestionTypeConfig, CATEGORY_COLORS } from "@/lib/questionTypes";
import { QuestionType } from "@/types";
import clsx from "clsx";

export default function SummaryCard({
  summary, showPercent,
}: {
  summary: QuestionSummary;
  showPercent: boolean;
}) {
  const [view, setView] = useState<"overview" | "trends">("overview");
  const hasBreakdown = summary.breakdown && Object.keys(summary.breakdown).length > 0;
  const total = summary.total_answers || 1;
  const maxCount = hasBreakdown ? Math.max(...Object.values(summary.breakdown!)) : 0;
  const config = getQuestionTypeConfig(summary.type as QuestionType);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={clsx("px-2 py-1 rounded-md text-xs font-semibold", CATEGORY_COLORS[config?.category ?? "other"])}>
            {config?.icon ? <config.icon size={13} /> : summary.question_id}
          </span>
          <span className="font-medium text-gray-900 flex-1 truncate">{summary.label || "Untitled question"}</span>
          <button className="text-gray-300 cursor-not-allowed">•••</button>
        </div>

        <p className="text-sm text-gray-400 mb-3">
          {summary.total_answers} out of {summary.total_answers} people answered this question.
        </p>

        <div className="flex items-center border border-gray-200 rounded-full p-0.5 w-fit mb-4">
          <button
            onClick={() => setView("overview")}
            className={clsx("text-xs px-3 py-1 rounded-full", view === "overview" ? "bg-gray-100 font-medium" : "text-gray-500")}
          >
            Overview
          </button>
          <button className="text-xs px-3 py-1 rounded-full text-gray-300 cursor-not-allowed">Trends</button>
        </div>

        {view === "overview" &&
          (hasBreakdown ? (
            <div className="space-y-2">
              {Object.entries(summary.breakdown!).map(([option, count]) => (
                <div key={option} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 truncate">{option}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${maxCount ? (count / maxCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">
                    {showPercent ? `${Math.round((count / total) * 100)}%` : count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">
              {summary.total_answers === 0 ? (
                <>
                  <span className="block text-base font-semibold text-gray-800 mb-1">Waiting for responses</span>
                  Your data will appear here.
                </>
              ) : (
                "Free-text answers — see individual responses"
              )}
            </p>
          ))}
      </div>
    </div>
  );
}