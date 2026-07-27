import { Question } from "@/types";
import { ResponseDetail } from "@/lib/results";

export function exportResponsesToCsv(formTitle: string, questions: Question[], responses: ResponseDetail[]) {
  const headers = ["Response ID", "Submitted At", ...questions.map((q) => q.label || `Question ${q.id}`)];

  const rows = responses.map((r) => {
    const answerMap = Object.fromEntries(r.answers.map((a) => [a.question_id, a.value]));
    const cells = [
      String(r.id),
      r.submitted_at ? new Date(r.submitted_at).toLocaleString() : "",
      ...questions.map((q) => {
        const val = answerMap[q.id];
        if (val === undefined || val === null) return "";
        if (typeof val === "boolean") return val ? "Yes" : "No";
        return String(val);
      }),
    ];
    return cells.map((c) => `"${c.replace(/"/g, '""')}"`).join(",");
  });

  const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${formTitle.replace(/\s+/g, "_")}_responses.csv`;
  link.click();
  URL.revokeObjectURL(url);
}