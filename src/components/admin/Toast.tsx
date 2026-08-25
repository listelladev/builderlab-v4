"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Toast = { id: number; message: string; type: "ok" | "error" };
type ToastFn = (message: string, type?: "ok" | "error") => void;

const ToastContext = createContext<ToastFn>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback<ToastFn>((message, type = "ok") => {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4.5 py-3 rounded-xl font-semibold text-sm shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] ${
              t.type === "error" ? "bg-red-500/90 text-white" : "bg-white text-[#08120E]"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
