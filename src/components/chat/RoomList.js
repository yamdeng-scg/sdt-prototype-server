import React from 'react';
import {
  Tabs,
  Button,
  Badge,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  List,
  Typography,
  DatePicker
} from 'antd';
import classNames from 'classnames';
import Code from '../../config/Code';
import Constant from '../../config/Constant';
import { ReloadOutlined, SmileOutlined } from '@ant-design/icons';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';

import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const data = [
  '222Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  '111'
];

const getCountLabelName = function(tabName) {
  let labelName = '상담대기';
  // wait, ing, close
  if (tabName === Constant.ROOM_TYPE_WAIT) {
    labelName = '상담대기';
  } else if (tabName === Constant.ROOM_TYPE_ING) {
    labelName = '상담진행';
  } else if (tabName === Constant.ROOM_TYPE_CLOSE) {
    labelName = '상담종료';
  }
  return labelName;
};

const getTimeLabelName = function(tabName) {
  let labelName = '최장대기 고객 시간';
  if (tabName === Constant.ROOM_TYPE_WAIT) {
    labelName = '최장대기 고객 시간';
  } else if (tabName === Constant.ROOM_TYPE_ING) {
    labelName = '평균 상담 시간';
  } else if (tabName === Constant.ROOM_TYPE_CLOSE) {
    labelName = '평균 상담 시간';
  }
  return labelName;
};

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openHitoryPopup = this.openHitoryPopup.bind(this);
    this.openTalkMovePopup = this.openTalkMovePopup.bind(this);
    this.openAlertPopup = this.openAlertPopup.bind(this);
    this.openConfirmPopup = this.openConfirmPopup.bind(this);
    this.openManualTagListPopup = this.openManualTagListPopup.bind(this);
  }

  openHitoryPopup() {
    ModalService.openMiddlePopup(ModalType.CHAT_BOT_HISTORY_POPUP, {});
  }

  openTalkMovePopup() {
    ModalService.openMiddlePopup(ModalType.TALK_MOVE_POPUP, {});
  }

  openAlertPopup() {
    ModalService.openMiddlePopup(ModalType.ALERT_POPUP, { title: '방 이관' });
  }

  openConfirmPopup() {
    ModalService.openMiddlePopup(ModalType.CONFRIM_POPUP, {});
  }

  openManualTagListPopup() {
    ModalService.openMiddlePopup(ModalType.MANUAL_TAGLIST_POPUP, {});
  }

  componentDidMount() {
    this.props.chatStore.listenWaitTimeRefreshEvent();
    this.props.chatStore.search();
  }

  componentWillUnmount() {
    this.props.chatStore.removeReadyTimeRefreshEvent();
  }

  render() {
    let { chatStore } = this.props;
    let {
      currentRoomTabName,
      readyRoomSort,
      roomList,
      maxDateConvertString,
      averageSpeakTimeString,
      startDate,
      endDate
    } = chatStore;
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    let uiStore = this.props.uiStore;
    let clientHeight = uiStore.clientHeight;
    let roomListCount = roomList.length;
    let pojoRoomList = roomList.toJS();
    console.log('readyRoomSort : ' + readyRoomSort);
    return (
      <div
        style={{
          height: '100%'
        }}
        className="bor-right"
      >
        <div className="pd10 bor-bottom">
          <Title
            level={3}
            className="text mr0"
            onClick={this.openManualTagListPopup}
          >
            {getCountLabelName(currentRoomTabName)}{' '}
            <span className="color-basic">{roomListCount}</span> 건
          </Title>
          <div>
            <span className="bold font-em1">
              {getTimeLabelName(currentRoomTabName)}
              {' : '}
            </span>
            <span className="red bold font-em1">
              {currentRoomTabName === Constant.ROOM_TYPE_WAIT
                ? maxDateConvertString
                : averageSpeakTimeString}
            </span>
          </div>
        </div>
        <Tabs
          defaultActiveKey="wait"
          tabBarStyle={{
            padding: '0px 5px 0px 5px',
            marginBottom: 0,
            borderBottom: '1px solid #cdcdcd'
          }}
          size={'large'}
          centered
          onChange={tabName => chatStore.changeRoomTab(tabName)}
        >
          <TabPane
            tab={
              currentRoomTabName === Constant.ROOM_TYPE_WAIT &&
              roomListCount ? (
                <Badge color={'orange'} className="font-em1">
                  대기
                </Badge>
              ) : (
                <span
                  className={
                    currentRoomTabName === Constant.ROOM_TYPE_WAIT
                      ? 'font-em1 bold'
                      : 'font-em1'
                  }
                >
                  대기
                </span>
              )
            }
            key={Constant.ROOM_TYPE_WAIT}
          >
            <Row className="right pd10 bor-bottom">
              <Col span={24}>
                <span
                  className={classNames('inblock', 'mrr5', {
                    bold: readyRoomSort === Constant.READY_ROOM_SORT_WAIT_TIME,
                    'text-under':
                      readyRoomSort === Constant.READY_ROOM_SORT_WAIT_TIME
                  })}
                  onClick={() =>
                    chatStore.changeReadyRoomSort(
                      Constant.READY_ROOM_SORT_WAIT_TIME
                    )
                  }
                >
                  최장대기순 ▼
                </span>{' '}
                <span
                  className={classNames('inblock', {
                    bold: readyRoomSort === Constant.READY_ROOM_SORT_JOIN_DATE,
                    'text-under':
                      readyRoomSort === Constant.READY_ROOM_SORT_JOIN_DATE
                  })}
                  onClick={() =>
                    chatStore.changeReadyRoomSort(
                      Constant.READY_ROOM_SORT_JOIN_DATE
                    )
                  }
                >
                  최근접수순 ▼
                </span>
              </Col>
            </Row>
            {pojoRoomList.length ? (
              <List
                className=""
                dataSource={pojoRoomList}
                style={{
                  overflowY: 'scroll',
                  height: clientHeight - 245
                }}
                rowKey="id"
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      position: 'relative'
                    }}
                    className={
                      index === 0
                        ? 'pd-left20 pd-right5 bor-bottom bg-baisc-low'
                        : 'pd-left20 pd-right5 bor-bottom'
                    }
                    onClick={() => chatStore.selectRoom(item)}
                  >
                    <p
                      className={item.isOnline ? 'dot-fill' : 'dot'}
                      style={{ position: 'absolute', top: 15, left: 6 }}
                    />{' '}
                    <span className="bold text">{item.customerName}님</span>
                    {item.isBlockCustomer ? (
                      <SmileOutlined className="font-em1 inblock mrl5 bold" />
                    ) : (
                      <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
                    )}
                    {item.noReadCount ? (
                      <Badge count={25} className="site-badge-count-room">
                        <span className="inblock mrl15" />
                      </Badge>
                    ) : null}
                    {item.memberName ? (
                      <span
                        className="bold color-basic inblock bg-gray"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: 10,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        {item.memberName}
                      </span>
                    ) : null}
                    <div style={{ position: 'relative' }}>
                      {item.lastMessageDetail ? (
                        <span
                          className="inblock"
                          style={{ backgroundColor: 'orange' }}
                        >
                          {item.lastMessageDetail}
                        </span>
                      ) : (
                        <Paragraph
                          style={{ marginTop: 10, width: '75%' }}
                          ellipsis
                        >
                          {item.lastMessage}
                        </Paragraph>
                      )}
                      <p style={{ position: 'absolute', top: 0, right: 0 }}>
                        <span className="red">{item.waitTime}</span>
                      </p>
                    </div>
                    <div className="center">
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.openChatbotHistoryPopup(item)}
                        className="bg-basic color-white bold"
                      >
                        챗봇대화
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openTalkMovePopup}
                        className="bg-basic color-white bold"
                      >
                        상담하기
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openAlertPopup}
                        className="bg-basic color-white bold"
                      >
                        이관
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openConfirmPopup}
                        className="bg-basic color-white bold"
                      >
                        종료
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <p
                className="pd-top30 center bold font-em2"
                style={{
                  overflowY: 'scroll',
                  height: clientHeight - 245
                }}
              >
                대기중인 상담이 없습니다
              </p>
            )}
          </TabPane>
          <TabPane
            tab={
              <span
                className={
                  currentRoomTabName === Constant.ROOM_TYPE_ING
                    ? 'font-em1 bold'
                    : 'font-em1'
                }
              >
                진행
              </span>
            }
            key={Constant.ROOM_TYPE_ING}
          >
            <Row className="pd5">
              <Col span={8}>
                <Select
                  defaultValue="customerName"
                  style={{ width: '100%' }}
                  onChange={() => {}}
                >
                  {roomListSearcTypeCodeList.map(codeInfo => {
                    return (
                      <Option value={codeInfo.value}>{codeInfo.name}</Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={16}>
                <Search
                  placeholder="검색어를 입력하세요"
                  onSearch={value => {
                    // console.log('aaa');
                  }}
                  style={{ width: '100%' }}
                  allowClear
                />
              </Col>
            </Row>
            <Row className="right pd-bottom5 bor-bottom">
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>
            {pojoRoomList.length ? (
              <List
                className=""
                dataSource={pojoRoomList}
                style={{
                  overflowY: 'scroll',
                  height: clientHeight - 245
                }}
                rowKey="id"
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      position: 'relative'
                    }}
                    className={
                      index === 0
                        ? 'pd-left20 pd-right5 bor-bottom bg-baisc-low'
                        : 'pd-left20 pd-right5 bor-bottom'
                    }
                    onClick={() => chatStore.selectRoom(item)}
                  >
                    <p
                      className={item.isOnline ? 'dot-fill' : 'dot'}
                      style={{ position: 'absolute', top: 15, left: 6 }}
                    />{' '}
                    <span className="bold text">{item.customerName}님</span>
                    {item.isBlockCustomer ? (
                      <SmileOutlined className="font-em1 inblock mrl5 bold" />
                    ) : (
                      <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
                    )}
                    {item.noReadCount ? (
                      <Badge count={25} className="site-badge-count-room">
                        <span className="inblock mrl15" />
                      </Badge>
                    ) : null}
                    {item.memberName ? (
                      <span
                        className="bold color-basic inblock bg-gray"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: 10,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        {item.memberName}
                      </span>
                    ) : null}
                    <div style={{ position: 'relative' }}>
                      {item.lastMessageDetail ? (
                        <span
                          className2="mrt10 mrb10 inblock bold pd-left5 pd-right5"
                          className="roomlist-inner-link"
                          style2={{
                            backgroundColor: 'orange',
                            color: '#fff',
                            borderRadius: 10
                          }}
                        >
                          {item.lastMessageDetail}
                        </span>
                      ) : (
                        <Paragraph
                          style={{ marginTop: 10, width: '75%' }}
                          ellipsis
                        >
                          {item.lastMessage}
                        </Paragraph>
                      )}
                      <p style={{ position: 'absolute', top: 0, right: 0 }}>
                        <span className="red">{item.waitTime}</span>
                      </p>
                    </div>
                    <div className="center">
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.openChatbotHistoryPopup(item)}
                        className="bg-basic color-white bold"
                      >
                        챗봇대화
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openTalkMovePopup}
                        className="bg-basic color-white bold"
                      >
                        상담하기
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openAlertPopup}
                        className="bg-basic color-white bold"
                      >
                        이관
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openConfirmPopup}
                        className="bg-basic color-white bold"
                      >
                        종료
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <p
                className="pd-top30 center bold font-em2"
                style={{
                  overflowY: 'scroll',
                  height: clientHeight - 245
                }}
              >
                진행중인 상담이 없습니다
              </p>
            )}
          </TabPane>
          <TabPane
            tab={
              <span
                className={
                  currentRoomTabName === Constant.ROOM_TYPE_CLOSE
                    ? 'font-em1 bold'
                    : 'font-em1'
                }
              >
                종료
              </span>
            }
            key={Constant.ROOM_TYPE_CLOSE}
          >
            <Row className="pd5">
              <Col span={8}>
                <Select
                  defaultValue="customerName"
                  style={{ width: '100%' }}
                  onChange={() => {}}
                >
                  {roomListSearcTypeCodeList.map(codeInfo => {
                    return (
                      <Option value={codeInfo.value}>{codeInfo.name}</Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={16}>
                <Search
                  placeholder="검색어를 입력하세요"
                  onSearch={value => {}}
                  allowClear
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
            <Row className="pd5">
              <Col span={24}>
                <RangePicker
                  style={{ width: '90%' }}
                  onChange={dates => chatStore.changeDates(dates[0], dates[1])}
                  value={[startDate, endDate]}
                  allowClear={false}
                />{' '}
                {'   '}
                <ReloadOutlined
                  className="color-basic bold"
                  style={{ fontSize: 16 }}
                  onClick={() => chatStore.initDate()}
                />
              </Col>
            </Row>
            <Row className="right pd-bottom5 bor-bottom">
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>
            {pojoRoomList.length ? (
              <List
                className=""
                dataSource={pojoRoomList}
                style={{
                  overflowY: 'scroll',
                  height: clientHeight - 245
                }}
                rowKey="id"
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      position: 'relative'
                    }}
                    className={
                      index === 0
                        ? 'pd-left20 pd-right5 bor-bottom bg-baisc-low'
                        : 'pd-left20 pd-right5 bor-bottom'
                    }
                    onClick={() => chatStore.selectRoom(item)}
                  >
                    <p
                      className={item.isOnline ? 'dot-fill' : 'dot'}
                      style={{ position: 'absolute', top: 15, left: 6 }}
                    />{' '}
                    <span className="bold text">{item.customerName}님</span>
                    {item.isBlockCustomer ? (
                      <SmileOutlined className="font-em1 inblock mrl5 bold" />
                    ) : (
                      <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
                    )}
                    {item.noReadCount ? (
                      <Badge count={25} className="site-badge-count-room">
                        <span className="inblock mrl15" />
                      </Badge>
                    ) : null}
                    {item.memberName ? (
                      <span
                        className="bold color-basic inblock bg-gray"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: 10,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        {item.memberName}
                      </span>
                    ) : null}
                    <div style={{ position: 'relative' }}>
                      <Paragraph
                        style={{ marginTop: 10, width: '75%' }}
                        ellipsis
                      >
                        {item.lastMessage}
                      </Paragraph>
                      <p style={{ position: 'absolute', top: 0, right: 0 }}>
                        <span className="red">{item.waitTime}</span>
                      </p>
                    </div>
                    <div className="center">
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.openChatbotHistoryPopup(item)}
                        className="bg-basic color-white bold"
                      >
                        챗봇대화
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openTalkMovePopup}
                        className="bg-basic color-white bold"
                      >
                        상담하기
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openAlertPopup}
                        className="bg-basic color-white bold"
                      >
                        이관
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={this.openConfirmPopup}
                        className="bg-basic color-white bold"
                      >
                        종료
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <p
                className="pd-top30 center bold font-em2"
                style={{
                  overflowY: 'scroll',
                  height: clientHeight - 245
                }}
              >
                검색결과가 존재하지 않습니다
              </p>
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RoomList;
