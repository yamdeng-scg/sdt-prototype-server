import React from 'react';
import { Row, Col, Input } from 'antd';
import CategoryTree from './CategoryTree';
import CategoryForm from './CategoryForm';
const { Search } = Input;

class TemplateCategoryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd10">
        <div className="text font-em4 bold mrb10 bor-bottom pd-bottom10">
          템플릿 카테고리 관리
        </div>
        <div className="mrb10">
          <Row>
            <Col span={24}>
              <span className="bold font-em1">카테고리 검색 : </span>
              <Search
                placeholder="검색어를 입력하세요"
                onSearch={value => {
                  // console.log('aaa');
                }}
                style={{ width: 300 }}
                allowClear
              />
            </Col>
          </Row>
        </div>
        <div className="red bold mrb10">
          ※ 추가·수정된 카테고리를 선택 후 마우스 드래그앤 드롭 시 순서 변경이
          가능합니다.
        </div>
        <div>
          <Row>
            <Col span={6}>
              <CategoryTree />
            </Col>
            <Col span={18}>
              <CategoryForm />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default TemplateCategoryContainer;
