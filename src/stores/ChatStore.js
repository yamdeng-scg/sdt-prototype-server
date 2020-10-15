import { observable, action } from 'mobx';

class ChatStore {
  // 로딩바 display
  @observable displayLoadingBar = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  handle() {}
}

export default ChatStore;
