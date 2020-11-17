import React from 'react';
import { Row, Col, Tree, Input } from 'antd';
import { StarFilled, StarOutlined, CaretDownOutlined } from '@ant-design/icons';

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

class ChatAreaBottomReplySearch extends React.Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0']
  };

  onDragEnter = info => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = info => {
    // console.log(info);
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
      <Row>
        <Col span={10} className="bor-right">
          <Tree
            style={{ overflowY: 'auto', height: 450 }}
            className="draggable-tree"
            defaultExpandedKeys={this.state.expandedKeys}
            draggable
            blockNode
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
            treeData={this.state.gData}
            switcherIcon={
              <CaretDownOutlined style={{ fontSize: '16px', color: 'gray' }} />
            }
          />
        </Col>
        <Col span={14}>
          <div style2={{ padding: '10px 10px 0px 10px' }} className="pd10">
            <Input allowClear placeholder="검색어를 입력해주세요" />
          </div>
          <div
            style={{
              padding: 5,
              textAlign: 'right',
              overflowY: 'auto',
              height: 400
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((info, index) => {
              return (
                <div>
                  <div
                    className="inblock pd-right5"
                    style={{
                      width: '10%'
                    }}
                  >
                    {/* <StarFilled className="color-basic" /> */}
                    <StarOutlined className="color-basic font-em2" />
                  </div>
                  <div
                    className="bg-gray pd10 mrb10 inblock text"
                    style={{
                      borderRadius: 10,
                      width: '90%'
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

export default ChatAreaBottomReplySearch;
