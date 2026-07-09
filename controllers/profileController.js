const profileService = require('../services/profileService');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Inject oleh authMiddleware
    const data = await profileService.getProfile(userId);
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil profil pengguna",
      data
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Inject oleh authMiddleware
    const { full_name, phone, avatar_url, password } = req.body;

    if (!full_name) {
      return res.status(400).json({ status: "error", message: "Nama lengkap wajib diisi" });
    }

    const data = await profileService.updateProfile(userId, { full_name, phone, avatar_url, password });
    return res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
