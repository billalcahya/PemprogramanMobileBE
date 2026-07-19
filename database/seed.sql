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
