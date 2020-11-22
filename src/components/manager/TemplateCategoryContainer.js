import React from 'react';
import { Row, Col, Input } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import CategoryTree from './CategoryTree';
import CategoryForm from './CategoryForm';
const { Search } = Input;

@withRouter
@inject('appStore', 'uiStore', 'managerStore')
@observer
class TemplateCategoryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.managerStore.changeMenuIndex(2);
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
              <Input
                placeholder="카테고리 이름을 입력해주세요"
                enterButton={null}
                allowClear
                value={''}
                style={{ width: 300 }}
                suffix={
                  <SearchOutlined
                    className="color-basic bold"
                    style={{
                      fontSize: 16
                    }}
                    onClick={() => {
                      // chatStore.search();
                    }}
                  />
                }
                onChange={event => {
                  // chatStore.changeIngSearchValue(event.target.value);
                }}
                onPressEnter={() => {
                  // chatStore.search();
                }}
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
