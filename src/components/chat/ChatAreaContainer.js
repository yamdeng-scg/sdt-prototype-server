import React from 'react';
import { Row, Col } from 'antd';
import MessageContainer from './MessageContainer';
import ContractAreaContainer from './ContractAreaContainer';
import CurrentUserInfo from './CurrentUserInfo';

class ChatAreaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <CurrentUserInfo />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <MessageContainer />
          </Col>
          <Col span={12}>
            <ContractAreaContainer />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatAreaContainer;
