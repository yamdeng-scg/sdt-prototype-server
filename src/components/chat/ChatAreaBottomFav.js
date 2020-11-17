import React from 'react';
import { Row, Col, Input } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

class ChatAreaBottomFav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <div style={{ padding: '10px 10px 0px 10px' }} className="right">
            <Input
              style={{ maxWidth: '90%' }}
              allowClear
              placeholder="검색어를 입력해주세요"
            />
          </div>
          <div
            style={{
              padding: 10,
              textAlign: 'right',
              overflowY: 'auto',
              height: 400
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((info, index) => {
              return (
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '10%',
                      paddingRight: 5
                    }}
                  >
                    {/* <StarFilled className="color-basic" /> */}
                    <StarOutlined className="color-basic font-em2" />
                  </div>
                  <div
                    style={{
                      borderRadius: 10,
                      width: '90%'
                    }}
                    className="bg-gray pd10 mrb10 inblock"
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
