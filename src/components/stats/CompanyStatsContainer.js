import React from 'react';
import { Row, Col, DatePicker, Button } from 'antd';
import TalkIngSummary from './TalkIngSummary';
import MemberUnitStatsList from './MemberUnitStatsList';
import TagTypeRankList from './TagTypeRankList';
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
          <Col span={12} style={{ padding: 10 }}>
            <Row>
              <Col span={24}>통계 YYYY.MM.DD 업데이트 : border bottom 줌</Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <RangePicker style={{ width: '70%' }} /> {'   '}
                <Button>검색</Button>
              </Col>
            </Row>
            <Row style={{ height: 500, overflowY: 'scroll' }}>
              <Col span={24}>
                <TalkIngSummary />
              </Col>
              <Col span={24}>상담처리 분석 TalkCloseummary</Col>
              <Col style={{ borderBottom: '1px solid #f0f0f0' }} span={24}>
                상담시간 분석 TalkTimeSummary
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
            <Row>
              <Col span={24}>상담 이용 추이 TalkUseHistoryChart</Col>
              <Col span={24}>
                <TagTypeRankList />
              </Col>
              <Col span={24}>고객 만족도 MemberReviewChart</Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompanyStatsContainer;
