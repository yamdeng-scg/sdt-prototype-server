import React from 'react';
import { Row, Col } from 'antd';
import CategoryTree from './CategoryTree';
import CategoryForm from './CategoryForm';

class TemplateCategoryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <div>템플릿 카테고리 관리</div>
        <div>input</div>
        <div>도움말 문구</div>
        <div>
          <Row>
            <Col span={8}>
              <CategoryTree />
            </Col>
            <Col span={16}>
              <CategoryForm />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default TemplateCategoryContainer;
