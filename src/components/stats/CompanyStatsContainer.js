import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, DatePicker, Button, Typography } from 'antd';
import TalkIngSummary from './TalkIngSummary';
import MemberUnitStatsList from './MemberUnitStatsList';
import TagTypeRankList from './TagTypeRankList';
import TalkUseHistoryChart from './TalkUseHistoryChart';
import MemberReviewChart from './MemberReviewChart';
import UseHistorySummary from './UseHistorySummary';
import TalkTimeSummary from './TalkTimeSummary';
import TalkCloseummary from './TalkCloseummary';
import Constant from '../../config/Constant';
const { Title } = Typography;
const { RangePicker } = DatePicker;

@withRouter
@inject('appStore', 'uiStore')
@observer
class CompanyStatsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.uiStore.changeSideBarSelectMenuKName(
      Constant.SIDE_BAR_MENU_STATS
    );
  }

  render() {
    let { uiStore } = this.props;
    let { clientHeight } = uiStore;
    return (
      <div>
        <Row>
          <Col span={12} className="pd10 bor-right">
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
              <Col span={24} className="right">
                <RangePicker style={{ width: '70%' }} /> {'   '}
                <Button>검색</Button>
              </Col>
            </Row>
            <Row style={{ height: clientHeight - 170, overflowY: 'scroll' }}>
              <Col span={24} className="pd10">
                <TalkIngSummary />
              </Col>
              <Col span={24} className="pd10">
                <UseHistorySummary />
              </Col>
              <Col span={24} className="pd10">
                <TalkCloseummary />
              </Col>
              <Col className="mrb20 pd10" span={24}>
                <TalkTimeSummary />
              </Col>
              <Col span={24}>
                <MemberUnitStatsList />
              </Col>
            </Row>
          </Col>
          <Col span={12} className="pd10">
            <Row className="bor-bottom mrb10 pd-top10 pd-bottom10">
              <Col span={24}>
                <div>
                  <Row>
                    <Col span={24} className="right">
                      <div className="inblock mrl15 text-under bold">
                        YYYY.MM.DD 업데이트
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row style={{ height: clientHeight - 120, overflowY: 'scroll' }}>
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
