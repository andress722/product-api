const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Listar todos os produtos
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("index", { products });
});

// Formulário para criar um novo produto
router.get("/create",async  (req, res) => {
  const categories = await Category.find();
  res.render("create", { categories });

});

// Criar um novo produto
router.post("/create", async (req, res) => {
  const { name, brand, category, description, sizes } = req.body;

  const parsedSizes = Object.entries(sizes || {}).map(([size, sizeData]) => ({
    size,
    variants: Object.values(sizeData.variants).map(variant => ({
      ...variant,
      onSale: variant.onSale === "true", // Converter checkbox para booleano
    })),
  }));

  await Product.create({
    name,
    brand,
    category,
    description, // Salvar descrição
    sizes: parsedSizes,
  });

  res.redirect("/");
});


// Formulário para editar um produto
router.get("/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("edit", { product });
});

// Atualizar um produto
router.post("/edit/:id", async (req, res) => {
  const { name, brand, category, description, sizes } = req.body;

  const parsedSizes = Object.entries(sizes || {}).map(([size, sizeData]) => ({
    size,
    variants: Object.values(sizeData.variants).map(variant => ({
      ...variant,
      onSale: variant.onSale === "true", // Converter checkbox para booleano
    })),
  }));

  await Product.findByIdAndUpdate(req.params.id, {
    name,
    brand,
    category,
    description, // Atualizar descrição
    sizes: parsedSizes,
  });

  res.redirect("/");
});


// Deletar um produto
router.get("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
