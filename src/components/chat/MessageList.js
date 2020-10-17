import React from 'react';
import { Row, Col } from 'antd';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col span={24}>MessageList</Col>
      </Row>
    );
  }
}

export default MessageList;
