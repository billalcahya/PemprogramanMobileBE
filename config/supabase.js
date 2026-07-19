const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Kredensial Supabase (SUPABASE_URL / SUPABASE_SERVICE_KEY) belum dikonfigurasi di .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;