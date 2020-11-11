import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import RoomList from './RoomList';

@withRouter
@inject('chatStore')
@observer
class ChatContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { chatStore } = this.props;
    let { chatCustomerInfo } = chatStore;
    return (
      <Row style={{ height: '100%' }}>
        <Col span={6}>
          <RoomList />
        </Col>
        <Col span={18}>{chatCustomerInfo ? null : null}</Col>
      </Row>
    );
  }
}

export default ChatContainer;
