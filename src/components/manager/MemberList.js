import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Table, Row, Col, Button, Select, Input } from 'antd';
import MemberSummary from '../stats/MemberSummary';
import Code from '../../config/Code';
import { SearchOutlined } from '@ant-design/icons';
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
@inject('appStore', 'uiStore', 'managerStore')
@observer
class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.managerStore.changeMenuIndex(1);
  }

  render() {
    let { clientHeight } = this.props.uiStore;
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    return (
      <div>
        <div className="text font-em4 bold mrb10 mrl5">계정관리</div>
        <div>
          <Row className="mrb10">
            <Col span={6} offset={8}>
              <Select
                defaultValue="customerName"
                style={{ width: '100%' }}
                onChange={() => {}}
              >
                {roomListSearcTypeCodeList.map(codeInfo => {
                  return (
                    <Option value={codeInfo.value}>{codeInfo.name}</Option>
                  );
                })}
              </Select>{' '}
            </Col>
            <Col span={10} className="pd-left10">
              <Input
                placeholder="검색어를 입력하세요"
                enterButton={null}
                allowClear
                value={''}
                style={{ width: '100%' }}
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
        <div>
          <MemberSummary />
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            scroll={{ y: clientHeight - 370 }}
          />
        </div>
      </div>
    );
  }
}

export default MemberList;
