import React from 'react';
import { Row, Col } from 'antd';

class ChatBotHistroyPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="pd-bottom10 center bor-bottom">
          <Col span={24}>챗봇 대화</Col>
        </Row>
        <div className="pd20" style={{ maxHeight: 350, overflowY: 'scroll' }}>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} className="right pd-right20 color-basic bold">
              오후 10시30분
            </Col>
            <Col span={18} className="left">
              메시지
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} className="right pd-right20 color-basic bold">
              오후 10시30분
            </Col>
            <Col span={18} className="left">
              메시지
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} className="right pd-right20 color-basic bold">
              오후 10시30분
            </Col>
            <Col span={18} className="left">
              메시지
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} className="right pd-right20 color-basic bold">
              오후 10시30분
            </Col>
            <Col span={18} className="left">
              메시지
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ChatBotHistroyPopup;
