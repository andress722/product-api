const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  onSale: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  images: [{ type: String }], // Adiciona o campo de imagens
});

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  variants: [variantSchema],
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  sizes: [sizeSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
