"use client";
import { useEffect, useMemo, useState } from "react";

type Settings = any;
type MenuItem = any;
type GalleryItem = any;

function formatIDR(n: number) { return "Rp" + Number(n || 0).toLocaleString("id-ID"); }

export default function PublicSite() {
  const [data, setData] = useState<{ settings: Settings; categories: any[]; menu: MenuItem[]; gallery: GalleryItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/public/content").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const href = data?.settings?.faviconUrl;
    if (!href) return;
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [data?.settings?.faviconUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (lightbox !== null && data) {
        if (e.key === "ArrowRight") setLightbox((lightbox + 1) % data.gallery.length);
        if (e.key === "ArrowLeft") setLightbox((lightbox - 1 + data.gallery.length) % data.gallery.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, data]);

  const s = data?.settings;
  const categories = useMemo(() => {
    if (!data) return ["Semua"];
    const names = data.categories.map((c: any) => c.name);
    const fromMenu = Array.from(new Set(data.menu.map((m: any) => m.categoryName)));
    return ["Semua", ...Array.from(new Set([...names, ...fromMenu]))];
  }, [data]);
  const filteredMenu = useMemo(() => {
    if (!data) return [];
    const list = data.menu.filter((m: any) => m.isAvailable !== false);
    return activeCat === "Semua" ? list : list.filter((m: any) => m.categoryName === activeCat);
  }, [data, activeCat]);

  const waLink = s ? `https://wa.me/${s.whatsapp}?text=${encodeURIComponent("Halo KINTOUN Coffee Galunggung, saya ingin bertanya tentang menu & jam buka hari ini.")}` : "https://wa.me/6285199890010";
  const mapsEmbed = "https://www.google.com/maps?q=KINTOUN%20Coffee%20Malang%20Galunggung%202JJ7%2B58%20Gading%20Kasri%20Malang&output=embed";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf1] flex flex-col items-center justify-center gap-4 px-6">
        <img src="/logo-kintoun.svg" alt="Logo KINTOUN — Indonesia Punya Kopi" className="h-16 w-auto animate-pulse" />
        <p className="tracking-[0.25em] text-xs font-bold text-[#527a94]">KINTOUN COFFEE • MALANG</p>
        <p className="text-sm text-[#527a94]">Menyiapkan pengalaman kopimu…</p>
      </div>
    );
  }

  if (!s) {
    return <div className="min-h-screen grid place-items-center p-8 text-center"><div><h1 className="font-serif text-3xl">KINTOUN Coffee</h1><p className="mt-2 text-sm opacity-70">Konten belum tersedia. Silakan cek lagi sebentar lagi.</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#fffbf1] overflow-x-hidden">
      {/* NAVBAR */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-[#fffbf1]/92 backdrop-blur-xl shadow-[0_8px_30px_rgba(35,25,18,0.08)]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <a href="#beranda" className="flex items-center gap-3">
              <img src={s.logoUrl || "/logo-kintoun.svg"} alt="KINTOUN — Indonesia Punya Kopi, Malang Galunggung" className="h-11 sm:h-12 w-auto" />
            </a>
            <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold tracking-wide">
              <a href="#beranda" className="hover:text-[#2f9be8]">Beranda</a>
              <a href="#tentang" className="hover:text-[#2f9be8]">Tentang</a>
              <a href="#menu" className="hover:text-[#2f9be8]">Menu</a>
              <a href="#galeri" className="hover:text-[#2f9be8]">Galeri</a>
              <a href="#lokasi" className="hover:text-[#2f9be8]">Lokasi</a>
            </nav>
            <div className="flex items-center gap-2">
              <a href={waLink} target="_blank" className="hidden sm:inline-flex items-center gap-2 bg-[#0a365d] text-white text-[13px] font-bold px-4 py-2.5 rounded-full hover:bg-[#2f9be8] transition shadow-lg">💬 WhatsApp</a>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-white border shadow-sm text-xl" aria-label="Menu navigasi">{mobileOpen ? "✕" : "☰"}</button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-[#fffbf1] border-t px-4 py-4 flex flex-col gap-1 text-sm font-semibold shadow-xl">
            {[["#beranda","Beranda"],["#tentang","Tentang Kami"],["#menu","Menu"],["#galeri","Galeri"],["#lokasi","Lokasi & Kontak"]].map(([h,l]) => (
              <a key={h} href={h} onClick={() => setMobileOpen(false)} className="py-3 px-3 rounded-xl hover:bg-[#faf3e2]">{l}</a>
            ))}
            <a href={waLink} target="_blank" className="mt-2 bg-[#0a365d] text-white text-center py-3 rounded-xl font-bold">Chat WhatsApp</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="beranda" className="relative pt-[68px] bg-[linear-gradient(180deg,#eaf6fe_0%,#fffbf1_58%,#fffbf1_100%)] overflow-hidden"><img src="/logo-cloud.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -top-4 right-[38%] w-28 opacity-[0.07] animate-drift hidden md:block" /><img src="/logo-cloud.svg" alt="" aria-hidden="true" className="pointer-events-none absolute top-40 -left-8 w-36 opacity-[0.05] animate-floaty hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-10 lg:pb-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 animate-fadeUp">
            <div className="inline-flex items-center gap-2 bg-white border border-[#dceffb] rounded-full pl-1.5 pr-3 py-1.5 shadow-sm">
              <span className="bg-[#0a365d] text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full">MALANG</span>
              <span className="text-[11px] font-bold tracking-widest text-[#527a94]">{s.heroSubtitle} • TUTUP 22.00</span>
            </div>
            <h1 className="font-serif font-semibold leading-[0.92] tracking-tight mt-6 text-[clamp(3.2rem,9vw,6.2rem)]">
              KINTOUN<br /><span className="italic font-medium text-[#2f9be8]">Coffee</span>
            </h1>
            <p className="font-serif italic text-[clamp(1.15rem,2.5vw,1.5rem)] text-[#2e4f66] mt-4">“{s.tagline}”</p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#517185] max-w-xl">{s.heroDescription}</p>

            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#menu" className="bg-[#0a365d] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-[0_12px_25px_rgba(35,25,18,0.25)] hover:bg-[#2f9be8] transition">☕ Lihat Menu</a>
              <a href="#galeri" className="bg-white px-6 py-3.5 rounded-full font-bold text-sm border border-[#0a365d]/10 shadow hover:border-[#2f9be8] transition">Lihat Galeri</a>
              <a href={s.mapsUrl} target="_blank" className="bg-[#faf3e2] px-6 py-3.5 rounded-full font-bold text-sm border border-[#dceffb] hover:bg-[#dceffb] transition">📍 Petunjuk Arah</a>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
              <div className="bg-white rounded-2xl p-3.5 border border-[#e4f1fa] shadow-sm"><p className="text-[10px] tracking-widest font-black text-[#5b93b8]">HARGA</p><p className="font-bold text-[13px] mt-1 leading-tight">{s.priceRange}</p></div>
              <div className="bg-white rounded-2xl p-3.5 border border-[#e4f1fa] shadow-sm"><p className="text-[10px] tracking-widest font-black text-[#5b93b8]">TUTUP</p><p className="font-bold text-[13px] mt-1">Pukul 22.00</p></div>
              <div className="bg-white rounded-2xl p-3.5 border border-[#e4f1fa] shadow-sm"><p className="text-[10px] tracking-widest font-black text-[#5b93b8]">AREA</p><p className="font-bold text-[13px] mt-1">Gading Kasri, Klojen</p></div>
            </div>
            <p className="text-[11px] text-[#7fa0b3] mt-3">📍 {s.plusCode} • Harga & menu dapat berubah — cek papan menu di lokasi</p>
          </div>

          <div className="lg:col-span-6 relative animate-fadeUp" style={{ animationDelay: "120ms" }}>
            <div className="relative rounded-[28px] overflow-hidden shadow-[0_30px_60px_rgba(35,25,18,0.22)] aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/4.2] bg-[#dceffb]">
              {s.heroImageUrl ? <img src={s.heroImageUrl} alt="Area bar KINTOUN Coffee Malang Galunggung" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-center p-8"><div><p className="text-4xl">☕</p><p className="font-bold mt-2">Foto Hero Belum Diisi</p><p className="text-sm opacity-60">Admin dapat mengganti via Panel Admin</p></div></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a365d]/55 via-transparent to-transparent" />
              <div className="absolute left-4 right-4 bottom-4 sm:left-5 sm:right-auto bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl max-w-sm">
                <p className="text-[10px] tracking-[0.2em] font-black text-[#2f9be8]">SIGNATURE FAVORIT</p>
                <p className="font-serif font-bold text-lg leading-tight mt-1">K.S.K — Kopi Susu Kintoun</p>
                <p className="text-xs text-[#517185] mt-1">Double shot espresso, secret sauce & gula aren asli.</p>
                <div className="flex items-center gap-2 mt-2"><span className="font-black">Rp13.636</span><span className="text-xs line-through opacity-50">Rp25.000</span><span className="text-[10px] bg-[#0a365d] text-white px-2 py-0.5 rounded-full font-bold">100% Arabica</span></div>
              </div>
              <div className="absolute top-4 right-4 bg-[#0a365d]/90 text-white backdrop-blur px-3.5 py-2 rounded-full text-[11px] font-bold shadow-lg animate-floaty">#IndonesiaPunyaKopi</div>
            </div>
            <div className="hidden sm:flex absolute -bottom-5 -left-3 bg-[#0a365d] text-white rounded-2xl px-4 py-3 shadow-2xl items-center gap-3 rotate-[-1deg]">
              <span className="text-2xl">✦</span><span className="leading-tight"><span className="block font-bold text-sm">Coffee in hand,</span><span className="block text-xs opacity-80">the world's at ease</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#0a365d] text-[#faf3e2] py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[11px] font-black tracking-[0.22em]">
          <span>K.S.K • KOPI SUSU KINTOUN</span><span className="text-[#8ed0f5]">✦</span><span>SEA SALT BUTTERSCOTCH</span><span className="text-[#8ed0f5]">✦</span><span>ICED BLACK AMERICANO</span><span className="text-[#8ed0f5]">✦</span><span>MATCHA SEA SALT</span>
        </div>
      </div>

      {/* TENTANG */}
      <section id="tentang" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-[28px] overflow-hidden shadow-2xl aspect-[4/3] bg-[#dceffb]">
              {s.aboutImageUrl ? <img src={s.aboutImageUrl} alt="Interior KINTOUN Coffee" className="w-full h-full object-cover hover:scale-105 transition duration-700" loading="lazy" /> : <div className="w-full h-full grid place-items-center p-8 text-center">Foto kafe belum diisi — ganti via Admin</div>}
            </div>
            <div className="absolute -bottom-6 right-4 sm:right-8 bg-white rounded-2xl shadow-xl border p-4 flex gap-4">
              <div><p className="text-[10px] tracking-widest font-black text-[#5b93b8]">TELEPON / WA</p><a href={`tel:${s.phone.replace(/\D/g,"")}`} className="font-black text-sm">{s.phone}</a></div>
              <div className="w-px bg-[#dceffb]" />
              <div><p className="text-[10px] tracking-widest font-black text-[#5b93b8]">PLUS CODE</p><p className="font-bold text-[11px] leading-tight max-w-[140px]">{s.plusCode}</p></div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-black tracking-[0.28em] text-[#2f9be8]">TENTANG KAMI</p>
            <h2 className="font-serif font-semibold text-[clamp(2rem,4vw,3rem)] leading-[1.05] mt-3">{s.aboutTitle}</h2>
            <p className="mt-5 text-[15px] leading-[1.85] text-[#35586e] whitespace-pre-line">{s.aboutDescription}</p>
            <div className="grid grid-cols-2 gap-3 mt-7">
              {[
                ["📍","Di jantung Klojen","Jl. Galunggung No.38 — mudah dijangkau, dekat pusat kota Malang."],
                ["💸","Ramah di kantong","Rp1–25.000 per orang. Kopi enak tidak harus mahal."],
                ["🕙","Tutup 22.00","Tempat singgah sore hingga malam untuk santai & bekerja."],
                ["☕","Signature jelas","K.S.K, Sea Salt Butterscotch & Black Series jadi andalan."],
              ].map(([icon,t,d]) => (
                <div key={t} className="bg-white rounded-2xl p-4 border border-[#e4f1fa] shadow-sm"><span className="text-xl">{icon}</span><p className="font-bold text-sm mt-2">{t}</p><p className="text-xs leading-relaxed text-[#5e7d90] mt-1">{d}</p></div>
              ))}
            </div>
            <a href={waLink} target="_blank" className="inline-flex mt-7 bg-[#0a365d] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-[#2f9be8] transition">Tanya via WhatsApp →</a>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-16 lg:py-24 bg-[#0a365d] text-[#fffbf1] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#2f9be8]/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-black tracking-[0.28em] text-[#8ed0f5]">OUR MENU • #IndonesiaPunyaKopi</p>
              <h2 className="font-serif font-semibold text-[clamp(2.2rem,4vw,3.4rem)] leading-none mt-3">Menu KINTOUN</h2>
              <p className="text-sm text-white/65 mt-3 max-w-xl leading-relaxed">Harga di bawah mengikuti papan menu KINTOUN. Admin dapat menambah, mengubah harga, foto & kategori kapan saja — tanpa coding.</p>
            </div>
            <a href={waLink} target="_blank" className="shrink-0 bg-white text-[#0a365d] px-5 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-[#8ed0f5] hover:text-white transition">Pesan / Tanya Menu ↗</a>
          </div>

          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((c: string) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`shrink-0 px-4 py-2.5 rounded-full text-[13px] font-bold border transition ${activeCat === c ? "bg-[#8ed0f5] text-[#0a365d] border-[#8ed0f5]" : "bg-white/5 text-white/85 border-white/15 hover:bg-white/10"}`}>{c}</button>
            ))}
          </div>

          {filteredMenu.length === 0 ? (
            <div className="mt-10 bg-white/5 border border-dashed border-white/20 rounded-3xl p-10 text-center">
              <p className="text-4xl">☕</p><h3 className="font-serif text-2xl font-bold mt-3">Menu sedang diperbarui</h3><p className="text-sm text-white/60 mt-2 max-w-md mx-auto">Menu untuk kategori ini belum ditambahkan. Admin dapat menambahkan menu melalui Panel Admin → Kelola Menu.</p>
              <a href={waLink} target="_blank" className="inline-block mt-5 bg-white text-[#0a365d] px-5 py-2.5 rounded-full font-bold text-sm">Tanya Menu via WhatsApp</a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filteredMenu.map((m: any) => (
                <article key={m.id} className="group bg-[#114a75] border border-white/8 rounded-[22px] overflow-hidden hover:border-[#8ed0f5]/50 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                  {m.imageUrl ? (
                    <div className="h-44 overflow-hidden bg-[#175582]"><img src={m.imageUrl} alt={m.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
                  ) : (
                    <div className="h-28 bg-gradient-to-br from-[#175582] to-[#0a365d] flex items-center justify-between px-5"><span className="font-serif italic text-white/25 text-lg leading-tight max-w-[180px]">{m.name}</span><span className="text-3xl opacity-60">☕</span></div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[10px] font-black tracking-widest text-[#8ed0f5] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{(m.categoryName || "MENU").toUpperCase()}</span>
                      {m.isFeatured && <span className="text-[10px] font-black bg-[#8ed0f5] text-[#0a365d] px-2.5 py-1 rounded-full">★ FAVORIT</span>}
                    </div>
                    <h3 className="font-serif font-bold text-[19px] leading-snug mt-3">{m.name}</h3>
                    {m.description && <p className="text-[13px] leading-relaxed text-white/60 mt-1.5 line-clamp-2">{m.description}</p>}
                    {m.badge && <p className="text-[11px] font-bold text-[#8ed0f5] mt-2">✦ {m.badge}</p>}
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-white/10">
                      <div><span className="font-black text-lg">{formatIDR(m.price)}</span>{m.originalPrice ? <span className="text-xs line-through text-white/40 ml-2">{formatIDR(m.originalPrice)}</span> : null}</div>
                      <a href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Halo KINTOUN, saya ingin pesan ${m.name} (${formatIDR(m.price)}). Apakah tersedia?`)}`} target="_blank" className="text-xs font-bold bg-white text-[#0a365d] px-3.5 py-2 rounded-full hover:bg-[#8ed0f5] transition">Pesan ↗</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="text-[11px] text-white/40 mt-6">* Harga belum termasuk pajak (PB1) mengikuti ketentuan di lokasi. Harga promo dapat berubah sewaktu-waktu.</p>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black tracking-[0.28em] text-[#2f9be8]">GALERI</p>
              <h2 className="font-serif font-semibold text-[clamp(2.2rem,4vw,3.4rem)] leading-none mt-3">Suasana KINTOUN</h2>
              <p className="text-sm text-[#5e7d90] mt-3 max-w-lg leading-relaxed">Foto-foto suasana KINTOUN Galunggung — klik untuk melihat lebih besar. Dikelola admin via drag & drop, foto baru langsung tampil di sini.</p>
            </div>
            <span className="text-xs font-bold bg-white border px-3.5 py-2 rounded-full shadow-sm shrink-0">{data.gallery.length} foto • Diperbarui via Admin</span>
          </div>

          {data.gallery.length === 0 ? (
            <div className="mt-10 border-2 border-dashed border-[#a5d6f2] rounded-[28px] bg-[#f2f9fe] p-12 text-center">
              <p className="text-5xl">🖼️</p><h3 className="font-serif text-2xl font-bold mt-4">Galeri akan segera hadir</h3><p className="text-sm text-[#5e7d90] mt-2 max-w-md mx-auto">Foto suasana KINTOUN sedang diperbarui. Mampir ke Jl. Galunggung No.38 atau chat WhatsApp untuk lihat menu hari ini.</p>
            </div>
          ) : (
            <div className="masonry mt-8">
              {data.gallery.filter((g: any) => g.isPublished !== false).map((g: any, idx: number) => (
                <button key={g.id} onClick={() => setLightbox(idx)} className="block w-full text-left group relative rounded-[20px] overflow-hidden bg-[#dceffb] shadow hover:shadow-2xl transition focus:outline-none focus:ring-4 focus:ring-[#2f9be8]/40">
                  <img src={g.imageUrl} alt={g.altText || g.title || "Foto KINTOUN Coffee"} loading="lazy" className="w-full h-auto object-cover group-hover:scale-[1.03] transition duration-500" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                  {(g.title || g.caption) && <span className="absolute left-0 right-0 bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0"><span className="block font-bold text-sm">{g.title}</span><span className="block text-xs opacity-85 mt-0.5">{g.caption}</span></span>}
                  <span className="absolute top-3 right-3 bg-black/55 text-white text-[11px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">🔍 Perbesar</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LOKASI */}
      <section id="lokasi" className="py-16 lg:py-24 bg-[#faf3e2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-black tracking-[0.28em] text-[#2f9be8]">LOKASI & KONTAK</p>
          <h2 className="font-serif font-semibold text-[clamp(2.2rem,4vw,3.4rem)] leading-none mt-3">Mampir ke Galunggung</h2>
          <div className="grid lg:grid-cols-5 gap-6 mt-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-[22px] p-6 shadow-sm border border-[#dceffb]">
                <p className="text-[10px] tracking-widest font-black text-[#5b93b8]">ALAMAT LENGKAP</p>
                <p className="font-bold leading-relaxed mt-2">{s.address}</p>
                <p className="text-xs text-[#5e7d90] mt-2">Plus Code: <span className="font-bold text-[#0a365d]">{s.plusCode}</span></p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <a href={s.mapsUrl} target="_blank" className="bg-[#0a365d] text-white px-5 py-3 rounded-full font-bold text-sm shadow hover:bg-[#2f9be8] transition">Buka Google Maps ↗</a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=KINTOUN+Coffee+Malang+Galunggung`} target="_blank" className="bg-[#faf3e2] border px-5 py-3 rounded-full font-bold text-sm">Petunjuk Arah</a>
                </div>
              </div>
              <div className="bg-[#0a365d] text-white rounded-[22px] p-6 shadow-xl">
                <p className="text-[10px] tracking-widest font-black text-[#8ed0f5]">JAM OPERASIONAL</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex justify-between gap-4 border-b border-white/10 pb-2"><span className="opacity-70">Senin – Jumat</span><b>{s.hoursWeekday.replace("Senin – Jumat • ","") || "— – 22.00"}</b></p>
                  <p className="flex justify-between gap-4 border-b border-white/10 pb-2"><span className="opacity-70">Sabtu – Minggu</span><b>{s.hoursWeekend.replace("Sabtu – Minggu • ","") || "— – 22.00"}</b></p>
                </div>
                <p className="text-[11px] leading-relaxed text-white/60 mt-3">{s.hoursNote}</p>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <a href={`tel:${s.phone.replace(/\D/g,"")}`} className="bg-white text-[#0a365d] text-center py-3 rounded-xl font-bold text-sm">📞 Telepon</a>
                  <a href={waLink} target="_blank" className="bg-[#25D366] text-[#0b3d20] text-center py-3 rounded-xl font-black text-sm">WhatsApp</a>
                </div>
                <p className="text-center font-black tracking-wider mt-3 text-sm">{s.phone}</p>
              </div>
              <div className="bg-white rounded-[22px] p-5 shadow-sm border border-[#dceffb] flex items-center justify-between">
                <div><p className="text-[10px] tracking-widest font-black text-[#5b93b8]">KISARAN HARGA</p><p className="font-black mt-1">{s.priceRange}</p></div><span className="text-3xl">💸</span>
              </div>
            </div>
            <div className="lg:col-span-3 rounded-[22px] overflow-hidden shadow-xl border border-[#dceffb] bg-[#dceffb] min-h-[420px] relative">
              <iframe title="Peta KINTOUN Coffee Malang Galunggung" src={mapsEmbed} className="absolute inset-0 w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 pt-4 bg-[#faf3e2]">
        <div className="max-w-7xl mx-auto bg-[#0a365d] rounded-[28px] px-6 py-10 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2f9be8]/25 rounded-full blur-3xl" />
          <div className="relative">
            <p className="font-serif italic text-[#8ed0f5] text-lg">Coffee in hand, the world's at ease</p>
            <h2 className="font-serif font-semibold text-[clamp(1.9rem,4vw,3rem)] leading-tight mt-2">Sudah siap ngopi di KINTOUN?</h2>
            <p className="text-sm text-white/65 mt-3 max-w-lg mx-auto">Datang langsung ke Jl. Galunggung No.38 atau chat dulu untuk tanya menu & ketersediaan tempat.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <a href={waLink} target="_blank" className="bg-[#25D366] text-[#0b3d20] px-7 py-3.5 rounded-full font-black text-sm shadow-xl">💬 Chat WhatsApp</a>
              <a href={s.mapsUrl} target="_blank" className="bg-white text-[#0a365d] px-7 py-3.5 rounded-full font-bold text-sm">📍 Buka Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#062540] text-white/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 inline-block"><img src={s.logoDarkUrl || "/logo-kintoun-white.svg"} alt="KINTOUN — Indonesia Punya Kopi" className="h-14 w-auto" /></div><p className="text-[10px] tracking-[0.24em] text-[#8ed0f5] font-black mt-3">MALANG • GALUNGGUNG</p>
            <p className="text-sm leading-relaxed mt-4 max-w-md">{s.heroDescription}</p>
            <p className="text-xs mt-3 opacity-60">#IndonesiaPunyaKopi • {s.priceRange}</p>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-wider">NAVIGASI</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#beranda" className="hover:text-white">Beranda</a></li>
              <li><a href="#tentang" className="hover:text-white">Tentang Kami</a></li>
              <li><a href="#menu" className="hover:text-white">Menu</a></li>
              <li><a href="#galeri" className="hover:text-white">Galeri</a></li>
              <li><a href="#lokasi" className="hover:text-white">Lokasi & Kontak</a></li>
              <li><a href="#lokasi" className="hover:text-white">Hubungi Kami</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-wider">KONTAK</p>
            <p className="text-sm leading-relaxed mt-4">{s.address}</p>
            <p className="text-sm mt-3">📞 <a href={`tel:${s.phone.replace(/\D/g,"")}`} className="font-bold text-white">{s.phone}</a></p>
            <p className="text-sm mt-1">🕙 Tutup pukul 22.00</p>
            {(s.instagramUrl || s.tiktokUrl || s.facebookUrl) ? (
              <div className="flex gap-2 mt-4">
                {s.instagramUrl && <a href={s.instagramUrl} target="_blank" className="bg-white/10 px-3 py-2 rounded-full text-xs font-bold hover:bg-white/20">Instagram ↗</a>}
                {s.tiktokUrl && <a href={s.tiktokUrl} target="_blank" className="bg-white/10 px-3 py-2 rounded-full text-xs font-bold hover:bg-white/20">TikTok ↗</a>}
                {s.facebookUrl && <a href={s.facebookUrl} target="_blank" className="bg-white/10 px-3 py-2 rounded-full text-xs font-bold hover:bg-white/20">Facebook ↗</a>}
              </div>
            ) : <p className="text-[11px] opacity-50 mt-4">Media sosial dapat ditambahkan admin di Pengaturan Website.</p>}
          </div>
        </div>
        <div className="border-t border-white/10"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs opacity-60"><span>© {new Date().getFullYear()} {s.cafeName}. All rights reserved.</span><span>Jl. Galunggung No.38, Malang • {s.plusCode}</span></div></div>
      </footer>

      {/* FLOATING WA */}
      <a href={waLink} target="_blank" aria-label="Chat WhatsApp KINTOUN" className="fixed bottom-5 right-5 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-[0_15px_35px_rgba(37,211,102,0.45)] grid place-items-center text-2xl hover:scale-110 transition">💬<span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0a365d] rounded-full border-2 border-white" /></a>

      {/* LIGHTBOX */}
      {lightbox !== null && data.gallery[lightbox] && (
        <div className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex flex-col" onClick={() => setLightbox(null)}>
          <div className="flex items-center justify-between px-4 py-4 text-white">
            <span className="text-sm font-bold bg-white/10 px-3 py-1.5 rounded-full">{lightbox + 1} / {data.gallery.length}</span>
            <button className="w-11 h-11 rounded-full bg-white text-black font-black text-lg shadow" onClick={() => setLightbox(null)} aria-label="Tutup">✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-4 gap-2 min-h-0">
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + data.gallery.length) % data.gallery.length); }} className="hidden sm:grid w-11 h-11 shrink-0 rounded-full bg-white/15 text-white text-xl place-items-center hover:bg-white/30" aria-label="Foto sebelumnya">‹</button>
            <figure className="max-w-4xl w-full text-center min-h-0" onClick={e => e.stopPropagation()}>
              <img src={data.gallery[lightbox].imageUrl} alt={data.gallery[lightbox].altText || "Foto KINTOUN"} className="max-h-[72vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain bg-black" />
              {(data.gallery[lightbox].title || data.gallery[lightbox].caption) && <figcaption className="text-white mt-4"><span className="block font-serif font-bold text-xl">{data.gallery[lightbox].title}</span><span className="block text-sm opacity-75 mt-1">{data.gallery[lightbox].caption}</span></figcaption>}
            </figure>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % data.gallery.length); }} className="hidden sm:grid w-11 h-11 shrink-0 rounded-full bg-white/15 text-white text-xl place-items-center hover:bg-white/30" aria-label="Foto berikutnya">›</button>
          </div>
          <div className="sm:hidden flex justify-center gap-3 pb-6">
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + data.gallery.length) % data.gallery.length); }} className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm">‹ Sebelumnya</button>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % data.gallery.length); }} className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm">Berikutnya ›</button>
          </div>
        </div>
      )}
    </div>
  );
}
