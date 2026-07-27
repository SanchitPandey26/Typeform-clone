import { api } from "./api";

export interface ResponseListItem {
  id: number;
  submitted_at: string | null;
  completed: boolean;
}

export interface AnswerDetail {
  id: number;
  question_id: number;
  value: any;
}

export interface ResponseDetail {
  id: number;
  form_id: number;
  submitted_at: string | null;
  completed: boolean;
  answers: AnswerDetail[];
}

export interface QuestionSummary {
  question_id: number;
  label: string;
  type: string;
  total_answers: number;
  breakdown?: Record<string, number> | null;
}

export interface FormSummary {
  form_id: number;
  total_responses: number;
  completed_responses: number;
  questions: QuestionSummary[];
}

export const resultsApi = {
  list: async (formId: number): Promise<ResponseListItem[]> => {
    const res = await api.get(`/api/forms/${formId}/responses`);
    return res.data;
  },

  get: async (formId: number, responseId: number): Promise<ResponseDetail> => {
    const res = await api.get(`/api/forms/${formId}/responses/${responseId}`);
    return res.data;
  },

  summary: async (formId: number): Promise<FormSummary> => {
    const res = await api.get(`/api/forms/${formId}/summary`);
    return res.data;
  },

  delete: async (formId: number, responseIds: number[]) => {
    await Promise.all(responseIds.map((id) => api.delete(`/api/forms/${formId}/responses/${id}`)));
  },
};