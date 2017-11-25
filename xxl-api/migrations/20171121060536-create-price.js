'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price_usd: {
        type: Sequelize.DOUBLE
      },
      price_btc: {
        type: Sequelize.DOUBLE
      },
      rank: {
        type: Sequelize.INTEGER
      },
      '24h_volume_usd': {
        type: Sequelize.FLOAT
      },
      market_cap_usd: {
        type: Sequelize.FLOAT
      },
      available_supply: {
        type: Sequelize.DOUBLE
      },
      total_supply: {
        type: Sequelize.DOUBLE
      },
      percent_change_1h: {
        type: Sequelize.FLOAT
      },
      percent_change_24h: {
        type: Sequelize.FLOAT
      },
      percent_change_7d: {
        type: Sequelize.FLOAT
      },
      cmc_last_updated: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Prices');
  }
};
