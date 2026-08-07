const { Supplier } = require('../models');

// GET /api/suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Failed to fetch suppliers.' });
  }
};

// GET /api/suppliers/:id
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Failed to fetch supplier details.' });
  }
};

// POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Backend validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Supplier email is required.' });
    }
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Supplier phone is required.' });
    }

    const supplier = await Supplier.create({ name, email, phone });
    res.status(201).json({ message: 'Supplier added successfully.', supplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Failed to create supplier.' });
  }
};

// PUT /api/suppliers/:id
exports.updateSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    // Backend validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Supplier email is required.' });
    }
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Supplier phone is required.' });
    }

    supplier.name = name;
    supplier.email = email;
    supplier.phone = phone;
    await supplier.save();

    res.json({ message: 'Supplier updated successfully.', supplier });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Failed to update supplier.' });
  }
};

// DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Failed to delete supplier.' });
  }
};
