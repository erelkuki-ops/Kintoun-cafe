# Deploy KINTOUN Coffee ke Netlify (link permanen)

Link `e2b.app` hanya preview sementara. Ikuti langkah ini supaya website punya alamat tetap, misalnya `https://kintoun.netlify.app`.

## 1. Siapkan kode di GitHub

1. Buat akun di [github.com](https://github.com) jika belum ada.
2. Buat repository baru (contoh: `kintoun-coffee`).
3. Upload semua folder project ini ke repository itu (kecuali `node_modules` dan `.env`).

## 2. Buat database gratis (wajib)

Netlify tidak punya PostgreSQL. Pakai [Neon](https://neon.tech) (gratis):

1. Daftar di neon.tech → **Create project**.
2. Copy **Connection string** (format `postgresql://...`).
3. Simpan; ini nanti jadi `DATABASE_URL`.

Setelah pertama kali live, buka website sekali supaya tabel & data awal terbuat otomatis.

## 3. Deploy di Netlify

1. Daftar di [netlify.com](https://netlify.com).
2. **Add new site** → **Import an existing project** → pilih repo GitHub.
3. Build settings (biasanya terisi sendiri dari `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Jangan Deploy dulu.** Isi Environment variables dulu:

| Nama | Isi |
|---|---|
| `DATABASE_URL` | Connection string dari Neon |
| `ADMIN_SESSION_SECRET` | Teks acak panjang, contoh: `kintoun-malang-rahasia-2026` |
| `ADMIN_USERNAME` | Username admin yang Anda inginkan |
| `ADMIN_PASSWORD` | Password admin yang Anda inginkan |

5. Deploy site.
6. Setelah selesai, alamat permanen muncul: `https://NAMA-SITUS.netlify.app`

Admin: `https://NAMA-SITUS.netlify.app/admin/login`

## 4. Domain sendiri (opsional)

Di Netlify: **Domain management** → **Add custom domain**  
Contoh: `kintouncoffee.com` atau `ngopi.kintoun.id`

## Catatan galeri

Foto yang di-upload lewat admin tersimpan di server. Di Netlify, file upload bisa hilang saat deploy ulang. Untuk galeri yang benar-benar permanen di Netlify, hubungkan Storage (Supabase/Cloudinary) — database Neon tetap menyimpan menu & teks kafe.
