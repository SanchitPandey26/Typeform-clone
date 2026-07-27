"use client";

import { Question } from "@/types";
import { Star, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface Props {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  autoFocus?: boolean;
}

export default function QuestionRenderer({ question, value, onChange, autoFocus }: Props) {
  switch (question.type) {
    case "short_text":
    case "email":
      return (
        <input
          type={question.type === "email" ? "email" : "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Type your answer here..."
          className="w-full text-[22px] text-gray-700 border-b border-gray-400 focus:border-black outline-none py-2 bg-transparent transition-colors placeholder:text-gray-300"
        />
      );

    case "long_text":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          rows={2}
          placeholder="Type your answer here..."
          className="w-full text-[22px] text-gray-700 border-b border-gray-400 focus:border-black outline-none py-2 bg-transparent resize-none transition-colors placeholder:text-gray-300"
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          autoFocus={autoFocus}
          placeholder="Type your answer here..."
          className="w-full text-[22px] text-gray-700 border-b border-gray-400 focus:border-black outline-none py-2 bg-transparent transition-colors placeholder:text-gray-300"
        />
      );

    case "multiple_choice":
      return (
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt, i) => (
            <button
              key={i}
              onClick={() => onChange(opt)}
              className={clsx(
                "w-full text-left px-2 py-2 rounded-lg flex items-center gap-3 transition-colors border shadow-sm",
                value === opt
                  ? "bg-gray-200 text-gray-900 border-gray-300 shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-transparent hover:border-gray-200"
              )}
            >
              <span className="text-[11px] font-bold bg-white text-gray-700 border border-gray-200 rounded px-1.5 py-0.5 flex items-center justify-center">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-[15px]">{opt}</span>
            </button>
          ))}
        </div>
      );

    case "dropdown":
      return (
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={autoFocus}
            className="w-full text-[20px] text-gray-700 border-b border-gray-400 focus:border-black outline-none py-2 bg-transparent appearance-none cursor-pointer pr-8"
          >
            <option value="" disabled className="text-gray-300">
              Type or select an option
            </option>
            {(question.options || []).map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      );

    case "yes_no":
      return (
        <div className="flex gap-3">
          {[
            { label: "Yes", val: true },
            { label: "No", val: false },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => onChange(o.val)}
              className={clsx(
                "px-8 py-3 border-2 rounded-lg font-medium transition-colors",
                value === o.val
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      );

    case "rating": {
      const max = question.settings?.max_rating || 5;
      return (
        <div className="flex gap-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => onChange(n)}>
              <Star
                size={32}
                className={clsx(
                  "transition-colors",
                  value >= n ? "fill-black text-black" : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}