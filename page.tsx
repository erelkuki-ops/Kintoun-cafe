"use client";
import { useEffect, useState } from "react";
import AdminShell, { inputCls, labelCls, btnPrimary } from "@/components/AdminShell";

export default function PengaturanPage() {
  const [form, setForm] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(d => setForm(d.settings)); }, []);

  async function save() {
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) setMsg("✅ Pengaturan website disimpan & langsung berlaku publik.");
    else setMsg("❌ Gagal menyimpan pengaturan.");
  }
  async function changePassword() {
    setPwMsg("");
    if (pw.newPassword !== pw.confirm) { setPwMsg("❌ Konfirmasi password baru tidak sama."); return; }
    const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }) });
    const d = await res.json();
    setPwMsg(res.ok ? "✅ Password berhasil diganti. Gunakan password baru saat login berikutnya." : "❌ " + (d.error || "Gagal"));
    if (res.ok) setPw({ currentPassword: "", newPassword: "", confirm: "" });
  }

  if (!form) return <AdminShell title="Pengaturan Website"><p className="text-sm bg-white border rounded-2xl p-8 text-center text-[#527a94]">Memuat pengaturan…</p></AdminShell>;
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <AdminShell title="Pengaturan Website" subtitle="SEO, media sosial, keamanan akun & panduan deployment. Semua rahasia (password, session secret) tidak pernah ditampilkan di frontend.">
      {msg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-4 font-semibold text-sm mb-5">{msg}</div>}

      <section className="bg-white rounded-[24px] border border-[#dceffb] shadow-sm p-5 sm:p-7">
        <h2 className="font-serif font-bold text-xl">🌐 SEO Dasar</h2>
        <p className="text-xs text-[#527a94] mt-1">Judul & deskripsi yang muncul di Google dan saat link dibagikan.</p>
        <div className="grid gap-4 mt-5">
          <div><label className={labelCls}>JUDUL HALAMAN (SEO TITLE)</label><input value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>DESKRIPSI (META DESCRIPTION)</label><textarea value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)} className={inputCls} rows={3} /></div>
        </div>
        <div className="bg-[#faf3e2] rounded-2xl p-4 mt-4 text-sm"><p className="text-[10px] font-black tracking-widest text-[#5b93b8]">PREVIEW GOOGLE</p><p className="text-[#1a56db] font-medium mt-1.5 leading-snug">{form.seoTitle}</p><p className="text-xs text-[#5f6368] mt-1 leading-relaxed">{form.seoDescription}</p><p className="text-[11px] text-[#188038] mt-1">kintoun-coffee-malang • Galunggung, Malang</p></div>
      </section>

      <section className="bg-white rounded-[24px] border border-[#dceffb] shadow-sm p-5 sm:p-7 mt-5">
        <h2 className="font-serif font-bold text-xl">📱 Media Sosial</h2>
        <p className="text-xs text-[#527a94] mt-1">Kosongkan bila belum ada akun resmi — ikon tidak akan tampil di footer (tidak ada tautan mati).</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          <div><label className={labelCls}>INSTAGRAM URL</label><input value={form.instagramUrl} onChange={e => set("instagramUrl", e.target.value)} className={inputCls} placeholder="https://instagram.com/…" /></div>
          <div><label className={labelCls}>TIKTOK URL</label><input value={form.tiktokUrl} onChange={e => set("tiktokUrl", e.target.value)} className={inputCls} placeholder="https://tiktok.com/@…" /></div>
          <div><label className={labelCls}>FACEBOOK URL</label><input value={form.facebookUrl} onChange={e => set("facebookUrl", e.target.value)} className={inputCls} placeholder="https://facebook.com/…" /></div>
        </div>
        <button onClick={save} className={btnPrimary + " mt-6"}>💾 Simpan SEO & Media Sosial</button>
      </section>

      <section className="bg-white rounded-[24px] border border-[#dceffb] shadow-sm p-5 sm:p-7 mt-5">
        <h2 className="font-serif font-bold text-xl">🔐 Ganti Password Admin</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          <div><label className={labelCls}>PASSWORD LAMA</label><input type="password" value={pw.currentPassword} onChange={e => setPw({ ...pw, currentPassword: e.target.value })} className={inputCls} placeholder="••••••••" /></div>
          <div><label className={labelCls}>PASSWORD BARU (MIN 6)</label><input type="password" value={pw.newPassword} onChange={e => setPw({ ...pw, newPassword: e.target.value })} className={inputCls} placeholder="••••••••" /></div>
          <div><label className={labelCls}>KONFIRMASI PASSWORD BARU</label><input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} className={inputCls} placeholder="••••••••" /></div>
        </div>
        {pwMsg && <p className={`text-sm font-semibold mt-3 ${pwMsg.startsWith("✅") ? "text-emerald-700" : "text-red-600"}`}>{pwMsg}</p>}
        <button onClick={changePassword} className={btnPrimary + " mt-5"}>Ganti Password</button>
      </section>

      <section className="bg-[#0a365d] text-white rounded-[24px] shadow-xl p-5 sm:p-7 mt-5">
        <h2 className="font-serif font-bold text-xl">🚀 Panduan Deployment & Backend</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-5 text-sm leading-relaxed">
          <div className="bg-white/8 border border-white/10 rounded-2xl p-5">
            <p className="font-black text-[#8ed0f5]">A. Arsitektur Saat Ini (Arena AI)</p>
            <ol className="list-decimal ml-4 mt-2 space-y-1.5 text-white/80 text-[13px]">
              <li>Next.js + PostgreSQL (Drizzle ORM) — database menyimpan menu, galeri & info.</li>
              <li>Foto upload disimpan sebagai <b>file asli</b> di <code className="bg-white/10 px-1 rounded">public/uploads</code> (bukan Base64, bukan URL manual).</li>
              <li>Auth admin: password ter-hash (scrypt) + cookie session httpOnly bertanda tangan.</li>
              <li>Pengunjung melihat galeri/menu tanpa login; hanya admin login yang bisa upload/hapus.</li>
            </ol>
          </div>
          <div className="bg-white/8 border border-white/10 rounded-2xl p-5">
            <p className="font-black text-[#8ed0f5]">B. Deploy ke Netlify + Supabase</p>
            <ol className="list-decimal ml-4 mt-2 space-y-1.5 text-white/80 text-[13px]">
              <li>Buat project Supabase → catat Project URL & anon key (jangan service-role ke frontend).</li>
              <li>Buat tabel mengikuti <code className="bg-white/10 px-1 rounded">src/db/schema.ts</code> & bucket Storage publik <code className="bg-white/10 px-1 rounded">gallery</code>.</li>
              <li>Aktifkan RLS: publik SELECT saja; INSERT/UPDATE/DELETE hanya user terautentikasi.</li>
              <li>Di Netlify: set env <code className="bg-white/10 px-1 rounded">DATABASE_URL</code>, <code className="bg-white/10 px-1 rounded">ADMIN_SESSION_SECRET</code>, Supabase keys → deploy. File <code className="bg-white/10 px-1 rounded">netlify.toml</code> sudah disertakan.</li>
              <li>Buat user admin pertama via env ADMIN_USERNAME / ADMIN_PASSWORD.</li>
            </ol>
          </div>
        </div>
        <p className="text-[11px] text-white/50 mt-4 leading-relaxed">Status konfigurasi ditampilkan jujur: bila DATABASE_URL belum diatur, website tidak berpura-pura upload berhasil. Service-role key tidak pernah dikirim ke browser — semua upload melewati API server yang memeriksa login admin.</p>
      </section>
    </AdminShell>
  );
}
