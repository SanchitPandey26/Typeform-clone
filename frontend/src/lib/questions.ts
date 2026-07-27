import { api } from "./api";
import { Question, QuestionType } from "@/types";

export interface QuestionPayload {
  type: QuestionType;
  label: string;
  help_text?: string | null;
  required: boolean;
  order_index: number;
  options?: string[] | null;
  settings?: Record<string, any> | null;
}

export const questionsApi = {
  create: async (formId: number, data: QuestionPayload): Promise<Question> => {
    const res = await api.post(`/api/forms/${formId}/questions`, data);
    return res.data;
  },

  update: async (questionId: number, data: Partial<QuestionPayload>): Promise<Question> => {
    const res = await api.patch(`/api/forms/questions/${questionId}`, data);
    return res.data;
  },

  remove: async (questionId: number): Promise<void> => {
    await api.delete(`/api/forms/questions/${questionId}`);
  },

  reorder: async (formId: number, questions: { id: number; order_index: number }[]) => {
    const res = await api.put(`/api/forms/${formId}/questions/reorder`, { questions });
    return res.data;
  },
};