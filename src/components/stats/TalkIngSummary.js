import React from 'react';
import { Card } from 'antd';

class TalkIngSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // title oputerClassName
    // "newCount": 10,
    // "readyCount": 5,
    // "ingCount": 3,
    // "closeCount": 10,
    // "outCount": 0
    let {
      title,
      outerClassName,
      newCount,
      readyCount,
      ingCount,
      closeCount,
      outCount
    } = this.props;
    return (
      <div className={outerClassName ? outerClassName : 'mrb20'}>
        <div className="text font-em4 bold mrb10 mrl5">
          {title ? title : '나의 상담 요약'}
        </div>
        <div className="none-border stats-box-shadow">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid5">
              <div className="center font-em2 text bold mrb5">신규 접수</div>
              <div className="center font-em3 color-basic bold">
                {newCount || 0}건
              </div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em2 text bold mrb5">대기중</div>
              <div className="center font-em3 color-basic bold">
                {readyCount || 0}건
              </div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em2 text bold mrb5">진행중</div>
              <div className="center font-em3 color-basic bold">
                {ingCount || 0}건
              </div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em2 text bold mrb5">종료</div>
              <div className="center font-em3 color-basic bold">
                {closeCount || 0}건
              </div>
            </Card.Grid>
            <Card.Grid className="grid5">
              <div className="center font-em2 text bold mrb5">이탈</div>
              <div className="center font-em3 color-basic bold">
                {outCount || 0}건
              </div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default TalkIngSummary;
