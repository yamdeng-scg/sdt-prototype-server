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
      <div className="pd-left15">
        <div className="text font-em2 bold mrb10 mrl5">
          카테고리 추가 / 수정 /삭제
        </div>
        <div className="bor">
          <Row align="middle" className="bor-bottom">
            <Col span={6} className="center">
              <span className="inblock pd30 bold">카테고리 추가</span>
            </Col>
            <Col span={18} className="bor-left">
              <Row className="pd20 bor-bottom">
                <Radio.Group onChange={() => {}} value={1}>
                  <Radio value={1}>대분류</Radio>
                  <Radio value={2}>중분류</Radio>
                  <Radio value={3}>소분류</Radio>
                </Radio.Group>
              </Row>
              <Row className="pd20">
                <Col span={18}>
                  <Input />
                </Col>
                <Col span={5} className="mrl5">
                  <Button className="bg-basic color-white bold">추가</Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row align="middle">
            <Col span={6} className="center">
              <span className="inblock pd30 bold">카테고리 수정 / 삭제</span>
            </Col>
            <Col span={18} className="bor-left">
              <Row className="bor-bottom">
                <Col span={24} className="center pd10">
                  <span className="inblokc bold">카테고리 수정 / 삭제</span>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ padding: '20px 10px 20px 20px' }}>
                  <Row>
                    <Col span={6}>
                      <Select
                        defaultValue="lucy"
                        style={{ width: '100%' }}
                        className="left"
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
                      <Input className="mrl5" style={{ width: '95%' }} />
                    </Col>
                    <Col span={6}>
                      <Button className="bg-basic color-white bold">
                        수정
                      </Button>{' '}
                      <Button className="bg-basic color-white bold">
                        삭제
                      </Button>
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
