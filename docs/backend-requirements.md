# SmartCafe POS Backend Agent Prompt

Kamu adalah Senior Backend Engineer yang bertugas sebagai reviewer sekaligus developer.

Project ini menggunakan teknologi:

* Express.js
* Node.js
* Supabase PostgreSQL
* JWT Authentication
* REST API
* dotenv
* bcrypt
* Express Router

## Tugas

Lakukan audit seluruh project backend Express.js.

Jangan hanya membaca source code, tetapi analisis implementasinya secara menyeluruh.

Bandingkan implementasi saat ini dengan checklist requirement berikut.

---

## Checklist

### 1. Project Setup

Pastikan project memiliki struktur seperti berikut:

```
project/
│
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── validators/
├── utils/
├── database/
├── scripts/
├── app.js
├── server.js
└── .env
```

Periksa:

* Struktur folder
* dotenv
* Express configuration
* Global Error Handler
* CORS
* JSON Middleware
* Logger
* Environment Variables

---

### 2. Database

Periksa apakah Supabase sudah memiliki:

* Semua tabel sesuai SDD
* Primary Key
* Foreign Key
* Constraint
* Index
* Migration
* Seed

---

### 3. Authentication

Periksa:

POST /login

Harus memiliki:

* bcrypt compare
* JWT Token
* JWT Middleware
* Protected Routes
* Unauthorized Response

---

### 4. Categories API

Periksa:

GET /categories

GET /categories/:id

POST /categories

PUT /categories/:id

DELETE /categories/:id

---

### 5. Products API

Periksa:

GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id

---

### 6. Inventory

Periksa:

GET /inventory

PUT /inventory/:id

Pastikan stok tidak bisa menjadi negatif.

---

### 7. Transactions

Periksa endpoint:

POST /transactions

Pastikan proses berikut berjalan dalam satu transaksi database (atomic):

1. Insert transaksi
2. Insert detail transaksi
3. Update stok
4. Rollback jika gagal

---

### 8. Transaction History

Periksa:

GET /transactions

GET /transactions/:id

PATCH /transactions/:id/void

---

### 9. Reports

Periksa:

GET /reports/daily

GET /reports/monthly

---

### 10. Dashboard

Periksa:

GET /dashboard

Harus mengembalikan data agregasi seperti:

* Total produk
* Total kategori
* Total transaksi hari ini
* Pendapatan hari ini
* Pendapatan bulan ini
* Produk terlaris
* Stok menipis (opsional)

---

### 11. Profile

Periksa:

GET /profile

PUT /profile

---

## Code Quality Review

Audit juga:

* REST API Design
* Clean Architecture
* Konsistensi struktur folder
* Modularisasi
* Error Handling
* Validation
* HTTP Status Code
* Response Format
* Security
* JWT
* bcrypt
* SQL Injection
* Async/Await
* Environment Variables
* Duplicate Code
* Dead Code
* Naming Convention
* Reusable Function
* Best Practice Express.js

---

## Jika menemukan kekurangan

Jangan hanya memberi tahu.

Langsung:

1. Sebutkan file yang harus diubah.
2. Jelaskan alasannya.
3. Implementasikan perbaikannya.
4. Jangan mengubah fitur yang sudah benar.
5. Pastikan perubahan tidak merusak endpoint lain.

---

## Output

Buat laporan dalam format:

| Requirement    | Status | Keterangan                           | File                   |
| -------------- | ------ | ------------------------------------ | ---------------------- |
| Authentication | ✅      | Lengkap                              | authController.js      |
| Dashboard      | ⚠️     | Endpoint ada, agregasi belum lengkap | dashboardController.js |
| Reports        | ❌      | Belum dibuat                         | -                      |

Kemudian tampilkan:

* Ringkasan progres (%)
* Daftar bug yang ditemukan
* Daftar file yang diperbaiki
* Daftar endpoint yang sudah sesuai
* Daftar endpoint yang masih perlu dibuat
* Prioritas pengerjaan berikutnya

Jika semua requirement sudah terpenuhi, lakukan review kualitas kode dan berikan rekomendasi refactor agar project mengikuti best practice Express.js dan siap digunakan pada lingkungan production.
