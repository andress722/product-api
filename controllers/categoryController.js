const Category = require("../models/Category");

// Obter todas as categorias
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter categorias" });
  }
};

// Criar uma nova categoria
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Categoria já existe" });
    }
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};
