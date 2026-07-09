# API Specification - SmartCafe POS

## Base URL
`/api/v1`

---

## 1. Authentication & Profile

### Login
* **URL**: `/auth/login`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "email": "admin@smartcafe.com",
  "password": "password123"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil",
  "data": {
    "token": "eyJhbGciOi...",
    "expiresIn": 86400,
    "user": {
      "id": "user-uuid",
      "name": "Admin Cafe",
      "email": "admin@smartcafe.com",
      "role": "admin"
    }
  }
}
```

### Get Profile
* **URL**: `/profile`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil profil pengguna",
  "data": {
    "id": "user-uuid",
    "email": "admin@smartcafe.com",
    "full_name": "Admin Cafe",
    "phone": "081234567890",
    "avatar_url": "https://example.com/avatar.jpg",
    "role": "admin",
    "created_at": "2026-07-04T10:00:00Z",
    "updated_at": "2026-07-04T12:00:00Z"
  }
}
```

### Update Profile
* **URL**: `/profile`
* **Method**: `PUT`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "full_name": "Admin Cafe Baru",
  "phone": "089876543210",
  "avatar_url": "https://example.com/avatar-baru.jpg",
  "password": "passwordBaru123"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Profil berhasil diperbarui",
  "data": {
    "id": "user-uuid",
    "email": "admin@smartcafe.com",
    "full_name": "Admin Cafe Baru",
    "phone": "089876543210",
    "avatar_url": "https://example.com/avatar-baru.jpg",
    "role": "admin",
    "created_at": "2026-07-04T10:00:00Z",
    "updated_at": "2026-07-04T12:30:00Z"
  }
}
```

---

## 2. Categories

### Get All Categories
* **URL**: `/categories`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil daftar kategori",
  "data": [
    {
      "id": "category-uuid",
      "name": "Makanan",
      "color_hex": "#FF5733",
      "icon_name": "food",
      "is_active": true,
      "created_at": "2026-07-04T12:00:00Z"
    }
  ]
}
```
   
### Add Category
* **URL**: `/categories`
* **Method**: `POST`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "name": "Minuman",
  "color_hex": "#3357FF",
  "icon_name": "drink"
}
```
* **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Kategori berhasil ditambahkan",
  "data": {
    "id": "category-uuid",
    "name": "Minuman",
    "color_hex": "#3357FF",
    "icon_name": "drink",
    "is_active": true,
    "created_at": "2026-07-04T12:05:00Z"
  }
}

### Get Category By ID
* **URL**: `/categories/:id`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil detail kategori",
  "data": {
    "id": "category-uuid",
    "name": "Minuman",
    "color_hex": "#3357FF",
    "icon_name": "drink",
    "is_active": true,
    "created_at": "2026-07-04T12:05:00Z"
  }
}
```

### Update Category
* **URL**: `/categories/:id`
* **Method**: `PUT`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "name": "Minuman Dingin",
  "color_hex": "#3399FF",
  "icon_name": "cold_drink"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Kategori berhasil diperbarui",
  "data": {
    "id": "category-uuid",
    "name": "Minuman Dingin",
    "color_hex": "#3399FF",
    "icon_name": "cold_drink",
    "is_active": true,
    "created_at": "2026-07-04T12:05:00Z"
  }
}
```

### Delete Category (Soft Delete)
* **URL**: `/categories/:id`
* **Method**: `DELETE`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Kategori berhasil dihapus (soft delete)",
  "data": {
    "id": "category-uuid",
    "name": "Minuman Dingin",
    "color_hex": "#3399FF",
    "icon_name": "cold_drink",
    "is_active": false,
    "created_at": "2026-07-04T12:05:00Z"
  }
}
```
```

---

## 3. Products

### Get All Products
* **URL**: `/products`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil daftar produk",
  "data": [
    {
      "id": "product-uuid",
      "category_id": "category-uuid",
      "name": "Kopi Latte",
      "sell_price": 25000,
      "cost_price": 10000,
      "image_url": "https://example.com/latte.jpg",
      "is_active": true,
      "created_at": "2026-07-04T12:10:00Z",
      "updated_at": "2026-07-04T12:10:00Z",
      "categories": {
        "name": "Minuman"
      }
    }
  ]
}
```

### Add Product
* **URL**: `/products`
* **Method**: `POST`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "category_id": "category-uuid",
  "name": "Kopi Latte",
  "sell_price": 25000,
  "cost_price": 10000,
  "image_url": "https://example.com/latte.jpg",
  "initial_stock": 50,
  "min_stock": 5,
  "unit": "pcs"
}
```
* **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Produk dan stok awal berhasil ditambahkan",
  "data": {
    "id": "product-uuid",
    "category_id": "category-uuid",
    "name": "Kopi Latte",
    "sell_price": 25000,
    "cost_price": 10000,
    "image_url": "https://example.com/latte.jpg",
    "is_active": true,
    "created_at": "2026-07-04T12:10:00Z",
    "updated_at": "2026-07-04T12:10:00Z"
  }
}

### Get Product By ID
* **URL**: `/products/:id`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil detail produk",
  "data": {
    "id": "product-uuid",
    "category_id": "category-uuid",
    "name": "Kopi Latte",
    "sell_price": 25000,
    "cost_price": 10000,
    "image_url": "https://example.com/latte.jpg",
    "is_active": true,
    "created_at": "2026-07-04T12:10:00Z",
    "updated_at": "2026-07-04T12:10:00Z",
    "categories": {
      "name": "Minuman"
    }
  }
}
```

### Update Product
* **URL**: `/products/:id`
* **Method**: `PUT`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "category_id": "category-uuid",
  "name": "Kopi Latte Caramel",
  "sell_price": 28000,
  "cost_price": 12000,
  "image_url": "https://example.com/latte-caramel.jpg"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Produk berhasil diperbarui",
  "data": {
    "id": "product-uuid",
    "category_id": "category-uuid",
    "name": "Kopi Latte Caramel",
    "sell_price": 28000,
    "cost_price": 12000,
    "image_url": "https://example.com/latte-caramel.jpg",
    "is_active": true,
    "created_at": "2026-07-04T12:10:00Z",
    "updated_at": "2026-07-04T12:15:00Z"
  }
}
```

### Delete Product (Soft Delete)
* **URL**: `/products/:id`
* **Method**: `DELETE`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Produk berhasil dihapus (soft delete)",
  "data": {
    "id": "product-uuid",
    "category_id": "category-uuid",
    "name": "Kopi Latte Caramel",
    "sell_price": 28000,
    "cost_price": 12000,
    "image_url": "https://example.com/latte-caramel.jpg",
    "is_active": false,
    "created_at": "2026-07-04T12:10:00Z",
    "updated_at": "2026-07-04T12:18:00Z"
  }
}
```
```

---

## 4. Inventory

### Get All Inventory
* **URL**: `/inventory`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil data inventori",
  "data": [
    {
      "id": "inventory-uuid",
      "product_id": "product-uuid",
      "current_stock": 50,
      "min_stock": 5,
      "unit": "pcs",
      "updated_at": "2026-07-04T12:10:00Z",
      "products": {
        "name": "Kopi Latte"
      }
    }
  ]
}
```

### Update Stock Manual
* **URL**: `/inventory/:id`
* **Method**: `PUT`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "current_stock": 60
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Stok berhasil diperbarui secara manual",
  "data": {
    "id": "inventory-uuid",
    "product_id": "product-uuid",
    "current_stock": 60,
    "min_stock": 5,
    "unit": "pcs",
    "updated_at": "2026-07-04T12:15:00Z"
  }
}
```

---

## 5. Transactions & History

### Checkout Transaction
* **URL**: `/transactions`
* **Method**: `POST`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2
    }
  ],
  "discountAmount": 5000,
  "paymentMethod": "CASH",
  "paymentAmount": 50000
}
```
* **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Transaksi berhasil",
  "data": {
    "transactionId": "transaction-uuid",
    "transactionCode": "TRX-20260704-5821",
    "grandTotal": 45000,
    "changeAmount": 5000
  }
}
```

### Get Transaction History
* **URL**: `/transactions`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil riwayat transaksi",
  "data": [
    {
      "id": "transaction-uuid",
      "transaction_code": "TRX-20260704-5821",
      "user_id": "user-uuid",
      "total_amount": 50000,
      "discount_amount": 5000,
      "grand_total": 45000,
      "payment_method": "CASH",
      "payment_amount": 50000,
      "change_amount": 5000,
      "status": "completed",
      "void_reason": null,
      "created_at": "2026-07-04T12:20:00Z",
      "users": {
        "full_name": "Admin Cafe"
      }
    }
  ]
}
```

### Get Transaction Details
* **URL**: `/transactions/:id`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil rincian detail transaksi",
  "data": [
    {
      "id": "detail-uuid",
      "transaction_id": "transaction-uuid",
      "product_id": "product-uuid",
      "product_name": "Kopi Latte",
      "sell_price": 25000,
      "cost_price": 10000,
      "quantity": 2,
      "subtotal": 50000
    }
  ]
}
```

### Cancel/Void Transaction
* **URL**: `/transactions/:id/void`
* **Method**: `PATCH`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body**:
```json
{
  "void_reason": "Salah input pesanan"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Transaksi berhasil dibatalkan (voided)",
  "data": {
    "id": "transaction-uuid",
    "transaction_code": "TRX-20260704-5821",
    "user_id": "user-uuid",
    "status": "voided",
    "void_reason": "Salah input pesanan"
  }
}
```

---

## 6. Dashboard

### Get Dashboard Summary
* **URL**: `/dashboard`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil data statistik dashboard",
  "data": {
    "total_products": 12,
    "total_categories": 4,
    "total_transactions_today": 3,
    "revenue_today": 125000,
    "revenue_this_month": 3450000,
    "best_selling_products": [
      {
        "product_name": "Kopi Latte",
        "total_quantity_sold": 45
      }
    ],
    "low_stock_alerts_count": 1,
    "low_stock_products": [
      {
        "product_name": "Kopi Latte Caramel",
        "current_stock": 2,
        "min_stock": 5,
        "unit": "pcs"
      }
    ]
  }
}
```

---

## 7. Reports

### Get Daily Report
* **URL**: `/reports/daily`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil laporan harian",
  "data": [
    {
      "date": "2026-07-04",
      "total_transactions": 3,
      "total_revenue": 125000,
      "total_cost": 50000,
      "gross_profit": 75000
    }
  ]
}
```

### Get Monthly Report
* **URL**: `/reports/monthly`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil laporan bulanan",
  "data": [
    {
      "month": "2026-07",
      "total_transactions": 45,
      "total_revenue": 3450000,
      "total_cost": 1500000,
      "gross_profit": 1950000
    }
  ]
}
```
