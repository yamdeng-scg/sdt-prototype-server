import React from 'react';
import { Row, Col } from 'antd';

class AlertPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>상담 이관</Col>
        </Row>
        <Row className="center pd-top10 mrb10">
          <Col span={24}>이 상담채팅을 어디로 이관하시겠습니까?</Col>
        </Row>
        <Row className="center">
          <Col span={24} className="pd10 bold okbtn">
            확인
          </Col>
        </Row>
      </div>
    );
  }
}

export default AlertPopup;
