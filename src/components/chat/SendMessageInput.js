import React from 'react';
import { Input, Button } from 'antd';
const { TextArea } = Input;

class SendMessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <TextArea
          autoSize={false}
          style={{
            backgroundColor: '#fff'
          }}
        ></TextArea>{' '}
        <Button type="primary" shape="round" size="small">
          전송
        </Button>
      </div>
    );
  }
}

export default SendMessageInput;
