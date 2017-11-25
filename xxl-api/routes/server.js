/* Required Constants */
const Express = require('express');
const Router  = Express.Router();
const Server  = require('../controllers/server');

/* Routes Accessible */
Router.get('/node/info', Server.info);
Router.get('/node/staking', Server.staking);
Router.get('/node/mining', Server.mining);
Router.get('/node/network', Server.network);

module.exports = Router;
