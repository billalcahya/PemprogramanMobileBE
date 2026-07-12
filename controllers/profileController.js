const profileService = require('../services/profileService');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
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

const getAllProfiles = async (req, res) => {
  try {
    const data = await profileService.getAllProfiles();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil seluruh profil pengguna",
      data 
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const { email, password, full_name, phone, avatar_url, role } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ status: "error", message: "Email, password, dan nama lengkap wajib diisi" });
    }

    const data = await profileService.createProfile({ email, password, full_name, phone, avatar_url, role });
    return res.status(201).json({
      status: "success",
      message: "Profil berhasil dibuat",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
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

const updateProfileById = async (req, res) => {
  try {
    // Ambil ID dari parameter URL (misal: /api/v1/profile/3)
    const userId = req.params.id; 
    const { full_name, phone, avatar_url, password, role } = req.body;

    if (!full_name) {
      return res.status(400).json({ status: "error", message: "Nama lengkap wajib diisi" });
    }

    // Menggunakan service yang sama, tapi membawa ID user yang dipilih dari Android
    const data = await profileService.updateProfile(userId, { full_name, phone, avatar_url, password, role });
    
    return res.status(200).json({
      status: "success",
      message: "Profil user berhasil diperbarui",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id; 
    
    await profileService.deleteProfile(userId);
    return res.status(200).json({
      status: "success",
      message: "Profil berhasil dihapus"
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getProfile,
  getAllProfiles,
  createProfile,
  updateProfile,
  updateProfileById,
  deleteProfile
};