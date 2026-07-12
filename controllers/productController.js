const productService = require('../services/productService');
const supabase = require('../config/supabase')

const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const data = await productService.getAllProductsFiltered(category, search);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productService.getProductById(id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Produk tidak ditemukan" });
    }
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil detail produk",
      data
    });
  } catch (error) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan atau tidak aktif" });
  }
};

const addProduct = async (req, res) => {
  try {
    // 1. Validasi apakah product_data dikirim                                                                                                                                                     
    if (!req.body.product_data) {
      return res.status(400).json({ status: 'error', message: 'product_data is missing' });
    }

    // 2. Urai string JSON product_data menjadi object                                                                                                                                             
    const productData = JSON.parse(req.body.product_data);
    const { category_id, name, sell_price, cost_price, min_stock, initial_stock, unit } = productData;

    // 3. Validasi field wajib                                                                                                                                                                     
    if (!category_id || !name || !sell_price) {
      return res.status(400).json({
        status: "error",
        message: "Kategori, nama produk, dan harga jual wajib diisi"
      });
    }

    let image_url = null;

    // 4. Proses Upload Gambar ke Supabase Storage (jika ada file yang diunggah)                                                                                                                   
    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

      // Upload ke bucket Supabase bernama 'product-images' (pastikan bucket ini sudah dibuat di dashboard Supabase Anda)                                                                          
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`products/${fileName}`, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
      }

      // Ambil Public URL gambar yang diunggah                                                                                                                                                     
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(`products/${fileName}`);

      image_url = urlData.publicUrl;
    }

    // 5. Gabungkan data untuk dikirim ke service database                                                                                                                                         
    const newProductData = {
      category_id,
      name,
      sell_price,
      cost_price,
      image_url, // URL gambar hasil upload Supabase                                                                                                                                               
      min_stock,
      initial_stock,
      unit
    };

    const product = await productService.createProduct(newProductData);

    return res.status(201).json({
      status: "success",
      message: "Produk dan stok awal berhasil ditambahkan",
      data: product
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, sell_price, cost_price, image_url } = req.body;

    // Validasi minimal field wajib jika dikirim
    if (sell_price !== undefined && sell_price < 0) {
      return res.status(400).json({ status: "error", message: "Harga jual tidak boleh negatif" });
    }

    const product = await productService.updateProduct(id, req.body);
    return res.status(200).json({
      status: "success",
      message: "Produk berhasil diperbarui",
      data: product
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.deleteProduct(id);
    return res.status(200).json({
      status: "success",
      message: "Produk berhasil dihapus (soft delete)",
      data: product
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};