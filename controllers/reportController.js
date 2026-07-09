const reportService = require('../services/reportService');

const getDailyReport = async (req, res) => {
  try {
    const data = await reportService.getDailyReport();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil laporan harian",
      data
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const data = await reportService.getMonthlyReport();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil laporan bulanan",
      data
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getDailyReport,
  getMonthlyReport
};
