import React from 'react';
import { Row, Col, Input, Collapse } from 'antd';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

class MinwonHistoryPopup extends React.Component {
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
          <Col span={24}>민원 등록 기록</Col>
        </Row>
        <Row>
          <Col span={12}>
            고객정보: 홍길동 ID{' '}
            <span style={{ fontWeight: 'bold' }}>chatID</span>
            <br />
            {'    '}
            <span>최근 1년간 연동 내역을 확인하실수 있습니다</span>
          </Col>
          <Col span={12} style={{ padding: 5 }}>
            <Input
              placeholder="input search text"
              enterButton={null}
              allowClear
              size="large"
              suffix={
                <SearchOutlined
                  style={{
                    fontSize: 16,
                    color: '#1890ff'
                  }}
                />
              }
            />
          </Col>
        </Row>
        <div>
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
                </div>
              }
              key="1"
            >
              <div>
                * 요금 &gt; 요금확인 &gt;{' '}
                <span style={{ fontWeight: 'bold' }}>상세</span>
              </div>
              <div>asdasdasd</div>
            </Panel>
            <Panel header="This is panel header 2" key="2">
              <div>{'* 요금 > 요금확인 > 상세'}</div>
              <div>asdasdasd</div>
            </Panel>
            <Panel header="This is panel header 3" key="3">
              <div>{'* 요금 > 요금확인 > 상세'}</div>
              <div>asdasdasd</div>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default MinwonHistoryPopup;
