"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, Calendar, List, LayoutGrid, ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

export type SortOption = "created" | "updated" | "alphabetical";

const SORT_LABELS: Record<SortOption, string> = {
  created: "Date created",
  updated: "Last updated",
  alphabetical: "Alphabetically",
};

interface Props {
  view: "list" | "grid";
  onViewChange: (v: "list" | "grid") => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

export default function WorkspaceToolbar({ view, onViewChange, sortBy, onSortChange }: Props) {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900">My workspace</h1>
        <button className="text-gray-400 cursor-not-allowed">•••</button>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 ml-2 cursor-not-allowed">
          <UserPlus size={15} /> Invite
        </button>
        <ShieldCheck size={16} className="text-teal-600 cursor-not-allowed" />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50"
          >
            <Calendar size={14} /> {SORT_LABELS[sortBy]} <ChevronDown size={14} />
          </button>

          {sortMenuOpen && (
            <div className="absolute left-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 w-48 z-30">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSortChange(option);
                    setSortMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {SORT_LABELS[option]}
                  {sortBy === option && <Check size={14} className="text-gray-900" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center border border-gray-200 rounded-full p-0.5">
          <button
            onClick={() => onViewChange("list")}
            className={clsx(
              "flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors",
              view === "list" ? "bg-gray-100 font-medium text-gray-900" : "text-gray-500"
            )}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => onViewChange("grid")}
            className={clsx(
              "flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors",
              view === "grid" ? "bg-gray-100 font-medium text-gray-900" : "text-gray-500"
            )}
          >
            <LayoutGrid size={14} /> Grid
          </button>
        </div>
      </div>
    </div>
  );
}