const supabase = require('../config/supabase');

// Fungsi baru untuk mendukung filter kategori dan search query (Supabase)
const getAllProductsFiltered = async (category, search) => {
  let query = supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true);

  // Jika ada filter kategori (berdasarkan nama atau ID)
  if (category) {
    // Jika parameter berupa ID Angka
    if (!isNaN(category)) {
      query = query.eq('category_id', parseInt(category));
    } else {
      // Jika parameter berupa Nama Kategori string
      query = query.eq('categories.name', category);
    }
  }

  // Jika ada pencarian teks nama produk
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true);

  if (error) throw error;
  return data;
};

const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

const createProduct = async (productData) => {
  const { category_id, name, sell_price, cost_price, image_url, initial_stock, min_stock, unit } = productData;

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([{ category_id, name, sell_price, cost_price, image_url }])
    .select()
    .single();

  if (productError) throw productError;

  const { error: inventoryError } = await supabase
    .from('inventory')
    .insert([
      {
        product_id: product.id,
        current_stock: initial_stock || 0,
        min_stock: min_stock || 5,
        unit: unit || 'pcs'
      }
    ]);

  if (inventoryError) throw inventoryError;

  return product;
};

const updateProduct = async (id, updateData) => {
  const { category_id, name, sell_price, cost_price, image_url } = updateData;
  const { data, error } = await supabase
    .from('products')
    .update({
      category_id,
      name,
      sell_price,
      cost_price,
      image_url,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteProduct = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      is_active: false,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Pastikan fungsi baru ini sudah di-export!
module.exports = {
  getAllProductsFiltered,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};