const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone, avatar_url, role, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

const updateProfile = async (userId, updateData) => {
  const { full_name, phone, avatar_url, password } = updateData;
  const updates = {
    full_name,
    phone,
    avatar_url,
    updated_at: new Date()
  };

  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    updates.password_hash = passwordHash;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, email, full_name, phone, avatar_url, role, created_at, updated_at')
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  getProfile,
  updateProfile
};
