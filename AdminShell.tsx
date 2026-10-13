"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { patchAdminFetch, clearAdminToken } from "@/lib/client-auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◈", desc: "Ringkasan" },
  { href: "/admin/galeri", label: "Kelola Galeri", icon: "🖼️", desc: "Drag & drop foto" },
  { href: "/admin/logo", label: "Ganti Logo", icon: "☁️", desc: "Logo navbar & footer" },
  { href: "/admin/menu", label: "Kelola Menu", icon: "☕", desc: "Menu & kategori" },
  { href: "/admin/info", label: "Edit Informasi Kafe", icon: "✎", desc: "Teks, alamat, jam" },
  { href: "/admin/pengaturan", label: "Pengaturan Website", icon: "⚙️", desc: "SEO, sosmed, akun" },
];

export default function AdminShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const pathname = usePathname();
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    patchAdminFetch();
    fetch("/api/auth/me", { credentials: "include" }).then(r => r.json()).then(d => {
      if (!d.user) window.location.replace("/admin/login");
      else setUser(d.user);
      setChecking(false);
    }).catch(() => { window.location.replace("/admin/login"); });
  }, []);

  async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch { /* ignore */ }
    clearAdminToken();
    window.location.replace("/admin/login");
  }

  if (checking) return <div className="min-h-screen bg-[#fffbf1] grid place-items-center"><div className="text-center"><img src="/logo-cloud.svg" alt="KINTOUN" className="h-14 w-auto mx-auto animate-pulse" /><p className="text-sm text-[#527a94] mt-3 font-semibold">Memeriksa login admin…</p></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf3e2] flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col bg-[#0a365d] text-white sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <img src="/logo-kintoun-white.svg" alt="KINTOUN Admin" className="h-12 w-auto" /><p className="text-[10px] tracking-[0.24em] text-[#8ed0f5] font-black mt-2.5">ADMIN PANEL</p>
          <div className="mt-5 bg-white/8 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-[#8ed0f5] text-[#0a365d] grid place-items-center font-black">{user.charAt(0).toUpperCase()}</span><span className="leading-tight"><span className="block font-bold text-sm">{user}</span><span className="block text-[11px] opacity-60">Administrator • Online</span></span><span className="ml-auto w-2.5 h-2.5 bg-emerald-400 rounded-full" /></div>
        </div>
        <nav className="p-4 flex flex-col gap-1.5 flex-1">
          {NAV.map(n => {
            const active = pathname === n.href;
            return <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${active ? "bg-[#8ed0f5] text-[#0a365d] shadow-lg" : "hover:bg-white/8 text-white/85"}`}><span className="text-lg">{n.icon}</span><span className="leading-tight"><span className="block font-bold text-sm">{n.label}</span><span className={`block text-[11px] ${active ? "opacity-70" : "opacity-50"}`}>{n.desc}</span></span>{active && <span className="ml-auto">→</span>}</Link>;
          })}
        </nav>
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <Link href="/" target="_blank" className="text-center bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold text-sm">🌐 Lihat Website Publik ↗</Link>
          <button onClick={logout} className="bg-white text-[#0a365d] py-3 rounded-xl font-bold text-sm">Keluar / Logout</button>
          <p className="text-[10px] text-center opacity-40 mt-1">Foto tersimpan permanen di server & database</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-40 bg-[#0a365d] text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5"><img src="/logo-kintoun-white.svg" alt="KINTOUN Admin" className="h-9 w-auto" /></div>
          <div className="flex gap-2"><Link href="/" className="bg-white/15 px-3 py-2 rounded-full text-xs font-bold">Website ↗</Link><button onClick={() => setMobileOpen(!mobileOpen)} className="bg-white text-[#0a365d] w-9 h-9 rounded-full font-black">{mobileOpen ? "✕" : "☰"}</button></div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-[#114a75] text-white px-4 py-3 flex flex-col gap-1 sticky top-[60px] z-40 shadow-xl">
            {NAV.map(n => <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className={`px-3 py-3 rounded-xl font-bold text-sm ${pathname === n.href ? "bg-[#8ed0f5] text-[#0a365d]" : ""}`}>{n.icon} {n.label}</Link>)}
            <button onClick={logout} className="mt-2 bg-white text-[#0a365d] py-3 rounded-xl font-bold text-sm">Keluar / Logout</button>
          </div>
        )}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div><h1 className="font-serif font-semibold text-[clamp(1.7rem,3vw,2.4rem)] leading-none">{title}</h1>{subtitle && <p className="text-sm text-[#5e7d90] mt-2 max-w-2xl leading-relaxed">{subtitle}</p>}</div>
            <span className="hidden sm:inline-flex bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-full">● Terhubung ke Database</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export const inputCls = "w-full bg-white border border-[#c9e6f6] rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#8aa9bc] transition";
export const labelCls = "block text-[11px] font-black tracking-[0.14em] text-[#527a94] mb-1.5";
export const btnPrimary = "bg-[#0a365d] text-white px-5 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-[#2f9be8] transition disabled:opacity-50 disabled:cursor-not-allowed";
export const btnGhost = "bg-white border border-[#c9e6f6] px-5 py-3 rounded-full font-bold text-sm hover:border-[#2f9be8] transition";
