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
        is: /^\S*$/
      }
    },
    raw_password: {
      type: DataTypes.VIRTUAL,
      validate: {
        is: /^(?=.*[0-9])(?=.*[a-zA-Z])(^\S*)$/,
        len: 8
      },
      set: function(val) {
        this.setDataValue('raw_password', val)
        this.setDataValue('password', bcrypt.hashSync(val, bcrypt.genSaltSync()))
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

  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  return User;
};