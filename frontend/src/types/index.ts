export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "email"
  | "number"
  | "yes_no"
  | "rating";

export interface Question {
  id: number;
  form_id: number;
  type: QuestionType;
  label: string;
  help_text?: string | null;
  required: boolean;
  order_index: number;
  options?: string[] | null;
  settings?: Record<string, any> | null;
}

export interface Form {
  id: number;
  title: string;
  description?: string | null;
  status: "draft" | "published";
  slug?: string | null;
  theme?: Record<string, any> | null;
  thank_you_message?: string | null;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export interface FormListItem {
  id: number;
  title: string;
  status: "draft" | "published";
  slug?: string | null;
  created_at: string;
  updated_at: string;
  response_count: number;
}