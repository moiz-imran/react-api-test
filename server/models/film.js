'use strict';

module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    year: {
      type: DataTypes.INTEGER,
      validate: {
        is: /^(18|19|20)[0-9][0-9]/ // Accept integers from 1800-2099 (oldest movie dates to 1888)
      }
    },
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