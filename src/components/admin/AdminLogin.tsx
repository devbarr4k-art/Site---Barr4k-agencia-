"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (r?.ok) return window.location.reload();
    setBusy(false);
    setError(r?.status === 401 ? "Wrong password." : "Something went wrong. Try again.");
  }

  return (
    <form onSubmit={submit} className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center px-6">
      <Image src="/img/logo-mark.png" alt="BB Agency" width={72} height={54} />
      <h1 className="display mt-8 text-5xl">Dashboard</h1>
      <label className="mt-8 block text-xs font-extrabold uppercase tracking-widest text-white/60" htmlFor="pw">
        Password
      </label>
      <input
        id="pw"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full border border-white/25 bg-navy px-4 py-3 outline-none focus:border-amber"
      />
      {error && <p className="mt-3 text-sm text-amber">{error}</p>}
      <button
        disabled={busy || !password}
        className="mt-6 inline-flex items-center justify-center gap-2 bg-amber px-6 py-3.5 font-extrabold uppercase text-ink disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Enter
      </button>
    </form>
  );
}
