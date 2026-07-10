const supabase = require('../config/supabase');

const getAllInventory = async () => {
  // Mengambil data inventori dan menambahkan pengurutan berdasarkan ID produk secara ascending (A-Z / 1-9)
  const { data, error } = await supabase
    .from('inventory')
    .select('*, products(name)')
    .order('product_id', { ascending: true }); // <--- TAMBAHKAN BARIS INI

  if (error) throw error;
  return data;
};

const updateStockManual = async (idOrProductId, current_stock) => {
  // Coba update berdasarkan primary key 'id' terlebih dahulu
  let { data, error } = await supabase
    .from('inventory')
    .update({ 
      current_stock,
      updated_at: new Date()
    })
    .eq('id', idOrProductId)
    .select()
    .single();

  // Jika error (misal id bukan UUID yang valid atau tidak cocok) atau data kosong, coba berdasarkan 'product_id'
  if (error || !data) {
    const { data: dataByProd, error: errorByProd } = await supabase
      .from('inventory')
      .update({ 
        current_stock,
        updated_at: new Date()
      })
      .eq('product_id', idOrProductId)
      .select()
      .single();

    if (errorByProd) throw new Error('Data inventori tidak ditemukan berdasarkan ID maupun Product ID');
    return dataByProd;
  }

  return data;
};

module.exports = {
  getAllInventory,
  updateStockManual
};