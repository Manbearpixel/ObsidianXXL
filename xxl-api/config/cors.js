// *** main dependencies *** //
var cors = require('cors');

// *** cors setup *** //
var whitelist   = ['http://localhost:4200'];
var corsOptions = {
  origin: function (origin, callback) {
    // Accept all requests... for now...
    callback(null, true);
    // if (origin === undefined || whitelist.indexOf(origin) !== -1) {
    //   callback(null, true)
    // }
    // else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  }
}

module.exports = cors(corsOptions);
