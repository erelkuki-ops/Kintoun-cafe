import { db } from "@/db";
import { siteSettings, menuCategories, menuItems, galleryImages, adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth";

// Foto resmi KINTOUN dari pemilik — file lokal di public/kintoun/
const HERO = "/kintoun/gallery-bar.jpg";
const ABOUT = "/kintoun/gallery-seating.jpg";

export const KINTOUN_GALLERY = [
  { imageUrl: "/kintoun/gallery-bar.jpg", title: "Area Bar & Kasir KINTOUN", caption: "Counter navy khas KINTOUN dengan menu digital — pesan, bayar, lalu pick up di sini", altText: "Area bar dan kasir KINTOUN Coffee Malang dengan counter biru navy", sortOrder: 1 },
  { imageUrl: "/kintoun/gallery-seating.jpg", title: "Ruang Duduk — Coffee in Hand", caption: "“Coffee in hand, the world's at ease” — sudut duduk nyaman untuk santai & bekerja", altText: "Ruang duduk KINTOUN dengan dinding navy dan meja kayu", sortOrder: 2 },
  { imageUrl: "/kintoun/gallery-espresso.jpg", title: "Di Balik Bar", caption: "Mesin espresso & biji kopi pilihan — setiap gelas dibuat segar saat dipesan", altText: "Mesin espresso dan rak biji kopi di KINTOUN Coffee", sortOrder: 3 },
  { imageUrl: "/kintoun/gallery-cup.jpg", title: "Segelas KINTOUN, Di Tanganmu", caption: "Iced coffee dengan logo awan KINTOUN — teman rehat di siang Malang", altText: "Tangan memegang segelas iced coffee KINTOUN berlatar jendela kafe", sortOrder: 4 },
  { imageUrl: "/kintoun/gallery-signature.jpg", title: "KINTOUN Signature", caption: "Duo signature andalan — creamy, segar, dan berkarakter", altText: "Dua gelas signature iced coffee KINTOUN", sortOrder: 5 },
  { imageUrl: "/kintoun/gallery-duo.jpg", title: "Ngopi Berdua Lebih Seru", caption: "Dua gelas favorit di meja KINTOUN Galunggung", altText: "Dua gelas kopi susu KINTOUN di atas meja kafe", sortOrder: 6 },
];

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  try {
    // settings
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
    if (existing.length === 0) {
      await db.insert(siteSettings).values({
        id: 1,
        cafeName: "KINTOUN Coffee Malang Galunggung",
        tagline: "Coffee in hand, the world's at ease.",
        heroTitle: "KINTOUN Coffee",
        heroSubtitle: "MALANG • GALUNGGUNG",
        heroDescription: "Coffee shop hangat di Jl. Galunggung, Malang — tempat singgah untuk kopi susu favorit, americano yang bersih, dan momen santai di tengah kota. #IndonesiaPunyaKopi",
        heroImageUrl: HERO,
        aboutTitle: "Singgah, duduk, dan nikmati kopimu.",
        aboutDescription: "KINTOUN Coffee Malang Galunggung adalah coffee shop di kawasan Gading Kasri, Klojen — mudah dijangkau dari pusat Kota Malang. Dengan harga ramah Rp1–25.000 per orang, KINTOUN jadi pilihan untuk ngopi santai, kerja dengan laptop, atau sekadar rehat sejenak. Teks ini dapat diubah kapan saja melalui Panel Admin → Edit Informasi Kafe.",
        aboutImageUrl: ABOUT,
        address: "Jl. Galunggung No. 38, Gading Kasri, Kec. Klojen, Kota Malang, Jawa Timur 65115",
        phone: "0851-9989-0010",
        whatsapp: "6285199890010",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=KINTOUN+Coffee+Malang+Galunggung",
        plusCode: "2JJ7+58 Gading Kasri, Malang City, East Java",
        priceRange: "Rp1–25.000 per orang",
        hoursWeekday: "Senin – Jumat • — – 22.00",
        hoursWeekend: "Sabtu – Minggu • — – 22.00",
        hoursNote: "Tutup pukul 22.00. Jam buka harian dikonfirmasi — admin dapat memperbarui jam buka di panel admin.",
        seoDescription: "KINTOUN Coffee Malang Galunggung — coffee shop di Jl. Galunggung No.38, Gading Kasri, Klojen, Kota Malang. Harga Rp1–25.000/orang, tutup 22.00. Lihat menu, galeri & petunjuk arah.",
        logoUrl: "/logo-kintoun.svg",
        logoDarkUrl: "/logo-kintoun-white.svg",
        faviconUrl: "/favicon.svg",
      });
    } else {
      const row = existing[0] as any;
      if (!row.logoUrl) {
        await db.update(siteSettings).set({
          logoUrl: "/logo-kintoun.svg",
          logoDarkUrl: "/logo-kintoun-white.svg",
          faviconUrl: "/favicon.svg",
        }).where(eq(siteSettings.id, 1));
      }
    }
    // admin
    const admins = await db.select().from(adminUsers);
    if (admins.length === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const password = process.env.ADMIN_PASSWORD || "kintoun123";
      await db.insert(adminUsers).values({ username, passwordHash: hashPassword(password) });
    }
    // categories + menu
    const cats = await db.select().from(menuCategories);
    let catMap: Record<string, number> = {};
    if (cats.length === 0) {
      const seedCats = [
        { name: "KINTOUN Signature", slug: "signature", sortOrder: 1 },
        { name: "Black Series", slug: "black-series", sortOrder: 2 },
        { name: "Selain Kopi", slug: "selain-kopi", sortOrder: 3 },
        { name: "Food & Snack", slug: "food", sortOrder: 4 },
      ];
      for (const c of seedCats) {
        const [row] = await db.insert(menuCategories).values(c).returning();
        catMap[c.name] = row.id;
      }
    } else {
      cats.forEach(c => { catMap[c.name] = c.id; });
    }
    const menus = await db.select().from(menuItems);
    if (menus.length === 0) {
      // Harga dari foto papan menu asli KINTOUN (terlihat di dokumentasi)
      const seedMenu = [
        { name: "K.S.K — Kopi Susu Kintoun", description: "Double shot espresso, secret sauce & gula aren asli. Signature paling dicari.", price: 13636, originalPrice: 25000, categoryName: "KINTOUN Signature", badge: "Best Seller • 100% Arabica", isFeatured: true, sortOrder: 1, imageUrl: "/kintoun/gallery-cup.jpg" },
        { name: "Sea Salt Butterscotch", description: "Espresso, susu, cloudy foam, sea salt butterscotch & taburan crumble.", price: 15454, originalPrice: 33000, categoryName: "KINTOUN Signature", badge: "Signature • Special Blend", isFeatured: true, sortOrder: 2, imageUrl: "/kintoun/gallery-signature.jpg" },
        { name: "Es Kopi Susu Tiramisu", description: "Espresso, susu, cloudy foam & rasa tiramisu yang lembut.", price: 15454, originalPrice: 34000, categoryName: "KINTOUN Signature", badge: "Special Blend", isFeatured: false, sortOrder: 3, imageUrl: "" },
        { name: "Double Shot Iced Shaken", description: "Double shot espresso dikocok dingin — pekat, segar, dan berani.", price: 18182, originalPrice: 33000, categoryName: "KINTOUN Signature", badge: "100% Arabica", isFeatured: false, sortOrder: 4, imageUrl: "" },
        { name: "Americano Iced Black", description: "Iced black americano yang bersih dan menyegarkan. 14oz.", price: 10909, originalPrice: 20000, categoryName: "Black Series", badge: "100% Arabica", isFeatured: true, sortOrder: 5, imageUrl: "/kintoun/gallery-duo.jpg" },
        { name: "Sunset Peach Americano", description: "Americano dengan sentuhan peach — ringan, fruity, dan segar.", price: 15454, originalPrice: 29000, categoryName: "Black Series", badge: "100% Arabica", isFeatured: false, sortOrder: 6, imageUrl: "" },
        { name: "Matcha Sea Salt", description: "Matcha lembut dengan cloudy foam sea salt yang gurih-manis.", price: 15454, originalPrice: 31000, categoryName: "Selain Kopi", badge: "Selain Kopi", isFeatured: false, sortOrder: 7, imageUrl: "" },
        { name: "Choc-Cloud", description: "Cokelat creamy dengan cloudy foam khas KINTOUN.", price: 15454, originalPrice: 29000, categoryName: "Selain Kopi", badge: "Selain Kopi", isFeatured: false, sortOrder: 8, imageUrl: "" },
        { name: "Mineral Water + Ice", description: "Air mineral dingin dengan es.", price: 10909, originalPrice: null, categoryName: "Selain Kopi", badge: "", isFeatured: false, sortOrder: 9, imageUrl: "" },
      ];
      for (const m of seedMenu) {
        await db.insert(menuItems).values({ ...m, categoryId: catMap[m.categoryName] || null });
      }
    }
    // --- Galeri foto KINTOUN + migrasi dari foto contoh lama ---
    const gallery = await db.select().from(galleryImages);
    const hasKintounPhotos = gallery.some(g => g.imageUrl.startsWith("/kintoun/"));
    if (!hasKintounPhotos) {
      // hapus hanya foto contoh bawaan lama (bukan upload admin: storagePath kosong + URL pexels)
      for (const g of gallery) {
        if (!g.storagePath && g.imageUrl.includes("images.pexels.com")) {
          await db.delete(galleryImages).where(eq(galleryImages.id, g.id));
        }
      }
      const remaining = await db.select().from(galleryImages);
      const base = remaining.length ? Math.max(...remaining.map(g => g.sortOrder)) : 0;
      for (let i = 0; i < KINTOUN_GALLERY.length; i++) {
        await db.insert(galleryImages).values({ ...KINTOUN_GALLERY[i], sortOrder: base + i + 1 });
      }
      // arahkan hero & tentang ke foto KINTOUN bila masih foto contoh lama
      const [sNow] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
      if (sNow && (sNow.heroImageUrl.includes("images.pexels.com") || sNow.aboutImageUrl.includes("images.pexels.com") || !sNow.heroImageUrl || !sNow.aboutImageUrl)) {
        await db.update(siteSettings).set({
          heroImageUrl: sNow.heroImageUrl.includes("images.pexels.com") || !sNow.heroImageUrl ? HERO : sNow.heroImageUrl,
          aboutImageUrl: sNow.aboutImageUrl.includes("images.pexels.com") || !sNow.aboutImageUrl ? ABOUT : sNow.aboutImageUrl,
        }).where(eq(siteSettings.id, 1));
      }
      // foto menu bawaan lama (pexels) → foto KINTOUN
      const menuFix: Record<string, string> = {
        "K.S.K — Kopi Susu Kintoun": "/kintoun/gallery-cup.jpg",
        "Sea Salt Butterscotch": "/kintoun/gallery-signature.jpg",
        "Americano Iced Black": "/kintoun/gallery-duo.jpg",
      };
      const allMenu = await db.select().from(menuItems);
      for (const m of allMenu) {
        if (m.imageUrl.includes("images.pexels.com") && menuFix[m.name]) {
          await db.update(menuItems).set({ imageUrl: menuFix[m.name] }).where(eq(menuItems.id, m.id));
        }
      }
    }
    seeded = true;
  } catch (e) {
    console.error("seed error", e);
  }
}

export function formatIDR(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}
