import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Select, Button } from 'antd';
const { Option } = Select;

@inject('alertModalStore')
@observer
class TalkMovePopup extends React.Component {
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
        <Row className="center pd-top10">
          <Col span={24}>이 상담채팅을 어디로 이관하시겠습니까?</Col>
        </Row>
        <Row className="center mrb10">
          <Col span={24} className="pd10">
            <Select
              defaultValue="lucy"
              className="left"
              style={{ width: '100%' }}
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
          <Col span={12}>
            <Button block className="pd10 bold cancelbtn">
              취소
            </Button>
          </Col>
          <Col span={12}>
            <Button block className="pd10 bold okbtn">
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TalkMovePopup;
