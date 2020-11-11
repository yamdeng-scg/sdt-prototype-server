import { observable, action } from 'mobx';

class AppStore {
  // company
  @observable company = 0;

  // 로그인 token
  @observable token = null;

  // 로그인한 사용자 정보
  @observable userInfo = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  logout() {
    this.token = '';
    this.userInfo = null;
  }

  @action
  setLoginInfo(loginInfo) {
    this.token = loginInfo.token;
    this.userInfo = loginInfo.user;
  }

  // 400 status code 에러 처리
  handleRequestInputFieldError(httpError) {}

  // 401 status code 에러 처리(인증 오류)
  handleUnauthorizedError(httpError) {}

  // 403 status code 에러 처리
  handle403StatusError(httpError) {}

  // 404 status code 에러 처리
  handle404StatusError(url) {}

  // 412 status code 에러 처리
  handle412StatusError(httpError) {}

  // 503 status code 에러 처리
  handle503StatusError(httpError) {}

  // 504 status code 에러 처리
  handle504StatusError(httpError) {}

  // 510 status code 에러 처리
  handle510StatusError(httpError) {}

  // 400, 401, 404, 412, 428, 426, 502, 503, 504, 510 status code를 제외한 에러 처리
  handleServerCommonError(httpError) {}

  // response가 존재하지 않는 경우 : ex) option 메서드 오류
  handleNoResponseError() {}

  // 웹뷰 reload
  reloadApp() {
    document.location.href = '/' + process.env.PUBLIC_URL;
  }
}

export default AppStore;
