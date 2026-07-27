import { ChevronDown, ChevronUp, MoreVertical, X, EyeOff } from "lucide-react";
import { Question } from "@/types";
import { ResponseDetail, ResponseListItem } from "@/lib/results";
import { getQuestionTypeConfig, CATEGORY_COLORS } from "@/lib/questionTypes";
import clsx from "clsx";

interface Props {
  responseId: number;
  responses: ResponseListItem[];
  details: Record<number, ResponseDetail>;
  questions: Question[];
  onClose: () => void;
  onNavigate: (id: number) => void;
}

export default function ResponseDetailPanel({
  responseId,
  responses,
  details,
  questions,
  onClose,
  onNavigate,
}: Props) {
  const currentIndex = responses.findIndex((r) => r.id === responseId);
  const response = responses[currentIndex];
  const detail = details[responseId];

  if (!response) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < responses.length - 1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(responses[currentIndex - 1].id);
  };
  const handleNext = () => {
    if (hasNext) onNavigate(responses[currentIndex + 1].id);
  };

  const formattedDate = response.submitted_at
    ? new Date(response.submitted_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      new Date(response.submitted_at).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="fixed top-0 right-0 h-full w-[450px] bg-[#f9f9f9] border-l border-gray-200 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="p-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent border-r border-gray-200 transition-colors"
            >
              <ChevronUp size={16} className="text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="p-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronDown size={16} className="text-gray-600" />
            </button>
          </div>
          <span className="text-[13px] text-gray-500 font-medium tracking-tight">
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={clsx(
              "text-[11px] font-medium px-2.5 py-0.5 rounded-full border",
              response.completed
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-600 border-gray-200"
            )}
          >
            {response.completed ? "Completed" : "Partial"}
          </span>
          <button className="text-gray-400 hover:text-gray-700 transition-colors">
            <MoreVertical size={16} />
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {questions.map((q) => {
          const config = getQuestionTypeConfig(q.type);
          const Icon = config.icon;
          const colorClass = CATEGORY_COLORS[config.category];
          
          const ans = detail?.answers?.find((a) => a.question_id === q.id);
          let displayValue = "";
          if (ans) {
            if (typeof ans.value === "boolean") displayValue = ans.value ? "Yes" : "No";
            else if (Array.isArray(ans.value)) displayValue = ans.value.join(", ");
            else displayValue = String(ans.value);
          }
          
          const isChoice = q.type === "multiple_choice" || q.type === "dropdown";

          return (
            <div key={q.id} className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <span className={clsx("p-1.5 rounded-md flex items-center justify-center shrink-0 mt-0.5", colorClass)}>
                  <Icon size={14} />
                </span>
                <p className="text-[14px] text-gray-800 leading-snug">
                  {q.label || "..."}
                </p>
              </div>
              
              <div className="pl-9 text-[14px] text-gray-700">
                {displayValue ? (
                  isChoice ? (
                    <span className="inline-block border border-gray-200 bg-gray-50 text-gray-700 text-[13px] px-3 py-1 rounded-md shadow-sm">
                      {displayValue}
                    </span>
                  ) : (
                    <span className="whitespace-pre-wrap">{displayValue}</span>
                  )
                ) : (
                  <span className="text-gray-300 italic">No answer</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Response ID */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 border border-gray-100 flex items-start gap-3 mt-4">
          <span className="p-1.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-gray-100 text-gray-500">
            <EyeOff size={14} />
          </span>
          <div>
            <p className="text-[14px] text-gray-800 mb-2">Response ID</p>
            <p className="text-[13px] text-gray-500 font-mono">
              {/* Dummy ID logic to mimic the screenshot */}
              {btoa(String(responseId)).replace(/=/g, "").toLowerCase() + "9r24s4yehbx5fjeepqzuxyvq9r246s"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
