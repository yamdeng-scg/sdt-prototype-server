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
      <div style={{ position: 'relative' }}>
        <TextArea
          autoSize={false}
          style={{
            backgroundColor: '#fff',
            position: 'inline-block',
            width: '85%'
          }}
        />{' '}
        <Button
          type="primary"
          shape="round"
          size="small"
          style={{ position: 'absolute', bottom: 0, right: 32 }}
        >
          전송
        </Button>
      </div>
    );
  }
}

export default SendMessageInput;
