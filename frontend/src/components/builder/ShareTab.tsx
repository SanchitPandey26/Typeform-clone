"use client";

import React from "react";
import { Link2, Edit2, LayoutGrid, Diamond } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  slug: string;
}

export default function ShareTab({ slug }: Props) {
  const formUrl = `${window.location.origin}/f/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formUrl);
    toast.success("Link copied");
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-24 px-6 overflow-y-auto">
      <h1 className="text-3xl text-gray-800 mb-10">Choose how you&apos;d like to share your form</h1>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 w-full">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-[rgb(60,50,62)] hover:brightness-110 transition-all text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            <Link2 size={16} /> Copy link
          </button>
          <input
            readOnly
            value={formUrl}
            className="flex-1 bg-transparent px-4 text-sm text-gray-600 outline-none"
          />
          <div className="flex items-center border-l border-gray-200 pl-3 pr-2 h-6">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 cursor-not-allowed">
              <Edit2 size={14} /> Edit
            </button>
          </div>
          <div className="flex items-center border-l border-gray-200 pl-3 pr-2 h-6">
            <button className="text-gray-400 hover:text-gray-600 cursor-not-allowed">
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="text-gray-400">Link preview</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-gray-600 cursor-not-allowed hover:text-gray-900">
                Customize <span className="text-[10px]">▼</span>
              </button>
              <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-teal-600 bg-teal-50 cursor-not-allowed">
                <Diamond size={12} />
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center cursor-not-allowed">
            <div className="w-[120px] h-[80px] bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
              <span className="font-bold text-gray-800 text-sm tracking-tight">|| Typeform</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900">New form</span>
              <span className="text-sm text-gray-400 leading-snug">
                Turn data collection into an experience with Typeform. Create beautiful o...
                <br />
                form.typeform.com
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mb-8">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Embed form</h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-stretch bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors text-left cursor-not-allowed">
            <div className="w-24 bg-[#c879db] shrink-0 p-2 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-white/20 rounded shadow-sm border border-white/30 backdrop-blur-sm relative">
                <div className="absolute inset-x-2 top-2 h-1 bg-white/40 rounded-full" />
                <div className="absolute inset-x-2 top-4 h-1 bg-white/40 rounded-full w-1/2" />
                <div className="absolute right-1 bottom-1 w-6 h-6 bg-purple-900/20 rounded-full" />
              </div>
            </div>
            <div className="p-4 flex items-center">
              <span className="text-sm text-gray-700">On your website</span>
            </div>
          </button>

          <button className="flex items-stretch bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors text-left cursor-not-allowed">
            <div className="w-24 bg-[#7eb8e3] shrink-0 p-2 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-white/20 rounded shadow-sm border border-white/30 backdrop-blur-sm relative">
                 <div className="absolute left-2 top-2 w-3 h-3 bg-blue-500/20 rounded-full" />
                 <div className="absolute inset-x-2 top-6 h-1 bg-white/40 rounded-full" />
                 <div className="absolute right-1 bottom-1 w-6 h-6 bg-blue-900/20 rounded" />
              </div>
            </div>
            <div className="p-4 flex items-center">
              <span className="text-sm text-gray-700">In your email</span>
            </div>
          </button>
        </div>
      </div>

      <button className="bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-not-allowed">
        Explore other ways to share
      </button>
    </div>
  );
}
