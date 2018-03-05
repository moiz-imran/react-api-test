'use strict';
module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    year: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, { timestamps: false });

  Film.associate = (models) => {
    // associations can be defined here
  };
  return Film;
};