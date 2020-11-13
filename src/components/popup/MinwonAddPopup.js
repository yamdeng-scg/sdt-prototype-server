import React from 'react';
import { Row, Col } from 'antd';

class MinwonAddPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ paddingTop: 30 }}>
        <Row
          style={{
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center',
            paddingBottom: 10
          }}
        >
          <Col span={24}>민원 등록</Col>
        </Row>
        <div style={{ padding: 10 }}>
          <Row>
            <Col span={24}>
              <span style={{ fontWeight: 'bold' }}>민원등록 고객 : </span>
              홍길동님(ID XXX)
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span style={{ fontWeight: 'bold' }}>민원 검색</span>
            </Col>
            <Col span={16}>
              <span style={{ fontWeight: 'bold' }}>민원등록 고객 : </span>
            </Col>
          </Row>
        </div>
        <Row style={{ textAlign: 'center' }}>
          <Col
            span={12}
            style={{
              backgroundColor: '#b5b1b1',
              padding: 10,
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            확인
          </Col>
          <Col
            span={12}
            style={{
              backgroundColor: '#62aef1',
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

export default MinwonAddPopup;
