import { LayoutGrid, Plus } from "lucide-react";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28">
      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
        <LayoutGrid size={22} className="text-blue-500" />
      </div>
      <p className="text-lg text-gray-800 mb-5">Create a new form to get started</p>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 bg-ink text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        <Plus size={16} /> Create form
      </button>
    </div>
  );
}