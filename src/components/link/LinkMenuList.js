import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Table, Row, Col, Button, Select } from 'antd';

const data = [];

for (let index = 0; index < 300; index++) {
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
    return (
      <div>
        <div>
          <Row>
            <Col span={12}>aasdasd</Col>
            <Col span={12}>aasdasd</Col>
          </Row>
        </div>
        <div
          style={{
            height: document.documentElement.clientHeight - 104,
            overflowY: 'scroll'
          }}
        >
          <Row align="middle">
            <Col span={4} style={{ textAlign: 'center' }}>
              요금
            </Col>
            <Col span={20}>
              {data.map((info, index) => (
                <span
                  style={{
                    backgroundColor: index % 2 === 0 ? '#d5d0d0' : '#fff',
                    borderRadius: 10,
                    border: '1px solid black',
                    padding: 5,
                    display: 'inline-block',
                    marginRight: 5,
                    marginBottom: 5
                  }}
                >
                  #캐시
                </span>
              ))}
            </Col>
          </Row>
          <Row align="middle">
            <Col span={4} style={{ textAlign: 'center' }}>
              요금
            </Col>
            <Col span={20}>
              {data.map((info, index) => (
                <span
                  style={{
                    backgroundColor: index % 2 === 0 ? '#d5d0d0' : '#fff',
                    borderRadius: 10,
                    border: '1px solid black',
                    padding: 5,
                    display: 'inline-block',
                    marginRight: 5,
                    marginBottom: 5
                  }}
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
