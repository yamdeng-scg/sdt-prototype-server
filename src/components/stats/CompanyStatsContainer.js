import React from 'react';
import { Row, Col, DatePicker, Button, Typography } from 'antd';
import TalkIngSummary from './TalkIngSummary';
import MemberUnitStatsList from './MemberUnitStatsList';
import TagTypeRankList from './TagTypeRankList';
import TalkUseHistoryChart from './TalkUseHistoryChart';
import MemberReviewChart from './MemberReviewChart';
import UseHistorySummary from './UseHistorySummary';
import TalkTimeSummary from './TalkTimeSummary';
const { Title } = Typography;
const { RangePicker } = DatePicker;

class CompanyStatsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={12} className="pd10">
            <Row>
              <Col span={24}>
                <div className="bor-bottom mrb20">
                  <Row>
                    <Col span={12}>
                      <Title level={3} className="inblock">
                        통계
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
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <RangePicker style={{ width: '70%' }} /> {'   '}
                <Button>검색</Button>
              </Col>
            </Row>
            <Row style={{ height: 500, overflowY: 'scroll' }}>
              <Col span={24} className="pd10">
                <TalkIngSummary />
              </Col>
              <Col span={24}>
                <UseHistorySummary />
              </Col>
              <Col span={24}>상담처리 분석 TalkCloseummary</Col>
              <Col style={{ borderBottom: '1px solid #f0f0f0' }} span={24}>
                <TalkTimeSummary />
              </Col>
              <Col span={24}>
                <MemberUnitStatsList />
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ padding: 10 }}>
            <Row>
              <Col span={24}>타이틀: border bottom 줌</Col>
            </Row>
            <Row style={{ height: 500, overflowY: 'scroll' }}>
              <Col span={24}>
                <TalkUseHistoryChart />
              </Col>
              <Col span={24}>
                <TagTypeRankList />
              </Col>
              <Col span={24}>
                <MemberReviewChart />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompanyStatsContainer;
