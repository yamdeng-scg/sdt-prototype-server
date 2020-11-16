import React from 'react';
import { Card } from 'antd';

class TalkIngSummary extends React.Component {
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
                width: '20%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid
              style={{
                width: '20%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid
              style={{
                width: '20%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid
              style={{
                width: '20%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid
              style={{
                width: '20%',
                textAlign: 'center',
                border: '0px',
                padding: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default TalkIngSummary;
