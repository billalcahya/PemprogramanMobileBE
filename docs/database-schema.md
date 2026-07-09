# Database Schema - SmartCafe POS

## PostgreSQL Database Schema (Supabase)

### 1. Table: `users`
Menyimpan informasi pengguna (karyawan/admin).

* **id**: `UUID` (Primary Key, Default: `uuid_generate_v4()`)
* **email**: `VARCHAR(255)` (Unique, Not Null)
* **password_hash**: `VARCHAR(255)` (Not Null)
* **full_name**: `VARCHAR(255)` (Not Null)
* **phone**: `VARCHAR(20)` (Nullable)
* **avatar_url**: `TEXT` (Nullable)
* **role**: `VARCHAR(50)` (Default: `'admin'`, Not Null)
* **created_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)
* **updated_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)

---

### 2. Table: `categories`
Menyimpan kategori menu/produk.

* **id**: `UUID` (Primary Key, Default: `uuid_generate_v4()`)
* **name**: `VARCHAR(255)` (Not Null)
* **color_hex**: `VARCHAR(7)` (Default: `'#808080'`)
* **icon_name**: `VARCHAR(50)` (Default: `'folder'`)
* **is_active**: `BOOLEAN` (Default: `true`, Not Null)
* **created_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)

---

### 3. Table: `products`
Menyimpan data produk/menu yang dijual.

* **id**: `UUID` (Primary Key, Default: `uuid_generate_v4()`)
* **category_id**: `UUID` (Foreign Key -> `categories.id` ON DELETE SET NULL)
* **name**: `VARCHAR(255)` (Not Null)
* **sell_price**: `NUMERIC(12,2)` (Not Null)
* **cost_price**: `NUMERIC(12,2)` (Default: `0`)
* **image_url**: `TEXT` (Nullable)
* **is_active**: `BOOLEAN` (Default: `true`, Not Null)
* **created_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)
* **updated_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)

---

### 4. Table: `inventory`
Menyimpan stok barang/produk.

* **id**: `UUID` (Primary Key, Default: `uuid_generate_v4()`)
* **product_id**: `UUID` (Foreign Key -> `products.id` ON DELETE CASCADE, Unique)
* **current_stock**: `INTEGER` (Default: `0`, Constraint: `current_stock >= 0`)
* **min_stock**: `INTEGER` (Default: `5`)
* **unit**: `VARCHAR(20)` (Default: `'pcs'`)
* **updated_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)

---

### 5. Table: `transactions`
Menyimpan data transaksi penjualan utama.

* **id**: `UUID` (Primary Key, Default: `uuid_generate_v4()`)
* **transaction_code**: `VARCHAR(50)` (Unique, Not Null)
* **user_id**: `UUID` (Foreign Key -> `users.id` ON DELETE SET NULL)
* **total_amount**: `NUMERIC(12,2)` (Not Null)
* **discount_amount**: `NUMERIC(12,2)` (Default: `0`)
* **grand_total**: `NUMERIC(12,2)` (Not Null)
* **payment_method**: `VARCHAR(50)` (Not Null)
* **payment_amount**: `NUMERIC(12,2)` (Not Null)
* **change_amount**: `NUMERIC(12,2)` (Not Null)
* **status**: `VARCHAR(20)` (Default: `'completed'`, Not Null) - `completed`, `voided`
* **void_reason**: `TEXT` (Nullable)
* **created_at**: `TIMESTAMP WITH TIME ZONE` (Default: `now()`)

---

### 6. Table: `transaction_details`
Menyimpan detail produk yang dibeli dalam suatu transaksi (snapshot data harga saat transaksi dilakukan).

* **id**: `UUID` (Primary Key, Default: `uuid_generate_v4()`)
* **transaction_id**: `UUID` (Foreign Key -> `transactions.id` ON DELETE CASCADE)
* **product_id**: `UUID` (Foreign Key -> `products.id` ON DELETE SET NULL)
* **product_name**: `VARCHAR(255)` (Not Null)
* **sell_price**: `NUMERIC(12,2)` (Not Null)
* **cost_price**: `NUMERIC(12,2)` (Default: `0`)
* **quantity**: `INTEGER` (Not Null)
* **subtotal**: `NUMERIC(12,2)` (Not Null)
