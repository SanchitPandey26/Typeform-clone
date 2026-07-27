"use client";

import { Plus, Palette, Smartphone, Play, Sparkles, Settings, ChevronDown } from "lucide-react";

interface Props {
  onAddContent: () => void;
  onPreview: () => void;
}

export default function BuilderToolbar({ onAddContent, onPreview }: Props) {
  return (
    <div className="bg-transparent px-5 py-3 flex items-center gap-2">
      <button
        onClick={onAddContent}
        className="flex items-center gap-1.5 bg-ink text-white text-sm font-medium rounded-lg px-3 py-1.5 hover:bg-gray-800"
      >
        <Plus size={15} /> Add content
      </button>

      <button className="flex items-center gap-1.5 text-sm text-gray-500 px-2 py-1.5 cursor-not-allowed">
        <Palette size={15} /> Design
      </button>

      <div className="h-5 w-px bg-gray-200 mx-1" />

      <button className="p-1.5 rounded-md text-gray-400 cursor-not-allowed">
        <Smartphone size={16} />
      </button>
      <button onClick={onPreview} className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100">
        <Play size={16} />
      </button>

      <div className="ml-auto flex items-center gap-1">
        <button className="p-1.5 rounded-md text-gray-300 cursor-not-allowed">
          <Sparkles size={16} />
        </button>
        <button className="p-1.5 rounded-md text-gray-300 cursor-not-allowed">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}