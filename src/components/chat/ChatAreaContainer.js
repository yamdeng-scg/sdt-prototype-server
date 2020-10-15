import React from 'react';
import MessageList from './MessageList';
import SendMessageInput from './SendMessageInput';
import ChatAreaBottom from './ChatAreaBottom';

class ChatAreaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <MessageList />
        <SendMessageInput />
        <ChatAreaBottom />
      </div>
    );
  }
}

export default ChatAreaContainer;
