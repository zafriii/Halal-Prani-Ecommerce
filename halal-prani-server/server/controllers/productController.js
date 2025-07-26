const productService = require("../services/productService");

const getAllProducts = async (req, res) => {
  try {
    const { orderby, order = 'desc' } = req.query;
    const products = await productService.getAllProducts(orderby, order);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to get products", details: err.message });
  }
};


const getProductById =  async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to get by category", details: err.message });
  }
};

const getProductsByType = async (req, res) => {
  try {
    const products = await productService.getProductsByType(req.params.type);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to get by type", details: err.message });
  }
};

const getProductsByTag = async (req, res) => {
  try {
    const products = await productService.getProductsByTag(req.params.tag);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to get by tag", details: err.message });
  }
};


const addMissingProducts = async (req, res) => {
  try {
    const { addedCount, updatedCount } = await productService.addMissingProducts();
    res.status(200).json({
      message: `${addedCount} product(s) added, ${updatedCount} updated.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync products", details: err.message });
  }
};


const removeDeletedProducts = async (req, res) => {
  try {
    const { deletedCount } = await productService.removeDeletedProducts();
    res.status(200).json({ message: `${deletedCount} products deleted.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete", details: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByType,
  getProductsByTag,
  addMissingProducts,
  removeDeletedProducts,
};
