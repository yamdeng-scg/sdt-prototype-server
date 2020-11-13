import React from 'react';
import { Row, Col } from 'antd';

class AlertPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ paddingTop: 30 }}>
        <Row
          style={{
            textAlign: 'center',
            paddingBottom: 10,
            marginBottom: 10,
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Col span={24}>상담 이관</Col>
        </Row>
        <Row style={{ textAlign: 'center', marginBottom: 10 }}>
          <Col span={24}>이 상담채팅을 어디로 이관하시겠습니까?</Col>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Col
            span={24}
            style={{
              backgroundColor: '#b5b1b1',
              padding: 10,
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            확인
          </Col>
        </Row>
      </div>
    );
  }
}

export default AlertPopup;
