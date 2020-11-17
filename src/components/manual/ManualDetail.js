import React from 'react';
import { Row, Col, Button, Image } from 'antd';

class ManualDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ position: 'relative' }} className="none2">
        <Row style={{ padding: 20, borderBottom: '1px solid #e0dcdc' }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button shape="round" size="small" onClick={this.openHitoryPopup}>
              챗봇대화
            </Button>{' '}
            <Button shape="round" size="small" onClick={this.openTalkMovePopup}>
              상담하기
            </Button>{' '}
            <Button shape="round" size="small" onClick={this.openAlertPopup}>
              이관
            </Button>{' '}
            <Button shape="round" size="small" onClick={this.openConfirmPopup}>
              종료
            </Button>
          </Col>
        </Row>
        <div
          style={{
            overflowY: 'scroll',
            height: document.documentElement.clientHeight - 65
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 20,
              top: document.documentElement.clientHeight / 2 - 65,
              color: '#fff',
              zIndex: 5,
              fontSize: 80
            }}
          >
            ❮
          </span>
          <span
            style={{
              position: 'absolute',
              right: 20,
              top: document.documentElement.clientHeight / 2 - 65,
              color: '#fff',
              zIndex: 5,
              fontSize: 80
            }}
          >
            ❯
          </span>
          <Row>
            <Image
              width={'100%'}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </Row>
          <Row>
            <Image
              width={'100%'}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </Row>
        </div>
      </div>
    );
  }
}

export default ManualDetail;
