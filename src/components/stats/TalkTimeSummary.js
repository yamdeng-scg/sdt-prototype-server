import React from 'react';
import { Card } from 'antd';

class TalkTimeSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="text font-em4 bold mrb10 mrl5">나의 상담시간 분석</div>
        <div className="none-border stats-box-shadow">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                최장 고객 대기시간
              </div>
              <div className="center font-em3 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                최장 상담시간
              </div>
              <div className="center font-em3 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                평균 고객 대기시간
              </div>
              <div className="center font-em3 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                평균 상담시간
              </div>
              <div className="center font-em3 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default TalkTimeSummary;
