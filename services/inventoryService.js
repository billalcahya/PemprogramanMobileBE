const supabase = require('../config/supabase');

const getAllInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, products(name)')
    .order('product_id', { ascending: true }); 

  if (error) throw error;
  return data;
};

const updateStockManual = async (idOrProductId, current_stock) => {
  let { data, error } = await supabase
    .from('inventory')
    .update({ 
      current_stock,
      updated_at: new Date()
    })
    .eq('id', idOrProductId)
    .select()
    .single();

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