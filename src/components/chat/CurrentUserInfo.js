import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

class CurrentUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row
        justify="space-around"
        align="middle"
        style={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <Col span={20} style={{ height: 76, paddingTop: 10, paddingLeft: 15 }}>
          <Title level={4}>
            이용숙님 <span>010-7338-4183</span> | <span>ChatID</span> :{' '}
            <span style={{ color: '#78bffd' }}>6958</span>{' '}
            <Button type="primary" shape="round" size="small">
              민원등록
            </Button>
          </Title>
          <Text strong={false}>2020-08-19 16:41 ~</Text>
        </Col>
        <Col span={4} style={{ textAlign: 'right', paddingRight: 10 }}>
          <CloseOutlined />
        </Col>
      </Row>
    );
  }
}

export default CurrentUserInfo;
