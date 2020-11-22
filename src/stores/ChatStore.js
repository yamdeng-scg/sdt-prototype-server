import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import Constant from '../config/Constant';
import ModalType from '../config/ModalType';
import Helper from '../utils/Helper';
import ApiService from '../services/ApiService';
import ModalService from '../services/ModalService';

class ChatStore {
  // 대기방 time 실시간으로 보여주는 용도
  waitTimeRefreshIntervalHandler = null;

  // 현재 선택한 방 정보
  @observable currentRoomInfo = null;

  // 하단 탭 active index
  @observable bottmActiveTabIndex = -1;

  // 현재 방 탭 종류 : wait, ing, close
  @observable currentRoomTabName = 'wait';

  // 대기방 정렬 정보 : joinDate, waitTime
  @observable readyRoomSort = Constant.READY_ROOM_SORT_WAIT_TIME;

  // 채팅 하단 영역 display 여부
  @observable displayBottomContent = false;

  // 메시지 목록 검색 component view
  @observable displaySearchMessgeComponent = false;

  // 방 목록
  @observable roomList = [];

  // 대기탭 상단 최장대기 고객 시간
  @observable maxDateConvertString = '00:00:00';

  // 진행 / 종료탭 상단 평균 상담 시간
  @observable averageSpeakTimeString = '00:00:00';

  // 내 상담만 보기
  @observable checkSelf = false;

  // 방 검색 유형
  @observable searchType = '';

  // 방 검색 값
  @observable searchValue = '';

  // 종료 방 검색 시작일
  @observable startDate = moment();

  // 종료 방 검색 종료일
  @observable endDate = moment().subtract(1, 'months');

  @action
  initDate() {
    this.startDate = moment();
    this.endDate = moment().subtract(1, 'months');
  }

  @action
  changeDates(startDate, endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  @action
  changeCheckSelf(checkSelf) {
    this.checkSelf = checkSelf;
  }

  @action
  changeSearchType(searchType) {
    this.searchType = searchType;
  }

  @action
  changeSearchValue(searchValue) {
    this.searchValue = searchValue;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  listenWaitTimeRefreshEvent() {
    if (this.waitTimeRefreshIntervalHandler) {
      clearInterval(this.waitTimeRefreshIntervalHandler);
    }
    this.waitTimeRefreshIntervalHandler = setInterval(() => {
      runInAction(() => {
        let waitStartDates = this.roomList.map(room =>
          moment(room.waitStartDate)
        );
        this.roomList.forEach(room => {
          room.waitTime = Helper.convertStringBySecond(
            moment().diff(room.waitStartDate, 'seconds')
          );
        });
        let maxDate = moment.max(waitStartDates);
        let maxDateConvertString = '00:00:00';
        if (maxDate) {
          maxDateConvertString = Helper.convertStringBySecond(
            moment().diff(maxDate, 'seconds')
          );
        }
        this.maxDateConvertString = maxDateConvertString;
        // maxDate = moment.max(moments)
        // 대기 최장시간 추출
        // 목록의 값의 속성을 추가시키고 해당 값을 변경함
      });
    }, 1000);
  }

  removeReadyTimeRefreshEvent() {
    if (this.waitTimeRefreshIntervalHandler) {
      clearInterval(this.waitTimeRefreshIntervalHandler);
    }
  }

  // 메시지 목록 검색 component view 여부 변경
  @action
  changeDisplaySearchMessgeComponent(displaySearchMessgeComponent) {
    this.displaySearchMessgeComponent = displaySearchMessgeComponent;
  }

  // 방 탭 변경
  @action
  changeRoomTab(tabName) {
    this.currentRoomTabName = tabName;
    if (tabName === Constant.ROOM_TYPE_WAIT) {
      this.listenWaitTimeRefreshEvent();
    } else {
      this.removeReadyTimeRefreshEvent();
    }
    this.search();
  }

  // 방 선택
  @action
  selectRoom(roomInfo) {
    this.currentRoomInfo = roomInfo;
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

  // 대기 방 정렬 정보 변경
  @action
  changeReadyRoomSort(readyRoomSort) {
    this.readyRoomSort = readyRoomSort;
    this.search();
  }

  @action
  openChatbotHistoryPopup(roomInfo) {
    ModalService.openMiddlePopup(ModalType.CHAT_BOT_HISTORY_POPUP, {
      history: roomInfo.joinHistoryJson
    });
  }

  @action
  search() {
    // room?queryId=findReadyState&sort=joinDate
    // room?queryId=findIngState&checkSelf=Y&searchType=message&searchValue=aaaaasdasdasdasdassdas
    // room?queryId=findSearchCloseState&checkSelf=Y&startDate=2018-01-01&endDate=2021-01-01&searchType=customerName&searchValue=이유
    let apiParam = {};
    let currentRoomTabName = this.currentRoomTabName;
    if (currentRoomTabName === Constant.ROOM_TYPE_WAIT) {
      apiParam.queryId = 'findReadyState';
      apiParam.sort = this.readyRoomSort;
    } else if (currentRoomTabName === Constant.ROOM_TYPE_ING) {
      apiParam.queryId = 'findIngState';
    } else if (currentRoomTabName === Constant.ROOM_TYPE_CLOSE) {
      apiParam.queryId = 'findSearchCloseState';
      apiParam.startDate = moment(this.startDate).format('YYYY-MM-DD');
      apiParam.endDate = moment(this.endDate).format('YYYY-MM-DD');
    }
    ApiService.get('room', { params: apiParam }).then(response => {
      runInAction(() => {
        let data = response.data;
        let totalSpeakMinute = 0;
        data.forEach(info => {
          if (info.speakMinute) {
            totalSpeakMinute = info.speakMinute;
          }
        });
        let averageSpeakMinute = 0;
        if (totalSpeakMinute) {
          averageSpeakMinute = Math.floor(totalSpeakMinute / data.length);
        }
        this.averageSpeakTimeString = Helper.convertStringBySecond(
          averageSpeakMinute * 60
        );
        this.roomList = data;
      });
    });
  }

  @action
  clear() {
    this.currentRoomInfo = null;
    this.displayBottomContent = false;
  }
}

export default ChatStore;
