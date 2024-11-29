require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
// Importar rotas
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));



// Permitir todas as origens
app.use(cors());

// Ou para uma origem específica
app.use(cors({ origin: "http://localhost:3000" }));

// Configurar EJS e Middlewares
app.use(express.urlencoded({ extended: true })); // Para processar dados de formulários HTML
app.use(express.json()); // Para lidar com dados em JSON (se necessário)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// **Rota Principal**
app.get("/", (req, res) => {
  res.redirect("/products"); // Redireciona para a lista de produtos
});

app.get("/create", (req, res) => {
  res.redirect("/products/create"); // Redireciona para a lista de produtos
});
app.post("/create", (req, res) => {
  res.redirect("/products/create"); // Redireciona para a lista de produtos
});


// Rotas de produtos e categorias
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

// Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
