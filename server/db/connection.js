// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('live-chat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;