import React from 'react';
import { Row, Col, Timeline } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

class TagTypeRankList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div>
          <Row>
            <Col span={18}>문의 유형별 통계</Col>
            <Col span={6}>2020.11.12</Col>
          </Row>
          <Row>
            <Col span={18}>문의 유형별 통계</Col>
            <Col span={6}>
              <Timeline>
                <Timeline.Item>2015-09-01</Timeline.Item>
                <Timeline.Item>2015-09-01</Timeline.Item>
                <Timeline.Item>2015-09-01</Timeline.Item>
                <Timeline.Item>2015-09-01</Timeline.Item>
                <Timeline.Item>2015-09-01</Timeline.Item>
                <Timeline.Item>2015-09-01</Timeline.Item>
                <Timeline.Item
                  dot={
                    <CheckCircleFilled
                      style={{ fontSize: '14px', color: '#1890ff' }}
                    />
                  }
                >
                  2015-09-01
                </Timeline.Item>
              </Timeline>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default TagTypeRankList;
