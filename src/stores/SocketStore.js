import { observable, action } from 'mobx';

class SocketStore {
  // 현재 소켓 연결된 사용자 정보
  @observable chatCustomerInfo = null;

  // 하단 탭 active index
  @observable bottmActiveTabIndex = 0;

  // 현재 선택한 방정보
  @observable
  currentRoomInfo = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  // 하단 탭 index 변경
  @action
  changeBottomActiveTabIndex(tabIndex) {
    this.bottmActiveTabIndex = tabIndex;
  }

  @action
  clear() {
    this.chatCustomerInfo = null;
  }
}

export default SocketStore;
