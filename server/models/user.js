'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, { timestamps: false });

  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  return User;
};