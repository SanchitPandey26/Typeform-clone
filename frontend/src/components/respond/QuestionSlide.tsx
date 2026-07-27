"use client";

import { motion } from "framer-motion";
import { PublicQuestion } from "@/lib/public";
import QuestionRenderer from "@/components/preview/QuestionRenderer";

interface Props {
  question: PublicQuestion;
  value: any;
  error: string | null;
  onChange: (value: any) => void;
  direction: number; // 1 = forward, -1 = backward
  index: number;
  isLast: boolean;
  onNext: () => void;
  submitting?: boolean;
}

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({
    y: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function QuestionSlide({ question, value, error, onChange, direction, index, isLast, onNext, submitting }: Props) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="flex items-center justify-center bg-[#3D3C40] text-white text-[11px] font-bold w-5 h-5 rounded flex-shrink-0 mt-1">
          {index + 1}
        </div>
        <div>
          <h2 className="text-[22px] leading-snug text-gray-900">
            {question.label || "..."}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          {question.help_text && (
            <p className="text-gray-500 mt-2 text-sm">{question.help_text}</p>
          )}
        </div>
      </div>

      <div className="mt-6 mb-8 max-w-[500px]">
        {/* @ts-ignore - PublicQuestion is structurally compatible with Question here */}
        <QuestionRenderer question={question} value={value} onChange={onChange} autoFocus />
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-md border border-red-100">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={onNext}
          disabled={submitting}
          className="bg-[#2B2A2E] text-white px-5 py-2 rounded-md font-bold text-[14px] hover:bg-black transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting ? "..." : isLast ? "Submit" : "OK"}
        </button>
        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
          press <span className="font-bold">Ctrl</span> + <span className="font-bold">Enter ↵</span>
        </span>
      </div>
      
      {isLast && (
        <p className="text-xs text-gray-400 mt-4">
          Never submit passwords! - <span className="underline cursor-pointer">Report abuse</span>
        </p>
      )}
    </motion.div>
  );
}