import React from 'react';
import { Menu, Row, Col } from 'antd';

class ChatAreaBottomLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col span={8} className="bor-right">
          <div style={{ overflowY: 'auto', height: 400 }}>
            <Menu style={{ width: '100%' }} defaultSelectedKeys={['1']}>
              <Menu.Item key="1">Navigation One</Menu.Item>
              <Menu.Item key="2">Navigation Two</Menu.Item>
              <Menu.Item key="3">Ant Design</Menu.Item>
            </Menu>
          </div>
        </Col>
        <Col span={16}>
          <div
            style={{
              overflowY: 'auto',
              height: 440
            }}
            className="pd10 left"
          >
            {[1, 1, 1, 1, 1, 2, 3, 5, 6].map((info, index) => {
              return <span className="tag-enable text-under bold">#캐시</span>;
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChatAreaBottomLink;
