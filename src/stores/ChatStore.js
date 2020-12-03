import { observable, action, runInAction, computed } from 'mobx';
import { message } from 'antd';
import io from 'socket.io-client';
import moment from 'moment';
import Constant from '../config/Constant';
import Helper from '../utils/Helper';
import SocketService from '../services/SocketService';
import _ from 'lodash';

// http://localhost:8090
// https://cstalk-prototype.herokuapp.com
const serverUrl = 'http://localhost:8090';

class ChatStore {
  @observable
  socket = null;

  @observable
  customer = null;

  @observable
  roomInfo = null;

  // 방 목록
  @observable messageList = [];

  @observable message = '';

  @observable companyId = '1';

  @observable appId = '';

  @observable telNumber = '';

  @observable notMoreMessage = false;

  @observable afterJoinListCall = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeCompanyId(companyId) {
    this.companyId = companyId;
  }

  @action
  changeAppId(appId) {
    this.appId = appId;
  }

  @action
  changeName(name) {
    this.name = name;
  }

  @action
  changeTelNumber(telNumber) {
    this.telNumber = telNumber;
  }

  @action
  changeMessage(message) {
    this.message = message;
  }

  @action
  sendMessage() {
    if (!this.socket) {
      return;
    }
    let { speakerId, companyId, roomId } = this.customer;
    let socket = this.socket;
    let message = this.message;
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
    this.message = '';
  }

  @action
  sendImage() {}

  @action
  sendEmotikon() {}

  @action
  connectSocket() {
    let socketUrl = serverUrl;
    let socket = this.socket;
    let companyId = this.companyId;
    let appId = this.appId;
    let name = this.name;
    let telNumber = this.telNumber;
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
      this.socket = io(socketUrl);
      this.initDefaultSocektEvent();
    }
  }

  initDefaultSocektEvent() {
    this.socket.on('connect', socketResponse => {
      this.onConnect(socketResponse);
    });
    this.socket.on('disconnect', socketResponse => {
      this.onDisconnect(socketResponse);
    });
    this.socket.on('welcome', socketResponse => {
      this.onWelcome(socketResponse);
    });
    this.socket.on('message-list', socketResponse => {
      this.onMessageList(socketResponse);
    });
    this.socket.on('message', socketResponse => {
      this.onMessage(socketResponse);
    });
    this.socket.on('error', socketResponse => {
      this.onError(socketResponse);
    });
    this.socket.on('read-message', socketResponse => {
      this.onReadMessage(socketResponse);
    });
    this.socket.on('room-detail', socketResponse => {
      this.onRoomDetail(socketResponse);
    });
  }

  @action
  onConnect(socketResponse) {
    message.info('socket connect !!!');
  }

  @action
  onDisconnect(socketResponse) {
    message.warning('socket disconnect!!');
    this.socket = null;
  }

  @action
  onWelcome(welcomeInfo) {
    message.info('welcome : ' + JSON.stringify(welcomeInfo));
    let customer = welcomeInfo.customer;
    let { roomId, speakerId } = customer;
    this.customer = customer;
    let socket = this.socket;
    SocketService.join(socket, roomId, speakerId);
  }

  @action
  onMessageList(messageList) {
    if (!messageList.length) {
      this.notMoreMessage = true;
    }
    let oriMessageList = this.messageList.toJS();
    let updateMessageList = messageList.concat(oriMessageList);
    let groupingDate = '';
    updateMessageList.forEach(messageInfo => {
      messageInfo.groupingDate = '';
      let createDateString = moment(messageInfo.createDate).format(
        'YYYY-MM-DD'
      );
      if (groupingDate !== createDateString) {
        messageInfo.groupingDate = createDateString;
        groupingDate = createDateString;
      }
    });
    this.messageList = updateMessageList;
    if (!this.afterJoinListCall) {
      setTimeout(() => {
        Helper.scrollBottomByDivId('messageListScroll', 300);
        setTimeout(() => {
          runInAction(() => {
            this.afterJoinListCall = true;
          });
        }, 500);
      }, 500);
    }
  }

  @action
  moreMessageList() {
    let messageList = this.messageList.toJS();
    if (messageList.length && this.afterJoinListCall && !this.notMoreMessage) {
      let firstMessage = messageList[0];
      let startId = firstMessage.id;
      let socket = this.socket;
      let { roomId } = this.customer;
      SocketService.moreMessage(socket, roomId, startId);
    }
  }

  @action
  onMessage(newMessage) {
    runInAction(() => {
      let oriMessageList = this.messageList.toJS();
      let searchIndex = _.findIndex(oriMessageList, messageInfo => {
        return (
          messageInfo.groupingDate ===
          moment(newMessage.createDate).format('YYYY-MM-DD')
        );
      });
      if (searchIndex === -1) {
        newMessage.groupingDate = moment(newMessage.createDate).format(
          'YYYY-MM-DD'
        );
      }
      this.messageList = oriMessageList.concat([newMessage]);
      setTimeout(() => {
        Helper.scrollBottomByDivId('messageListScroll', 500);
      }, 500);
    });
  }

  @action
  onError(error) {
    message.warn('error : ' + error);
  }

  @action
  onReadMessage(readMessage) {
    message.info('readMessage : ' + readMessage);
  }

  @action
  onRoomDetail(roomInfo) {
    // message.info('roomDetail : ' + roomInfo);
    this.roomInfo = roomInfo;
  }

  @action
  disconnect() {
    let socket = this.socket;
    if (socket) {
      socket.disconnect();
    }
    this.messageList = [];
  }

  @action
  end() {
    let socket = this.socket;
    let customer = this.customer;
    let { roomId } = customer;
    SocketService.end(socket, roomId);
  }

  @action
  saveHistory(historyJson) {
    let socket = this.socket;
    let customer = this.customer;
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
  deleteMessage() {
    let socket = this.socket;
  }

  @action
  readMessage() {
    let socket = this.socket;
  }

  @action
  moreMessage() {
    let socket = this.socket;
  }

  // 로그인 버튼 여부 체크
  @computed
  get disabledButton() {
    let disabled = true;
    let companyId = this.companyId;
    let appId = this.appId;
    let name = this.name;
    let telNumber = this.telNumber;
    if (companyId && appId && name && telNumber) {
      disabled = false;
    }
    return disabled;
  }

  // 연결끊기 버튼 여부 체크
  @computed
  get disabledDisconnectButton() {
    let disabled = true;
    let socket = this.socket;
    if (!socket || socket.disconnected) {
      disabled = false;
    }
    return disabled;
  }

  // 소켓 연결 여부
  @computed
  get connectedSocket() {
    let connected = true;
    let socket = this.socket;
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
