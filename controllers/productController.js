const Product = require("../models/Product");
const Category = require("../models/Category"); // Importar o modelo de Categoria

// Listar todos os produtos
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products.map((produto)=>{
      console.log(produto)
    }))
    res.render("index", { products });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).send("Erro ao listar produtos");
  }
};

// Renderizar formulário de criação
exports.renderCreateForm = async (req, res) => {
  try {
    const categories = await Category.find(); // Buscar categorias
    res.render("create", { categories });
  } catch (error) {
    console.error("Erro ao renderizar o formulário de criação:", error);
    res.status(500).send("Erro ao carregar o formulário de criação.");
  }
};


exports.createProduct = async (req, res) => {
  try {
    // Log dos dados recebidos
    console.log("Dados recebidos no formulário:", req.body);

    // Processar os tamanhos e variantes
    const sizes = [];
    if (req.body.sizes) {
      for (const size of Object.keys(req.body.sizes)) {
        const variants = [];
        const sizeVariants = req.body.sizes[size].variants;

        for (const color of Object.keys(sizeVariants)) {
          const variant = {
            color,
            price: parseFloat(sizeVariants[color].price),
            quantity: parseInt(sizeVariants[color].quantity),
            onSale: sizeVariants[color].onSale === "true", // Checar se está em promoção
            discount: sizeVariants[color].discount ? parseFloat(sizeVariants[color].discount) : 0,
            image: req.files ? req.files[`${size}-${color}`]?.[0]?.filename : null, // Adicionar imagem se existir
          };
          variants.push(variant);
        }
        sizes.push({ size, variants });
      }
    }

    // Criação do produto
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      sizes,
    });

    // Salvar no banco de dados
    await product.save();

    res.status(201).send({ message: "Produto criado com sucesso!", product });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(400).send({ error: "Erro ao criar produto." });
  }
};

exports.renderCreateForm = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("create", { categories });
  } catch (err) {
    console.error("Erro ao carregar formulário:", err);
    res.status(500).send("Erro ao carregar formulário");
  }
};

// Atualizar um produto

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, brand, category, description, sizes } = req.body;

    // Processar tamanhos e variantes
    let updatedSizes = [];
    if (sizes) {
      for (const size in sizes) {
        let variants = [];
        if (sizes[size].variants) {
          for (const color in sizes[size].variants) {
            const variant = sizes[size].variants[color];
            let variantData = {
              color: variant.color,
              price: parseFloat(variant.price),
              quantity: parseInt(variant.quantity),
              onSale: variant.onSale === "true",
              discount: parseFloat(variant.discount || 0),
            };

            // Adicionar imagens enviadas
            if (req.files) {
              const uploadedImages = req.files
                .filter((file) => file.fieldname.startsWith(`sizes[${size}][variants][${color}][images]`))
                .map((file) => file.filename);

              variantData.images = uploadedImages.concat(variant.images || []);
            }

            variants.push(variantData);
          }
        }
        updatedSizes.push({ size, variants });
      }
    }

    // Atualizar produto
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        brand,
        category,
        description,
        sizes: updatedSizes,
      },
      { new: true }
    );

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};


// Função para processar os tamanhos e variantes, incluindo as imagens
function processSizes(body, files) {
  const sizes = body.sizes || {};
  const updatedSizes = [];

  for (const sizeKey in sizes) {
    const sizeData = sizes[sizeKey];
    const variants = [];

    if (sizeData.variants) {
      for (const colorKey in sizeData.variants) {
        const variantData = sizeData.variants[colorKey];

        // Obter imagens existentes ou iniciar array
        let images = variantData.existingImages || [];

        // Remover imagens marcadas para exclusão
        if (variantData.removeImages) {
          const imagesToRemove = Array.isArray(variantData.removeImages) ? variantData.removeImages : [variantData.removeImages];
          images = images.filter(image => !imagesToRemove.includes(image));

          // Opcional: Excluir os arquivos do servidor
          imagesToRemove.forEach(image => {
            fs.unlinkSync(`uploads/${image}`);
          });
        }

        // Adicionar novas imagens
        const uploadedImages = files.filter(file => file.fieldname === `sizes[${sizeKey}][variants][${colorKey}][images][]`).map(file => file.filename);
        images.push(...uploadedImages);

        // Limitar a 3 imagens
        if (images.length > 3) {
          images = images.slice(0, 3);
        }

        variants.push({
          color: variantData.color,
          price: parseFloat(variantData.price),
          quantity: parseInt(variantData.quantity),
          onSale: variantData.onSale === "true",
          discount: parseFloat(variantData.discount || 0),
          images: images,
        });
      }
    }

    updatedSizes.push({
      size: sizeKey,
      variants: variants,
    });
  }

  return updatedSizes;
}

exports.getAllProductsAsJson = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};


exports.renderEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find();
    res.render("edit", { product, categories });
  } catch (err) {
    console.error("Erro ao carregar formulário de edição:", err);
    res.status(500).send("Erro ao carregar formulário de edição");
  }
};



// Deletar um produto
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    res.status(500).send("Erro ao deletar produto");
  }
};

// Atualizar estoque de uma variante
exports.updateStock = async (req, res) => {
  try {
    const { size, color, quantityChange } = req.body;
    const product = await Product.findById(req.params.id);
    await product.updateStock(size, color, parseInt(quantityChange, 10));
    res.redirect(`/products/edit/${req.params.id}`);
  } catch (err) {
    res.status(400).send("Erro ao atualizar estoque.");
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, color, image } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado." });

    // Remover a imagem do array
    const sizeData = product.sizes.find((s) => s.size === size);
    if (!sizeData) return res.status(404).json({ error: "Tamanho não encontrado." });

    const variant = sizeData.variants.find((v) => v.color === color);
    if (!variant) return res.status(404).json({ error: "Cor não encontrada." });

    variant.images = variant.images.filter((img) => img !== image);

    // Salvar alterações no banco de dados
    await product.save();

    // Remover arquivo do sistema
    const filePath = path.join(__dirname, "../uploads", image);
    fs.unlinkSync(filePath);

    res.json({ success: true, message: "Imagem removida com sucesso." });
  } catch (error) {
    console.error("Erro ao remover imagem:", error.message);
    res.status(500).json({ error: "Erro ao remover imagem." });
  }
};