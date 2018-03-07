'use strict';

module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    year: DataTypes.INTEGER,
    img_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    average_score: DataTypes.FLOAT
  }, { timestamps: false });

  Film.associate = (models) => {
    Film.hasMany(models.Rating, {
      foreignKey: 'filmId',
      as: 'ratings'
    });
  };

  return Film;
};