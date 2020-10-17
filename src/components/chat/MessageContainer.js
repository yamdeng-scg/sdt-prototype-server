import React from 'react';
import { Row, Col } from 'antd';
import MessageList from './MessageList';
import SendMessageInput from './SendMessageInput';
import ChatAreaBottom from './ChatAreaBottom';

class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Row>
          <Col span={24}>
            <MessageList />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <SendMessageInput />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ChatAreaBottom />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MessageContainer;
