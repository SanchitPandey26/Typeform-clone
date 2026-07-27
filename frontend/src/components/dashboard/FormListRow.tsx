"use client";

import { useState } from "react";
import { MoreHorizontal, LayoutGrid } from "lucide-react";
import { FormListItem } from "@/types";
import FormActionsMenu from "./FormActionsMenu";

interface Props {
  form: FormListItem;
  onOpen: (id: number) => void;
  onRename: (id: number, title: string) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, status: string) => void;
}

export default function FormListRow({ form, onOpen, onRename, onDuplicate, onDelete, onTogglePublish }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(form.title);

  const saveRename = () => {
    setEditing(false);
    if (title.trim() && title !== form.title) onRename(form.id, title.trim());
  };

  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0 last:rounded-b-xl group"
      onClick={() => !editing && onOpen(form.id)}
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-avatar-from to-avatar-to shrink-0" />

      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveRename}
          onKeyDown={(e) => e.key === "Enter" && saveRename()}
          onClick={(e) => e.stopPropagation()}
          className="font-semibold text-gray-900 outline-none border-b border-gray-300 flex-1"
        />
      ) : (
        <span className="font-semibold text-gray-900 flex-1 truncate">{form.title}</span>
      )}

      <span className="text-sm text-gray-400 w-20 text-center">
        {form.response_count > 0 ? form.response_count : "–"}
      </span>
      <span className="text-sm text-gray-400 w-20 text-center">
        {form.response_count > 0 ? form.response_count : "–"}
      </span>
      <span className="text-sm text-gray-500 w-28 text-center">
        {new Date(form.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>

      <div className="w-24 flex items-center">
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-not-allowed"
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
        >
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <FormActionsMenu
            formId={form.id}
            slug={form.slug}
            status={form.status}
            onRename={() => setEditing(true)}
            onDuplicate={() => onDuplicate(form.id)}
            onDelete={() => onDelete(form.id)}
            onTogglePublish={() => onTogglePublish(form.id, form.status)}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}