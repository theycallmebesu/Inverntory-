const path = require('path');
const { Sequelize } = require('sequelize');

// Initialize SQLite database using Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false // Disable logging SQL queries in terminal for clean output
});

module.exports = sequelize;
