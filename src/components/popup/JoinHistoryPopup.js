import React from 'react';
import { Row, Col, Collapse } from 'antd';
import MessageList from '../chat/MessageList';
const { Panel } = Collapse;

class JoinHistoryPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ paddingTop: 30 }}>
        <Row
          style={{
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center',
            paddingBottom: 10
          }}
        >
          <Col span={24}>과거 채팅상담 기록</Col>
        </Row>
        <div style={{ maxHeight: 700, overflowY: 'scroll' }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header={
                <div>
                  <span style={{ fontWeight: 'bold' }}>등록일</span> :
                  YYYY-MM-DD 00:00:00
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  />
                  |
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    담당자
                  </span>{' '}
                  : 안용성
                  <div>
                    * 주요문의유형
                    <div>
                      <span
                        style={{
                          backgroundColor: '#d5d0d0',
                          borderRadius: 10,
                          padding: 5,
                          display: 'inline-block',
                          marginRight: 5
                        }}
                      >
                        #자가검침
                      </span>{' '}
                      <span
                        style={{
                          backgroundColor: '#d5d0d0',
                          borderRadius: 10,
                          padding: 5,
                          display: 'inline-block',
                          marginRight: 5
                        }}
                      >
                        #캐시
                      </span>{' '}
                    </div>
                  </div>
                </div>
              }
              key="1"
            >
              <div>
                <MessageList />
              </div>
            </Panel>
            <Panel
              header={
                <div>
                  <span style={{ fontWeight: 'bold' }}>등록일</span> :
                  YYYY-MM-DD 00:00:00
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  />
                  |
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    담당자
                  </span>{' '}
                  : 안용성
                </div>
              }
              key="2"
            >
              <div>
                <MessageList />
              </div>
            </Panel>
            <Panel
              header={
                <div>
                  <span style={{ fontWeight: 'bold' }}>등록일</span> :
                  YYYY-MM-DD 00:00:00
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  />
                  |
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    담당자
                  </span>{' '}
                  : 안용성
                </div>
              }
              key="3"
            >
              <div>
                <MessageList />
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default JoinHistoryPopup;
