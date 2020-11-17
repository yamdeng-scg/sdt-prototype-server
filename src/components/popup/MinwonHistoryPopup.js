import React from 'react';
import { Row, Col, Input, Collapse } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

class MinwonHistoryPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>민원 등록 기록</Col>
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
        <div style={{ maxHeight: 500, overflowY: 'scroll' }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header={
                <div>
                  <span className="bold">등록일</span> : YYYY-MM-DD 00:00:00
                  <span className="bold inblock mrl20" />|
                  <span className="bold inblock mrl20">담당자</span> : 안용성
                </div>
              }
              key="1"
            >
              <div>
                * 요금 &gt; 요금확인 &gt; <span className="bold">상세</span>
              </div>
              <div className="mrl5">asdasdasd</div>
            </Panel>
            <Panel
              header={
                <div>
                  <span className="bold">등록일</span> : YYYY-MM-DD 00:00:00
                  <span className="bold inblock mrl20" />|
                  <span className="bold inblock mrl20">담당자</span> : 안용성
                </div>
              }
              key="2"
            >
              <div>
                * 요금 &gt; 요금확인 &gt; <span className="bold">상세</span>
              </div>
              <div className="mrl5">asdasdasd</div>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default MinwonHistoryPopup;
