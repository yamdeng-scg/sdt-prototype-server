import React from 'react';
import { Row, Col } from 'antd';

class CompanyStatsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={24}>통계 YYYY.MM.DD 업데이트 : border bottom 줌</Col>
            </Row>
            <Row>
              <Col span={24}>
                우측에 날짜 컴포넌트와 검색 버튼 : border bottom 줌
              </Col>
            </Row>
            <Row>
              <Col span={24}>상담현황 요약 TalkIngSummary</Col>
            </Row>
            <Row>
              <Col span={24}>상담처리 분석 TalkCloseummary</Col>
            </Row>
            <Row>
              <Col span={24}>상담시간 분석 TalkTimeSummary</Col>
            </Row>
            <Row>
              <Col span={24}>상담사별 분석 MemberUnitStatsList</Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>타이틀: border bottom 줌</Col>
            </Row>
            <Row>
              <Col span={24}>상담 이용 추이 TalkUseHistoryChart</Col>
            </Row>
            <Row>
              <Col span={24}>문의 유형별 통계 TagTypeRankList</Col>
            </Row>
            <Row>
              <Col span={24}>고객 만족도 MemberReviewChart</Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompanyStatsContainer;
