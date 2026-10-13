# KINTOUN Coffee Malang Galunggung — Panduan Lengkap

## Akun Admin Pertama
- Username default: `admin`
- Password default: `kintoun123`
- Login di `/admin/login`, lalu ganti password di **Pengaturan Website → Ganti Password**.
- Untuk production, atur env sebelum pertama kali jalan: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (acak, panjang).

## Cara Upload Foto Galeri (Drag & Drop)
1. Login → **Kelola Galeri**
2. Drag banyak foto JPG/PNG/WebP dari komputer ke area "Drag & Drop Foto di Sini" (atau klik untuk pilih file)
3. Lihat preview thumbnail, hapus yang salah dengan ✕, isi judul/caption opsional per foto
4. Klik **Upload dan Simpan** → lihat progress bar → pesan sukses
5. Foto tersimpan permanen (file di `public/uploads` + metadata di PostgreSQL) & langsung tampil di galeri publik. Atur urutan dengan drag kartu atau tombol ↑↓.

## Kelola Menu & Info
- **Kelola Menu**: tambah/edit/hapus menu, harga coret, badge, kategori (Signature / Black Series / Selain Kopi / buat sendiri).
- **Edit Informasi Kafe**: tagline, hero, tentang kami, alamat, telepon/WA, Plus Code, jam operasional (tutup 22.00 pasti; jam buka isi setelah konfirmasi), foto hero/tentang via URL foto galeri.
- **Pengaturan Website**: SEO title/description, Instagram/TikTok/Facebook (kosong = tidak tampil), ganti password.

## Teknologi & Penyimpanan
- Next.js (App Router) + PostgreSQL via Drizzle ORM.
- Upload **bukan Base64** dan **bukan URL manual**: file asli dioptimalkan client-side (resize maks 1600px, JPEG q0.82) lalu disimpan server.
- Auth: password hash scrypt + cookie httpOnly signed. Hanya admin login yang bisa POST/PUT/DELETE; publik hanya GET.

## Deploy ke Netlify + Supabase (produksi eksternal)
Netlify static tidak punya penyimpanan file permanen. Untuk skala produksi:
1. Buat project di supabase.com → ambil Project URL + anon key. **Jangan** taruh service-role key di frontend.
2. Buat tabel sesuai `src/db/schema.ts` (site_settings, menu_categories, menu_items, gallery_images, admin_users) atau arahkan `DATABASE_URL` ke Postgres Supabase.
3. Buat Storage bucket publik `gallery`; aktifkan RLS: publik boleh SELECT, hanya authenticated/admin boleh INSERT/UPDATE/DELETE.
4. Di Netlify Site Settings → Environment Variables: `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Deploy — `netlify.toml` sudah disertakan (plugin Next.js).
6. Bila kredensial belum diisi, panel menampilkan status konfigurasi secara jujur (tidak berpura-pura berhasil).

## Instalasi Lokal
```bash
npm install
# atur .env: DATABASE_URL=postgresql://...
npx drizzle-kit push
npm run dev
```

## Data Resmi Kafe
- Jl. Galunggung No. 38, Gading Kasri, Kec. Klojen, Kota Malang, Jawa Timur 65115
- Telepon/WA: 0851-9989-0010 → https://wa.me/6285199890010
- Harga: Rp1–25.000 per orang • Tutup 22.00 • Plus Code: 2JJ7+58 Gading Kasri, Malang
- Maps: https://www.google.com/maps/search/?api=1&query=KINTOUN+Coffee+Malang+Galunggung
- Menu awal diambil dari foto papan menu asli (K.S.K Rp13.636, Sea Salt Butterscotch Rp15.454, dll) — harga promo dapat berubah, admin dapat memperbarui.
