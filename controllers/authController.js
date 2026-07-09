const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input sederhana
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi"
      });
    }

    const result = await authService.login(email, password);

    // Format output sukses sesuai halaman 17 dokumen SDD
    return res.status(200).json({
      status: "success",
      message: "Berhasil",
      data: result
    });
  } catch (error) {

    console.error("DEBUG LOGIN ERROR:", error);
    
    return res.status(401).json({
      status: "error",
      message: error.message
    });
  }
};

module.exports = {
  login
};