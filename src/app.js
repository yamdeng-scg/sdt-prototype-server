'use strict';

const CONFIG = require('./config');
const express = require('express');
const app = express();
const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
// const authRoute = require('./routes/auth');
// const autoDiscoveryRoute = require('./routes/autoDiscovery');
// const channel1Route = require('./routes/channel1');
// const channel2Route = require('./routes/channel2');
// const customDeviceRoute = require('./routes/customDevice');
// const deviceRoute = require('./routes/device');
// const gatewayRoute = require('./routes/gateway');
// const cameraRoute = require('./routes/camera');
const applicationRoute = require('./route/application');
const errorMiddleware = require('./middleware/error');
const loggerMiddleware = require('./middleware/logger');
const appInit = require('./init');
appInit(app);

app
  .use(compress())
  .use(express.static(__dirname + '/../public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .options('*', cors())
  .use(cors())
  .use(favicon(__dirname + '/../public/favicon.ico'));

app.use(loggerMiddleware);
// app.use(CONFIG.API_PREFIX_URL, authRoute);
// app.use(CONFIG.API_PREFIX_URL + '/autoDiscovery', autoDiscoveryRoute);
// app.use(CONFIG.API_PREFIX_URL + '/channel1', channel1Route);
// app.use(CONFIG.API_PREFIX_URL + '/channel2', channel2Route);
// app.use(CONFIG.API_PREFIX_URL + '/customDevice', customDeviceRoute);
// app.use(CONFIG.API_PREFIX_URL + '/device', deviceRoute);
// app.use(CONFIG.API_PREFIX_URL + '/gateway', gatewayRoute);
app.use(CONFIG.API_PREFIX_URL + '/application', applicationRoute);
// app.use(CONFIG.API_PREFIX_URL + '/camera', cameraRoute);

app
  .use(errorMiddleware.notFoundHandler)
  .use(errorMiddleware.errorLogger)
  .use(errorMiddleware.hanlder);

module.exports = app;
