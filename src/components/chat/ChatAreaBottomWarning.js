import React from 'react';
import { Button, Typography } from 'antd';
const Title = Typography.Title;

class ChatAreaBottomWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          height: 400,
          overflowY: 'scroll'
        }}
        className="pd15"
      >
        <div className="mrb10">
          <Title
            level={4}
            className="text mr0"
            onClick={this.openManualTagListPopup}
          >
            욕설 및 비속어 사용 경고
          </Title>
        </div>
        <div className="mrb10">
          <div
            style={{
              width: '80%',
              padding: '11px 15px 9px',
              position: 'relative'
            }}
            className="inblock left red mrb10"
          >
            asdasdasa asdasdasdaasda asdas dasad sa dasd asd asds sd
            1123123123123
          </div>
          <div
            style={{
              width: '20%'
            }}
            className="inblock right"
          >
            <Button className="bg-basic color-white bold">전송</Button>
          </div>
        </div>
        <div className="mrb10">
          <div
            style={{
              width: '80%',
              padding: '11px 15px 9px',
              position: 'relative'
            }}
            className="inblock left red mrb10"
          >
            asdasdasa asdasdasdaasda asdas dasad sa dasd asd asds sd
            1123123123123
          </div>
          <div
            style={{
              width: '20%'
            }}
            className="inblock right"
          >
            <Button className="bg-basic color-white bold">전송</Button>
          </div>
        </div>
        <div>
          <Title
            level={4}
            className="text mr0"
            onClick={this.openManualTagListPopup}
          >
            욕설 및 비속어 사용 경고
          </Title>
        </div>
        <div
          style={{
            marginBottom: 10
          }}
        >
          <div
            style={{
              width: '80%',
              display: 'inline-block',
              textAlign: 'left',
              padding: '11px 15px 9px',
              color: 'red',
              marginBottom: 10,
              position: 'relative'
            }}
          >
            asdasdasa asdasdasdaasda asdas dasad sa dasd asd asds sd
            1123123123123
          </div>
          <div
            style={{
              width: '20%',
              display: 'inline-block',
              textAlign: 'right'
            }}
          >
            <Button className="bg-basic color-white bold">전송</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatAreaBottomWarning;
