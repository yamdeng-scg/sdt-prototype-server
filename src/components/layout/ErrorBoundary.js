import React from 'react';
import { observer, inject } from 'mobx-react';
import shortid from 'shortid';
import Logger from '../../utils/Logger';
import Helper from '../../utils/Helper';
import Constant from '../../config/Constant';

@inject('appStore')
@observer
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.refreshPage = this.refreshPage.bind(this);
    this.copyToClipboardByTextArea = this.copyToClipboardByTextArea.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  copyToClipboardByTextArea(textAreaId) {
    Helper.copyToClipboard(textAreaId);
  }

  componentDidCatch(error, info) {
    let errorObject = {};
    errorObject.errorType = Constant.ERROR_TYPE_REACT;
    if (error.message) {
      errorObject.message = error.message;
    }
    if (error.stack) {
      errorObject.stack = error.stack;
    }
    if (info && info.componentStack) {
      errorObject.componentStack = info.componentStack;
    }
    this.setState({
      errorObject: errorObject
    });
    Logger.error(JSON.stringify(errorObject));
  }

  refreshPage() {
    this.props.appStore.reloadApp();
  }

  render() {
    if (this.state.hasError) {
      let errorObject = this.state.errorObject;
      let errorObjectConvertString = '';
      if (errorObject) {
        errorObjectConvertString = JSON.stringify(errorObject);
      }
      let textAreaId = shortid.generate();
      let buttonComponent = (
        <React.Fragment>
          <button
            color="primary"
            onClick={(event) => this.copyToClipboardByTextArea(textAreaId)}
          >
            에러 복사
          </button>
          <br />
          <button color="primary" onClick={this.refreshPage}>
            페이지 리프레쉬
          </button>
        </React.Fragment>
      );
      return (
        <div>
          <textarea
            id={textAreaId}
            value={errorObjectConvertString}
            style={{
              display: 'block',
              opacity: 0,
              width: '0px',
              height: '0px'
            }}
          />
          오류가 발생하였습니다. 관리자에게 문의해주세요. 02-2123-1234
          <br />
          {buttonComponent}
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
