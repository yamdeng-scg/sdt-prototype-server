import { observable, action, runInAction, computed } from 'mobx';
import { message } from 'antd';
import io from 'socket.io-client';
import Constant from '../config/Constant';
import Helper from '../utils/Helper';
import SocketService from '../services/SocketService';
import ModalService from '../services/ModalService';
import ModalType from '../config/ModalType';

// 이름
// appId
// 전화번호
// 회사 : select
// 로그인 or 연결끊기

class ChatStore {
  @observable
  socket1 = null;

  @observable
  socket2 = null;

  @observable
  socket3 = null;

  @observable
  customer1 = null;

  @observable
  customer2 = null;

  @observable
  customer3 = null;

  @observable
  roomInfo1 = null;

  @observable
  roomInfo2 = null;

  @observable
  roomInfo3 = null;

  // 방 목록
  @observable messageList1 = [];

  // 방 목록
  @observable messageList2 = [];

  // 방 목록
  @observable messageList3 = [];

  @observable message1 = '';

  @observable message2 = '';

  @observable message3 = '';

  @observable companyId1 = '1';

  @observable companyId2 = '1';

  @observable companyId3 = '1';

  @observable appId1 = '';

  @observable appId2 = '';

  @observable appId3 = '';

  @observable telNumber1 = '';

  @observable telNumber2 = '';

  @observable telNumber3 = '';

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeCompanyId(companyId, index) {
    this['companyId' + index] = companyId;
  }

  @action
  changeAppId(appId, index) {
    this['appId' + index] = appId;
  }

  @action
  changeName(name, index) {
    this['name' + index] = name;
  }

  @action
  changeTelNumber(telNumber, index) {
    this['telNumber' + index] = telNumber;
  }

  @action
  changeMessage(message, index) {
    this['message' + index] = message;
  }

  @action
  sendMessage(index) {
    let { speakerId, companyId, roomId } = this['customer' + index];
    let socket = this['socket' + index];
    let message = this['message' + index];
    let socketParam = {
      companyId: companyId,
      speakerId: speakerId,
      roomId: roomId,
      isEmployee: 0,
      templateId: null,
      messageType: Constant.MESSAGE_TYPE_NORMAL,
      isSystemMessage: 0,
      messageAdminType: 0,
      messageDetail: null,
      message: message
    };
    SocketService.sendMessage(socket, socketParam);
    this['message' + index] = '';
  }

  @action
  sendImage() {}

  @action
  sendEmotikon() {}

  @action
  connectSocket(index) {
    let socketUrl = 'http://localhost:8090';
    let socket = this['socket' + index];
    let companyId = this['companyId' + index];
    let appId = this['appId' + index];
    let name = this['name' + index];
    let telNumber = this['telNumber' + index];
    if (!socket || socket.disconnected) {
      socketUrl =
        socketUrl +
        '?companyId=' +
        companyId +
        '&appId=' +
        appId +
        '&name=' +
        name +
        '&telNumber=' +
        telNumber;
      this['socket' + index] = io(socketUrl);
      this.initDefaultSocektEvent(index);
    }
  }

  initDefaultSocektEvent(index) {
    this['socket' + index].on('connect', socketResponse => {
      this.onConnect(socketResponse, index);
    });
    this['socket' + index].on('disconnect', socketResponse => {
      this.onDisconnect(socketResponse, index);
    });
    this['socket' + index].on('welcome', socketResponse => {
      this.onWelcome(socketResponse, index);
    });
    this['socket' + index].on('message-list', socketResponse => {
      this.onMessageList(socketResponse, index);
    });
    this['socket' + index].on('message', socketResponse => {
      this.onMessage(socketResponse, index);
    });
    this['socket' + index].on('error', socketResponse => {
      this.onError(socketResponse, index);
    });
    this['socket' + index].on('read-message', socketResponse => {
      this.onReadMessage(socketResponse, index);
    });
    this['socket' + index].on('room-detail', socketResponse => {
      this.onRoomDetail(socketResponse, index);
    });
  }

  onConnect(socketResponse, index) {
    // message.info('socket connect : ' + index);
  }

  onDisconnect(socketResponse, index) {
    message.warning('socket disconnect : ' + index);
    this['socket' + index] = null;
  }

  @action
  onWelcome(welcomeInfo, index) {
    // message.info('welcome ' + index + ' : ' + JSON.stringify(welcomeInfo));
    let customer = welcomeInfo.customer;
    let { roomId, speakerId } = customer;
    this['customer' + index] = customer;
    let socket = this['socket' + index];
    SocketService.join(socket, roomId, speakerId);
  }

  @action
  onMessageList(messageList, index) {
    // message.info('messageList ' + index + ' : ' + messageList);
    let oriMessageList = this['messageList' + index].toJS();
    this['messageList' + index] = messageList.concat(oriMessageList);
    setTimeout(() => {
      Helper.scrollBottomByDivId('messageListScroll' + index, 500);
    }, 500);
  }

  @action
  onMessage(message, index) {
    runInAction(() => {
      let oriMessageList = this['messageList' + index].toJS();
      this['messageList' + index] = oriMessageList.concat([message]);
      setTimeout(() => {
        Helper.scrollBottomByDivId('messageListScroll' + index, 500);
      }, 500);
    });
  }

  @action
  onError(error, index) {
    message.warn('error ' + index + ' : ' + error);
  }

  @action
  onReadMessage(readMessage, index) {
    // message.info('readMessage ' + index + ' : ' + readMessage);
  }

  @action
  onRoomDetail(roomInfo, index) {
    // message.info('roomDetail ' + index + ' : ' + roomInfo);
    this['roomInfo' + index] = roomInfo;
  }

  @action
  disconnect(index) {
    let socket = this['socket' + index];
    if (socket) {
      socket.disconnect();
    }
    this['messageList' + index] = [];
  }

  @action
  end(index) {
    let socket = this['socket' + index];
    let customer = this['customer' + index];
    let { roomId } = customer;
    SocketService.end(socket, roomId);
  }

  @action
  saveHistory(index, historyJson) {
    let socket = this['socket' + index];
    let customer = this['customer' + index];
    let { roomId } = customer;
    SocketService.end(socket, roomId, [
      {
        m: '나도 오늘 저녁이 기대된다!',
        t: '2019-08-23 17:41:28'
      },
      {
        m: 'ㅏㅏㅏㅏㅏㅏ',
        t: '2019-08-23 17:41:39'
      }
    ]);
  }

  @action
  deleteMessage(index) {
    let socket = this['socket' + index];
  }

  @action
  readMessage(index) {
    let socket = this['socket' + index];
  }

  @action
  moreMessage(index) {
    let socket = this['socket' + index];
  }

  // 로그인 버튼 여부 체크
  @computed
  get disabledButton1() {
    let disabled = true;
    let companyId = this.companyId1;
    let appId = this.appId1;
    let name = this.name1;
    let telNumber = this.telNumber1;
    if (companyId && appId && name && telNumber) {
      disabled = false;
    }
    return disabled;
  }

  @computed
  get disabledButton2() {
    let disabled = true;
    let companyId = this.companyId2;
    let appId = this.appId2;
    let name = this.name2;
    let telNumber = this.telNumber2;
    if (companyId && appId && name && telNumber) {
      disabled = false;
    }
    return disabled;
  }

  @computed
  get disabledButton3() {
    let disabled = true;
    let companyId = this.companyId3;
    let appId = this.appId3;
    let name = this.name3;
    let telNumber = this.telNumber3;
    if (companyId && appId && name && telNumber) {
      disabled = false;
    }
    return disabled;
  }

  // 연결끊기 버튼 여부 체크
  @computed
  get disabledDisconnectButton1() {
    let disabled = true;
    let socket = this.socket1;
    if (!socket || socket.disconnected) {
      disabled = false;
    }
    return disabled;
  }

  @computed
  get disabledDisconnectButton2() {
    let disabled = true;
    let socket = this.socket2;
    if (!socket || socket.disconnected) {
      disabled = false;
    }
    return disabled;
  }

  @computed
  get disabledDisconnectButton3() {
    let disabled = true;
    let socket = this.socket3;
    if (!socket || socket.disconnected) {
      disabled = false;
    }
    return disabled;
  }

  // 소켓 연결 여부
  @computed
  get connectedSocket1() {
    let connected = true;
    let socket = this.socket1;
    if (!socket) {
      connected = false;
    }
    return connected;
  }

  @computed
  get connectedSocket2() {
    let connected = true;
    let socket = this.socket2;
    if (!socket) {
      connected = false;
    }
    return connected;
  }

  @computed
  get connectedSocket3() {
    let connected = true;
    let socket = this.socket3;
    if (!socket) {
      connected = false;
    }
    return connected;
  }

  @action
  clear() {
    this.currentRoomInfo = null;
    this.displayBottomContent = false;
  }
}

export default ChatStore;
