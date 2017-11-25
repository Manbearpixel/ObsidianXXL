/* Required Constants */
const Obsidian      = require('../helpers/obsidian');
const Util          = require('util');
const Debug         = process.env.ODN_DEBUG;
const Inspect       = Util.inspect;

/* Debug Methods */
let inspectLog = (varX) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(Inspect(varX, {showHidden: false, depth: null}));
};

function debug(foo) {
  if (Debug == false || Debug == 'false') { return; }
  console.log(foo);
};

// faker -- info
let fake_info = {
  "result":{
    "version":"v1.0.0.6-g32a928e",
    "protocolversion":70000,
    "walletversion":60000,
    "balance":0,
    "newmint":0,
    "stake":0,
    "blocks":81331,
    "timeoffset":0,
    "moneysupply":99528622.9588,
    "connections":1,
    "proxy":"",
    "ip":"0.0.0.0",
    "difficulty":{
      "proof-of-work":1.73221791,
      "proof-of-stake":5269515.0324943
    },
    "testnet":false,
    "keypoololdest":1507774920,
    "keypoolsize":101,
    "paytxfee":0,
    "mininput":0,
    "errors":""
  }
};

module.exports = {
  info: (req, res, next) => {
    Obsidian.fetchNodeInfo()
    .then((nodeInfo) => {
      res.json(nodeInfo);
    }).catch(next);
  },

  staking: (req, res, next) => {
    Obsidian.fetchStakeInfo()
    .then((stakeInfo) => {
      res.json(stakeInfo);
    }).catch(next);
  },

  mining: (req, res, next) => {
    Obsidian.fetchMiningInfo()
    .then((miningInfo) => {
      res.json(miningInfo);
    }).catch(next);
  },

  network: (req, res, next) => {
    Obsidian.fetchNetworkInfo()
    .then((netInfo) => {
      res.json(netInfo);
    }).catch(next);
  }
};
