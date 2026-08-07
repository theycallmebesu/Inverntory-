const { Product, Supplier } = require('../models');

// GET /api/products/s
exports.getAllProducts = async (req, res) => { 
  try {
    const products = await Product.findAll({
      include: [{ model: Supplier, attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, attributes: ['id', 'name', 'email', 'phone'] }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product details.' });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplierId, image } = req.body;

    // Backend validations
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required.' });
    }
    if (price === undefined || price === '' || Number(price) < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (quantity === undefined || quantity === '' || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier must be selected.' });
    }
    if (!image) {
      return res.status(400).json({ message: 'Product image is required.' });
    }

    // Verify supplier exists
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(400).json({ message: 'Selected supplier does not exist.' });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      supplierId: parseInt(supplierId, 10),
      image
    });

    const productWithSupplier = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'name'] }]
    });

    res.status(201).json({ message: 'Product added successfully.', product: productWithSupplier });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product.' });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplierId, image } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Backend validations
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required.' });
    }
    if (price === undefined || price === '' || Number(price) < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (quantity === undefined || quantity === '' || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier must be selected.' });
    }

    // Verify supplier exists
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(400).json({ message: 'Selected supplier does not exist.' });
    }

    product.name = name;
    product.description = description;
    product.price = parseFloat(price);
    product.quantity = parseInt(quantity, 10);
    product.supplierId = parseInt(supplierId, 10);
    
    // Only update image if provided
    if (image) {
      product.image = image;
    }

    await product.save();

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'name'] }]
    });

    res.json({ message: 'Product updated successfully.', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product.' });
  }
};

// PATCH /api/products/:id/quantity
exports.updateQuantity = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const { quantity } = req.body;
    if (quantity === undefined || quantity === '' || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    product.quantity = parseInt(quantity, 10);
    await product.save();
    res.json({ message: 'Product quantity updated successfully.', product });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({ message: 'Failed to update product quantity.' });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
};
