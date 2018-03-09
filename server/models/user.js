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
      unique: true,
      validate: {
        is: /^\S*$/ // Check for no spaces
      }
    },
    raw_password: {
      type: DataTypes.VIRTUAL,
      validate: {
        is: /^(?=.*[0-9])(?=.*[a-zA-Z])(^\S*)$/, // Atleast one number and one alphabet. No spaces.
        len: 8
      },
      set: function(val) {
        this.setDataValue('raw_password', val)
        this.setDataValue('password', bcrypt.hashSync(val, bcrypt.genSaltSync())) // Password stored as hash
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, { timestamps: false });

  User.prototype.comparePassword = function(password) {
    // Compare given password against stored hash
    return bcrypt.compareSync(password, this.password);
  }

  return User;
};