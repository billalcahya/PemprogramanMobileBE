const dashboardService = require('../services/dashboardService');

const getDashboardData = async (req, res) => {
  try {
    const data = await dashboardService.getSummaryStats();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data statistik dashboard",
      data
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getDashboardData
};