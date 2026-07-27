"use client";

import { Link2, Pencil, Copy, ExternalLink, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  formId: number;
  slug?: string | null;
  status: string;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onClose: () => void;
}

export default function FormActionsMenu({
  slug, status, onRename, onDuplicate, onDelete, onTogglePublish, onClose,
}: Props) {
  const copyLink = () => {
    if (!slug) {
      toast.error("Publish the form first to get a link");
      return;
    }
    navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`);
    toast.success("Link copied");
    onClose();
  };

  return (
    <div
      className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 w-52 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={copyLink} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 text-gray-700">
        <Link2 size={15} /> Copy link
      </button>

      <div className="h-px bg-gray-100 my-1.5" />

      <button
        onClick={() => { onTogglePublish(); onClose(); }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 text-gray-700"
      >
        <ExternalLink size={15} /> {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={() => { onRename(); onClose(); }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 text-gray-700"
      >
        <Pencil size={15} /> Rename
      </button>
      <button
        onClick={() => { onDuplicate(); onClose(); }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 text-gray-700"
      >
        <Copy size={15} /> Duplicate
      </button>

      <div className="h-px bg-gray-100 my-1.5" />

      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2.5 text-red-600"
      >
        <Trash2 size={15} /> Delete
      </button>
    </div>
  );
}