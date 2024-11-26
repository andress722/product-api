require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const productController = require("./controllers/productController");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/", productController);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
