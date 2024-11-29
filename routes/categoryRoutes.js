const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Rotas para categorias
router.get("/", categoryController.getAllCategories);
router.post("/create", categoryController.createCategory);

module.exports = router;
