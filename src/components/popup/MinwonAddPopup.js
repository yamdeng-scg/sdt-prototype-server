import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Input, Tree, Button } from 'antd';
import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import ApiService from '../../services/ApiService';
import _ from 'lodash';
const TextArea = Input.TextArea;
const addCategoryList = function(list, info, parent) {
  if (info.children) {
    addCategoryListArray(list, info.children, info);
    list.push({
      key: info.key,
      title: info.title,
      level: info.level,
      parentKey: parent ? parent.key : null
    });
  } else {
    list.push({
      key: info.key,
      title: info.title,
      level: info.level,
      parentKey: parent ? parent.key : null
    });
  }
};

const addCategoryListArray = function(list, children, parent) {
  children.forEach(treeInfo => {
    addCategoryList(list, treeInfo, parent);
  });
};

const addExpandedKeys = function(allList, resultKeys, info) {
  resultKeys.push(info.key);
  if (info.level !== 1) {
    let searchIndex = _.findIndex(allList, tree => {
      return tree.key === info.parentKey;
    });
    addExpandedKeys(allList, resultKeys, allList[searchIndex]);
  }
};

@inject('alertModalStore')
@observer
class MinwonAddPopup extends React.Component {
  categoryAllList = [];
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      treeData: [],
      searchValue: '',
      smallCategoryInfo: null
    };
    this.treeRef = React.createRef();
  }

  onDrop = tree => {
    let sourceInfo = tree.dragNode.info;
    let targetInfo = tree.node.info;
    // debugger;
    ApiService.get('category/tree').then(response => {
      let data = response.data;
      this.categoryAllList = [];
      data.forEach(treeInfo => {
        addCategoryList(this.categoryAllList, treeInfo);
      });
      let treeData = [
        {
          title: '전체',
          key: '0',
          children: data
        }
      ];
      let expandedKeys = ['0'];
      this.setState({ treeData: treeData, expandedKeys: expandedKeys });
    });
  };

  onChange = e => {
    const { value } = e.target;
    let expandedKeys = [];
    if (value) {
      let findList = _.filter(this.categoryAllList, info => {
        return info.title.indexOf(value) !== -1;
      });
      findList.forEach(info => {
        addExpandedKeys(this.categoryAllList, expandedKeys, info);
      });
      if (findList.length) {
        let findKeys = findList.map(info => info.key);
        setTimeout(() => {
          this.treeRef.current.scrollTo({
            key: _.sortedUniq(findKeys)[0]
          });
        }, 500);
      }
    }
    this.setState({
      expandedKeys: ['0'].concat(_.uniq(expandedKeys)),
      searchValue: value,
      autoExpandParent: true
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onSelect = (selectedKeys, tree) => {
    let info = tree.node.info;
    if (info.level === 3) {
      this.setState({ smallCategoryInfo: info });
    }
  };

  componentDidMount() {
    ApiService.get('category/tree').then(response => {
      let data = response.data;
      this.categoryAllList = [];
      data.forEach(treeInfo => {
        addCategoryList(this.categoryAllList, treeInfo);
      });
      let treeData = [
        {
          title: '전체',
          key: '0',
          children: data
        }
      ];
      let expandedKeys = ['0'];
      this.setState({ treeData: treeData, expandedKeys: expandedKeys });
    });
  }

  render() {
    let { treeData, searchValue, expandedKeys, smallCategoryInfo } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="bold bg-yellow">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            level: item.level,
            info: item,
            children: loop(item.children)
          };
        }

        return {
          title,
          key: item.key,
          level: item.level,
          info: item
        };
      });
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>민원 등록</Col>
        </Row>
        <div className="pd15">
          <Row className="mrb10">
            <Col span={24}>
              <span className="bold font-em1">민원등록 고객 : </span>
              <span className="color-basic bold">홍길동님(ID XXX)</span>
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="font-em1 bold">민원 검색</span>
            </Col>
            <Col span={16} className="pd-left10">
              <span className="font-em1 bold">선택한 민원 분류</span>
            </Col>
          </Row>
          <Row className="mrb10">
            <Col span={8}>
              <Input
                placeholder=""
                enterButton={null}
                allowClear
                size="large"
                suffix={
                  <SearchOutlined
                    style={{
                      fontSize: 16,
                      color: '#1890ff'
                    }}
                  />
                }
                onChange={this.onChange}
              />
            </Col>
            <Col span={16} style={{ paddingLeft: 10 }}>
              <Input
                placeholder="카테고리를 선택해주세요"
                allowClear
                size="large"
                disabled
                value={
                  smallCategoryInfo
                    ? smallCategoryInfo.categoryLargeName +
                      ' > ' +
                      smallCategoryInfo.categoryMiddleName +
                      ' > ' +
                      smallCategoryInfo.name
                    : ''
                }
              />
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="font-em1 bold">민원 분류</span>
            </Col>
            <Col span={16} className="pd-left10">
              <span className="font-em1 bold">민원 내용 </span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Tree
                ref={this.treeRef}
                draggable
                onDrop={this.onDrop}
                onExpand={this.onExpand}
                height={350}
                className="draggable-tree"
                treeData={loop(treeData)}
                expandedKeys={expandedKeys}
                onSelect={this.onSelect}
                switcherIcon={
                  <CaretDownOutlined
                    style={{ fontSize: '16px', color: 'gray' }}
                  />
                }
              />
            </Col>
            <Col span={16} style={{ paddingLeft: 10 }}>
              <TextArea rows={15} />
            </Col>
          </Row>
        </div>
        <Row style={{ textAlign: 'center' }}>
          <Col span={12}>
            <Button block className="pd10 bold cancelbtn">
              취소
            </Button>
          </Col>
          <Col span={12}>
            <Button block className="pd10 bold okbtn">
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MinwonAddPopup;
