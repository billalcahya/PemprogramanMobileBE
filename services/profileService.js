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

const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone, avatar_url, role, created_at, updated_at')
    .order('created_at', { ascending: false });  

  if (error) throw error;
  return data;
};

const createProfile = async (profileData) => {
  const { email, password, full_name, phone, avatar_url, role } = profileData;
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password_hash: passwordHash,
        full_name,
        phone,
        avatar_url,
        role: role || 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    .select('id, email, full_name, phone, avatar_url, role, created_at, updated_at')
    .single();

  if (error) throw error;
  return data;
};

const updateProfile = async (userId, updateData) => {
  const { full_name, email, phone, avatar_url, password, role } = updateData;
  const updates = {
    full_name,
    email,
    phone,
    avatar_url,
    role,
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

const deleteProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)
    .select('id')
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  getProfile,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile
};