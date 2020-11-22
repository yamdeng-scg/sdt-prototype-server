import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeFilled,
  SettingFilled,
  BarChartOutlined,
  StarFilled,
  SoundFilled
} from '@ant-design/icons';
import Constant from '../../config/Constant';

@withRouter
@inject('appStore', 'uiStore')
@observer
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { uiStore } = this.props;
    let { sideBarSelectMenuKName } = uiStore;
    return (
      <div
        style={{
          width: 100,
          height: '100%',
          padding: '0px 0px 10px 0px',
          position: 'fixed',
          top: 50,
          left: 0,
          overflowX: 'hidden'
        }}
        className="side-bar bor-right"
      >
        <Menu
          mode={'vertical'}
          theme={'light'}
          Divider={false}
          selectedKeys={[sideBarSelectMenuKName]}
        >
          <Menu.Item
            key={Constant.SIDE_BAR_MENU_CHAT}
            className="center mrb20"
            style={{ paddingTop: 10, marginTop: 0 }}
            onClick={() => uiStore.goPage('/chat')}
          >
            <HomeFilled
              style={{ fontSize: 35, zIndex: 11, margin: 0 }}
              className="color-basic"
            />
            <div className="color-basic center bold">채팅상담</div>
          </Menu.Item>
          <Menu.Item
            key={Constant.SIDE_BAR_MENU_TEMPLATE}
            className="center mrb20"
            style={{ paddingTop: 10 }}
            onClick={() => uiStore.goPage('/template')}
          >
            <StarFilled
              style={{ fontSize: 35, zIndex: 11, margin: 0 }}
              className="color-basic"
            />
            <div className="color-basic center bold">답변템플릿</div>
          </Menu.Item>
          <Menu.Item
            key={Constant.SIDE_BAR_MENU_MANUAL}
            className="center mrb20"
            style={{ paddingTop: 10 }}
            onClick={() => uiStore.goPage('/manual')}
          >
            <SoundFilled
              style={{ fontSize: 35, zIndex: 11, margin: 0 }}
              className="color-basic"
            />
            <div className="color-basic center bold">상담도우미</div>
          </Menu.Item>
          <Menu.Item
            key={Constant.SIDE_BAR_MENU_STATS}
            className="center mrb20"
            style={{ paddingTop: 10 }}
            onClick={() => uiStore.goPage('/stats')}
          >
            <BarChartOutlined
              style={{ fontSize: 35, zIndex: 11, margin: 0 }}
              className="color-basic"
            />
            <div className="color-basic center bold">통계</div>
          </Menu.Item>
          <Menu.Item
            key={Constant.SIDE_BAR_MENU_MANAGER}
            className="center mrb20"
            style={{ paddingTop: 10 }}
            onClick={() => uiStore.goPage('/manager')}
          >
            <SettingFilled
              style={{ fontSize: 35, zIndex: 11, margin: 0 }}
              className="color-basic"
            />
            <div className="color-basic center bold">관리설정</div>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default SideBar;
