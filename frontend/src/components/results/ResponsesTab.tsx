"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Filter, Download, Inbox, AlertOctagon, Columns, SlidersHorizontal, ChevronDown, CheckCircle2, ListFilter, User, Building, Phone, Mail, ChevronRight, Trash2, X, Maximize2 } from "lucide-react";
import { Question } from "@/types";
import { ResponseListItem, ResponseDetail, AnswerDetail } from "@/lib/results";
import { getQuestionTypeConfig, CATEGORY_COLORS } from "@/lib/questionTypes";
import { exportResponsesToCsv } from "@/lib/csv";
import ResponseDetailPanel from "./ResponseDetailPanel";
import clsx from "clsx";

interface Props {
  formTitle: string;
  questions: Question[];
  responses: ResponseListItem[];
  fetchDetail: (id: number) => Promise<ResponseDetail>;
  onOpen: (id: number) => void;
  onShare: () => void;
  onDelete: (ids: number[]) => Promise<void>;
}

export default function ResponsesTab({ formTitle, questions, responses, fetchDetail, onOpen, onShare, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [details, setDetails] = useState<Record<number, ResponseDetail>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingResponseId, setViewingResponseId] = useState<number | null>(null);

  useEffect(() => {
    responses.forEach(async (r) => {
      if (!details[r.id]) {
        try {
          const d = await fetchDetail(r.id);
          setDetails((prev) => ({ ...prev, [r.id]: d }));
        } catch (e) {
          // ignore
        }
      }
    });
  }, [responses, fetchDetail]);

  const filtered = useMemo(
    () => responses.filter((r) => String(r.id).includes(search)),
    [responses, search]
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      const fetchedDetails = await Promise.all(responses.map((r) => fetchDetail(r.id)));
      exportResponsesToCsv(formTitle, questions, fetchedDetails);
    } finally {
      setExporting(false);
    }
  };

  const handleExportSelected = async () => {
    setExporting(true);
    try {
      const fetchedDetails = await Promise.all(
        Array.from(selected).map((id) => fetchDetail(id))
      );
      exportResponsesToCsv(formTitle, questions, fetchedDetails);
    } finally {
      setExporting(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(new Set(filtered.map((r) => r.id)));
    else setSelected(new Set());
  };

  const handleSelect = (id: number, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    setIsDeleting(true);
    try {
      await onDelete(Array.from(selected));
      setSelected(new Set());
    } finally {
      setIsDeleting(false);
    }
  };

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Inbox size={28} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No responses</h2>
        <p className="text-sm text-gray-500 mb-5 max-w-sm">
          Share your form to start collecting data, or generate sample responses to test your workflow
        </p>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="bg-ink text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800">
            Share your form
          </button>
          <button className="border border-gray-200 text-sm text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
            Generate test response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-wrap bg-white">
          <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50/50">
            <button className="text-sm px-3 py-1.5 rounded-md bg-white shadow-sm font-medium flex items-center gap-1.5 text-gray-900 border border-gray-100/50">
              <Inbox size={14} className="text-gray-500" /> Responses
            </button>
            <button className="text-sm px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-100 flex items-center gap-1.5 cursor-not-allowed">
              <AlertOctagon size={14} /> Spam [0]
            </button>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 max-w-[200px] bg-white">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search responses"
              className="flex-1 text-sm outline-none min-w-0 bg-transparent text-gray-700"
            />
          </div>

          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 bg-white cursor-not-allowed">
            <Calendar size={14} /> All time
          </button>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 bg-white cursor-not-allowed">
            <ListFilter size={14} /> Filters
          </button>

          <div className="ml-auto flex items-center gap-3 text-gray-400">
            <button className="hover:text-gray-600 cursor-not-allowed"><Columns size={16} /></button>
            <button className="hover:text-gray-600 cursor-not-allowed"><SlidersHorizontal size={16} /></button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="hover:text-gray-600 disabled:opacity-50"
              title="Export as CSV"
            >
              <Download size={16} />
            </button>
          </div>
          <button className="ml-2 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-lg cursor-not-allowed bg-white">
            Generate test response
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-sm whitespace-nowrap">
          <thead className="text-left text-[13px] text-gray-700 bg-white">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3.5 w-12 font-medium">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-ink focus:ring-ink"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  ref={(input) => {
                    if (input) input.indeterminate = selected.size > 0 && selected.size < filtered.length;
                  }}
                  onChange={handleSelectAll}
                />
              </th>
              
              <th className="px-4 py-3.5 font-medium border-l border-gray-100 min-w-[150px]">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 p-1 rounded">
                    <Calendar size={14} className="text-gray-500" />
                  </span>
                  Response time
                </div>
              </th>
              <th className="px-4 py-3.5 font-medium border-l border-gray-100 min-w-[150px]">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 p-1 rounded">
                    <ListFilter size={14} className="text-gray-500" />
                  </span>
                  Response type
                </div>
              </th>
              {questions.map((q) => {
                const config = getQuestionTypeConfig(q.type);
                const Icon = config?.icon || ChevronRight;
                const colorClass = CATEGORY_COLORS[config?.category || "other"];
                return (
                  <th key={q.id} className="px-4 py-3.5 font-medium border-l border-gray-100 min-w-[150px]">
                    <div className="flex items-center gap-2">
                      <span className={clsx("p-1 rounded flex items-center justify-center shrink-0", colorClass)}>
                        <Icon size={14} />
                      </span>
                      <span className="truncate" title={q.label || config?.label}>{q.label || config?.label}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {filtered.map((r) => {
              const detail = details[r.id];

              return (
                <tr
                  key={r.id}
                  className={clsx(
                    "border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer relative group transition-colors",
                    viewingResponseId === r.id && "bg-gray-50/50"
                  )}
                  onClick={() => setViewingResponseId(r.id)}
                >
                  <td className="px-4 py-4 text-gray-500 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-ink focus:ring-ink"
                        checked={selected.has(r.id)}
                        onChange={(e) => handleSelect(r.id, e.target.checked)}
                      />
                    </div>
                    {/* Hover expand button */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none hidden md:block">
                      <div className="relative group/btn flex items-center pointer-events-auto">
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-[#333] text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#333]">
                          View response
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setViewingResponseId(r.id); }}
                          className="bg-white border border-gray-200 shadow-sm p-1.5 rounded hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 border-l border-gray-50">
                    {r.submitted_at
                      ? new Date(r.submitted_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) +
                        "\n" +
                        new Date(r.submitted_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </td>
                  <td className="px-4 py-4 border-l border-gray-50">
                    <span className={clsx(
                      "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                      r.completed ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
                    )}>
                      {r.completed ? "Completed" : "Partial"}
                    </span>
                  </td>
                  {questions.map((q) => {
                    const ans = detail?.answers?.find((a) => a.question_id === q.id);
                    let displayValue = "";
                    if (ans) {
                      if (typeof ans.value === "boolean") displayValue = ans.value ? "Yes" : "No";
                      else if (Array.isArray(ans.value)) displayValue = ans.value.join(", ");
                      else displayValue = String(ans.value);
                    }
                    
                    const isChoice = q.type === "multiple_choice" || q.type === "dropdown";

                    return (
                      <td key={q.id} className="px-4 py-4 text-gray-700 border-l border-gray-50 truncate max-w-[200px]">
                        {displayValue ? (
                          isChoice ? (
                            <span className="border border-gray-200 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              {displayValue}
                            </span>
                          ) : (
                            displayValue
                          )
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-200 px-5 py-3 flex items-center gap-5 z-50 animate-in slide-in-from-bottom-5">
          <span className="text-sm font-medium text-gray-700">{selected.size} selected</span>
          <div className="w-px h-4 bg-gray-200" />
          <button onClick={handleExportSelected} disabled={exporting} className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"><Download size={16} /></button>
          <button onClick={handleDelete} disabled={isDeleting} className="text-[#D32F2F] hover:text-red-700 disabled:opacity-50 transition-colors"><Trash2 size={16} /></button>
          <div className="w-px h-4 bg-gray-200" />
          <button onClick={() => setSelected(new Set())} className="text-gray-500 hover:text-gray-700 transition-colors"><X size={16} /></button>
        </div>
      )}

      {viewingResponseId !== null && (
        <ResponseDetailPanel
          responseId={viewingResponseId}
          responses={filtered}
          details={details}
          questions={questions}
          onClose={() => setViewingResponseId(null)}
          onNavigate={(id) => setViewingResponseId(id)}
        />
      )}
      
      </div>
    </div>
  );
}