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
      <div style={{ position: 'relative', paddingRight: 60 }}>
        <TextArea autoSize={true} className="bg-white inblock w100" />{' '}
        <Button
          className="bg-basic color-white bold"
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        >
          전송
        </Button>
      </div>
    );
  }
}

export default SendMessageInput;
