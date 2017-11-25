/* Required Constants */
const ModelBuilder  = require('../helpers/model-builder');
const Models        = require('../models/index');
const Request       = require('request');
const System        = require('systeminformation');
const Util          = require('util');
const Debug         = process.env.ODN_DEBUG;
const Inspect       = Util.inspect;
const moment        = require('moment');

/* Internal Vars */
const CMCAPI        = 'https://api.coinmarketcap.com/v1/ticker/obsidian/';
const MaxFreshness  = 10;

/* Debug Methods */
let inspectLog = (varX) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(Inspect(varX, {showHidden: false, depth: null}));
};

function debug(foo) {
  if (Debug == false || Debug == 'false') { return; }
  console.log(foo);
};

/* Internal Methods */

// Make GET request for Coinmarketcap API price info
let getCMCData = () => {
  let _opts = {
    url:            CMCAPI,
    method:         "GET",
    timeout:        10000, // 10 second timeout
    followRedirect: true
  };

  return new Promise((resolve, reject) => {
    Request(_opts, (err, res, body) => {
      if(!err && res.statusCode == 200) {
        body = JSON.parse(body);

        // return first (only) entry object
        resolve(body[0]);
      }
      else {
        debug('CMC Error!');
        inspectLog(body);
        reject(`CMC Rejected; ${err}`);
      }
    });
  });
};

// Fetch price from Database, update if older than MaxFreshness
let fetchPrice = (next) => {
  debug('FETCHING PRICE');

  return new Promise((resolve, reject) => {
    Models.Price.findById(1)
    .then((Price) => {
      // Empty price, set first value via CMC API
      if (Price === null) {
        getCMCData()
        .then((CMCResponse) => {
          debug('getCMC Successful');
          ModelBuilder.createPrice(CMCResponse)
          .then((Price) => {
            debug('-- PRICE CREATED');
            let _price = Price.toJSON();
            _price.humanized_last_updated = 'a few seconds ago';
            resolve(_price);
          });
        }).catch((err) => {
          reject({ location: 'Price.null', message: err.message });
        });
      }
      else {
        let dateNow     = moment().utc();
        let lastUpdate  = moment.utc(Price.updatedAt);
        let mjsDuration = moment.duration(dateNow.diff(lastUpdate));

        debug(`Price Last Pull -- ${mjsDuration.minutes()}`)

        if (mjsDuration.minutes() > MaxFreshness) {
          debug('Price Found -- Needs Refresh...');

          getCMCData()
          .then((CMCResponse) => {
            ModelBuilder.updatePrice(Price, CMCResponse)
            .then((Price) => {
              debug('-- PRICE UPDATED');
              let _price = Price.toJSON();

              // refresh time difference
              lastUpdate  = moment.utc(Price.updatedAt);
              mjsDuration = moment.duration(dateNow.diff(lastUpdate));
              _price.humanized_last_updated = `${mjsDuration.humanize()} ago`;
              resolve(_price);
            });
          });
        }
        else {
          debug('Price Found -- Data Still Fresh');
          let _price = Price.toJSON();
          _price.humanized_last_updated = `${mjsDuration.humanize()} ago`;
          resolve(_price);
        }
      }
    }).catch((err)=>{
      reject({ location: 'Price', message: err.message });
    });
  });
};

module.exports = {
  price: (req, res, next) => {
    fetchPrice(next)
    .then((Price) => {
      res.json({ status: 'success', response: Price });
    })
    .catch((error) => {
      res.json({ status: 'error', error: error });
    });
  },

  systemInfo: (req, res, next) => {
    Promise.all([System.osInfo(), System.mem(), System.fsSize()])
    .then((_system) => {
      let _os   = _system[0];
      // platform - 'Linux', 'Darwin', 'Windows'
      // distro - os
      // release - os version

      let _mem  = _system[1];
      // total - total memory in bytes
      // free - not used in bytes
      // used - used (incl. buffers/cache)
      // active - used actively (excl. buffers/cache)
      // available - potentially available (total - active)

      let _fs   = _system[2];
      // [0].size - sizes in Bytes
      // [0].used - used in bytes
      // [0].use - used in %

      res.json({
        os: {
          platform: _os.platform,
          distro: _os.distro,
          release: _os.release
        },
        mem: {
          total: _mem.total,
          free: _mem.free,
          used: _mem.used,
          available: _mem.available
        },
        storage: {
          size: _fs[0].size,
          used: _fs[0].used,
          use: _fs[0].use
        }
      });
    }).catch(next);
  }
};
