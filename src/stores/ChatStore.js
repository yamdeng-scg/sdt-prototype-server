import { observable, action } from 'mobx';

class ChatStore {
  // 현재 선택한 방 정보
  @observable currentRoomInfo = null;

  // 하단 탭 active index
  @observable bottmActiveTabIndex = -1;

  // wait, ing, closes
  @observable currentRoomTabName = 'wait';

  //sort : joinDate, waitTime
  @observable readyRoomSort = 'joinDate';

  @observable displayBottomContent = false;

  @observable displaySearchMessgeComponent = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeDisplaySearchMessgeComponent(displaySearchMessgeComponent) {
    this.displaySearchMessgeComponent = displaySearchMessgeComponent;
  }

  @action
  changeRoomTab(tabName) {
    this.currentRoomTabName = tabName;
  }

  @action
  selectRoom(roomInfo) {
    this.currentRoomInfo = {};
  }

  // 하단 탭 index 변경
  @action
  changeBottomActiveTabIndex(tabIndex) {
    if (
      this.bottmActiveTabIndex === -1 ||
      this.bottmActiveTabIndex === tabIndex
    ) {
      this.displayBottomContent = !this.displayBottomContent;
    } else if (
      this.bottmActiveTabIndex !== tabIndex &&
      !this.displayBottomContent
    ) {
      this.displayBottomContent = true;
    }
    this.bottmActiveTabIndex = tabIndex;
  }

  @action
  changeReadyRoomSort(readyRoomSort) {
    this.readyRoomSort = readyRoomSort;
  }

  @action
  clear() {
    this.currentRoomInfo = null;
    this.displayBottomContent = false;
  }
}

export default ChatStore;
