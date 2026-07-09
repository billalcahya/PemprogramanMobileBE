const { verifyToken } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak. Token tidak ditemukan."
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token menggunakan helper jwt.js kita
    const decoded = verifyToken(token);
    
    // Suntikkan data user hasil dekripsi ke object request (req.user)
    req.user = decoded; 
    
    next(); // Lanjut ke controller berikutnya
  } catch (error) {
    // Risiko R-07 di dokumen: Kembalikan 401 jika token kadaluwarsa
    return res.status(401).json({
      status: "error",
      message: "Sesi Anda telah berakhir. Silakan login kembali."
    });
  }
};

module.exports = authMiddleware;