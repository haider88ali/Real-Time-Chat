// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Message = sequelize.define('Message', {
    conversationId: {
    type: DataTypes.STRING
  },
  senderId: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT
  },
}, {
  // Disable timestamps
  timestamps: false
});

module.exports = Message;
