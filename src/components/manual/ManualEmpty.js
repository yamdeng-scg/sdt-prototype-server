import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
const Title = Typography.Title;

class ManualEmpty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ position: 'relative' }} className="none2">
        <Row className="pd15 bor-bottom">
          <Col span={24} className="left">
            <Button
              shape="round"
              className="bold bg-basic color-white font-em1"
              onClick={this.openHitoryPopup}
            >
              등록
            </Button>{' '}
          </Col>
        </Row>
        <div
          style={{
            overflowY: 'scroll',
            height: document.documentElement.clientHeight - 65
          }}
          className="center mrt30"
        >
          <Title
            level={3}
            className="text mr0"
            onClick={this.openManualTagListPopup}
          >
            상담 도우미 매뉴얼입니다
          </Title>
        </div>
      </div>
    );
  }
}

export default ManualEmpty;
