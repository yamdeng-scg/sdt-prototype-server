'use strict';

const CONFIG = require('./config');
const express = require('express');
const app = express();
const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
const authRoute = require('./route/auth');
const companyRoute = require('./route/company');
const applicationRoute = require('./route/application');
const searchQueryRoute = require('./route/searchQuery');
const executeQueryRoute = require('./route/executeQuery');
const restCommonRoute = require('./route/restCommon');
const wiseSayRoute = require('./route/wiseSay');
const roomRoute = require('./route/room');
const memberRoute = require('./route/member');
const errorMiddleware = require('./middleware/error');
const authMiddleware = require('./middleware/auth');
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

app.use(authMiddleware);
app.use(loggerMiddleware);
app.use('/auth', authRoute);
app.use(CONFIG.API_PREFIX_URL + '/company', companyRoute);
app.use(CONFIG.API_PREFIX_URL + '/application', applicationRoute);
app.use(CONFIG.API_PREFIX_URL + '/search-query', searchQueryRoute);
app.use(CONFIG.API_PREFIX_URL + '/execute-query', executeQueryRoute);
app.use(CONFIG.API_PREFIX_URL + '/rest-common', restCommonRoute);
app.use(CONFIG.API_PREFIX_URL + '/wise-say', wiseSayRoute);
app.use(CONFIG.API_PREFIX_URL + '/room', roomRoute);
app.use(CONFIG.API_PREFIX_URL + '/member', memberRoute);

app
  .use(errorMiddleware.notFoundHandler)
  .use(errorMiddleware.errorLogger)
  .use(errorMiddleware.hanlder);

module.exports = app;
