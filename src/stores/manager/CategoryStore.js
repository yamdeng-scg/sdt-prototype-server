import { observable, action } from 'mobx';

class CategoryStore {
  // 로딩바 display
  @observable displayLoadingBar = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  handle() {}
}

export default CategoryStore;
