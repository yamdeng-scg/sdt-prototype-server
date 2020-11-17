import React from 'react';
import { Row, Col, Select } from 'antd';
const { Option } = Select;

class MemberStateChangePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>상담사 상태 변경</Col>
        </Row>
        <Row className="center">
          <Col span={24} className="pd10">
            <Select
              defaultValue="lucy"
              style={{ width: '100%' }}
              className="left"
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
        </Row>
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

export default MemberStateChangePopup;
