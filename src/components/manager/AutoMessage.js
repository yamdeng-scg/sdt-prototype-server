import React from 'react';
import { Button, Row, Col, Input } from 'antd';
const { TextArea } = Input;

class AutoMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          height: document.documentElement.clientHeight - 104,
          overflowY: 'scroll'
        }}
      >
        <div style={{ borderBottom: '1px solid gray' }}>
          자동 메시지 관리 : bottomBorder
        </div>
        <div style={{ borderBottom: '1px solid gray' }}>
          <div>
            신규 대화 시작 인사메시지 <Button>추가</Button>
          </div>
          <div>
            고객이 신규 상담 채팅 진입 시, 등록한 메시지 중 랜덤으로 자동
            전송됩니다.
          </div>
          <Row>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ borderBottom: '1px solid gray' }}>
          <div>
            신규 대화 시작 인사메시지 <Button>추가</Button>
          </div>
          <div>
            고객이 신규 상담 채팅 진입 시, 등록한 메시지 중 랜덤으로 자동
            전송됩니다.
          </div>
          <Row>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ borderBottom: '1px solid gray' }}>
          <div>
            신규 대화 시작 인사메시지 <Button>추가</Button>
          </div>
          <div>
            고객이 신규 상담 채팅 진입 시, 등록한 메시지 중 랜덤으로 자동
            전송됩니다.
          </div>
          <Row>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
            <Col span={12} style={{ padding: 10, marginBottom: 5 }}>
              <div style={{ textAlign: 'right' }}>왼쪽 버튼</div>
              <div className="focus-textarea">
                <TextArea
                  autoSize={true}
                  style={{
                    backgroundColor: '#d1d0d0',
                    position: 'inline-block',
                    borderRadius: 10,
                    minHeight: 70
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AutoMessage;
