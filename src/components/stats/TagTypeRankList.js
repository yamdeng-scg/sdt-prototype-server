import React from 'react';
import { Row, Col, Timeline, Table } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const columns = [
  {
    title: '순위',
    dataIndex: 'key',
    key: 'key',
    width: '10%',
    render: text => <a>{text}</a>
  },
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name2',
    width: '50%',
    ellipsis: true
  },
  {
    title: '전일 대비',
    dataIndex: 'name',
    key: 'name3',
    width: '40%',
    ellipsis: true
  }
];

const basicData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer', 'developer', 'developer', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];

let data = [];

for (let index = 0; index < 4; index++) {
  data = data.concat(basicData);
}

class TagTypeRankList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mrt10">
        <Row>
          <Col span={16} className="text font-em4 bold mrb10 mrl5">
            문의 유형별 통계
          </Col>
          <Col span={5} className="inblock mrl15 color-basic bold font-em1">
            2020.11.12
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              showHeader={false}
              size="small"
            />
          </Col>
          <Col span={5} style={{ marginLeft: 10 }}>
            <Timeline>
              <Timeline.Item>
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
              <Timeline.Item>
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
              <Timeline.Item>
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
              <Timeline.Item>
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
              <Timeline.Item>
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
              <Timeline.Item>
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <CheckCircleFilled
                    style={{ fontSize: '14px', color: '#1890ff' }}
                  />
                }
              >
                <span
                  style={{
                    display: 'inline-block',
                    paddingBottom: 10
                  }}
                >
                  2015-09-01
                </span>
              </Timeline.Item>
            </Timeline>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TagTypeRankList;
