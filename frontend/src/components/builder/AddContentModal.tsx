"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { QuestionType } from "@/types";
import { QUESTION_TYPES, PLACEHOLDER_TYPES, CATEGORY_LABELS, QuestionCategory } from "@/lib/questionTypes";
import clsx from "clsx";

const CATEGORIES: QuestionCategory[] = ["contact_info", "choice", "rating_ranking", "text_video", "other"];

export default function AddContentModal({
  onAdd, onClose,
}: {
  onAdd: (type: QuestionType) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 pt-24 px-6" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[75vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-6 text-sm">
            <button className="font-semibold text-gray-900 pb-2 border-b-2 border-ink">Add form elements</button>
            <button className="text-gray-400 cursor-not-allowed">Import questions</button>
            <button className="text-gray-400 cursor-not-allowed">Create with AI</button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 mb-6">
            <Search size={16} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search form elements"
              className="flex-1 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {CATEGORIES.map((cat) => {
              const real = QUESTION_TYPES.filter(
                (t) => t.category === cat && t.label.toLowerCase().includes(search.toLowerCase())
              );
              const placeholders = PLACEHOLDER_TYPES.filter(
                (t) => t.category === cat && t.label.toLowerCase().includes(search.toLowerCase())
              );
              if (real.length === 0 && placeholders.length === 0) return null;

              return (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-400 mb-2">{CATEGORY_LABELS[cat]}</p>
                  <div className="space-y-0.5">
                    {real.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.value}
                          onClick={() => onAdd(t.value)}
                          className="w-full flex items-center gap-2.5 text-sm text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <Icon size={16} className="text-gray-500" />
                          {t.label}
                        </button>
                      );
                    })}
                    {placeholders.map((t) => {
                      const Icon = t.icon;
                      return (
                        <div
                          key={t.label}
                          className="w-full flex items-center gap-2.5 text-sm text-gray-350 px-2 py-1.5 rounded-lg cursor-not-allowed text-gray-400"
                        >
                          <Icon size={16} />
                          {t.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}