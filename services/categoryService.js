const supabase = require('../config/supabase');

const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data;
};

const getCategoryById = async (id) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

const createCategory = async (name, color_hex, icon_name) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, color_hex, icon_name }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateCategory = async (id, updateData) => {
  const { name, color_hex, icon_name } = updateData;
  const { data, error } = await supabase
    .from('categories')
    .update({ name, color_hex, icon_name })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteCategory = async (id) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};