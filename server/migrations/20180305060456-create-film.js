'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Films', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      img_url: {
        type: Sequelize.STRING
      },
      average_score: {
        type: Sequelize.FLOAT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Films');
  }
};