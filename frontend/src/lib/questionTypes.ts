import { QuestionType } from "@/types";
import {
  Type, AlignLeft, ListChecks, ChevronDownSquare, Mail, Hash, ToggleLeft, Star,
  Users, Phone, MapPin, Link2, Image, Scale, CheckSquare, Gauge, BarChart3,
  ListOrdered, Grid3x3, Video, PenTool, Calendar, CreditCard, Upload, CalendarClock,
} from "lucide-react";

export type QuestionCategory = "contact_info" | "choice" | "rating_ranking" | "text_video" | "other";

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  contact_info: "Contact info",
  choice: "Choice",
  rating_ranking: "Rating & ranking",
  text_video: "Text & Video",
  other: "Other",
};

export const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  contact_info: "bg-pink-100 text-pink-600",
  choice: "bg-violet-100 text-violet-600",
  rating_ranking: "bg-green-100 text-green-600",
  text_video: "bg-blue-100 text-blue-600",
  other: "bg-amber-100 text-amber-700",
};

export interface QuestionTypeConfig {
  value: QuestionType;
  label: string;
  icon: any;
  hasOptions: boolean;
  category: QuestionCategory;
}

export const QUESTION_TYPES: QuestionTypeConfig[] = [
  { value: "email", label: "Email", icon: Mail, hasOptions: false, category: "contact_info" },
  { value: "short_text", label: "Short Text", icon: Type, hasOptions: false, category: "text_video" },
  { value: "long_text", label: "Long Text", icon: AlignLeft, hasOptions: false, category: "text_video" },
  { value: "multiple_choice", label: "Multiple Choice", icon: ListChecks, hasOptions: true, category: "choice" },
  { value: "dropdown", label: "Dropdown", icon: ChevronDownSquare, hasOptions: true, category: "choice" },
  { value: "yes_no", label: "Yes / No", icon: ToggleLeft, hasOptions: false, category: "choice" },
  { value: "number", label: "Number", icon: Hash, hasOptions: false, category: "other" },
  { value: "rating", label: "Rating", icon: Star, hasOptions: false, category: "rating_ranking" },
];

// Present in the modal for visual completeness, but non-functional (placeholder scope per assignment)
export const PLACEHOLDER_TYPES: { label: string; icon: any; category: QuestionCategory }[] = [
  { label: "Contact Info", icon: Users, category: "contact_info" },
  { label: "Phone Number", icon: Phone, category: "contact_info" },
  { label: "Address", icon: MapPin, category: "contact_info" },
  { label: "Website", icon: Link2, category: "contact_info" },
  { label: "Picture Choice", icon: Image, category: "choice" },
  { label: "Legal", icon: Scale, category: "choice" },
  { label: "Checkbox", icon: CheckSquare, category: "choice" },
  { label: "Opinion Scale", icon: Gauge, category: "rating_ranking" },
  { label: "NPS", icon: BarChart3, category: "rating_ranking" },
  { label: "Ranking", icon: ListOrdered, category: "rating_ranking" },
  { label: "Matrix", icon: Grid3x3, category: "rating_ranking" },
  { label: "Video and Audio", icon: Video, category: "text_video" },
  { label: "Signature", icon: PenTool, category: "other" },
  { label: "Date", icon: Calendar, category: "other" },
  { label: "Payment", icon: CreditCard, category: "other" },
  { label: "File Upload", icon: Upload, category: "other" },
  { label: "Scheduler", icon: CalendarClock, category: "other" },
];

export const getQuestionTypeConfig = (type: QuestionType) =>
  QUESTION_TYPES.find((t) => t.value === type)!;