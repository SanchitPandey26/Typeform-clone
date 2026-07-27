import { PublicQuestion } from "./public";

export function validateAnswer(question: PublicQuestion, value: any): string | null {
  const isEmpty = value === undefined || value === null || value === "";

  if (question.required && isEmpty) {
    return "This question is required";
  }
  if (isEmpty) return null; // optional + empty, nothing else to check

  switch (question.type) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        return "Please enter a valid email";
      }
      break;
    case "number":
      if (isNaN(Number(value))) return "Please enter a valid number";
      break;
    case "rating": {
      const max = question.settings?.max_rating || 5;
      if (Number(value) < 1 || Number(value) > max) return `Please select 1 to ${max}`;
      break;
    }
  }
  return null;
}