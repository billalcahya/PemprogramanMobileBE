const supabase = require('../config/supabase');

const getDailyReport = async () => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('id, grand_total, created_at, status, transaction_details(cost_price, quantity)')
    .eq('status', 'completed')
    .order('created_at', { ascending: true });

  if (error) throw error;

  const dailyData = {};
  for (const trx of transactions) {
    const dateStr = new Date(trx.created_at).toISOString().split('T')[0];
    const totalCost = trx.transaction_details?.reduce((sum, det) => sum + (Number(det.cost_price) * det.quantity), 0) || 0;

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = {
        date: dateStr,
        total_transactions: 0,
        total_revenue: 0,
        total_cost: 0,
        gross_profit: 0
      };
    }

    dailyData[dateStr].total_transactions += 1;
    dailyData[dateStr].total_revenue += Number(trx.grand_total);
    dailyData[dateStr].total_cost += totalCost;
    dailyData[dateStr].gross_profit = dailyData[dateStr].total_revenue - dailyData[dateStr].total_cost;
  }

  return Object.values(dailyData).sort((a, b) => b.date.localeCompare(a.date));
};

const getMonthlyReport = async () => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('id, grand_total, created_at, status, transaction_details(cost_price, quantity)')
    .eq('status', 'completed')
    .order('created_at', { ascending: true });

  if (error) throw error;

  const monthlyData = {};
  for (const trx of transactions) {
    const dateObj = new Date(trx.created_at);
    const monthStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    const totalCost = trx.transaction_details?.reduce((sum, det) => sum + (Number(det.cost_price) * det.quantity), 0) || 0;

    if (!monthlyData[monthStr]) {
      monthlyData[monthStr] = {
        month: monthStr,
        total_transactions: 0,
        total_revenue: 0,
        total_cost: 0,
        gross_profit: 0
      };
    }

    monthlyData[monthStr].total_transactions += 1;
    monthlyData[monthStr].total_revenue += Number(trx.grand_total);
    monthlyData[monthStr].total_cost += totalCost;
    monthlyData[monthStr].gross_profit = monthlyData[monthStr].total_revenue - monthlyData[monthStr].total_cost;
  }

  return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
};

module.exports = {
  getDailyReport,
  getMonthlyReport
};
