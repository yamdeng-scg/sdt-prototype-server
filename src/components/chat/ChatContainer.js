import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import RoomList from './RoomList';
import MessageContainer from './MessageContainer';
import ContractDeftail from './ContractDeftail';
import MyTodayStats from './MyTodayStats';

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
    let { currentRoomInfo } = chatStore;
    let detailMessgeComponent = null;
    if (!currentRoomInfo) {
      detailMessgeComponent = (
        <React.Fragment>
          <Col span={10}>
            <MessageContainer />
          </Col>
          <Col span={8}>
            <ContractDeftail />
          </Col>
        </React.Fragment>
      );
    } else {
      detailMessgeComponent = (
        <Col span={18}>
          <MyTodayStats />
        </Col>
      );
    }
    return (
      <Row style={{ height: '100%' }}>
        <Col span={6}>
          <RoomList />
        </Col>
        {detailMessgeComponent}
      </Row>
    );
  }
}

export default ChatContainer;
