const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET belum dikonfigurasi di file .env');
}


/**
 * Membuat token JWT baru saat user berhasil login
 * param {Object} payload - Data user yang akan dimasukkan ke dalam token (id, role, dll)
 * returns {string} Token JWT
 */

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};


/**
 * Memverifikasi token JWT yang dikirimkan oleh client
 * param {string} token - Token JWT dari header request
 * returns {Object} Payload hasil dekripsi jika token valid
 */

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token tidak valid atau telah kedaluwarsa');
  }
};

module.exports = {
  generateToken,
  verifyToken
};