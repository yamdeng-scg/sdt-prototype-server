import React from 'react';
import { Menu, Row, Col } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

class ChatAreaBottomReplySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col span={10}>
          <Menu
            onClick={this.handleClick}
            style={{ width: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <MailOutlined />
                  <span>Navigation One</span>
                </span>
              }
            >
              <Menu.ItemGroup key="g1" title="Item 1">
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup key="g2" title="Item 2">
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<AppstoreOutlined />}
              title="Navigation Two"
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={
                <span>
                  <SettingOutlined />
                  <span>Navigation Three</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </Col>
        <Col
          span={14}
          style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <div style={{ padding: 10, height: '100%' }}>
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((info) => {
              return (
                <div
                  style={{
                    backgroundColor: '#d5d0d0',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10
                  }}
                >
                  <p>답변입니당1</p>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChatAreaBottomReplySearch;
