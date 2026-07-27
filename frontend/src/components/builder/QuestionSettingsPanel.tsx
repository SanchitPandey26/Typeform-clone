"use client";

import { HelpCircle, Plus, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Question } from "@/types";
import { QUESTION_TYPES, getQuestionTypeConfig } from "@/lib/questionTypes";
import Toggle from "@/components/ui/Toggle";

export default function QuestionSettingsPanel({
  question, onUpdate,
}: {
  question: Question;
  onUpdate: (id: number, data: Partial<Question>) => void;
}) {
  const config = getQuestionTypeConfig(question.type);

  return (
    <aside className="w-[320px] shrink-0 bg-white shadow-sm rounded-xl overflow-y-auto p-5 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="font-semibold text-gray-900">Question</h3>
        <HelpCircle size={14} className="text-gray-300" />
      </div>
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
        <button className="flex-1 text-sm font-medium bg-gray-100 py-1.5">Text</button>
        <button className="flex-1 text-sm text-gray-400 py-1.5 cursor-not-allowed">Video</button>
      </div>

      <h3 className="font-semibold text-gray-900 mb-3">Answer</h3>
      <select
        value={question.type}
        onChange={(e) => {
          const newConfig = getQuestionTypeConfig(e.target.value as any);
          onUpdate(question.id, {
            type: e.target.value as any,
            options: newConfig.hasOptions ? question.options || ["Option 1"] : null,
          });
        }}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none"
      >
        {QUESTION_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <div className="space-y-1 mb-4">
        <Toggle
          label="Required"
          checked={question.required}
          onChange={(v) => onUpdate(question.id, { required: v })}
        />
        {config.hasOptions && (
          <>
            <Toggle label="Multiple selection" checked={false} disabled />
            <Toggle label="Randomize" checked={false} disabled />
            <Toggle label='"Other" option' checked={false} disabled />
            <Toggle label='"None" option' checked={false} disabled />
          </>
        )}
        {(question.type === "short_text" || question.type === "long_text" || question.type === "number") && (
          <>
            <Toggle label="Answer validation" checked={false} disabled />
            <Toggle label="Custom placeholder text" checked={false} disabled />
          </>
        )}
      </div>

      <Toggle label="Map to contacts" checked={false} disabled />

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-400">Image or video</span>
        <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 cursor-not-allowed">
          <Plus size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">Logic</span>
        <button
          onClick={() => toast("Logic branching — coming soon", { icon: "🔀" })}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-300 cursor-not-allowed">
        Comments <ShieldCheck size={13} />
      </div>
    </aside>
  );
}