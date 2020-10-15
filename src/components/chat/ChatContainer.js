import React from 'react';
import RoomList from './RoomList';
import CurrentUserInfo from './CurrentUserInfo';
import ChatAreaContainer from './ChatAreaContainer';
import ContractAreaContainer from './ContractAreaContainer';

class ChatContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <RoomList />
        <CurrentUserInfo />
        <ChatAreaContainer />
        <ContractAreaContainer />
      </div>
    );
  }
}

export default ChatContainer;
