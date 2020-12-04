'use strict';

const CONFIG = require('./config');
const express = require('express');
const app = express();
const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
const history = require('connect-history-api-fallback');
const authRoute = require('./route/auth');
const companyRoute = require('./route/company');
const applicationRoute = require('./route/application');
const searchQueryRoute = require('./route/searchQuery');
const executeQueryRoute = require('./route/executeQuery');
const restCommonRoute = require('./route/restCommon');
const roomRoute = require('./route/room');
const messageRoute = require('./route/message');
const memberRoute = require('./route/member');
const minwonRoute = require('./route/minwon');
const categoryRoute = require('./route/category');
const keywordRoute = require('./route/keyword');
const adminRoute = require('./route/admin');
const templateRoute = require('./route/template');
const autoMessageRoute = require('./route/autoMessage');
const linkRoute = require('./route/link');
const manualRoute = require('./route/manual');
const statsRoute = require('./route/stats');
const customerRoute = require('./route/customer');
const relayRoute = require('./route/relay');
const errorMiddleware = require('./middleware/error');
const authMiddleware = require('./middleware/auth');
const loggerMiddleware = require('./middleware/logger');
const appInit = require('./init');
appInit(app);

app
  .use(compress())
  .use(
    history({
      index: '/index.html',
      rewrites: [
        { from: /\/manual/, to: '/manual.html' },
        { from: /\/admin/, to: '/admin.html' }
      ]
    })
  )
  .use(express.static(__dirname + '/../public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .options('*', cors())
  .use(cors())
  .use(favicon(__dirname + '/../public/favicon.ico'));

app.use(authMiddleware);
app.use(loggerMiddleware);
app.use(CONFIG.API_PREFIX_URL + '/auth', authRoute);
app.use(CONFIG.API_PREFIX_URL + '/company', companyRoute);
app.use(CONFIG.API_PREFIX_URL + '/application', applicationRoute);
app.use(CONFIG.API_PREFIX_URL + '/search-query', searchQueryRoute);
app.use(CONFIG.API_PREFIX_URL + '/execute-query', executeQueryRoute);
app.use(CONFIG.API_PREFIX_URL + '/rest-common', restCommonRoute);
app.use(CONFIG.API_PREFIX_URL + '/room', roomRoute);
app.use(CONFIG.API_PREFIX_URL + '/message', messageRoute);
app.use(CONFIG.API_PREFIX_URL + '/member', memberRoute);
app.use(CONFIG.API_PREFIX_URL + '/minwon', minwonRoute);
app.use(CONFIG.API_PREFIX_URL + '/category', categoryRoute);
app.use(CONFIG.API_PREFIX_URL + '/keyword', keywordRoute);
app.use(CONFIG.API_PREFIX_URL + '/admin', adminRoute);
app.use(CONFIG.API_PREFIX_URL + '/template', templateRoute);
app.use(CONFIG.API_PREFIX_URL + '/auto-message', autoMessageRoute);
app.use(CONFIG.API_PREFIX_URL + '/link', linkRoute);
app.use(CONFIG.API_PREFIX_URL + '/manual', manualRoute);
app.use(CONFIG.API_PREFIX_URL + '/stats', statsRoute);
app.use(CONFIG.API_PREFIX_URL + '/customer', customerRoute);
app.use(CONFIG.API_PREFIX_URL + '/relay', relayRoute);

app
  .use(errorMiddleware.notFoundHandler)
  .use(errorMiddleware.errorLogger)
  .use(errorMiddleware.hanlder);

module.exports = app;
