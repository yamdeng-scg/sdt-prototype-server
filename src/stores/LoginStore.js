import { observable, action } from 'mobx';

class LoginStore {
  // 로딩바 display
  @observable loginId = false;

  @observable password = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeLoginId(loginId) {
    this.loginId = loginId;
  }

  @action
  changePassword(password) {
    this.password = password;
  }

  @action
  login() {}
}

export default LoginStore;
