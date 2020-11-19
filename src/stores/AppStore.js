import { observable, action } from 'mobx';
import Helper from '../utils/Helper';
import ApiService from '../services/ApiService';
import ModalService from '../services/ModalService';

class AppStore {
  // company
  @observable company = 0;

  // 로그인 token
  @observable token = Helper.getInfoByLocalStorage('token') || null;

  // 로그인한 사용자 정보
  @observable profile = {};

  // 회사 목록
  @observable companyList = [];

  // 현재 시간 통계 정보
  @observable currentStatsInfo = {};

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  logout() {
    ModalService.confirm({
      title: '로그아웃',
      body: '로그아웃하시겠습니까?',
      ok: () => {
        this.token = '';
        this.profile = null;
        Helper.removeInfoByLocalStorage('token');
      }
    });
  }

  @action
  setLoginInfo(loginInfo) {
    this.token = loginInfo.token;
    this.profile = loginInfo.profile;
    Helper.saveInfoToLocalStorage('token', loginInfo.token);
  }

  @action
  changeProfile(profile) {
    this.profile = profile;
  }

  @action
  changeToken(token) {
    this.token = token;
  }

  @action
  loadProfile() {
    ApiService.get('auth/profile').then(response => {
      let data = response.data;
      this.setLoginInfo(data);
    });
    ApiService.get('room', { params: { queryId: 'getCurrentTimeStats' } }).then(
      respone => {
        let data = respone.data;
        this.currentStatsInfo = data;
      }
    );
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

  @action
  loadCompanyList() {
    ApiService.get('company').then(respone => {
      let data = respone.data;
      this.companyList = data;
    });
  }
}

export default AppStore;
