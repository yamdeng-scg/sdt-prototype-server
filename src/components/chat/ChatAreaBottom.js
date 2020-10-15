import React from 'react';
import ChatAreaBottomReplySearch from './ChatAreaBottomReplySearch';
import ChatAreaBottomFav from './ChatAreaBottomFav';
import ChatAreaBottomLink from './ChatAreaBottomLink';
import ChatAreaBottomWarning from './ChatAreaBottomWarning';

class ChatAreaBottom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ChatAreaBottomReplySearch />
        <ChatAreaBottomFav />
        <ChatAreaBottomLink />
        <ChatAreaBottomWarning />
      </div>
    );
  }
}

export default ChatAreaBottom;
