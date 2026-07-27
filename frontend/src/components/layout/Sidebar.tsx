"use client";

import { Search, Grid3x3, Plus, Mic, ArrowUp, ChevronRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface Props {
  onCreate: () => void;
}

export default function Sidebar({ onCreate }: Props) {
  const [aiQuery, setAiQuery] = useState("");
  const [privateOpen, setPrivateOpen] = useState(true);

  return (
    <aside className="w-[280px] shrink-0 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={onCreate}
          className="w-full flex items-center justify-center gap-2 bg-[rgb(60,50,62)] border border-transparent text-white rounded-full py-2.5 text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create form
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 text-gray-400 text-sm px-3 py-2 rounded-lg cursor-not-allowed">
          <Search size={16} />
          Search
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Grid3x3 size={15} />
            Workspaces
          </div>
          <button className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 cursor-not-allowed">
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => setPrivateOpen(!privateOpen)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 px-2 mb-1 mt-3 w-full hover:text-gray-600"
        >
          <ChevronRight size={12} className={clsx("transition-transform", privateOpen && "rotate-90")} />
          Private
        </button>

        {privateOpen && (
          <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-amber-50 text-sm font-medium text-gray-800">
            <span>My workspace</span>
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 border-2 border-violet-200 rounded-full px-3 py-2 cursor-not-allowed">
          <Mic size={15} className="text-gray-400 shrink-0" />
          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask Typeform AI"
            disabled
            className="flex-1 text-sm outline-none bg-transparent min-w-0 cursor-not-allowed"
          />
          <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 cursor-not-allowed">
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}