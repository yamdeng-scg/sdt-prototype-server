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
import {
  FolderAddOutlined,
  FolderFilled,
  SearchOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
const { Title } = Typography;

const columns = [
  {
    title: 'page',
    dataIndex: 'age',
    key: 'age',
    width: 65,
    render: text => <a>{text}</a>
  },
  {
    title: '목차',
    dataIndex: 'name',
    key: 'name',
    width: '50%',
    ellipsis: true
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          return (
            <Tag color={'green'} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: '',
    key: 'action',
    width: 50,
    render: (text, record) => (
      <StarFilled style={{ fontSize: 17, color: '#2196f3' }} />
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
class ManualList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { clientHeight } = this.props.uiStore;
    return (
      <div>
        <div style={{ padding: '10px 0px 0px 10px' }}>
          <Title level={3}>상담 도우미</Title>
        </div>
        <div style={{ padding: '0px 10px', marginBottom: 10 }}>
          <Input
            placeholder="input search text"
            enterButton={null}
            allowClear
            suffix={
              <SearchOutlined
                style={{
                  fontSize: 16,
                  color: '#1890ff'
                }}
              />
            }
          />
        </div>
        <div style={{ padding: 10 }}>
          <Row>
            <Col span={12}>
              <Button>태그보기</Button>
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginTop: 5 }}>
              <Checkbox>즐겨찾기만 보기</Checkbox>
            </Col>
          </Row>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ y: clientHeight - 300 }}
          />
        </div>
      </div>
    );
  }
}

export default ManualList;
