'use strict';
module.exports = (sequelize, DataTypes) => {
  var Price = sequelize.define('Price', {
    price_usd: DataTypes.DOUBLE,
    price_btc: DataTypes.DOUBLE,
    rank: DataTypes.INTEGER,
    '24h_volume_usd': DataTypes.FLOAT,
    market_cap_usd: DataTypes.FLOAT,
    available_supply: DataTypes.DOUBLE,
    total_supply: DataTypes.DOUBLE,
    percent_change_1h: DataTypes.FLOAT,
    percent_change_24h: DataTypes.FLOAT,
    percent_change_7d: DataTypes.FLOAT,
    cmc_last_updated: DataTypes.INTEGER
  });

  return Price;
};
