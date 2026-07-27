"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DropResult } from "@hello-pangea/dnd";

import { formsApi } from "@/lib/forms";
import { questionsApi } from "@/lib/questions";
import { Form, Question, QuestionType } from "@/types";
import BuilderTopBar from "@/components/builder/BuilderTopBar";
import BuilderToolbar from "@/components/builder/BuilderToolbar";
import PagesSidebar from "@/components/builder/PagesSidebar";
import QuestionCanvas from "@/components/builder/QuestionCanvas";
import QuestionSettingsPanel from "@/components/builder/QuestionSettingsPanel";
import AddContentModal from "@/components/builder/AddContentModal";
import PreviewModal from "@/components/builder/PreviewModal";
import ComingSoonPanel from "@/components/builder/ComingSoonPanel";
import ShareTab from "@/components/builder/ShareTab";
import { resultsApi, FormSummary, ResponseListItem } from "@/lib/results";
import ResultsSubNav, { ResultsTab } from "@/components/results/ResultsSubNav";
import InsightsTab from "@/components/results/InsightsTab";
import SummaryTab from "@/components/results/SummaryTab";
import ResponsesTab from "@/components/results/ResponsesTab";

type Selection = { type: "question"; id: number } | { type: "ending" };
type Tab = "content" | "workflow" | "connect" | "share" | "results";

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = Number(params.id);

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("content");
  const [selection, setSelection] = useState<Selection>({ type: "question", id: -1 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Results state
  const [resultsTab, setResultsTab] = useState<ResultsTab>("insights");
  const [summary, setSummary] = useState<FormSummary | null>(null);
  const [responses, setResponses] = useState<ResponseListItem[]>([]);

  const loadForm = async () => {
    try {
      const data = await formsApi.get(formId);
      setForm(data);
      if (data.questions.length > 0) setSelection({ type: "question", id: data.questions[0].id });
    } catch {
      toast.error("Form not found");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadForm(); }, [formId]);

  useEffect(() => {
    if (tab === "results" && form) {
      resultsApi.summary(form.id).then(setSummary).catch(() => toast.error("Failed to load summary"));
      resultsApi.list(form.id).then(setResponses).catch(() => toast.error("Failed to load responses"));
    }
  }, [tab, form?.id]);

  const handleDeleteResponses = async (ids: number[]) => {
    if (!form) return;
    try {
      await resultsApi.delete(form.id, ids);
      setResponses((prev) => prev.filter((r) => !ids.includes(r.id)));
      toast.success("Responses deleted");
    } catch {
      toast.error("Failed to delete responses");
    }
  };

  const handleAddQuestion = async (type: QuestionType) => {
    if (!form) return;
    try {
      const newQuestion = await questionsApi.create(form.id, {
        type,
        label: "",
        required: false,
        order_index: form.questions.length,
        options: type === "multiple_choice" || type === "dropdown" ? ["Option 1"] : null,
        settings: type === "rating" ? { max_rating: 5 } : null,
      });
      setForm((f) => (f ? { ...f, questions: [...f.questions, newQuestion] } : f));
      setSelection({ type: "question", id: newQuestion.id });
      setShowAddModal(false);
    } catch {
      toast.error("Failed to add question");
    }
  };

  const handleUpdateQuestion = (id: number, data: Partial<Question>) => {
    if (!form) return;
    setForm((f) => f ? { ...f, questions: f.questions.map((q) => (q.id === id ? { ...q, ...data } : q)) } : f);
    questionsApi.update(id, data).catch(() => toast.error("Failed to save question"));
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!form) return;
    try {
      await questionsApi.remove(id);
      const remaining = form.questions.filter((q) => q.id !== id);
      setForm((f) => (f ? { ...f, questions: remaining } : f));
      if (selection.type === "question" && selection.id === id) {
        setSelection(remaining.length > 0 ? { type: "question", id: remaining[0].id } : { type: "ending" });
      }
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleDuplicateQuestion = async (id: number) => {
    if (!form) return;
    const original = form.questions.find((q) => q.id === id);
    if (!original) return;
    try {
      const copy = await questionsApi.create(form.id, {
        type: original.type,
        label: original.label,
        help_text: original.help_text,
        required: original.required,
        order_index: form.questions.length,
        options: original.options,
        settings: original.settings,
      });
      setForm((f) => (f ? { ...f, questions: [...f.questions, copy] } : f));
    } catch {
      toast.error("Failed to duplicate question");
    }
  };

  const handleReorder = async (result: DropResult) => {
    if (!form || !result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const reordered = Array.from(form.questions);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    const withNewOrder = reordered.map((q, i) => ({ ...q, order_index: i }));
    setForm((f) => (f ? { ...f, questions: withNewOrder } : f));

    try {
      await questionsApi.reorder(form.id, withNewOrder.map((q) => ({ id: q.id, order_index: q.order_index })));
    } catch {
      toast.error("Failed to save new order");
      loadForm();
    }
  };

  const handleTogglePublish = async () => {
    if (!form) return;
    try {
      const updated = form.status === "published" ? await formsApi.unpublish(form.id) : await formsApi.publish(form.id);
      setForm((f) => (f ? { ...f, ...updated } : f));
      toast.success(updated.status === "published" ? "Form published" : "Form unpublished");
      return updated;
    } catch {
      toast.error("Action failed");
    }
  };

  const handleRename = async (newTitle: string) => {
    if (!form) return;
    try {
      const updated = await formsApi.update(form.id, { title: newTitle });
      setForm((f) => (f ? { ...f, title: updated.title } : f));
      toast.success("Form renamed");
    } catch {
      toast.error("Failed to rename form");
    }
  };

  const handleThankYouChange = (msg: string) => {
    setForm((f) => (f ? { ...f, thank_you_message: msg } : f));
  };
  const handleThankYouBlur = async () => {
    if (!form) return;
    try {
      await formsApi.update(form.id, { thank_you_message: form.thank_you_message });
    } catch {
      toast.error("Failed to save");
    }
  };

  if (loading || !form) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const selectedQuestion = selection.type === "question" ? form.questions.find((q) => q.id === selection.id) : null;
  const selectedIndex = selectedQuestion ? form.questions.indexOf(selectedQuestion) : -1;

  return (
    <div className="h-screen flex flex-col bg-[#f9f9f9]">
      <BuilderTopBar
        form={form}
        activeTab={tab}
        onTabChange={setTab}
        onTogglePublish={handleTogglePublish}
        onRename={handleRename}
      />

      {tab === "content" && (
        <div className="flex flex-1 overflow-hidden p-4 gap-4">
          <PagesSidebar
            form={form}
            selection={selection}
            onSelect={setSelection}
            onReorder={handleReorder}
            onDuplicate={handleDuplicateQuestion}
            onDelete={handleDeleteQuestion}
            onAddContent={() => setShowAddModal(true)}
          />

          <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <BuilderToolbar onAddContent={() => setShowAddModal(true)} onPreview={() => setShowPreview(true)} />

            {selection.type === "ending" ? (
              <div className="flex-1 flex items-start justify-center pt-16 px-6">
                <div className="w-full max-w-xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Thank you screen</h2>
                  <textarea
                    value={form.thank_you_message || ""}
                    onChange={(e) => handleThankYouChange(e.target.value)}
                    onBlur={handleThankYouBlur}
                    rows={4}
                    placeholder="Thanks for completing this form!"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            ) : selectedQuestion ? (
              <QuestionCanvas question={selectedQuestion} index={selectedIndex} onUpdate={handleUpdateQuestion} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Add a question to get started
              </div>
            )}
          </div>

          {selectedQuestion && (
            <QuestionSettingsPanel question={selectedQuestion} onUpdate={handleUpdateQuestion} />
          )}
        </div>
      )}

      {tab === "workflow" && <ComingSoonPanel title="Workflow" />}
      {tab === "connect" && <ComingSoonPanel title="Connect" />}
      {tab === "share" && form.slug && <ShareTab slug={form.slug} />}

      {tab === "results" && form && (
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          <ResultsSubNav tab={resultsTab} onChange={setResultsTab} />
          <div className="flex-1 overflow-y-auto bg-[#f9f9f9]">
            {resultsTab === "insights" && <InsightsTab submissions={summary?.total_responses || 0} />}
            {resultsTab === "summary" && (
              <SummaryTab summary={summary} onViewResponses={() => setResultsTab("responses")} />
            )}
            {resultsTab === "responses" && (
              <ResponsesTab
                formTitle={form.title}
                questions={form.questions}
                responses={responses}
                fetchDetail={(id) => resultsApi.get(form.id, id)}
                onOpen={(id) => toast("View response details not implemented yet")}
                onShare={() => setTab("share")}
                onDelete={handleDeleteResponses}
              />
            )}
          </div>
        </div>
      )}

      {showAddModal && <AddContentModal onAdd={handleAddQuestion} onClose={() => setShowAddModal(false)} />}
      {showPreview && <PreviewModal form={form} onClose={() => setShowPreview(false)} />}
    </div>
  );
}