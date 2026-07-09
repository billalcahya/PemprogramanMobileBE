# Changelog - SmartCafe POS Backend

Semua perubahan penting pada project backend SmartCafe POS akan dicatat di file ini.

## [Unreleased]

### Added
- Dokumen inisialisasi `docs/audit-report.md`, `docs/implementation-status.md`, `docs/api-spec.md`, dan `docs/database-schema.md`.
- Middleware `cors` untuk izin akses lintas asal dan `morgan` untuk logging request HTTP.
- Global Error Handler terpusat di `server.js` untuk menangkap error tidak terduga dan mengembalikan respons JSON.

### Changed
- Mengubah main entrypoint dari `index.js` ke `server.js` di `package.json`.

### Removed
- File entrypoint duplikat `index.js`.

## [0.2.0] - 2026-07-04

### Added
- Endpoint Kategori Baru: `GET /categories/:id`, `PUT /categories/:id`, dan `DELETE /categories/:id` (soft delete).
- Endpoint Produk Baru: `GET /products/:id`, `PUT /products/:id`, dan `DELETE /products/:id` (soft delete).

## [0.3.0] - 2026-07-04

### Added
- Endpoint Profile: `GET /profile` untuk mengambil detail profile pengguna.
- Endpoint Update Profile: `PUT /profile` untuk memperbarui data profile (termasuk update password terenkripsi bcrypt).

## [0.4.0] - 2026-07-04

### Added
- Mekanisme database rollback manual di service layer untuk checkout transaksi (`POST /transactions`) dan pembatalan transaksi (`PATCH /transactions/:id/void`).
- Dual lookup fallback untuk pencarian inventori berdasarkan `id` utama atau `product_id` pada update stok manual.

### Changed
- Mengubah HTTP Method void transaksi dari `PUT /transactions/:id/void` menjadi `PATCH /transactions/:id/void`.
- Mengubah route update stok manual dari `/inventory/:product_id` menjadi `/inventory/:id`.

## [0.5.0] - 2026-07-04

### Added
- Endpoint Report Harian: `GET /reports/daily` (laporan jumlah transaksi, omzet, modal, laba per hari).
- Endpoint Report Bulanan: `GET /reports/monthly` (laporan jumlah transaksi, omzet, modal, laba per bulan).
- Agregasi Dashboard Baru: total produk, total kategori, pendapatan/transaksi hari ini, pendapatan bulan ini, produk terlaris.

### Changed
- Mengubah route Dashboard dari `GET /dashboard/summary` menjadi `GET /dashboard`.

## [0.6.0] - 2026-07-04

### Added
- Berkas `database/schema.sql` untuk inisialisasi database terstruktur.
- Berkas `database/seed.sql` berisi data sampel awal pengguna, kategori, produk, dan inventori.
