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

/*

 1.Login.js : 권한여부 관련 같이 표기
 2.Main.js : 로그인 권한이 있는 사용자
  -SideBar.js
 @.이하부터는 body 바뀌는 부분임
 3.채팅 컨테이너 : /chat ChatContainer.js
  -좌측 방목록 : RoomList.js
  -상단 사용자 정보 : CurrentUserInfo.js
  -가운데 채팅 영역 : ChatAreaContainer.js
   ㄴ.MessageList.js
   ㄷ.SendMessageInput.js
   ㄹ.ChatAreaBottom.js
     -ChatAreaBottomReplySearch.js
     -ChatAreaBottomFav.js
     -ChatAreaBottomLink.js
     -ChatAreaBottomWarning.js
  -우측 계약 정보 영역 : ContractAreaContainer.js
   ㄱ.ContractDeftail.js
   ㄴ.TalkHistory.js

 4.나의 답변템플릿 / 즐겨찾기 답변템플릿 / 전체 답변템플릿 : /template TemplateContainer.js
  -TemplateMenu.js
  -TemplateSearch.js

 5.답변 도우미(new까지 고려) : /pdfmanual PDFManualContainer.js
  -좌측 목록 : PDFManualList.js
  -우측 상세 : PDFManualDetail.js

 6.관리자 : /manager or /manager/stats ManagerContainer.js
  -좌측 공통 영역 : ManagerMenu.js
  6-1.현재 진행 상황 및 기간 별 통계 : /manager/stats?activeTabIndex=0 StatsContiner.js
   ㄱ.현재 진행 상황 탭
    -CurrentIngStats.js
   ㄴ.기간 별 통계 탭
    -PeriodStats.js
  6-2.계정 관리 : /manager/emps EmployeeList.js
  6-3.답변 템플릿 카테고리 관리 : /manager/category TemplateCategory.js
  6-4.자동 메시지 관리 : /manager/autoMessage AutoMessage.js
  6-5.관심고객 관리 : /manager/blackCustomer BlackCustomerList.js

 #.팝업 / 레이어
  1.민원 등록 팝업 : MinwonAddPopup.js
  2.채팅영역의 챗봇대화 : ChatBotHistroyPopup.js
  3.템플릿 등록 / 수정 : TemplateFormPopup.js
  4.상담 상태 변경 : EmpStateChangePopup.js
  5.종료대기 상태 변경 : ClosingStateSpaceChangePopup.js
  6.관심고객 지정 및 해제 : BlackCustomerPopup.js
  7.상담이관 : TalkMovePopup.js
  8.내 상담으로 가져오기 : TalkMoveSelfPopup.js
  9.데스크톱 공지 설정 : NoticePopup.js

*/

@withRouter
@inject('appStore', 'uiStore')
@observer
class App extends Component {
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

export default App;
