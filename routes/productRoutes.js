const express = require("express");
const multer = require("multer");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  importFromExcel
} = require("../controllers/productController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/produtos", getAllProducts);
router.get("/produtos/:id", getProductById);
router.post("/produtos", createProduct);
router.put("/produtos/:id", updateProduct);
router.delete("/produtos/:id", deleteProduct);
router.post("/produtos/import", upload.single("file"), importFromExcel);

module.exports = router;
