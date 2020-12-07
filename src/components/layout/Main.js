import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Select, Input, Button, Modal, Collapse } from 'antd';
import { withRouter } from 'react-router-dom';
import SendMessageInput from '../chat/SendMessageInput';
import MessageList from '../chat/MessageList';
const { Option } = Select;
const { Panel } = Collapse;

const companyCodeList = [
  { name: '서울도시가스', value: '1' },
  { name: '인천도시가스', value: '2' }
];

const customerList = [
  {
    companyId: '1',
    appId: '7001',
    name: '안용성1',
    telNumber: '010111117001'
  },
  {
    companyId: '1',
    appId: '7002',
    name: '안용성2',
    telNumber: '010111117002'
  },
  {
    companyId: '1',
    appId: '7003',
    name: '안용성3',
    telNumber: '010111117003'
  },
  { companyId: '2', appId: '7001', name: '안용성1', telNumber: '010111117001' }
];

@withRouter
@inject('appStore', 'chatStore', 'uiStore')
@observer
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewModal: false };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.applyCustomerInfo = this.applyCustomerInfo.bind(this);
  }

  openModal() {
    this.setState({ viewModal: true });
  }

  closeModal() {
    this.setState({ viewModal: false });
  }

  applyCustomerInfo(customerInfo) {
    let { chatStore } = this.props;
    let { companyId, appId, name, telNumber } = customerInfo;
    chatStore.changeCompanyId(companyId);
    chatStore.changeAppId(appId);
    chatStore.changeName(name);
    chatStore.changeTelNumber(telNumber);
    this.setState({ viewModal: false });
  }

  render() {
    let { viewModal } = this.state;
    let { chatStore, uiStore } = this.props;
    let { clientHeight } = uiStore;
    let {
      companyId,
      appId,
      name,
      telNumber,
      connectedSocket,
      disabledButton,
      messageList
    } = chatStore;
    let listClientHeight = clientHeight - 280;
    if (connectedSocket) {
      listClientHeight = clientHeight - 350;
    }
    return (
      <React.Fragment>
        <div
          style={{
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {/* 연결 url 모달/ */}
          <Modal
            title="소켓 URL 및 계정선택"
            visible={viewModal}
            footer={null}
            onCancel={() => this.closeModal()}
          >
            <Collapse defaultActiveKey={['0']}>
              {customerList.map((customerInfo, index) => {
                return (
                  <Panel key={index} header={customerInfo.name}>
                    <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                      <Col span={24}>
                        <span style={{ fontWeight: 'bold' }}>도시가스</span> :{' '}
                        {customerInfo.companyId === '1'
                          ? '서울도시가스'
                          : '인천도시가스'}
                      </Col>
                    </Row>
                    <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                      <Col span={24}>
                        <span style={{ fontWeight: 'bold' }}>가스앱 id</span> :{' '}
                        {customerInfo.appId}
                      </Col>
                    </Row>
                    <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                      <Col span={24}>
                        <span style={{ fontWeight: 'bold' }}>이름</span> :{' '}
                        {customerInfo.name}
                      </Col>
                    </Row>
                    <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                      <Col span={24}>
                        <span style={{ fontWeight: 'bold' }}>전화번호</span> :{' '}
                        {customerInfo.telNumber}
                      </Col>
                    </Row>
                    <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                      <Col span={24}>
                        <Button
                          type="primary"
                          onClick={() => this.applyCustomerInfo(customerInfo)}
                        >
                          적용
                        </Button>{' '}
                      </Col>
                    </Row>
                  </Panel>
                );
              })}
            </Collapse>
          </Modal>
          <Row>
            <Col offset={6} span={12} className="bor-right bor-left">
              <Row className="pd10 bor-bottom">
                <Col span={24} className="mrb10">
                  <Button
                    type="primary"
                    className="text bold font-em2"
                    onClick={() => this.openModal()}
                  >
                    고객정보
                  </Button>
                </Col>
                <Col span={6} className="mrb5">
                  도시가스
                </Col>
                <Col span={18} className="mrb5">
                  <Select
                    placeholder="도시가스를 선택해주세요"
                    style={{ width: '100%', textAlign: 'left' }}
                    value={companyId}
                    onChange={value => chatStore.changeCompanyId(value)}
                  >
                    {companyCodeList.map(companyInfo => {
                      return (
                        <Option value={companyInfo.value}>
                          {companyInfo.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
                <Col span={6} className="mrb5">
                  가스앱 id
                </Col>
                <Col span={18} className="mrb5">
                  <Input
                    style={{ width: '100%' }}
                    placeholder="가스앱 id를 입력해주세요"
                    allowClear
                    value={appId}
                    onChange={event =>
                      chatStore.changeAppId(event.target.value)
                    }
                    onPressEnter={this.onPressEnter}
                  />
                </Col>
                <Col span={6} className="mrb5">
                  이름
                </Col>
                <Col span={18} className="mrb5">
                  <Input
                    style={{ width: '100%' }}
                    placeholder="사용자 이름을 입력해주세요"
                    allowClear
                    value={name}
                    onChange={event => chatStore.changeName(event.target.value)}
                    onPressEnter={this.onPressEnter}
                  />
                </Col>
                <Col span={6} className="mrb5">
                  핸드폰번호
                </Col>
                <Col span={18} className="mrb5">
                  <Input
                    style={{ width: '100%' }}
                    placeholder="핸드폰번호를 입력해주세요"
                    allowClear
                    value={telNumber}
                    onChange={event =>
                      chatStore.changeTelNumber(event.target.value)
                    }
                  />
                </Col>
                <Col span={18} offset={6}>
                  {connectedSocket ? (
                    <Button
                      block
                      type="danger"
                      className="bold"
                      onClick={() => chatStore.disconnect()}
                    >
                      연결끊기
                    </Button>
                  ) : (
                    <Button
                      block
                      type="primary"
                      className="bold"
                      onClick={() => chatStore.connectSocket()}
                      disabled={disabledButton}
                    >
                      로그인
                    </Button>
                  )}
                </Col>
                <Col
                  span={18}
                  offset={6}
                  className={connectedSocket ? '' : 'none'}
                >
                  <Button
                    block
                    className="bold mrt5"
                    onClick={() => chatStore.end()}
                  >
                    종료
                  </Button>
                </Col>
                <Col
                  span={18}
                  offset={6}
                  className={connectedSocket ? '' : 'none'}
                >
                  <Button
                    block
                    className="bold mrt5"
                    onClick={() => chatStore.review(1)}
                  >
                    리뷰
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ position: 'relative' }}>
                  <React.Fragment>
                    <MessageList
                      clientHeight={listClientHeight}
                      messageList={messageList}
                      searchValue={''}
                    />
                  </React.Fragment>
                </Col>
                <Col span={24}>
                  <SendMessageInput />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Main;
