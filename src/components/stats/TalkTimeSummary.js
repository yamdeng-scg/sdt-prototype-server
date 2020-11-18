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
        <div className="text font-em6 bold mrb5 mrl5">나의 상담 시간 분석</div>
        <div className="none-border stats-box-shadow">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid4">
              <div className="center font-em4 text bold mrb5">
                최장 고객 대기시간
              </div>
              <div className="center font-em4 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em4 text bold mrb5">
                최장 고객 대기시간
              </div>
              <div className="center font-em4 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em4 text bold mrb5">
                최장 고객 대기시간
              </div>
              <div className="center font-em4 color-basic bold">
                0시 0분 0초
              </div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em4 text bold mrb5">
                최장 고객 대기시간
              </div>
              <div className="center font-em4 color-basic bold">
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
