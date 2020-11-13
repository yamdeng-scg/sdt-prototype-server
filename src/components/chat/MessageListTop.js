import React from 'react';
import { Row, Col, Button } from 'antd';
import ModalType from '../../config/ModalType';
import ModalService from '../../services/ModalService';

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

  render() {
    return (
      <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 20 }}>
        <p onClick={this.openBlackCustomerPopup}>홍길동</p>
        <Row>
          <Col span={12} style={{ textAlign: 'left' }}>
            asdsads
          </Col>
          <Col
            span={12}
            style={{ textAlign: 'right' }}
            onClick={this.openMinwonAddPopup}
          >
            1213123
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{ padding: 15 }}>
            <Button block>as</Button>
          </Col>
          <Col span={12} style={{ padding: 15 }}>
            <Button block>as</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MessageListTop;
