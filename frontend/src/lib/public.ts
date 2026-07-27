import { api } from "./api";

export interface PublicQuestion {
  id: number;
  type: string;
  label: string;
  help_text?: string | null;
  required: boolean;
  order_index: number;
  options?: string[] | null;
  settings?: Record<string, any> | null;
}

export interface PublicForm {
  id: number;
  title: string;
  description?: string | null;
  theme?: Record<string, any> | null;
  thank_you_message?: string | null;
  questions: PublicQuestion[];
}

export const publicApi = {
  getForm: async (slug: string): Promise<PublicForm> => {
    const res = await api.get(`/api/public/forms/${slug}`);
    return res.data;
  },

  submit: async (slug: string, answers: { question_id: number; value: any }[]) => {
    const res = await api.post(`/api/public/forms/${slug}/submit`, { answers });
    return res.data;
  },
};