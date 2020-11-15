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

const { Paragraph } = Typography;
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
          boxShadow: '0 0 50px 10px rgba(175,175,175,.5)',
          height: '100%'
        }}
      >
        <div
          style={{ padding: 10, borderBottom: '1px solid rgb(240, 240, 240)' }}
        >
          <p onClick={this.openManualTagListPopup}>
            상담대기 <span>1</span>건
          </p>
          <p>
            최장 대기시간<span>00:00:25</span>
          </p>
        </div>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{ padding: '0px 5px 0px 5px', marginBottom: 0 }}
          size={'large'}
          centered
        >
          <TabPane tab={<Badge status="success">대기</Badge>} key="1">
            <Row
              style={{
                padding: 10,
                borderTop: '1px solid #f0f0f0',
                textAlign: 'right'
              }}
            >
              <Col span={24}>
                <span style={{ fontWeight: 'bold' }}>최장대기순▼</span>{' '}
                <span style={{ fontWeight: 'bold' }}>최근접수순▼</span>
              </Col>
            </Row>
            {/* <p
              style={{
                borderTop: '1px solid rgb(240, 240, 240)',
                fontWeight: 'bold',
                textAlign: 'center',
                paddingTop: 30
              }}
            >
              대기건이 없습니다
            </p> */}
            <List
              bordered
              dataSource={data}
              style={{
                overflowY: 'scroll',
                height: document.documentElement.clientHeight - 285
              }}
              renderItem={item => (
                <List.Item style={{ position: 'relative' }}>
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
                      Ant Design, a design language for background applications,
                      is refined by Ant UED Team. Ant Design, a design language
                      for background applications, is refined by Ant UED Team.
                      Ant Design, a design language for background applications,
                      is refined by Ant UED Team. Ant Design, a design language
                      for background applications, is refined by Ant UED Team.
                      Ant Design, a design language for background applications,
                      is refined by Ant UED Team. Ant Design, a design language
                      for background applications, is refined by Ant UED Team.
                    </Paragraph>
                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                      01:25:20
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
                  onSearch={value => console.log(value)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
            <Row style={{ padding: 10 }}>
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>
            <List
              bordered
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <span className="dot-fill" /> 오국환님{' '}
                  <Button type="primary" shape="round" size="small">
                    서울도시가스
                  </Button>
                  <Paragraph ellipsis>
                    Ant Design, a design language for background applications,
                    is refined by Ant UED Team. Ant Design, a design language
                    for background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team.
                  </Paragraph>
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
                  onSearch={value => console.log(value)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={24}>
                <RangePicker style={{ width: '90%' }} /> {'   '}
                <ReloadOutlined />
              </Col>
            </Row>
            <Row
              style={{
                padding: 10
              }}
            >
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>
            <List
              bordered
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <span className="dot-fill" /> 오국환님{' '}
                  <Button type="primary" shape="round" size="small">
                    서울도시가스
                  </Button>
                  <Paragraph ellipsis>
                    Ant Design, a design language for background applications,
                    is refined by Ant UED Team. Ant Design, a design language
                    for background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team.
                  </Paragraph>
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
