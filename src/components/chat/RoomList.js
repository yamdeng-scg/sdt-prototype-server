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
import { ReloadOutlined } from '@ant-design/icons';
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

  render() {
    let { chatStore } = this.props;
    let { tabName, readyRoomSort } = chatStore;
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    let uiStore = this.props.uiStore;
    let clientHeight = uiStore.clientHeight;
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
            상담대기 <span className="color-basic">1</span> 건
          </Title>
          <div>
            최장 대기시간{'  '} <span className="red">00:00:25</span>
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
              <Badge color={'orange'} className="font-em1">
                대기
              </Badge>
            }
            tab2={<span className="font-em1">대기</span>}
            key="wait"
          >
            <Row className="right pd10 bor-bottom">
              <Col span={24}>
                <span
                  className={classNames('inblock', 'mrr5', 'bold', {
                    'text-under': readyRoomSort === 'waitTime'
                  })}
                  onClick={() => chatStore.changeReadyRoomSort('waitTime')}
                >
                  최장대기순▼
                </span>{' '}
                <span
                  className={classNames('inblock', 'bold', {
                    'text-under': readyRoomSort === 'joinDate'
                  })}
                  onClick={() => chatStore.changeReadyRoomSort('joinDate')}
                >
                  최근접수순▼
                </span>
              </Col>
            </Row>
            <p className="pd-top30 center bold font-em2 none">
              상담내역이 없습니다
            </p>
            <List
              className=""
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: clientHeight - 245
              }}
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
                    className="dot-fill"
                    style={{ position: 'absolute', top: 15, left: 10 }}
                  />{' '}
                  <span className="bold text">오국환님</span>
                  <Badge count={25} className="site-badge-count-room">
                    <span className="inblock mrl15" />
                  </Badge>
                  <div style={{ position: 'relative' }}>
                    <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                      {item}
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      <span className="red">01:25:20</span>
                    </p>
                  </div>
                  <div className="center">
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openHitoryPopup}
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
          </TabPane>
          <TabPane tab={<span className="font-em1">진행</span>} key="ing">
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
            <p className="pd-top30 center bold font-em2 none">
              상담내역이 없습니다
            </p>
            <List
              className=""
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: clientHeight - 245
              }}
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
                    className="dot-fill"
                    style={{ position: 'absolute', top: 15, left: 10 }}
                  />{' '}
                  <span className="bold text">오국환님</span>
                  <Badge count={25} className="site-badge-count-room">
                    <span className="inblock mrl15" />
                  </Badge>
                  <div style={{ position: 'relative' }}>
                    <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                      {item}
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      <span className="red">01:25:20</span>
                    </p>
                  </div>
                  <div className="center">
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openHitoryPopup}
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
          </TabPane>
          <TabPane tab={<span className="font-em1">종료</span>} key="close">
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
                <RangePicker style={{ width: '90%' }} /> {'   '}
                <ReloadOutlined
                  className="color-basic bold"
                  style={{ fontSize: 16 }}
                />
              </Col>
            </Row>
            <Row className="right pd-bottom5 bor-bottom">
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>
            <p className="pd-top30 center bold font-em2 none">
              상담내역이 없습니다
            </p>
            <List
              className=""
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: clientHeight - 245
              }}
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
                    className="dot-fill"
                    style={{ position: 'absolute', top: 15, left: 10 }}
                  />{' '}
                  <span className="bold text">오국환님</span>
                  <Badge count={25} className="site-badge-count-room">
                    <span className="inblock mrl15" />
                  </Badge>
                  <div style={{ position: 'relative' }}>
                    <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                      {item}
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      <span className="red">01:25:20</span>
                    </p>
                  </div>
                  <div className="center">
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openHitoryPopup}
                      className="bg-basic color-white bold"
                    >
                      챗봇대화
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      className="bg-basic color-white bold"
                    >
                      상담하기
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openTalkMovePopup}
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
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RoomList;
