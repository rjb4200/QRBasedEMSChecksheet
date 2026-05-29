"use client";

import { useCallback, useRef, useState } from "react";

type SlideToConfirmProps = {
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  confirmedLabel?: string;
};

export default function SlideToConfirm({
  onConfirm,
  disabled = false,
  loading = false,
  label = "Slide to confirm",
  confirmedLabel = "Slide to confirm",
}: SlideToConfirmProps) {
  const [value, setValue] = useState(0);
  const isConfirming = useRef(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setValue(newValue);
      if (newValue >= 100 && !isConfirming.current && !disabled && !loading) {
        isConfirming.current = true;
        onConfirm();
      }
    },
    [onConfirm, disabled, loading],
  );

  const handleMouseUp = useCallback(() => {
    if (value < 100) {
      setValue(0);
    }
    isConfirming.current = false;
  }, [value]);

  const handleTouchEnd = useCallback(() => {
    if (value < 100) {
      setValue(0);
    }
    isConfirming.current = false;
  }, [value]);

  const pct = value;
  const isComplete = pct >= 100;

  return (
    <div className="relative w-full select-none">
      <div
        className={`relative h-14 overflow-hidden rounded-2xl transition-colors ${
          disabled || loading
            ? "bg-slate-200"
            : isComplete
              ? "bg-red-800"
              : "bg-slate-300"
        }`}
      >
        <div
          className="absolute inset-y-1 left-1 flex w-12 items-center justify-center rounded-xl bg-white shadow transition-all duration-75"
          style={{ width: `${Math.max(12, pct)}%` }}
        >
          <div className="flex items-center gap-1 whitespace-nowrap">
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <input
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={disabled || loading}
          max={100}
          min={0}
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          step={1}
          type="range"
          value={pct > 99 ? 100 : (pct < 90 ? 0 : pct)}
        />

        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold transition-colors ${
            disabled || loading
              ? "text-slate-400"
              : isComplete
                ? "text-white"
                : "text-slate-500"
          }`}
        >
          {loading ? "Clearing..." : isComplete ? confirmedLabel : label}
        </span>
      </div>
    </div>
  );
}
