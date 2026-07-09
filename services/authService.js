const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');

const login = async (email, password) => {
  // 1. Cari user di Supabase berdasarkan email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Email atau password salah');
  }

  // 2. Cek apakah password cocok dengan password_hash di DB (NFR-05)
  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new Error('Email atau password salah');
  }

  // 3. Buat payload token (tanpa memasukkan password_hash demi keamanan)
  const payload = {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role
  };

  // 4. Generate JWT Token (Masa aktif 24 jam sesuai NFR-03)
  const token = generateToken(payload);

  return {
    token,
    expiresIn: 86400, // 24 jam dalam hitungan detik
    user: payload
  };
};

module.exports = {
  login
};