import React from 'react';
import { Card } from 'antd';
import { RobotOutlined, UsergroupAddOutlined } from '@ant-design/icons';

class UseHistorySummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mrb20">
        <div className="text font-em4 bold mrb10 mrl5">나의 상담 시간 분석</div>
        <div className="none-border">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid2">
              <div className="center font-em2 text bold mrb5">
                챗봇 이용 고객
              </div>
              <div className="center">
                <UsergroupAddOutlined
                  style={{
                    fontSize: 40,
                    zIndex: 11,
                    margin: 0
                  }}
                  className="color-basic"
                />
                <span
                  className="color-basic"
                  style={{
                    fontSize: 40,
                    zIndex: 11,
                    margin: 0
                  }}
                >
                  120
                </span>
              </div>
            </Card.Grid>
            <Card.Grid className="grid2">
              <div className="center font-em2 text bold mrb5">
                채팅상담시스템 인입 고객
              </div>
              <div className="center">
                <RobotOutlined
                  style={{
                    fontSize: 40,
                    zIndex: 11,
                    margin: 0
                  }}
                  className="color-basic"
                />
                <span
                  className="color-basic"
                  style={{
                    fontSize: 40,
                    zIndex: 11,
                    margin: 0
                  }}
                >
                  120
                </span>
              </div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default UseHistorySummary;
