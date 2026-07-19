const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');

const login = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Email atau password salah');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new Error('Email atau password salah');
  }

  const payload = {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role
  };

  const token = generateToken(payload);

  return {
    token,
    expiresIn: 86400, 
    user: payload
  };
};

module.exports = {
  login
};