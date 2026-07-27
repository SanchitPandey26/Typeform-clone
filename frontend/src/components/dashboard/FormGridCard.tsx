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

export default function FormGridCard({ form, onOpen, onRename, onDuplicate, onDelete, onTogglePublish }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(form.title);

  const saveRename = () => {
    setEditing(false);
    if (title.trim() && title !== form.title) onRename(form.id, title.trim());
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl2 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => !editing && onOpen(form.id)}
    >
      <div className="flex items-start justify-between mb-4">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveRename}
            onKeyDown={(e) => e.key === "Enter" && saveRename()}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-gray-900 outline-none border-b border-gray-300 flex-1 mr-2"
          />
        ) : (
          <span className="font-semibold text-gray-900 truncate">{form.title}</span>
        )}

        <div className="relative shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="text-gray-400 hover:text-gray-700"
          >
            <MoreHorizontal size={18} />
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

      <button
        onClick={(e) => e.stopPropagation()}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed"
      >
        <LayoutGrid size={14} />
      </button>

      <div className="flex items-center justify-between mt-6 text-xs text-gray-400">
        <span className={form.status === "published" ? "text-green-600 font-medium" : ""}>
          {form.status === "published" ? "Published" : "Draft"}
        </span>
        <span>{form.response_count} responses</span>
      </div>
    </div>
  );
}