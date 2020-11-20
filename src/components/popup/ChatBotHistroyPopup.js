import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';
import moment from 'moment';

@inject('alertModalStore')
@observer
class ChatBotHistroyPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { modalData } = this.props;
    let { history } = modalData;
    history = history || [];
    return (
      <div className="pd-top15">
        <Row className="pd-bottom10 center bor-bottom text font-em2 bold">
          <Col span={24}>챗봇 대화</Col>
        </Row>
        <div className="pd20" style={{ maxHeight: 350, overflowY: 'scroll' }}>
          {history.map(info => {
            return (
              <Row style={{ marginBottom: 10 }}>
                <Col span={6} className="right pd-right20 color-basic bold">
                  {moment(info.t, 'YYYY-MM-DD HH:mm:ss').format('LT')}
                </Col>
                <Col span={18} className="left">
                  {info.m}
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ChatBotHistroyPopup;
