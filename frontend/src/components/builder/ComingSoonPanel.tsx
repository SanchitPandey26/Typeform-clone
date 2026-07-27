import { Clock } from "lucide-react";

export default function ComingSoonPanel({ title }: { title: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-24">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
        <Clock size={20} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-400">Coming soon</p>
    </div>
  );
}