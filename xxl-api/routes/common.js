/* Required Constants */
const Express = require('express');
const Router  = Express.Router();
const Common  = require('../controllers/common');

/* Routes Accessible */
Router.get('/price', Common.price);
Router.get('/system', Common.systemInfo);

module.exports = Router;
