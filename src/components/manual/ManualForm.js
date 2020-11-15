import React from 'react';
import {
  Row,
  Col,
  Button,
  Image,
  Typography,
  Input,
  Table,
  Tag,
  Pagination,
  Upload,
  PlusOutlined
} from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;
const TextArea = Input.TextArea;

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

const fileList = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
  }
];

@withRouter
@inject('appStore', 'uiStore')
@observer
class ManualForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { clientHeight } = this.props.uiStore;
    return (
      <div style={{ padding: 20 }}>
        <div>
          <Title level={3}>상담도우미 페이지 수정</Title>
        </div>
        <div style={{ paddingLeft: 10 }}>
          * 이미지 등록된 상담도우미 목차를 확인 후 등록될 Page Number를 정확히
          기입해주세요
        </div>
        <div>
          <Row>
            <Col span={8}>
              검색 :{' '}
              <Input
                style={{ width: '80%' }}
                placeholder="input with clear icon"
                allowClear
              />
            </Col>
            <Col span={16}>
              태그(*) :{' '}
              <Input
                style={{ width: '90%' }}
                placeholder="input with clear icon"
                allowClear
              />
            </Col>
          </Row>
          <Row>
            <Col span={8}>목차</Col>
            <Col span={12}>페이지 제목(*)</Col>
            <Col span={4} style={{ paddingLeft: 5 }}>
              Page(*)
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{ paddingRight: 10 }}>
              <Table
                size="small"
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: clientHeight - 370 }}
                style={{ borderRight: '1px solid #e0dcdc' }}
              />
            </Col>
            <Col span={16}>
              <Row>
                <Col span={18}>
                  <Input
                    style={{ width: '100%' }}
                    placeholder="input with clear icon"
                    allowClear
                  />
                </Col>
                <Col span={6} style={{ paddingLeft: 5 }}>
                  <Input
                    style={{ width: '90%' }}
                    placeholder="input with clear icon"
                    allowClear
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>내용</Col>
              </Row>
              <Row>
                <TextArea
                  style={{
                    height: clientHeight - 385
                  }}
                  rows={15}
                />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={16} offset={8}>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                defaultFileList={[...fileList]}
                className="upload-list-inline"
                multiple={false}
              >
                <Button icon={<UploadOutlined />}>파일첨부</Button>
              </Upload>
            </Col>
          </Row>
          <Row style={{ textAlign: 'right', marginTop: 10 }}>
            <Col span={24}>
              <Button>취소</Button>
              {'  '}
              <Button>저장</Button>{' '}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ManualForm;
