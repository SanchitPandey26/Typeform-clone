"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Link2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { Form } from "@/types";
import clsx from "clsx";
import RenameModal from "./RenameModal";

interface Props {
  form: Form;
  activeTab: "content" | "workflow" | "connect" | "share" | "results";
  onTabChange: (t: "content" | "workflow" | "connect" | "share" | "results") => void;
  onTogglePublish: () => Promise<Form | void>;
  onRename: (title: string) => Promise<void>;
}

export default function BuilderTopBar({ form, activeTab, onTabChange, onTogglePublish, onRename }: Props) {
  const router = useRouter();
  const [showRename, setShowRename] = useState(false);

  const copyLink = (slugToUse?: string | null) => {
    const slug = slugToUse || form.slug;
    if (!slug) {
      toast.error("Publish the form first to get a link");
      return;
    }
    navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`);
    toast.success("Link copied");
  };

  const handleShareClick = async () => {
    if (form.status !== "published") {
      const updated = await onTogglePublish();
      if (updated && updated.slug) {
        copyLink(updated.slug);
        onTabChange("share");
      }
    } else {
      onTabChange("share");
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-5 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-sm">
        <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-800">
          Forms
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <button
          onClick={() => setShowRename(true)}
          className="font-medium text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
        >
          {form.title}
        </button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg absolute left-1/2 -translate-x-1/2">
        {(["content", "workflow", "connect", "share", "results"] as const).map((tab) => {
          if (form.status !== "published" && (tab === "share" || tab === "results")) {
            return null;
          }
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={clsx(
                "capitalize px-3 py-1.5 rounded-md transition-all text-sm font-medium",
                activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        {form.status !== "published" && (
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            ▷ Share
          </button>
        )}

        <div className="flex items-center gap-3 ml-2">
          {form.status === "published" && (
            <button onClick={() => copyLink()} className="text-gray-400 hover:text-gray-700 transition-colors mr-1">
              <Link2 size={18} />
            </button>
          )}
          <button className="bg-[rgb(23,119,103)] text-white text-sm font-medium px-4 py-1.5 rounded-[10px] cursor-not-allowed hover:brightness-110 transition-all">
            View plans
          </button>
          <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-[rgb(249,232,200)] flex items-center justify-center text-[rgb(174,78,9)] text-xs font-bold cursor-not-allowed">
            SP
          </div>
        </div>
      </div>

      {showRename && (
        <RenameModal
          initialTitle={form.title}
          onSave={async (newTitle) => {
            await onRename(newTitle);
            setShowRename(false);
          }}
          onClose={() => setShowRename(false)}
        />
      )}
    </div>
  );
}