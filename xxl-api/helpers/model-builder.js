/* Required Constants */
const Models  = require('../models/index');
const Util    = require('util');
const Debug   = process.env.ODN_DEBUG;
const Inspect = Util.inspect;

/* Debug Methods */
let inspectLog = (varX, override) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(Inspect(varX, {showHidden: false, depth: null}));
};

let debug = (foo) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(foo);
};

/* Internal Methods */
let createPrice = (_price) => {
  let priceAttributes = {
    rank:               _price['rank'],
    price_usd:          _price['price_usd'],
    price_btc:          _price['price_btc'],
    '24h_volume_usd':   _price['24h_volume_usd'],
    market_cap_usd:     _price['market_cap_usd'],
    available_supply:   _price['available_supply'],
    total_supply:       _price['total_supply'],
    percent_change_1h:  _price['percent_change_1h'],
    percent_change_24h: _price['percent_change_24h'],
    percent_change_7d:  _price['percent_change_7d'],
    cmc_last_updated:   _price['last_updated']
  };

  return new Promise((resolve, reject) => {
    Models.Price.create(priceAttributes)
    .then((Price) => {
      debug('-- PRICE SAVED?');
      resolve(Price);
    }).catch((err) => {
      reject(err.message);
    });
  });
};

let updatePrice = (Price, _price) => {
  let priceAttributes = {
    rank:               _price['rank'],
    price_usd:          _price['price_usd'],
    price_btc:          _price['price_btc'],
    '24h_volume_usd':   _price['24h_volume_usd'],
    market_cap_usd:     _price['market_cap_usd'],
    available_supply:   _price['available_supply'],
    total_supply:       _price['total_supply'],
    percent_change_1h:  _price['percent_change_1h'],
    percent_change_24h: _price['percent_change_24h'],
    percent_change_7d:  _price['percent_change_7d'],
    cmc_last_updated:   _price['last_updated']
  };

  return new Promise((resolve, reject) => {
    Price.updateAttributes(priceAttributes)
    .then((Price) => {
      debug('-- PRICE UPDATED?');
      resolve(Price);
    }).catch((err) => {
      reject(err.message);
    });
  });
};

module.exports = {
  createPrice: createPrice,
  updatePrice: updatePrice
};
