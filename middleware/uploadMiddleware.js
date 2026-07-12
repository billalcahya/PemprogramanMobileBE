const multer = require('multer');

// Gunakan memory storage agar file tersedia sebagai Buffer di req.file.buffer                                                                                                                     
const storage = multer.memoryStorage();

// Filter opsional untuk memastikan hanya file gambar yang diunggah                                                                                                                                
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Batasi ukuran maksimal file (contoh: 2MB)                                                                                                                         
    },
    fileFilter: fileFilter
});

module.exports = upload; 