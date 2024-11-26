const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }, // Descrição do produto
  sizes: [
    {
      size: { type: String, required: true },
      variants: [
        {
          color: { type: String, required: true },
          quantity: { type: Number, default: 0 },
          price: { type: Number, required: true },
          onSale: { type: Boolean, default: false },
          discount: { type: Number, default: 0 },
          finalPrice: { type: Number }
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// Middleware para calcular o preço final se estiver em promoção
productSchema.pre("save", function (next) {
  this.sizes.forEach(size => {
    size.variants.forEach(variant => {
      if (variant.onSale) {
        variant.finalPrice = variant.price - (variant.price * (variant.discount / 100));
      } else {
        variant.finalPrice = variant.price;
      }
    });
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
