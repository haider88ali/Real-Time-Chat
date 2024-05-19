// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Conversation = sequelize.define('Conversation', {
  members: {
    type: DataTypes.JSON, // Use JSON data type to store array-like data
    allowNull: false
  },

}, {
  // Disable timestamps
  timestamps: false
});

module.exports = Conversation;
