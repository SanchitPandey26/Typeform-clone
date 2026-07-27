"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  initialTitle: string;
  onSave: (title: string) => void;
  onClose: () => void;
}

export default function RenameModal({ initialTitle, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initialTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Rename form</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Form name</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
              placeholder="e.g. My awesome form"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || title === initialTitle}
              className="px-4 py-2 text-sm font-medium bg-[rgb(60,50,62)] text-white hover:brightness-110 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
