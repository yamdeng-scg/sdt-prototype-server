import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import DevTools from 'mobx-react-devtools';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Main from './components/layout/Main';
import Constant from './config/Constant';
import Logger from './utils/Logger';
import AppHistory from './utils/AppHistory';
import ErrorService from 'src/services/ErrorService';
import Login from './components/Login';

@withRouter
@inject('appStore', 'uiStore')
@observer
class AdminApp extends Component {
  // history block 이벤트 핸들러 변수(clear 용도)
  historyBlockHandler = null;

  constructor(props) {
    super(props);
    this.state = {};
    this.handleGlobalError = this.handleGlobalError.bind(this);
  }

  handleGlobalError(message, url, lineNumber, column, errorObject) {
    if (errorObject && typeof errorObject === 'string') {
      errorObject = {
        message: errorObject
      };
    }
    let displayErrorMessage = '';
    displayErrorMessage = displayErrorMessage + 'url : ' + url + '\n';
    displayErrorMessage =
      displayErrorMessage + 'lineNumber : ' + lineNumber + '\n';
    displayErrorMessage = displayErrorMessage + 'column : ' + column + '\n';
    displayErrorMessage =
      displayErrorMessage +
      'message : ' +
      (errorObject && errorObject.message
        ? errorObject.message
        : 'NO MESSAGE') +
      '\n';
    errorObject = errorObject || {};
    errorObject.message = displayErrorMessage;
    let appErrorObject = { message: errorObject.message };
    if (errorObject.stack) {
      appErrorObject.statck = errorObject.stack;
    }
    appErrorObject.errorType =
      errorObject.errorType || Constant.ERROR_TYPE_CORE;
    ErrorService.openErrorPopup({
      errorObject: appErrorObject,
      body: errorObject.message
    });
    Logger.error('appErrorObject : ' + JSON.stringify(appErrorObject));
    return false;
  }

  init() {
    const { uiStore } = this.props;

    Logger.info('App init call');
    Logger.info('process.env : ' + JSON.stringify(process.env));
    window.onerror = this.handleGlobalError;

    // url block 핸들러 등록
    this.historyBlockHandler = AppHistory.block((location, action) => {
      let currentRouteUrl = location.pathname;
      Logger.info('history change ' + action + ' : ' + currentRouteUrl);
      // 현재 라우팅 url 변경
      if (action === 'REPLACE') {
        uiStore.changeOnlyCurrentRouteUrl(currentRouteUrl);
      } else {
        uiStore.changeCurrentRouteUrl(currentRouteUrl);
      }
      return true;
    });
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    if (this.historyBlockHandler) {
      this.historyBlockHandler();
    }
  }

  render() {
    let { appStore } = this.props;
    let { token } = appStore;
    let DEV_TOOL_COMPONENT = null;
    if (process.env.APP_ENV === Constant.APP_ENV_DEVELOPMENT) {
      DEV_TOOL_COMPONENT = <DevTools />;
    }
    return (
      <ErrorBoundary>
        <React.Fragment>
          {token ? <Main /> : <Login />}
          {DEV_TOOL_COMPONENT}
        </React.Fragment>
      </ErrorBoundary>
    );
  }
}

export default AdminApp;
