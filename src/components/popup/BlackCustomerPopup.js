import React from 'react';
import { Row, Col, Input } from 'antd';
const { TextArea } = Input;

class BlackCustomerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>관심고객 설정</Col>
        </Row>
        <div className="pd10">
          <Row className="mrb10">
            <Col span={4} className="center bold">
              지정사유
            </Col>
            <Col span={20}>
              {' '}
              <Input style={{ width: '100%' }} />
            </Col>
          </Row>
          <Row>
            <Col span={4} className="center bold">
              추가 메모
            </Col>
            <Col span={20}>
              <TextArea autoSize={false} />
            </Col>
          </Row>
        </div>
        <Row className="center">
          <Col span={12} className="pd10 bold cancelbtn">
            취소
          </Col>
          <Col span={12} className="pd10 bold okbtn">
            확인
          </Col>
        </Row>
      </div>
    );
  }
}

export default BlackCustomerPopup;
