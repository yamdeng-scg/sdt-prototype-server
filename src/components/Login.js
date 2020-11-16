import React from 'react';
import { Row, Col, Typography, Select, Input, Checkbox, Button } from 'antd';
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
            marginBottom: 70
          }}
        >
          <Col span={18} offset={6} className="center">
            <Title>채팅상담 시스템</Title>
          </Col>
          {/* 이름 */}
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            <span className="bold">도시가스 선택</span>
          </Col>
          <Col span={18}>
            <Select
              placeholder="도시가스를 선택해주세요"
              style={{ width: '100%', textAlign: 'left' }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          {/* 암호 */}
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            <span className="bold">사번</span>
          </Col>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              placeholder="사번을 입력해주세요"
              allowClear
            />
          </Col>
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            <span className="bold">암호</span>
          </Col>
          <Col span={18}>
            <Input
              type="password"
              style={{ width: '100%' }}
              placeholder="암호를 입력해주세요"
              allowClear
            />
          </Col>
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            <span className="bold">이름</span>
          </Col>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              placeholder="이름을 입력해주세요"
              allowClear
            />
          </Col>
          <Col span={18} offset={6}>
            <Button type="primary" block className="bold">
              로그인
            </Button>
          </Col>
          <Col span={18} offset={6} style={{ textAlign: 'left' }}>
            <Checkbox onChange={() => {}}>사번 저장</Checkbox>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default Login;
