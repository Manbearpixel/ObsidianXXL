const RpcClient = require('node-json-rpc2').Client;
const Util      = require('util')
const Inspect   = Util.inspect;

let _async      = require('async');

// JSON-RPC Client setup for Obsidian (localhost)
const RpcConfig = {
  protocol: 'http',      // Optional. Will be http by default
  host: '127.0.0.1',     // Will be 127.0.0.1 by default
  user: 'me',            // Opt, only if auth needed
  password: '123',       // Opt. mandatory if user is passed.
  port: 8332,            // Will be 8443/8080 http(s)
  method: 'POST'         // Optional. POST by default
};

const ObsidianRpc = new RpcClient(RpcConfig);

const Debug = process.env.ODN_DEBUG;

let inspectLog = (varX) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(Inspect(varX, {showHidden: false, depth: null}));
};

let debug = (foo) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(foo);
};


/* API Helper Methods */
let fetchNodeInfo = () => {
  return new Promise((resolve, reject) => {
    debug('...fetching:getinfo');

    ObsidianRpc.call({
      method: 'getinfo'
    }, (err, res) => {
      if (err) { reject(`Unable to get node info... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to get node inf... [${e.message}]`);
      }
    })
  })
};

let fetchStakeInfo = () => {
  return new Promise((resolve, reject) => {
    debug('...fetching:getstakinginfo');

    ObsidianRpc.call({
      method: 'getstakinginfo'
    }, (err, res) => {
      if (err) { reject(`Unable to get staking info... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to get staking info... [${e.message}]`);
      }
    })
  })
};

let fetchMiningInfo = () => {
  return new Promise((resolve, reject) => {
    debug('...fetching:getmininginfo');

    ObsidianRpc.call({
      method: 'getmininginfo'
    }, (err, res) => {
      if (err) { reject(`Unable to get mining info... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to get mining info... [${e.message}]`);
      }
    })
  })
};

let fetchNetworkInfo = () => {
  return new Promise((resolve, reject) => {
    debug('...fetching:getnetworkinfo');

    ObsidianRpc.call({
      method: 'getnettotals'
    }, (err, res) => {
      if (err) { reject(`Unable to get network info... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to get network info... [${e.message}]`);
      }
    })
  })
};

let fetchTransaction = function(txid) {
  return new Promise((resolve, reject) => {
    debug(`...fetching:${txid}`);

    ObsidianRpc.call({
      method: 'getrawtransaction',
      params: [txid, 1]
    }, (err, res) => {
      if (err) { reject(`Unable to fetch tx... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to fetch tx... [${e.message}]`);
      }
    });
  });
};

let fetchCurrentBlockHeight = function() {
  return new Promise((resolve, reject) => {
    debug(`...fetching block height`);

    ObsidianRpc.call({
      method: 'getblockcount',
      params: []
    }, (err, res) => {
      if (err) { reject(`Unable to fetch block height... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to fetch block height... [${e.message}]`);
      }
    });
  });
};

let fetchBlockByNumber = function(blockHeight, showTxs = true) {
  return new Promise((resolve, reject) => {
    debug(`...fetching block height:${blockHeight}`);
    if (!(/^\d+$/.test(blockHeight))) reject(`Block Heights must be numeric!`);

    blockHeight = parseInt(blockHeight);
    ObsidianRpc.call({
      method: 'getblockbynumber',
      params: [blockHeight, showTxs]
    }, (err, res) => {
      if (err) { reject(`Unable to fetch block ... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to fetch block ... [${e.message}]`);
      }
    });
  });
};

let fetchBlockByHash = function(blockHash, showTxs = true) {
  return new Promise((resolve, reject) => {
    debug(`...fetching block hash:${blockHash}`);
    if ((/^\d+$/.test(blockHash))) reject(`Invalid Block Hash!`);

    ObsidianRpc.call({
      method: 'getblock',
      params: [blockHash, showTxs]
    }, (err, res) => {
      inspectLog(res);
      inspectLog(err);
      if (err) { reject(`Unable to fetch block ... [${err}]`); }
      try {
        resolve(res.result);
      } catch(e) {
        reject(`Unable to fetch block ... [${e.message}]`);
      }
    });
  });
};

let populateTxVinMetadata = function(txData) {
  let BATCH_MODE = false;

  return new Promise((resolve, reject) => {

    if (txData['vin'].length > 25) {
      debug('[populate] ... WHOA big order!! Running BATCH_MODE');
      BATCH_MODE = true;
    }

    _async.eachLimit(txData['vin'], 25, (_vin, _callback) => {
      if (_vin.hasOwnProperty('coinbase')) {
        debug('[populate-vin] .. COINBASE SKIP');
        _callback();
      }
      else {
        debug('[populate-vin] .. FETCHING TX');

        // fetch the txid of _vin
        // NOTE:  The TxVinModel uses txid as a reference to the actual txid
        //        of the transaction it is from, and vout_txid as a reference
        //        to the vout-referenced txid in order to differentiate the two
        //        but still maintain knowledge of each.
        //        In this case however, the txData should contain a raw version
        //        of VIN data so we still use txid here.
        fetchTransaction(_vin['txid'])
        .then((_tx) => {
          debug('[populate-vin] .. TX FOUND');
          debug('[populate-vin] .. LOOP THROUGH VOUT TO FIND MATCH');

          for(let _vout of _tx['vout']) {
            if (_vout['n'] == _vin['vout']) {
              debug('[populate-vin] .. !! MATCH FOUND');
              _vin['value']    = _vout['value'];
              _vin['address']  = _vout['scriptPubKey']['addresses'][0];
              debug('[populate-vin] .. ADDED VALUE, ADDRESS');
              _callback();
            }
          }
        }).catch(reject);
      }
    }, () => {
      debug('[populate-vin] !! COMPLETE !!');
      resolve(txData);
    });
  });
};

module.exports = {
  fetchNodeInfo: fetchNodeInfo,
  fetchStakeInfo: fetchStakeInfo,
  fetchMiningInfo: fetchMiningInfo,
  fetchNetworkInfo: fetchNetworkInfo,
  fetchTransaction: fetchTransaction,
  fetchCurrentBlockHeight: fetchCurrentBlockHeight,
  fetchBlockByNumber: fetchBlockByNumber,
  fetchBlockByHash: fetchBlockByHash,
  populateTxVinMetadata: populateTxVinMetadata
};
