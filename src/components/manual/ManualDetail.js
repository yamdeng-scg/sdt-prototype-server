import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Image } from 'antd';

@withRouter
@inject('appStore', 'uiStore')
@observer
class ManualDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { uiStore } = this.props;
    return (
      <div style={{ position: 'relative' }} className="none2">
        <Row className="pd15 bor-bottom">
          <Col span={24} className="left">
            <Button
              shape="round"
              className="bold bg-basic color-white font-em1"
              onClick={() => uiStore.goPage('/manual/create')}
            >
              등록
            </Button>{' '}
            <Button
              shape="round"
              className="bold bg-basic color-white font-em1"
              onClick={this.openTalkMovePopup}
            >
              수정
            </Button>{' '}
            <Button
              shape="round"
              className="bold bg-basic color-white font-em1"
              onClick={this.openAlertPopup}
            >
              삭제
            </Button>{' '}
            <Button
              shape="round"
              className="bold bg-basic color-white font-em1"
              onClick={this.openConfirmPopup}
            >
              확대보기
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
