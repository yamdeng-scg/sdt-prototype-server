import { observable, action } from 'mobx';

class ManagerStore {
  // 1, 2, 3, 4
  @observable currentMenuIndex = 1;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeMenuIndex(menuIndex) {
    this.currentMenuIndex = menuIndex;
  }

  @action
  clear() {
    this.currentMenuIndex = 1;
  }
}

export default ManagerStore;
