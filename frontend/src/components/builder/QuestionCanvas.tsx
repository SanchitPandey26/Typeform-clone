"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Question } from "@/types";
import { getQuestionTypeConfig } from "@/lib/questionTypes";
import QuestionRenderer from "@/components/preview/QuestionRenderer";

interface Props {
  question: Question;
  index: number;
  onUpdate: (id: number, data: Partial<Question>) => void;
}

export default function QuestionCanvas({ question, index, onUpdate }: Props) {
  const [previewValue, setPreviewValue] = useState<any>(undefined);
  const config = getQuestionTypeConfig(question.type);

  const handleOptionChange = (i: number, value: string) => {
    const options = [...(question.options || [])];
    options[i] = value;
    onUpdate(question.id, { options });
  };
  const addOption = () => onUpdate(question.id, { options: [...(question.options || []), ""] });
  const removeOption = (i: number) =>
    onUpdate(question.id, { options: (question.options || []).filter((_, idx) => idx !== i) });

  return (
    <div className="flex-1 flex items-start justify-center py-16 px-6 overflow-y-auto">
      <div className="w-full max-w-xl">
        <div className="flex items-start gap-3 mb-4">
          <span className="w-7 h-7 bg-ink text-white rounded-md flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1">
            <input
              value={question.label}
              onChange={(e) => onUpdate(question.id, { label: e.target.value })}
              placeholder="Your question here. Recall information with @"
              className="w-full text-xl italic text-gray-800 placeholder:italic placeholder:text-gray-300 outline-none border-none mb-1"
            />
            <input
              value={question.help_text || ""}
              onChange={(e) => onUpdate(question.id, { help_text: e.target.value })}
              placeholder="Description (optional)"
              className="w-full text-sm italic text-gray-400 placeholder:italic outline-none border-none"
            />
          </div>
        </div>

        <div className="pl-10">
          {config.hasOptions ? (
            <div className="space-y-2">
              {(question.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2.5">
                    <span className="w-5 h-5 rounded bg-white border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder="choice"
                      className="flex-1 bg-transparent outline-none text-sm italic text-gray-700"
                    />
                  </div>
                  <button
                    onClick={() => removeOption(i)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-1 text-sm text-gray-500 underline hover:text-gray-800 mt-1"
              >
                Add choice
              </button>
            </div>
          ) : (
            <QuestionRenderer question={question} value={previewValue} onChange={setPreviewValue} />
          )}

          {question.type === "rating" && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
              Max rating:
              <input
                type="number"
                min={3}
                max={10}
                value={question.settings?.max_rating || 5}
                onChange={(e) => onUpdate(question.id, { settings: { max_rating: Number(e.target.value) } })}
                className="w-14 border border-gray-200 rounded-md px-2 py-1 outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}