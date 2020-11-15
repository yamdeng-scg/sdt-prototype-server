import React from 'react';
import { Row, Col, Typography, Checkbox, Input, Button, Select } from 'antd';
import {
  FolderAddOutlined,
  FolderFilled,
  FolderOpenOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons';
const { Option } = Select;

class TemplateSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div style={{ padding: 20, borderBottom: '1px solid #e0dcdc' }}>
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
            <Col span={14} style={{ margin: '0px 10px' }}>
              <Input style={{ width: '100%' }} />
            </Col>
            <Col span={3}>
              <Button>템플릿 추가</Button>
            </Col>
          </Row>
          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>
              * 전체 : 총 250개
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Checkbox>내가 등록한 템플릿 보기</Checkbox>
            </Col>
          </Row>
        </div>
        <div>
          <div style={{ padding: 20, borderBottom: '1px solid #e0dcdc' }}>
            <Row style={{ marginBottom: 10 }}>
              <Col span={12} style={{ textAlign: 'left' }}>
                요금 &gt; 요금혹인 &gt; 체납
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                YY.MM.DD / 홍길동 <StarOutlined style={{ fontSize: 17 }} />{' '}
                <Button>편집</Button> <Button>삭제</Button>
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={4}>* 질문</Col>
              <Col span={20}>asdasd</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={4}>* 답변</Col>
              <Col span={20}>asdasd</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={4}>* 키워드</Col>
              <Col span={20}>asdasd</Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateSearch;
