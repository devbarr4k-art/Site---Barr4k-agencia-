"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

type Ask = (text: string) => Promise<boolean>;
const Ctx = createContext<Ask>(async () => false);

/** Popup "tem certeza?" no visual do painel (no lugar do confirm() do navegador) */
export function useConfirm() {
  return useContext(Ctx);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState<string | null>(null);
  const resolver = useRef<(ok: boolean) => void>(() => {});
  const okRef = useRef<HTMLButtonElement>(null);

  const ask = useCallback<Ask>(
    (t) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setText(t);
      }),
    []
  );

  const answer = (ok: boolean) => {
    resolver.current(ok);
    setText(null);
  };

  useEffect(() => {
    if (text === null) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && answer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [text]);

  return (
    <Ctx.Provider value={ask}>
      {children}
      {text !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm" onClick={() => answer(false)} role="presentation">
          <div role="alertdialog" aria-modal="true" aria-label={text} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm border border-white/15 bg-navy p-6 shadow-2xl">
            <div className="grid h-11 w-11 place-items-center bg-amber text-ink">
              <Trash2 className="h-5 w-5" />
            </div>
            <p className="display mt-5 text-3xl normal-case leading-tight">{text}</p>
            <p className="mt-2 text-sm text-white/60">It only leaves the site after you click Save.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => answer(false)} className="px-4 py-2.5 text-sm font-extrabold uppercase text-white/70 hover:text-white">
                Cancel
              </button>
              <button ref={okRef} type="button" onClick={() => answer(true)} className="bg-amber px-5 py-2.5 text-sm font-extrabold uppercase text-ink hover:bg-amber-2">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
