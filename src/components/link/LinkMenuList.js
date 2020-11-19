import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Select } from 'antd';
import Code from '../../config/Code';
const { Option } = Select;

const data = [];

for (let index = 0; index < 20; index++) {
  data.push(index + '');
}

@withRouter
@inject('appStore', 'uiStore')
@observer
class LinkMenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { clientHeight } = this.props.uiStore;
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    return (
      <div>
        <div className="bor-bottom">
          <Row className="pd25">
            <Col span={8} className="left pd-left10">
              <span className="font-em3 bold text">링크관리</span>{' '}
            </Col>
            <Col span={16} className="right">
              <Select
                defaultValue="customerName"
                style={{ width: 200 }}
                onChange={() => {}}
              >
                {roomListSearcTypeCodeList.map(codeInfo => {
                  return (
                    <Option value={codeInfo.value}>{codeInfo.name}</Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
        </div>
        <div
          style={{
            height: clientHeight - 150,
            overflowY: 'scroll'
          }}
        >
          <Row align="middle bor-bottom">
            <Col span={4} className="center font-em1 bold">
              요금
            </Col>
            <Col span={20} className="pd10 bor-left bold">
              {data.map((info, index) => (
                <span
                  className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
          <Row align="middle bor-bottom">
            <Col span={4} className="center font-em1 bold">
              요금
            </Col>
            <Col span={20} className="pd10 bor-left bold">
              {data.map((info, index) => (
                <span
                  className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
          <Row align="middle bor-bottom">
            <Col span={4} className="center font-em1 bold">
              요금
            </Col>
            <Col span={20} className="pd10 bor-left bold">
              {data.map((info, index) => (
                <span
                  className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
          <Row align="middle bor-bottom">
            <Col span={4} className="center font-em1 bold">
              요금
            </Col>
            <Col span={20} className="pd10 bor-left bold">
              {data.map((info, index) => (
                <span
                  className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
          <Row align="middle bor-bottom">
            <Col span={4} className="center font-em1 bold">
              요금
            </Col>
            <Col span={20} className="pd10 bor-left bold">
              {data.map((info, index) => (
                <span
                  className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
          <Row align="middle bor-bottom">
            <Col span={4} className="center font-em1 bold">
              요금
            </Col>
            <Col span={20} className="pd10 bor-left bold">
              {data.map((info, index) => (
                <span
                  className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default LinkMenuList;
