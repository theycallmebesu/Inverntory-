const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const sequelize = require('./config/database');
const { User, Supplier, Product } = require('./models');

const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: process.env.CORS_METHOD ? process.env.CORS_METHOD.split(',') : ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);

// Database initialization and default admin creation
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // sync models
    console.log('Database synced successfully.');

    // Check and create default admin user only if no users exist
    const userCount = await User.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin user created (Username: admin, Password: admin123)');
    }

    // Seed default sample suppliers if empty
    const supplierCount = await Supplier.count();
    if (supplierCount === 0) {
      await Supplier.bulkCreate([
        { name: 'TechSupplies Inc.', email: 'contact@techsupplies.com', phone: '123-456-7890' },
        { name: 'Global Logistics', email: 'sales@globallogistics.com', phone: '987-654-3210' }
      ]);
      console.log('Default sample suppliers created.');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  await initializeDatabase();
});
