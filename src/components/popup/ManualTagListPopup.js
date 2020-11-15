import React from 'react';
import { Row, Col } from 'antd';

const data = [
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1
];

class ManualTagListPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ paddingTop: 30 }}>
        <Row
          style={{
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center',
            paddingBottom: 10
          }}
        >
          <Col span={24}>상담도우미 태그</Col>
        </Row>
        <div style={{ padding: 20, maxHeight: 300, overflowY: 'scroll' }}>
          {data.map((info, index) => (
            <span
              style={{
                backgroundColor: index % 2 === 0 ? '#d5d0d0' : '#fff',
                borderRadius: 10,
                border: '1px solid black',
                padding: 5,
                display: 'inline-block',
                marginRight: 5,
                marginBottom: 5
              }}
            >
              #캐시
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default ManualTagListPopup;
