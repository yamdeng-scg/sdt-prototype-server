import React from 'react';
import { Row, Col, Radio, Input, Button, Select } from 'antd';
const { Option } = Select;

class CategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <div>카테고리 추가 / 수정 /삭제</div>
        <div style={{ border: '1px solid #f0f0f0' }}>
          <Row align="middle" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: 30 }}>
                카테고리 추가
              </span>
            </Col>
            <Col span={18} style={{ borderLeft: '1px solid #f0f0f0' }}>
              <Row style={{ padding: 20, borderBottom: '1px solid #f0f0f0' }}>
                <Radio.Group onChange={() => {}} value={1}>
                  <Radio value={1}>대분류</Radio>
                  <Radio value={2}>중분류</Radio>
                  <Radio value={3}>소분류</Radio>
                </Radio.Group>
              </Row>
              <Row style={{ padding: 20 }}>
                <Col span={18}>
                  <Input />
                </Col>
                <Col span={5} style={{ marginLeft: 5 }}>
                  <Button>추가</Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row align="middle">
            <Col span={6} style={{ textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: 30 }}>
                카테고리 수정 / 삭제
              </span>
            </Col>
            <Col
              span={18}
              style={{
                borderLeft: '1px solid #f0f0f0'
              }}
            >
              <Row style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Col
                  span={24}
                  style={{
                    borderRight: '1px solid #f0f0f0',
                    textAlign: 'center'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: 20
                    }}
                  >
                    카테고리 수정 / 삭제
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ padding: '20px 10px 20px 20px' }}>
                  <Row>
                    <Col span={6}>
                      <Select
                        defaultValue="lucy"
                        style={{ width: '100%', textAlign: 'left' }}
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </Col>
                    <Col span={12}>
                      <Input style={{ marginLeft: 5, width: '95%' }} />
                    </Col>
                    <Col span={6}>
                      <Button>수정</Button> <Button>삭제</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CategoryForm;
