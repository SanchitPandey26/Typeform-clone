"use client";

import { useState } from "react";
import { Grid3x3, Gift, HelpCircle, ChevronDown, LayoutGrid } from "lucide-react";
import clsx from "clsx";

const TABS = ["Forms", "Contacts", "Automations"];

export default function TopBar() {
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Account row */}
      <div className="flex items-center justify-between px-5 py-2.5">
        <div className="relative">
          <button
             onClick={() => setOrgMenuOpen(!orgMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="11" height="32">
              <path fill="#191919" d="M6 0C2 0 0 3 0 8v16c0 5 2 8 6 8 3 0 5-3 5-8V8c0-5-2-8-5-8Z" />
            </svg>
            <div className="w-7 h-7 rounded-lg bg-[rgb(174,78,9)] flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-medium text-gray-800">sanchitaddi</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {orgMenuOpen && (
            <div className="absolute left-0 top-11 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-64 z-30">
              <p className="text-xs font-semibold text-gray-400 px-4 pb-1">Organization</p>
              {["Admin settings", "Org members", "Plan & billing", "Developer apps"].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-5 text-sm text-gray-600">
          <button className="flex items-center gap-1.5 hover:text-gray-900 cursor-not-allowed">
            <Grid3x3 size={15} /> Integrations
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-900 cursor-not-allowed">
            <Gift size={15} /> Brand kit
          </button>
          <button className="bg-[rgb(23,119,103)] text-white text-sm font-medium px-4 py-1.5 rounded-[10px] cursor-not-allowed hover:brightness-110 transition-all">
            View plans
          </button>
          <HelpCircle size={18} className="text-gray-400 hover:text-gray-700 cursor-not-allowed" />
          <div className="w-8 h-8 rounded-full bg-[rgb(249,232,200)] flex items-center justify-center text-[#4c414e] text-xs font-bold cursor-not-allowed">
            SP
          </div>
        </div>
      </div>

      {/* Nav tabs row */}
      <div className="flex items-center gap-6 px-5">
        {TABS.map((tab) => {
          const isForms = tab === "Forms";
          return (
            <button
              key={tab}
              disabled={!isForms}
              className={clsx(
                "relative py-3 text-sm font-medium flex items-center gap-1.5 transition-colors",
                isForms ? "text-gray-900" : "text-gray-400 cursor-not-allowed"
              )}
            >
              {tab}
              {isForms && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink rounded-full" />}
            </button>
          );
        })}
        <div className="flex items-center gap-1.5 py-3 text-sm text-gray-400 cursor-not-allowed">
          <LayoutGrid size={14} />
          Research Flow
          <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-medium">
            Demo
          </span>
        </div>
      </div>
    </div>
  );
}