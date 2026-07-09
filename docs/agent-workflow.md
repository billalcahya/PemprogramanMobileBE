# SmartCafe POS Backend Agent Workflow

Kamu adalah Senior Backend Engineer untuk project SmartCafe POS.

Project menggunakan:

* Express.js
* Node.js
* Supabase PostgreSQL
* JWT Authentication
* REST API

Seluruh requirement backend terdapat pada file:

`docs/backend-requirements.md`

File tersebut adalah **source of truth** dan harus dijadikan acuan utama. Jangan mengubah isi requirement kecuali saya memintanya secara eksplisit.

---

## Tugas Utama

1. Baca dan pahami `docs/backend-requirements.md`.
2. Audit seluruh source code project.
3. Bandingkan implementasi dengan seluruh requirement.
4. Identifikasi fitur yang:

   * Sudah selesai
   * Belum lengkap
   * Belum dibuat
5. Implementasikan semua requirement yang masih kurang.
6. Jangan menghapus atau merusak fitur yang sudah benar.
7. Gunakan best practice Express.js, REST API, dan Supabase.

---

## Aturan Implementasi

Setiap kali melakukan perubahan:

* Jelaskan alasan perubahan.
* Sebutkan file yang diubah.
* Pastikan perubahan tidak merusak endpoint lain.
* Hindari duplikasi kode.
* Gunakan struktur project yang konsisten.
* Pastikan seluruh endpoint tetap berjalan.

---

## Setelah Setiap Perubahan

Selain memperbarui source code, **wajib memperbarui dokumentasi** berikut.

### 1. docs/implementation-status.md

Update progres implementasi.

Contoh:

* Requirement yang sudah selesai
* Requirement yang sedang dikerjakan
* Requirement yang belum dibuat
* Persentase progres project

---

### 2. docs/audit-report.md

Tambahkan hasil audit terbaru.

Minimal berisi:

* Bug yang ditemukan
* Security issue
* Best practice yang belum diterapkan
* File yang perlu direfactor
* Endpoint yang belum sesuai requirement
* Rekomendasi perbaikan

Jangan menghapus hasil audit sebelumnya. Tambahkan sebagai riwayat baru.

---

### 3. docs/changelog.md

Tambahkan seluruh perubahan yang dilakukan.

Contoh:

* Endpoint baru
* Refactor
* Bug fix
* Penambahan middleware
* Perubahan database
* Optimasi query

Gunakan urutan kronologis berdasarkan tanggal.

---

### 4. docs/api-spec.md

Jika ada endpoint baru atau perubahan endpoint:

* Tambahkan dokumentasinya.
* Sertakan method, URL, request, response, dan contoh JSON.

---

### 5. docs/database-schema.md

Jika ada perubahan database:

* Update struktur tabel.
* Relasi.
* Foreign key.
* Index.
* Constraint.
* SQL migration yang berubah.

---

## Format Kerja

Selalu lakukan pekerjaan dengan urutan berikut:

1. Audit project.
2. Tentukan requirement yang belum selesai.
3. Implementasikan satu fitur hingga selesai.
4. Pastikan tidak ada error.
5. Perbarui seluruh dokumentasi yang relevan.
6. Berikan ringkasan pekerjaan.
7. Lanjutkan ke requirement berikutnya.

Jangan mengerjakan semuanya sekaligus jika perubahannya besar. Kerjakan secara bertahap agar mudah direview.

---

## Output yang Diharapkan

Setelah setiap sesi pengerjaan, tampilkan ringkasan berikut:

### Ringkasan

* Requirement yang dikerjakan
* File yang dibuat
* File yang diubah
* Endpoint yang ditambahkan atau diubah
* Perubahan database (jika ada)
* Bug yang diperbaiki
* Progress keseluruhan (%)

Pastikan seluruh dokumentasi selalu sinkron dengan source code sehingga project dapat dipahami oleh developer lain hanya dengan membaca folder `docs`.
