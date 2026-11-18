import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { blobReady, getContentFresh } from "@/lib/content";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminEditor from "@/components/admin/AdminEditor";

export const metadata: Metadata = { title: "BB Agency · Dashboard", robots: { index: false, follow: false }, other: { google: "notranslate" } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const setupMissing = [!adminConfigured() && "ADMIN_PASSWORD", !blobReady() && "Vercel Blob (BLOB_READ_WRITE_TOKEN)"].filter(Boolean) as string[];

  return (
    // translate="no": a tradução automática do Chrome mexe no HTML e quebra o React ao salvar
    <main translate="no" className="notranslate min-h-[100dvh] bg-ink text-paper">
      {setupMissing.length > 0 ? (
        <div className="mx-auto max-w-lg px-6 py-24">
          <p className="eyebrow text-amber">Dashboard</p>
          <h1 className="display mt-4 text-5xl">Almost there</h1>
          <p className="mt-6 text-white/75">The dashboard needs these settings in Vercel before it can be used:</p>
          <ul className="mt-4 list-disc pl-6 text-white/90">
            {setupMissing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : !(await isAdmin()) ? (
        <AdminLogin />
      ) : (
        <AdminEditor initial={await getContentFresh()} />
      )}
    </main>
  );
}
