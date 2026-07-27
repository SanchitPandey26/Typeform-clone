"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { formsApi } from "@/lib/forms";
import { resultsApi, ResponseListItem, ResponseDetail, FormSummary } from "@/lib/results";
import { Form } from "@/types";
import SummaryCard from "@/components/results/SummaryCard";
import ResponseDetailModal from "@/components/results/ResponseDetailModal";

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = Number(params.id);

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<ResponseListItem[]>([]);
  const [summary, setSummary] = useState<FormSummary | null>(null);
  const [selected, setSelected] = useState<ResponseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([formsApi.get(formId), resultsApi.list(formId), resultsApi.summary(formId)])
      .then(([f, r, s]) => {
        setForm(f);
        setResponses(r);
        setSummary(s);
      })
      .catch(() => toast.error("Failed to load results"))
      .finally(() => setLoading(false));
  }, [formId]);

  const openResponse = async (id: number) => {
    try {
      const detail = await resultsApi.get(formId, id);
      setSelected(detail);
    } catch {
      toast.error("Failed to load response");
    }
  };

  if (loading || !form) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.push(`/builder/${formId}`)} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">{form.title} — Results</h1>
        <span className="ml-auto text-sm text-gray-500">
          {summary?.completed_responses ?? 0} responses
          {summary && summary.total_responses > summary.completed_responses && (
            <span className="text-gray-400">
              {" "}
              ({summary.total_responses - summary.completed_responses} incomplete)
            </span>
          )}
        </span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Summary section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Summary
          </h2>
          {summary && summary.questions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.questions.map((q) => (
                <SummaryCard key={q.question_id} summary={q} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data yet.</p>
          )}
        </section>

        {/* Response table */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            All Responses
          </h2>
          {responses.length === 0 ? (
            <p className="text-sm text-gray-400">No responses yet.</p>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">ID</th>
                    <th className="px-4 py-2 font-medium">Submitted</th>
                    <th className="px-4 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => openResponse(r.id)}
                    >
                      <td className="px-4 py-3">#{r.id}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {r.submitted_at ? new Date(r.submitted_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-600">View →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selected && (
        <ResponseDetailModal
          response={selected}
          questions={form.questions}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}