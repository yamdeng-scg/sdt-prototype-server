import React from 'react';
import { Card } from 'antd';

class MemberSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mrb20">
        <div className="none-border stats-box-shadow">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">총 생성 계정</div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                상담권한부여 계정
              </div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                상담상태 계정
              </div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">관리자 계정</div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default MemberSummary;
