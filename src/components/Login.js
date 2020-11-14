import React from 'react';
import { Row, Col, Typography, Select, Input } from 'antd';
import BackGroundImage from '../resources/images/login_background.png';
const { Title } = Typography;
const { Option } = Select;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row
        justify="center"
        align="bottom"
        style={{
          height: '100%',
          textAlign: 'center',
          backgroundImage: `url(${BackGroundImage})`,
          backgroundRepeat: 'repeat-x'
        }}
      >
        <Row
          style={{
            width: 500,
            height: 350,
            marginBottom: 30
          }}
        >
          <Col span={24}>
            <Title>채팅상담 시스템</Title>
          </Col>
          {/* 이름 */}
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            도시가스 선택{' '}
          </Col>
          <Col span={18}>
            <Select
              defaultValue="lucy"
              style={{ width: '100%', textAlign: 'left' }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          {/* 암호 */}
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            사번{' '}
          </Col>
          <Col span={18}>
            <Input style={{ width: '100%' }} />
          </Col>
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            암호{' '}
          </Col>
          <Col span={18}>
            <Input style={{ width: '100%' }} />
          </Col>
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            이름{' '}
          </Col>
          <Col span={18}>
            <Input style={{ width: '100%' }} />
          </Col>
        </Row>
      </Row>
    );
  }
}

export default Login;
