// *** main dependencies *** //
let express   = require('express');
let app       = express();
let api       = require('./xxl-api/api');
let models    = require('./xxl-api/models');
let appPort   = normalizePort(process.env.PORT || 3000);
let debug     = process.env.ODN_DEBUG || false;

// *** local vars *** //
let public_path = `${__dirname}/public/`
let webapp_path = `${public_path}index.html`
let server = {};

// *** local methods *** //

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  let port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) { return val; }

  // port number
  if (port >= 0) { return port; }

  return false;
}

// *** setup api + webapp *** //
app.use('/api', api);
app.use(express.static(public_path));

app.get('*', function(req, res) {
  res.sendFile(webapp_path);
});

// *** sync database + start server *** //
models.sequelize.sync().then(function() {
  server = app.listen(appPort, 'localhost', () => {
    let addr = server.address();
    if (typeof addr === 'object') {
      addr = `${addr.address}:${addr.port}`;
    }

    console.log(`ObsidianXXL Listening on ${addr}`);
    console.log(`Debug Mode :: ${process.env.ODN_DEBUG}`);
  });
});

// *** expose server *** //
exports = module.exports = app;
