"use client";

import clsx from "clsx";

interface Props {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}

export default function Toggle({ checked, onChange, disabled, label }: Props) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={clsx("text-sm", disabled ? "text-gray-400" : "text-gray-700")}>{label}</span>
      <button
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          "w-9 h-5 rounded-full relative transition-colors shrink-0",
          disabled ? "bg-gray-100 cursor-not-allowed" : checked ? "bg-gray-800" : "bg-gray-200"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}