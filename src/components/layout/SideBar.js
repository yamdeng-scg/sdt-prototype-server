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
          top: 50,
          left: 0,
          overflowX: 'hidden'
        }}
      >
        <Menu mode={'vertical'} theme={'light'} Divider={false}>
          <Menu.Item key="1">채팅상담</Menu.Item>
          <Menu.Item key="2">답변템플릿</Menu.Item>
          <Menu.Item key="3">상담도우미</Menu.Item>
          <Menu.Item key="4">통계</Menu.Item>
          <Menu.Item key="5">관리설정</Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default SideBar;
