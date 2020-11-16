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
import Code from '../../config/Code';
import { ReloadOutlined } from '@ant-design/icons';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.'
];

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
    ModalService.openMiddlePopup(ModalType.ALERT_POPUP, {});
  }

  openConfirmPopup() {
    ModalService.openMiddlePopup(ModalType.CONFRIM_POPUP, {});
  }

  openManualTagListPopup() {
    ModalService.openMiddlePopup(ModalType.MANUAL_TAGLIST_POPUP, {});
  }

  render() {
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    return (
      <div
        style={{
          height: '100%'
        }}
        className="bor-right"
      >
        <div className="pd10 bor-bottom">
          <p onClick={this.openManualTagListPopup}>
            <Title level={3} style={{ margin: 0 }} className="text">
              상담대기 <span className="color-basic">1</span> 건
            </Title>
          </p>
          <div>
            최장 대기시간{'  '} <span className="red">00:00:25</span>
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            padding: '0px 5px 0px 5px',
            marginBottom: 0,
            borderBottom: '1px solid #cdcdcd'
          }}
          size={'large'}
          centered
        >
          <TabPane tab={<Badge color={'orange'}>대기</Badge>} key="1">
            <Row className="right pd10 bor-bottom">
              <Col span={24}>
                <span className="bold text-under mrr5 inblock">
                  최장대기순▼
                </span>{' '}
                <span className="bold text-under inblock">최근접수순▼</span>
              </Col>
            </Row>
            <p className="pd-top30 center bold font-em2 none">
              상담내역이 없습니다
            </p>
            <List
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: document.documentElement.clientHeight - 245
              }}
              renderItem={item => (
                <List.Item
                  style={{
                    position: 'relative'
                  }}
                  className="pd-left20 pd-right20 bor-bottom"
                >
                  <p
                    className="dot-fill"
                    style={{ position: 'absolute', top: 15, left: 10 }}
                  />{' '}
                  오국환님{' '}
                  <Badge count={25} className="site-badge-count-room" />
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    style={{ position: 'absolute', top: 15, right: 15 }}
                  >
                    서울도시가스
                  </Button>
                  <div style={{ position: 'relative' }}>
                    <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                      Ant Design, a design language for background applications
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      <span className="red">01:25:20</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openHitoryPopup}
                    >
                      챗봇대화
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openTalkMovePopup}
                    >
                      상담하기
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openAlertPopup}
                    >
                      이관
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openConfirmPopup}
                    >
                      종료
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="진행" key="2">
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
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: document.documentElement.clientHeight - 285
              }}
              renderItem={item => (
                <List.Item
                  style={{
                    position: 'relative'
                  }}
                  className="pd-left20 pd-right20 bor-bottom"
                >
                  <p
                    className="dot-fill"
                    style={{ position: 'absolute', top: 15, left: 10 }}
                  />{' '}
                  오국환님{' '}
                  <Badge count={25} className="site-badge-count-room" />
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    style={{ position: 'absolute', top: 15, right: 15 }}
                  >
                    서울도시가스
                  </Button>
                  <div style={{ position: 'relative' }}>
                    <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                      Ant Design, a design language for background applications
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      <span className="red">01:25:20</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openHitoryPopup}
                    >
                      챗봇대화
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openTalkMovePopup}
                    >
                      상담하기
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openAlertPopup}
                    >
                      이관
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openConfirmPopup}
                    >
                      종료
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="종료" key="3">
            <Row style={{ padding: 5 }}>
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
            <Row style={{ padding: 5 }}>
              <Col span={24}>
                <RangePicker style={{ width: '90%' }} /> {'   '}
                <ReloadOutlined
                  className="color-basic bold"
                  style={{ fontSize: 20 }}
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
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: document.documentElement.clientHeight - 330
              }}
              renderItem={item => (
                <List.Item
                  style={{
                    position: 'relative'
                  }}
                  className="pd-left20 pd-right20 bor-bottom"
                >
                  <p
                    className="dot-fill"
                    style={{ position: 'absolute', top: 15, left: 10 }}
                  />{' '}
                  오국환님{' '}
                  <Badge count={25} className="site-badge-count-room" />
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    style={{ position: 'absolute', top: 15, right: 15 }}
                  >
                    서울도시가스
                  </Button>
                  <div style={{ position: 'relative' }}>
                    <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                      Ant Design, a design language for background applications
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      <span className="red">01:25:20</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openHitoryPopup}
                    >
                      챗봇대화
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openTalkMovePopup}
                    >
                      상담하기
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openAlertPopup}
                    >
                      이관
                    </Button>{' '}
                    <Button
                      shape="round"
                      size="small"
                      onClick={this.openConfirmPopup}
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
