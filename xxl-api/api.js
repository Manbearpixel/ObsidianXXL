// *** main dependencies *** //
let express       = require('express');
let path          = require('path');
let logger        = require('morgan');
let cookieParser  = require('cookie-parser');
let bodyParser    = require('body-parser');
let cors          = require('./config/cors');
let pjson         = require('./package.json');

// *** routes *** //
let serverRoutes = require('./routes/server');
let commonRoutes = require('./routes/common');

// *** express instance *** //
let app = express();

// *** cors middleware *** //
app.use(cors)

// *** config middleware *** //
app.use(logger('dev'));
app.use(cookieParser());

/* Configure bodyParser to handle data from POST/PUT */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Configure request headers */
// TODO: Restrict CORs to a configurable whitelist instead of wildcard
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

// *** main routes *** //
if (process.env.NODE_ENV === 'development') {
  app.use('/api', commonRoutes);
  app.use('/api', serverRoutes);
}
else {
  app.use('/', commonRoutes);
  app.use('/', serverRoutes);
}

// *** handle favicon request *** //
app.get('/favicon.ico', function(req, res) {
  res.status(204);
});

// *** handle ping request *** //
app.get('/ping', function(req, res) {
  res.json({
    status: 'success',
    api_version: pjson.version
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      status: 'error',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: 'error',
    message: err.message,
    error: err
  });
});

module.exports = app;
