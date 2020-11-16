import React from 'react';

import {
  Table,
  Tag,
  Checkbox,
  Typography,
  Input,
  Row,
  Col,
  Button
} from 'antd';

const columns = [
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
    width: '15%',
    render: text => <a>{text}</a>
  },
  {
    title: '상태',
    dataIndex: 'name',
    key: 'name2',
    width: '15%',
    ellipsis: true
  },
  {
    title: '진행중',
    dataIndex: 'name',
    key: 'name3',
    width: '15%',
    ellipsis: true
  },
  {
    title: '종료',
    dataIndex: 'name',
    key: 'name4',
    width: '15%',
    ellipsis: true
  },
  {
    title: '전일 대비 증감',
    dataIndex: 'name',
    key: 'name5',
    width: '20%',
    ellipsis: true
  },
  {
    title: '최근 7일 종료건',
    dataIndex: 'name',
    key: 'name6',
    width: '20%',
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

class MemberUnitStatsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div>상담사별 분석</div>
        <div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </div>
    );
  }
}

export default MemberUnitStatsList;
