const express = require("express");
const multer = require("multer");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
// Configurar Multer para uploads (caso haja imagens no envio)

// Listar todos os produtos
router.get("/", productController.listProducts);

// Formulário para criar um novo produto
router.get("/create", productController.renderCreateForm);

// Criar um novo produto
router.post("/create", upload, productController.createProduct); // Middleware para FormData

// Formulário para editar um produto
router.get("/edit/:id", productController.renderEditForm);

// Atualizar um produto
router.post("/edit/:id", upload, productController.updateProduct);

// Deletar um produto
router.get("/delete/:id", productController.deleteProduct);

// Atualizar estoque de um produto
router.post("/:id/stock", productController.updateStock);

router.get("/json", productController.getAllProductsAsJson);
router.post("/edit/:id/remove-image", productController.removeImage);

module.exports = router;
