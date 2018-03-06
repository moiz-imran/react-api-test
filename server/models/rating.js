'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 10 }
    }
  }, { timestamps: false });

  Rating.associate = function(models) {
    Rating.belongsTo(models.Film, {
      foreignKey: 'filmId',
      onDelete: 'CASCADE',
    });
  };
  return Rating;
};