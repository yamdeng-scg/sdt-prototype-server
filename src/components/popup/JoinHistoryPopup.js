import React from 'react';
import { Row, Col, Collapse, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MessageList from '../chat/MessageList';
const { Panel } = Collapse;

class JoinHistoryPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>과거 채팅상담 기록</Col>
        </Row>
        <Row className="mrt15 mrb10">
          <Col span={12} className="pd-left10">
            <span className="bold font-em2">고객정보 :</span>{' '}
            <span className="font-em2">홍길동 ID</span>
            <span className="bold text text-under font-em2 inblock mrl5">
              chatID
            </span>
            <br />
            {'    '}
            <span>최근 1년간 연동 내역을 확인하실수 있습니다</span>
          </Col>
          <Col span={12} className="pd5">
            <Input
              placeholder="input search text"
              enterButton={null}
              allowClear
              size="large"
              suffix={
                <SearchOutlined
                  className="color-basic"
                  style={{
                    fontSize: 16
                  }}
                />
              }
            />
          </Col>
        </Row>
        <div style={{ maxHeight: 600, overflowY: 'scroll' }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header={
                <div>
                  YYYY-MM-DD 00:00:00 ~ YYYY-MM-DD 00:00:00
                  <span className="bold inblock mrl20" />|
                  <span className="bold inblock mrl20">담당자</span> : 안용성
                  <div className="mrt5">
                    * 주요문의유형
                    <div className="mrt5 mrl5">
                      <span
                        style={{
                          borderRadius: 10
                        }}
                        className="mrr5 inblock pd7 bg-basic color-white"
                      >
                        #자가검침
                      </span>{' '}
                      <span
                        style={{
                          borderRadius: 10
                        }}
                        className="mrr5 inblock pd7 bg-basic color-white"
                      >
                        #자가검침
                      </span>{' '}
                    </div>
                  </div>
                </div>
              }
              key="1"
            >
              <div>
                <MessageList clientHeight={300} />
              </div>
            </Panel>
            <Panel
              header={
                <div>
                  YYYY-MM-DD 00:00:00 ~ YYYY-MM-DD 00:00:00
                  <span className="bold inblock mrl20" />|
                  <span className="bold inblock mrl20">담당자</span> : 안용성
                  <div className="mrt5">
                    * 주요문의유형
                    <div className="mrt5 mrl5">
                      <span
                        style={{
                          borderRadius: 10
                        }}
                        className="mrr5 inblock pd7 bg-basic color-white"
                      >
                        #자가검침
                      </span>{' '}
                      <span
                        style={{
                          borderRadius: 10
                        }}
                        className="mrr5 inblock pd7 bg-basic color-white"
                      >
                        #자가검침
                      </span>{' '}
                    </div>
                  </div>
                </div>
              }
              key="2"
            >
              <div>
                <MessageList clientHeight={300} />
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default JoinHistoryPopup;
