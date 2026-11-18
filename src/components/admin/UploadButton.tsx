"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Loader2 } from "lucide-react";

async function sendFile(file: File) {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const blob = await upload(`uploads/${safe}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
  return blob.url;
}

/** Botão que abre o seletor de arquivo e já sobe pro Blob */
export function UploadButton({ accept, onDone, children, className = "" }: { accept: string; onDone: (url: string) => void; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <>
      <button type="button" disabled={busy} onClick={() => ref.current?.click()} className={className}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </button>
      {err && <span className="text-xs text-amber">{err}</span>}
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          setErr("");
          try {
            onDone(await sendFile(f));
          } catch {
            setErr("Upload failed (max 15 MB).");
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}

