"use client";

import { X } from "lucide-react";
import { ResponseDetail } from "@/lib/results";
import { Question } from "@/types";

interface Props {
  response: ResponseDetail;
  questions: Question[];
  onClose: () => void;
}

function formatValue(value: any): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default function ResponseDetailModal({ response, questions, onClose }: Props) {
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q]));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Response #{response.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Submitted {response.submitted_at ? new Date(response.submitted_at).toLocaleString() : "—"}
        </p>

        <div className="space-y-4">
          {response.answers.map((a) => {
            const q = questionMap[a.question_id];
            return (
              <div key={a.id} className="border-b border-gray-100 pb-3">
                <p className="text-sm text-gray-500 mb-1">{q?.label || "Question"}</p>
                <p className="text-gray-900 font-medium">{formatValue(a.value)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}