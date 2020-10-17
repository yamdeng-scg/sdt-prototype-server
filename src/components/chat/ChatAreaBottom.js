import React from 'react';
import ChatAreaBottomReplySearch from './ChatAreaBottomReplySearch';
import ChatAreaBottomFav from './ChatAreaBottomFav';
import ChatAreaBottomLink from './ChatAreaBottomLink';
import ChatAreaBottomWarning from './ChatAreaBottomWarning';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

@withRouter
@inject('chatStore')
@observer
class ChatAreaBottom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { chatStore } = this.props;
    let { bottmActiveTabIndex } = chatStore;
    let applyBottomTabComponent = <ChatAreaBottomReplySearch />;
    if (bottmActiveTabIndex === 1) {
      applyBottomTabComponent = <ChatAreaBottomFav />;
    } else if (bottmActiveTabIndex === 2) {
      applyBottomTabComponent = <ChatAreaBottomLink />;
    } else if (bottmActiveTabIndex === 3) {
      applyBottomTabComponent = <ChatAreaBottomWarning />;
    }
    return (
      <div>
        {applyBottomTabComponent}
        <Row style={{ borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(0);
            }}
          >
            답변검색
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(1);
            }}
          >
            즐겨찾기
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(2);
            }}
          >
            화면링크
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(3);
            }}
          >
            경고메시지
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatAreaBottom;
