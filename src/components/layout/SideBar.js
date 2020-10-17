import React from 'react';
import { Menu, Switch, Divider, List, Typography } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined
} from '@ant-design/icons';
const { SubMenu } = Menu;

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          width: 110,
          height: '100%',
          borderRight: '1px solid #f0f0f0',
          padding: '20px 0px 10px 0px',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowX: 'hidden'
        }}
      >
        <Menu mode={'vertical'} theme={'light'} Divider={false}>
          <Menu.Item key="1">상담채팅</Menu.Item>
          <Menu.Item key="2">답변템플릿</Menu.Item>
          <Menu.Item key="3">답변도우미</Menu.Item>
          <Menu.Item key="4">관리자메뉴</Menu.Item>
        </Menu>
        <div style={{ textAlign: 'center' }}>
          상담중
          <br />
          <Switch onChange={this.changeMode} />
          <br />
          <br />
          <p>| Today |</p>
          <p>진행 5</p>
          <p>신규 5</p>
          <p>종료 5</p>
        </div>
      </div>
    );
  }
}

export default SideBar;
