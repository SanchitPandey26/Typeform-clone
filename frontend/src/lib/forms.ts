import { api } from "./api";
import { Form, FormListItem } from "@/types";

export const formsApi = {
  list: async (): Promise<FormListItem[]> => {
    const res = await api.get("/api/forms/");
    return res.data;
  },

  get: async (id: number): Promise<Form> => {
    const res = await api.get(`/api/forms/${id}`);
    return res.data;
  },

  create: async (title: string): Promise<Form> => {
    const res = await api.post("/api/forms/", { title });
    return res.data;
  },

  update: async (id: number, data: Partial<Pick<Form, "title" | "description" | "thank_you_message">>): Promise<Form> => {
    const res = await api.patch(`/api/forms/${id}`, data);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/forms/${id}`);
  },

  duplicate: async (id: number): Promise<Form> => {
    const res = await api.post(`/api/forms/${id}/duplicate`);
    return res.data;
  },

  publish: async (id: number): Promise<Form> => {
    const res = await api.post(`/api/forms/${id}/publish`);
    return res.data;
  },

  unpublish: async (id: number): Promise<Form> => {
    const res = await api.post(`/api/forms/${id}/unpublish`);
    return res.data;
  },
};