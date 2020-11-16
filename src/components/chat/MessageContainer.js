import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Input } from 'antd';
import {
  CloseOutlined,
  UpCircleTwoTone,
  DownCircleTwoTone
} from '@ant-design/icons';
import MessageList from './MessageList';
import SendMessageInput from './SendMessageInput';
import ChatAreaBottom from './ChatAreaBottom';
import MessageListTop from './MessageListTop';

@withRouter
@inject('appStore', 'uiStore')
@observer
class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let uiStore = this.props.uiStore;
    let { clientHeight } = uiStore;
    return (
      <div style={{ position: 'relative' }}>
        <MessageListTop />
        <Row>
          <Col span={24} style={{ position: 'relative', padding: '0px 5px' }}>
            <React.Fragment>
              <MessageList clientHeight={clientHeight - 740} />
              {/* 버튼 3개 */}
              <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <Button type="danger" shape="circle" size="large">
                  검색
                </Button>{' '}
                <Button type="danger" shape="circle" size="large">
                  이관
                </Button>{' '}
                <Button type="danger" shape="circle" size="large">
                  종료
                </Button>
              </div>
              {/* 대화검색 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '0px 10px',
                  marginBottom: 5,
                  zIndex: 10,
                  display: 'none'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '13px 13px 13px 13px',
                    border: '1px solid #cac8c8',
                    padding: 5
                  }}
                >
                  <Row style={{ marginBottom: 5 }}>
                    <Col span={8} offset={8} style={{ textAlign: 'center' }}>
                      대화내용 검색
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <CloseOutlined />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Input style={{ width: '85%' }} allowClear />{' '}
                      <UpCircleTwoTone style={{ fontSize: 20 }} /> {'  '}
                      <DownCircleTwoTone style={{ fontSize: 20 }} />
                    </Col>
                  </Row>
                </div>
              </div>
            </React.Fragment>
          </Col>
          <Col span={24}>
            <SendMessageInput />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ChatAreaBottom />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MessageContainer;
