import React from 'react';
import { Menu, Row, Col, Tree, Input } from 'antd';
import {
  FolderAddOutlined,
  FolderFilled,
  FolderOpenOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons';

class ChatAreaBottomFav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <div style={{ padding: '10px 10px 0px 10px' }}>
            <Input allowClear placeholder="검색어를 입력해주세요" />
          </div>
          <div
            style={{
              padding: 10,
              textAlign: 'right',
              overflowY: 'auto',
              height: 500
            }}
          >
            {[1, 1, 1, 1, 1, 2, 3, 5, 6].map((info, index) => {
              return (
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '10%',
                      paddingRight: 5
                    }}
                  >
                    <StarFilled />
                  </div>
                  <div
                    style={{
                      backgroundColor: '#d5d0d0',
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 10,
                      width: '90%',
                      display: 'inline-block'
                    }}
                  >
                    <p>답변입니당{index}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChatAreaBottomFav;
