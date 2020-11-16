import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import ModalType from '../../config/ModalType';
import ModalService from '../../services/ModalService';
const { Title } = Typography;

class MessageListTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openBlackCustomerPopup = this.openBlackCustomerPopup.bind(this);
  }

  openBlackCustomerPopup() {
    ModalService.openMiddlePopup(ModalType.BLACK_CUSTOMER_POPUP, {});
  }

  openMinwonAddPopup() {
    ModalService.openMiddlePopup(ModalType.MINWON_ADD_POPUP, {});
  }

  openMinwonHistoryPopup() {
    ModalService.openMiddlePopup(ModalType.MINWON_HISTORY_POPUP, {});
  }

  openJoinHistoryPopup() {
    ModalService.openMiddlePopup(ModalType.JOIN_HISTORY_POPUP, {});
  }

  render() {
    return (
      <div className="bor-bottom pd10">
        <Title
          level={3}
          className="text mr0"
          onClick={this.openBlackCustomerPopup}
        >
          <SmileOutlined className="color-basic" /> 홍길동
        </Title>
        <Row className="pd-left5 pd-right5 mrb10">
          <Col span={12}>
            <span className="font-em2">01073384183</span>
          </Col>
          <Col span={12} className="left" onClick={this.openMinwonAddPopup}>
            <span className="font-em2">ID : </span>
            <span className="font-em2 text-under">123</span>{' '}
            <Button>민원등록</Button>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="pd-left5 pd-right5">
            <Button block onClick={this.openMinwonHistoryPopup}>
              직전 챗봇대화
            </Button>
          </Col>
          <Col span={12} className="pd-left5 pd-right5">
            <Button block onClick={this.openJoinHistoryPopup}>
              과거 채팅상담 내역(5)
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MessageListTop;
