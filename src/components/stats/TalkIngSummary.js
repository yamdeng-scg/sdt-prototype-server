import React from 'react';
import { Card } from 'antd';

class TalkIngSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mrb20">
        <div className="text font-em6 bold mrb5 mrl5">나의 상담 요약</div>
        <div className="none-border stats-box-shadow">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid5">
              <div className="center font-em4 text bold mrb5">대기</div>
              <div className="center font-em4 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em4 text bold mrb5">대기</div>
              <div className="center font-em4 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em4 text bold mrb5">대기</div>
              <div className="center font-em4 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em4 text bold mrb5">대기</div>
              <div className="center font-em4 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em4 text bold mrb5">대기</div>
              <div className="center font-em4 color-basic bold">0건</div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default TalkIngSummary;
