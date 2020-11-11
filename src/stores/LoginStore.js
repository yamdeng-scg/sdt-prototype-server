import { observable, action } from 'mobx';

// {
//   "loginName": "yamdeng1",
//   "password": "1234",
//   "companyId": "1",
//   "name": "안용성"
// }

class LoginStore {
  @observable loginName = null;

  @observable password = null;

  @observable name = null;

  @observable companyId = null;

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
