import React from 'react';
import { Menu, Row, Col, Tree, Input, Button } from 'antd';
import {
  FolderAddOutlined,
  FolderFilled,
  FolderOpenOutlined,
  StarFilled,
  MailOutlined,
  StarOutlined,
  CalendarOutlined,
  LinkOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

class ChatAreaBottomLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col span={8} style={{ borderRight: '1px solid black' }}>
          {/* <Tree
            style={{ overflowY: 'auto', height: 500 }}
            className="draggable-tree"
            defaultExpandedKeys={this.state.expandedKeys}
            draggable
            blockNode
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
            treeData={this.state.gData}
            switcherIcon={
              <FolderFilled style={{ fontSize: '14px', color: '#d6d604' }} />
            }
          /> */}
          <div style={{ overflowY: 'auto', height: 500 }}>
            <Menu
              style={{ width: '100%' }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
            >
              <Menu.Item key="1" icon={<MailOutlined />}>
                Navigation One
              </Menu.Item>
              <Menu.Item key="2" icon={<CalendarOutlined />}>
                Navigation Two
              </Menu.Item>
              <Menu.Item key="link" icon={<LinkOutlined />}>
                <a
                  href="https://ant.design"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ant Design
                </a>
              </Menu.Item>
            </Menu>
          </div>
        </Col>
        <Col span={16}>
          <div
            style={{
              padding: 10,
              textAlign: 'left',
              overflowY: 'auto',
              height: 500
            }}
          >
            {[1, 1, 1, 1, 1, 2, 3, 5, 6].map((info, index) => {
              return (
                <Button
                  type="dashed"
                  style={{ marginRight: 5, marginBottom: 5 }}
                >
                  <span
                    style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    Dashed2
                  </span>
                </Button>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChatAreaBottomLink;
