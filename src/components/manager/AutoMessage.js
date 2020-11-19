import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Row, Col, Input } from 'antd';
const { TextArea } = Input;

@withRouter
@inject('appStore', 'uiStore')
@observer
class AutoMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { clientHeight } = this.props.uiStore;
    return (
      <div>
        <div className="text font-em2 bold mrb10 bor-bottom pd-bottom10">
          자동 메시지 관리
        </div>
        <div
          style={{
            height: clientHeight - 120,
            overflowY: 'scroll'
          }}
        >
          <div className="bor-bottom">
            <div>
              <span className="bold font-em1">신규 대화 시작 인사메시지 </span>
              <Button className="bg-basic color-white bold">추가</Button>
            </div>
            <div className="red bold">
              * 고객이 신규 상담 채팅 진입 시, 등록한 메시지 중 랜덤으로 자동
              전송됩니다.
            </div>
            <Row>
              <Col span={12} className="mrb5 pd10">
                <div className="right mrb5">
                  <Button className="bg-basic color-white bold">취소</Button>{' '}
                  <Button className="bg-basic color-white bold">저장</Button>
                </div>
                <div className="focus-textarea">
                  <TextArea
                    autoSize={true}
                    style={{
                      borderRadius: 10,
                      minHeight: 70
                    }}
                    className="bg-gray inblock"
                  />
                </div>
              </Col>
              <Col span={12} className="mrb5 pd10">
                <div className="right mrb5">
                  <Button className="bg-basic color-white bold">취소</Button>{' '}
                  <Button className="bg-basic color-white bold">저장</Button>
                </div>
                <div className="focus-textarea">
                  <TextArea
                    autoSize={true}
                    style={{
                      borderRadius: 10,
                      minHeight: 70
                    }}
                    className="bg-gray inblock"
                  />
                </div>
              </Col>
              <Col span={12} className="mrb5 pd10">
                <div className="right mrb5">
                  <Button className="bg-basic color-white bold">취소</Button>{' '}
                  <Button className="bg-basic color-white bold">저장</Button>
                </div>
                <div className="focus-textarea">
                  <TextArea
                    autoSize={true}
                    style={{
                      borderRadius: 10,
                      minHeight: 70
                    }}
                    className="bg-gray inblock"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default AutoMessage;
