-- SmartCafe POS Database Seed Data

-- 1. Insert Default Users (Password: password123)
INSERT INTO users (id, email, password_hash, full_name, phone, role)
VALUES (
    'a4d913be-9214-41d3-a55b-80dfa8eb36bb',
    'admin@smartcafe.com',
    '$2b$10$tM294q6q/GZpP5xXqYl3UeRveaM50z7vW5X0L/E4a7g.yQWvT8FOW',
    'Admin Cafe',
    '081234567890',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (id, name, color_hex, icon_name)
VALUES 
    ('c4c8dbe6-1c4b-48ad-8d96-cfbf8483f982', 'Makanan Utama', '#FF5733', 'local_dining'),
    ('d5c9dbe6-2c4b-48ad-8d96-cfbf8483f983', 'Minuman Kopi', '#3357FF', 'local_cafe'),
    ('e6c0dbe6-3c4b-48ad-8d96-cfbf8483f984', 'Camilan', '#FFC300', 'bakery_dining')
ON CONFLICT DO NOTHING;

-- 3. Insert Products
INSERT INTO products (id, category_id, name, sell_price, cost_price)
VALUES
    ('p1c00000-0000-0000-0000-000000000001', 'd5c9dbe6-2c4b-48ad-8d96-cfbf8483f983', 'Kopi Espresso', 15000.00, 5000.00),
    ('p1c00000-0000-0000-0000-000000000002', 'd5c9dbe6-2c4b-48ad-8d96-cfbf8483f983', 'Kopi Latte', 25000.00, 10000.00),
    ('p1c00000-0000-0000-0000-000000000003', 'c4c8dbe6-1c4b-48ad-8d96-cfbf8483f982', 'Nasi Goreng Special', 30000.00, 12000.00),
    ('p1c00000-0000-0000-0000-000000000004', 'e6c0dbe6-3c4b-48ad-8d96-cfbf8483f984', 'Kentang Goreng', 18000.00, 8000.00)
ON CONFLICT DO NOTHING;

-- 4. Insert Inventory records for the products
INSERT INTO inventory (product_id, current_stock, min_stock, unit)
VALUES
    ('p1c00000-0000-0000-0000-000000000001', 100, 10, 'pcs'),
    ('p1c00000-0000-0000-0000-000000000002', 50, 5, 'pcs'),
    ('p1c00000-0000-0000-0000-000000000003', 30, 5, 'pcs'),
    ('p1c00000-0000-0000-0000-000000000004', 40, 5, 'pcs')
ON CONFLICT (product_id) DO NOTHING;
