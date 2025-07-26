const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByType,
  getProductsByTag,
  addMissingProducts,
  removeDeletedProducts,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get('/:id', getProductById);
router.get("/category/:category", getProductsByCategory);
router.get("/type/:type", getProductsByType);
router.get("/tag/:tag", getProductsByTag);

router.post("/sync/add-missing", addMissingProducts);

router.delete("/sync/remove-deleted", removeDeletedProducts);

module.exports = router;
