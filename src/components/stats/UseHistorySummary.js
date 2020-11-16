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
      <div>
        <div>나의 상담 시간 분석</div>
        <div className="none-border">
          <Card title={null} bordered={false}>
            <Card.Grid
              style={{
                width: '50%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>챗봇 이용 고객</div>
              <div style={{ textAlign: 'center' }}>
                <UsergroupAddOutlined
                  style={{
                    color: '#35bffd',
                    fontSize: 50,
                    zIndex: 11,
                    margin: 0
                  }}
                />
                <span
                  style={{
                    color: '#35bffd',
                    fontSize: 50,
                    zIndex: 11,
                    margin: 0
                  }}
                >
                  120
                </span>
              </div>
            </Card.Grid>
            <Card.Grid
              style={{
                width: '50%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>
                채팅상담시스템 인입 고객
              </div>
              <div style={{ textAlign: 'center' }}>
                <RobotOutlined
                  style={{
                    color: '#35bffd',
                    fontSize: 50,
                    zIndex: 11,
                    margin: 0
                  }}
                />
                <span
                  style={{
                    color: '#35bffd',
                    fontSize: 50,
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
