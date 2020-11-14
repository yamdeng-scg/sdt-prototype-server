import React from 'react';
import { Row, Col, Select, Input } from 'antd';
const Option = Select.Option;
const { TextArea } = Input;

class BlackCustomerPopup extends React.Component {
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
          <Col span={24}>관심고객 설정</Col>
        </Row>
        <div style={{ padding: 10 }}>
          <Row style={{ marginBottom: 10 }}>
            <Col span={4} style={{ textAlign: 'center' }}>
              지정사유
            </Col>
            <Col span={20}>
              {' '}
              <Input style={{ width: '100%' }} />
            </Col>
          </Row>
          <Row>
            <Col span={4} style={{ textAlign: 'center' }}>
              추가 메모
            </Col>
            <Col span={20}>
              <TextArea autoSize={false}></TextArea>
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
            취소
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

export default BlackCustomerPopup;
