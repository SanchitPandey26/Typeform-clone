"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ChevronDown, Check } from "lucide-react";

import { publicApi, PublicForm } from "@/lib/public";
import { validateAnswer } from "@/lib/validation";
import QuestionSlide from "@/components/respond/QuestionSlide";

export default function RespondPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<PublicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    publicApi
      .getForm(slug)
      .then(setForm)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const currentQuestion = form?.questions[index];

  const goNext = useCallback(async () => {
    if (!form || !currentQuestion) return;

    const value = answers[currentQuestion.id];
    const validationError = validateAnswer(currentQuestion, value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (index < form.questions.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    } else {
      // Last question -> submit
      setSubmitting(true);
      try {
        const payload = form.questions.map((q) => ({
          question_id: q.id,
          value: answers[q.id] ?? null,
        }));
        await publicApi.submit(slug, payload);
        setSubmitted(true);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  }, [form, currentQuestion, answers, index, slug]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setError(null);
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (submitted || submitting) return;
      if (e.key === "Enter" && !(e.target as HTMLElement).matches("textarea")) {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, submitted, submitting]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        This form doesn't exist or isn't published.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            {form.thank_you_message || "Thanks for your response!"}
          </h1>
        </motion.div>
      </div>
    );
  }

  const progress = ((index + 1) / form.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col font-sans">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200 w-full fixed top-0 z-50">
        <motion.div
          className="h-full bg-black"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {currentQuestion && (
              <QuestionSlide
                key={currentQuestion.id}
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                error={error}
                direction={direction}
                index={index}
                isLast={index === form.questions.length - 1}
                submitting={submitting}
                onNext={goNext}
                onChange={(val) => {
                  setAnswers((a) => ({ ...a, [currentQuestion.id]: val }));
                  setError(null);
                }}
              />
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toolbar */}
      <div className="fixed bottom-4 right-4 flex items-center gap-[1px] z-50">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="bg-[#3D3C40] text-white p-2 rounded-l disabled:bg-[#3D3C40]/50 disabled:text-gray-400 hover:bg-[#2b2a2e] transition-colors"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={goNext}
          disabled={index === form.questions.length - 1}
          className="bg-[#3D3C40] text-white p-2 disabled:bg-[#3D3C40]/50 disabled:text-gray-400 hover:bg-[#2b2a2e] transition-colors"
        >
          <ChevronDown size={16} />
        </button>
        <div className="bg-[#3D3C40] text-white px-3 py-2 rounded-r flex items-center text-[11px] font-medium gap-1.5 cursor-pointer hover:bg-[#2b2a2e] transition-colors ml-[1px]">
          Powered by <span className="font-bold tracking-tight text-white flex items-center gap-1"><div className="w-2.5 h-3 flex gap-[1.5px]"><div className="w-1/2 h-full bg-white rounded-sm" /><div className="w-1/2 h-full bg-white rounded-sm" /></div> Typeform</span>
        </div>
      </div>
    </div>
  );
}