import React from 'react';
import { Row, Col, Input, Tree } from 'antd';
import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
const TextArea = Input.TextArea;

class MinwonAddPopup extends React.Component {
  constructor(props) {
    super(props);

    const x = 10;
    const y = 2;
    const z = 1;
    const gData = [];

    const generateData = (_level, _preKey, _tns) => {
      const preKey = _preKey || '0';
      const tns = _tns || gData;

      const children = [];
      for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ title: key, key });
        if (i < y) {
          children.push(key);
        }
      }
      if (_level < 0) {
        return tns;
      }
      const level = _level - 1;
      children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
      });
    };
    generateData(z);

    this.state = { gData: gData, expandedKeys: ['0-0', '0-0-0', '0-0-0-0'] };
  }

  onDragEnter = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data
    });
  };

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>민원 등록</Col>
        </Row>
        <div className="pd15">
          <Row className="mrb10">
            <Col span={24}>
              <span className="bold font-em2">민원등록 고객 : </span>
              <span className="">홍길동님(ID XXX)</span>
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="font-em2">민원 검색</span>
            </Col>
            <Col span={16} className="pd-left10">
              <span className="font-em2">민원등록 고객</span>
            </Col>
          </Row>
          <Row className="mrb10">
            <Col span={8}>
              <Input
                placeholder="input search text"
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
              />
            </Col>
            <Col span={16} style={{ paddingLeft: 10 }}>
              <Input
                placeholder="input search text"
                allowClear
                size="large"
                disabled
              />
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="font-em2">민원 분류</span>
            </Col>
            <Col span={16} className="pd-left10">
              <span className="font-em2">민원 내용 </span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Tree
                style={{ overflowY: 'auto', height: 350 }}
                className="draggable-tree"
                defaultExpandedKeys={this.state.expandedKeys}
                draggable
                blockNode
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                treeData={this.state.gData}
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
          <Col span={12} className="pd10 bold cancelbtn">
            취소
          </Col>
          <Col span={12} className="pd10 bold okbtn">
            확인
          </Col>
        </Row>
      </div>
    );
  }
}

export default MinwonAddPopup;
