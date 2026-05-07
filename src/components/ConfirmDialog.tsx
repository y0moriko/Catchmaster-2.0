"use client";

import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
}

export function useConfirm() {
  const [state, setState] = useState<{
    options: ConfirmDialogOptions;
    resolve: (value: boolean) => void;
  } | undefined>();

  const confirm = useCallback(
    (options: ConfirmDialogOptions | string): Promise<boolean> => {
      const opts: ConfirmDialogOptions =
        typeof options === "string" ? { message: options } : options;
      return new Promise((resolve) => {
        setState({ options: opts, resolve });
      });
    },
    []
  );

  const close = (result: boolean) => {
    state?.resolve(result);
    setState(undefined);
  };

  const dialog = state ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-[300px]">
        <div className="px-4 pt-4 pb-3 flex items-start gap-2.5">
          <div
            className={`rounded-full p-1 mt-0.5 shrink-0 ${
              state.options.variant === "danger"
                ? "bg-red-100 text-red-600"
                : "bg-primary/10 text-primary"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">
              {state.options.title || "Confirm"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {state.options.message}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 px-4 pb-4">
          <button
            onClick={() => close(false)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 transition-colors text-xs font-medium"
          >
            {state.options.cancelLabel || "Cancel"}
          </button>
          <button
            onClick={() => close(true)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors ${
              state.options.variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {state.options.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
