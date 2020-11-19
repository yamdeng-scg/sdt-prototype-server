import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Typography, Select, Input, Checkbox, Button } from 'antd';
import BackGroundImage from '../resources/images/login_background.png';
const { Title } = Typography;
const { Option } = Select;

@withRouter
@inject('appStore', 'uiStore', 'loginStore')
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeCompany = value => {
    let { loginStore } = this.props;
    loginStore.changeCompany(value);
  };

  changeLoginName = event => {
    let { loginStore } = this.props;
    loginStore.changeLoginName(event.target.value);
  };

  changePassword = event => {
    let { loginStore } = this.props;
    loginStore.changePassword(event.target.value);
  };

  changeName = event => {
    let { loginStore } = this.props;
    loginStore.changeName(event.target.value);
  };

  changeSaveLoginChecked = event => {
    let { loginStore } = this.props;
    loginStore.changeSaveLoginChecked(event.target.checked);
  };

  login = () => {
    let { loginStore } = this.props;
    loginStore.login();
  };

  onPressEnter = () => {
    let { loginStore } = this.props;
    loginStore.login();
  };

  componentWillUnmount() {
    let { loginStore } = this.props;
    loginStore.clear();
  }

  render() {
    let { appStore, loginStore } = this.props;
    let { companyList } = appStore;
    let {
      companyId,
      loginName,
      password,
      name,
      saveLoginChecked,
      enabledButton
    } = loginStore;
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
              value={companyId}
              onChange={this.changeCompany}
            >
              {companyList.map(companyInfo => {
                return (
                  <Option value={companyInfo.id}>{companyInfo.name}</Option>
                );
              })}
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
              value={loginName}
              onChange={this.changeLoginName}
              onPressEnter={this.onPressEnter}
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
              value={password}
              onChange={this.changePassword}
              onPressEnter={this.onPressEnter}
            />
          </Col>
          <Col span={6} style={{ textAlign: 'right', padding: 5 }}>
            <span className="bold">이름</span>
          </Col>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              placeholder="이름을 입력해주세요"
              allowClearv
              value={name}
              onChange={this.changeName}
              onPressEnter={this.onPressEnter}
            />
          </Col>
          <Col span={18} offset={6}>
            <Button
              type="primary"
              block
              className="bold"
              onClick={this.login}
              disabled={!enabledButton}
            >
              로그인
            </Button>
          </Col>
          <Col span={18} offset={6} style={{ textAlign: 'left' }}>
            <Checkbox
              checked={saveLoginChecked}
              onChange={this.changeSaveLoginChecked}
            >
              로그인 정보 저장
            </Checkbox>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default Login;
