const supabase = require('../config/supabase');

const getSummaryStats = async () => {
  // 1. Ambil jumlah total produk aktif
  const { count: totalProducts, error: prodErr } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (prodErr) throw prodErr;

  // 2. Ambil jumlah total kategori aktif
  const { count: totalCategories, error: catErr } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (catErr) throw catErr;

  // 3. Ambil semua transaksi sukses untuk kalkulasi harian dan bulanan
  const { data: transactions, error: trxError } = await supabase
    .from('transactions')
    .select('grand_total, status, created_at')
    .eq('status', 'completed');

  if (trxError) throw trxError;

  const todayStr = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  const thisMonthStr = todayStr.substring(0, 7); // Format YYYY-MM

  let totalTransactionsToday = 0;
  let revenueToday = 0;
  let revenueThisMonth = 0;

  for (const trx of transactions) {
    const trxDateStr = new Date(trx.created_at).toISOString().split('T')[0];
    const trxMonthStr = trxDateStr.substring(0, 7);

    if (trxDateStr === todayStr) {
      totalTransactionsToday += 1;
      revenueToday += Number(trx.grand_total);
    }
    if (trxMonthStr === thisMonthStr) {
      revenueThisMonth += Number(trx.grand_total);
    }
  }

  // 4. Ambil data produk terlaris (top 5) berdasarkan detail transaksi sukses
  const { data: details, error: detErr } = await supabase
    .from('transaction_details')
    .select('product_id, product_name, quantity, transactions!inner(status)')
    .eq('transactions.status', 'completed');

  if (detErr) throw detErr;

  const productSales = {};
  for (const det of details) {
    const pId = det.product_id;
    if (!productSales[pId]) {
      productSales[pId] = {
        product_name: det.product_name,
        total_quantity_sold: 0
      };
    }
    productSales[pId].total_quantity_sold += det.quantity;
  }

  const bestSellingProducts = Object.values(productSales)
    .sort((a, b) => b.total_quantity_sold - a.total_quantity_sold)
    .slice(0, 5);

  // 5. Ambil data inventori untuk alert stok menipis
  const { data: allInventory, error: invError } = await supabase
    .from('inventory')
    .select('*, products(name)');

  if (invError) throw invError;

  const alertItems = allInventory?.filter(item => item.current_stock <= item.min_stock) || [];

  return {
    total_products: totalProducts || 0,
    total_categories: totalCategories || 0,
    total_transactions_today: totalTransactionsToday,
    total_revenue_today: revenueToday,
    revenue_this_month: revenueThisMonth,
    last_7_days_sales: [], 
    top_products: bestSellingProducts.map(p => ({
      product_name: p.product_name,
      quantity: p.total_quantity_sold
    })),
    low_stock_alerts: alertItems.map(item => ({
      product_name: item.products?.name,
      current_stock: item.current_stock
    }))
  };
};

module.exports = {
  getSummaryStats
};