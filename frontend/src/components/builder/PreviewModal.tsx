"use client";

import { useState, useCallback, useEffect } from "react";
import { X, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Form } from "@/types";
import QuestionSlide from "@/components/respond/QuestionSlide";

export default function PreviewModal({ form, onClose }: { form: Form; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [done, setDone] = useState(false);

  const restart = () => {
    setIndex(0);
    setAnswers({});
    setDone(false);
  };

  const goNext = useCallback(() => {
    if (index < form.questions.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }, [index, form.questions.length]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const question = form.questions[index];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center justify-center gap-2 py-3 border-b border-gray-100">
        <button onClick={onClose} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          <X size={16} />
        </button>
        <button onClick={restart} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          <RotateCcw size={16} />
        </button>
      </div>

      {done ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold text-gray-800">
            {form.thank_you_message || "Thanks for your response!"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center relative overflow-hidden px-6">
            <AnimatePresence mode="wait" custom={direction}>
              {question && (
                <QuestionSlide
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  error={null}
                  direction={direction}
                  onChange={(val) => setAnswers((a) => ({ ...a, [question.id]: val }))}
                  index={index}
                  isLast={index === form.questions.length - 1}
                  onNext={goNext}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">{index + 1} of {form.questions.length}</span>
            <div className="flex items-center gap-2">
              <button onClick={goPrev} disabled={index === 0} className="p-2 rounded-lg bg-gray-100 disabled:opacity-30">
                <ChevronUp size={16} />
              </button>
              <button onClick={goNext} className="flex items-center gap-1 px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium">
                {index === form.questions.length - 1 ? "Submit" : "OK"}
                {index < form.questions.length - 1 && <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}