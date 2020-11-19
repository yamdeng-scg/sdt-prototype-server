import React from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import TalkIngSummary from '../stats/TalkIngSummary';
import TalkTimeSummary from '../stats/TalkTimeSummary';
import moment from 'moment';
const { Title } = Typography;

@withRouter
@inject('appStore', 'uiStore')
@observer
class MyTodayStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  moveStatsTotalPage = () => {
    let { uiStore } = this.props;
    uiStore.goPage('/stats');
  };

  render() {
    return (
      <div className="pd20">
        <div className="bor-bottom mrb20">
          <Row>
            <Col span={12}>
              <Title level={3} className="inblock">
                상담 도우미
              </Title>
              <span className="inblock mrl15 font-em1 bold">
                <span className="text-under inblock">
                  {moment().format('YYYY.MM.DD')}
                </span>{' '}
                업데이트
              </span>
            </Col>
            <Col span={12} className="right" onClick={this.moveStatsTotalPage}>
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
