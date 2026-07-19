const { verifyToken } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak. Token tidak ditemukan."
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    req.user = decoded; 
    
    next(); 
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Sesi Anda telah berakhir. Silakan login kembali."
    });
  }
};

module.exports = authMiddleware;