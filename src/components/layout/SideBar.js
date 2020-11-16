import React from 'react';
import { Menu, Switch, Divider, List, Typography } from 'antd';
import {
  HomeFilled,
  CalendarOutlined,
  AppstoreOutlined,
  SettingFilled,
  BarChartOutlined,
  StarFilled,
  SoundFilled
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
          width: 100,
          height: '100%',
          borderRight: '1px solid #f0f0f0',
          padding: '20px 0px 10px 0px',
          position: 'fixed',
          top: 50,
          left: 0,
          overflowX: 'hidden'
        }}
        className="side-bar"
      >
        <Menu mode={'vertical'} theme={'light'} Divider={false}>
          <Menu.Item key="1" style={{ textAlign: 'center', marginBottom: 20 }}>
            <HomeFilled
              style={{ color: '#35bffd', fontSize: 40, zIndex: 11, margin: 0 }}
            />
            <div
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#35bffd'
              }}
            >
              채팅상담
            </div>
          </Menu.Item>
          <Menu.Item key="2" style={{ textAlign: 'center', marginBottom: 20 }}>
            <StarFilled
              style={{ color: '#35bffd', fontSize: 40, zIndex: 11, margin: 0 }}
            />
            <div
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#35bffd'
              }}
            >
              답변템플릿
            </div>
          </Menu.Item>
          <Menu.Item key="3" style={{ textAlign: 'center', marginBottom: 20 }}>
            <SoundFilled
              style={{ color: '#35bffd', fontSize: 40, zIndex: 11, margin: 0 }}
            />
            <div
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#35bffd'
              }}
            >
              상담도우미
            </div>
          </Menu.Item>
          <Menu.Item key="4" style={{ textAlign: 'center', marginBottom: 20 }}>
            <BarChartOutlined
              style={{ color: '#35bffd', fontSize: 40, zIndex: 11, margin: 0 }}
            />
            <div
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#35bffd'
              }}
            >
              통계
            </div>
          </Menu.Item>
          <Menu.Item key="5" style={{ textAlign: 'center', marginBottom: 20 }}>
            <SettingFilled
              style={{ color: '#35bffd', fontSize: 40, zIndex: 11, margin: 0 }}
            />
            <div
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#35bffd'
              }}
            >
              관리설정
            </div>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default SideBar;
