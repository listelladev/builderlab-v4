"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ConfirmOptions = { title: string; message: string };
type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    opts: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    return new Promise((resolve) => setState({ opts, resolve }));
  }, []);

  const close = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1500] p-5"
          onClick={(e) => e.target === e.currentTarget && close(false)}
        >
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 max-w-[420px] w-full">
            <h3 className="text-lg font-bold text-white mb-2.5">{state.opts.title}</h3>
            <p className="text-sm text-white/60 mb-5">{state.opts.message}</p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => close(false)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
