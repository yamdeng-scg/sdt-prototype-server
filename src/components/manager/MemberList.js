import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Table, Row, Col, Button, Select } from 'antd';
const { Option } = Select;

/*

  index
  이름
  사번
  부서명
  직급
  권한
  상담상태
  수정(버튼 2개)
*/

const columns = [
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
    width: '15%',
    render: text => (
      <Select defaultValue="lucy" style={{ width: '100%', textAlign: 'left' }}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    )
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
    ellipsis: true,
    render: text => (
      <Select defaultValue="lucy" style={{ width: '100%', textAlign: 'left' }}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    )
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
    ellipsis: true,
    render: (text, record) => (
      <div>
        <Button size="small">수정</Button>
        <Button size="small">삭제</Button>
      </div>
    )
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

@withRouter
@inject('appStore', 'uiStore')
@observer
class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { clientHeight } = this.props.uiStore;
    return (
      <div>
        <div>계정관리</div>
        <div>검색 input</div>
        <div>count 정보 : bottom border 넣음</div>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            scroll={{ y: clientHeight - 250 }}
          />
        </div>
      </div>
    );
  }
}

export default MemberList;
