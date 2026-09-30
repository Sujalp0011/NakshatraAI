"use client";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-teal text-teal";
      case "error":
        return "border-l-red-500 text-red-400";
      case "info":
      default:
        return "border-l-gold text-gold";
    }
  };

  return (
    <div className={`bg-surface border border-white/10 border-l-4 ${getBorderColor()} rounded-lg px-4 py-3 shadow-2xl flex items-center justify-between gap-4 min-w-[280px] max-w-md animate-in slide-in-from-top-2 transition-all`}>
      <span className="text-xs font-medium text-text-primary">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-text-muted hover:text-text-primary text-sm p-1 leading-none"
      >
        ×
      </button>
    </div>
  );
}
