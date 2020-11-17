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
      <div style={{ height: 500 }}>
        <Row className="center bor-top bor-bottom center mrt5">
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(0);
            }}
            className="pd10 bold font-em2 text-under color-basic"
          >
            답변검색
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(1);
            }}
            className="pd10 font-em1"
          >
            즐겨찾기
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(2);
            }}
            className="pd10 font-em1"
          >
            화면링크
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(3);
            }}
            className="pd10 font-em1"
          >
            경고메시지
          </Col>
        </Row>
        {applyBottomTabComponent}
      </div>
    );
  }
}

export default ChatAreaBottom;
