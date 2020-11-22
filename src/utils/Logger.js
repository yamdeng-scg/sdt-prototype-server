// import FirebaseService from '../services/FirebaseService';
import SlackService from '../services/SlackService';
import rootStore from '../stores/RootStore';
import Config from '../config/Config';
import Constant from '../config/Constant';
import moment from 'moment';

const Logger = {
  debug: function(message) {
    if (process.env.APP_ENV === Constant.APP_ENV_DEVELOPMENT) {
      // eslint-disable-next-line
      console.debug(message);

      try {
        let appStore = rootStore.appStore;
        let uiStore = rootStore.uiStore;
        let debugDoc = {};
        debugDoc.version = Config.version;
        debugDoc.frontEnv = process.env.APP_ENV;
        debugDoc.company = appStore.company;
        debugDoc.token = appStore.token;
        debugDoc.message = message;
        debugDoc.created = moment().format('YYYY-MM-DD HH:mm:ss');
        debugDoc.currentRouteUrl = uiStore.currentRouteUrl || '';
        debugDoc.beforeRouteUrl = uiStore.beforeRouteUrl || '';
        debugDoc.message = message.substr(0, 2500);
        // SlackService.sendMessageToDebugChannel(JSON.stringify(debugDoc));
      } catch (e) {
        // eslint-disable-next-line
        console.debug('Logger debug : ' + JSON.stringify(e));
      }
    }
  },
  info: function(message) {
    // eslint-disable-next-line
    console.info(message);
  },
  warn: function(message) {
    // eslint-disable-next-line
    console.warn(message);
  },
  error: function(message) {
    // eslint-disable-next-line
    console.error(message);
    try {
      let appStore = rootStore.appStore;
      let uiStore = rootStore.uiStore;
      let errorDoc = {};
      errorDoc.version = Config.version;
      errorDoc.frontEnv = process.env.APP_ENV;
      errorDoc.company = appStore.company;
      errorDoc.message = message;
      errorDoc.token = appStore.token;
      errorDoc.created = moment().format('YYYY-MM-DD HH:mm:ss');
      errorDoc.currentRouteUrl = uiStore.currentRouteUrl || '';
      errorDoc.beforeRouteUrl = uiStore.beforeRouteUrl || '';
      errorDoc.message = message.substr(0, 2500);
      // SlackService.sendMessageToErrorChannel(JSON.stringify(errorDoc));
    } catch (e) {
      // eslint-disable-next-line
      console.error('Logger error : ' + JSON.stringify(e));
    }
  },
  log: function(message) {
    // eslint-disable-next-line
    console.log(message);
  }
};

export default Logger;
