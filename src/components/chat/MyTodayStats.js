import React from 'react';
import { Button, Row, Col, Typography } from 'antd';

import TalkIngSummary from '../stats/TalkIngSummary';
import TalkTimeSummary from '../stats/TalkTimeSummary';
const { Title } = Typography;

class MyTodayStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd20">
        <div className="bor-bottom mrb20">
          <Row>
            <Col span={12}>
              <Title level={3} className="inblock">
                상담 도우미
              </Title>
              <span className="inblock mrl15 text-under bold">
                YYYY.MM.DD 업데이트
              </span>
            </Col>
            <Col span={12} className="right">
              <Button className="bold bg-basic color-white font-em1">
                자세히보기
              </Button>
            </Col>
          </Row>
        </div>
        {/* 나의 상담 요약 */}
        <TalkIngSummary />
        {/* 나의 상담 시간 분석 */}
        <TalkTimeSummary />
      </div>
    );
  }
}

export default MyTodayStats;
