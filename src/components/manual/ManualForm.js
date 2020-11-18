import React from 'react';
import { Row, Col, Button, Typography, Input, Table, Tag, Upload } from 'antd';
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
    align: 'center',
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
    title: '태그',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          return (
            <Tag className="color-basic inblock mrb5" key={tag}>
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
      <div className="pd20">
        <div className="bor-bottom mrb5">
          <Title level={3} className="text mr0">
            상담도우미 페이지 수정
          </Title>
        </div>
        <div className="pd-left5 mrb10 bold">
          * 이미지 등록된 상담도우미 목차를 확인 후 등록될 Page Number를 정확히
          기입해주세요
        </div>
        <div>
          <Row className="mrb10">
            <Col span={10}>
              <span className="bold font-em1">검색 : </span>
              <Input
                style={{ width: '80%' }}
                placeholder="input with clear icon"
                allowClear
              />
            </Col>
            <Col span={14}>
              <span className="bold font-em1">
                태그<span className="red">(*)</span> :{' '}
              </span>
              <Input
                style={{ width: '90%' }}
                placeholder="input with clear icon"
                allowClear
              />
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={10}>
              <span className="bold font-em1">목차</span>
            </Col>
            <Col span={10}>
              <span className="bold font-em1">
                페이지 제목<span className="red">(*)</span>
              </span>
            </Col>
            <Col span={4} className="pd-left5">
              <span className="bold font-em1">
                Page<span className="red">(*)</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={10} style={{ paddingRight: 10 }}>
              <Table
                size="small"
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: clientHeight - 280 }}
                style={{ borderRight: '1px solid #e0dcdc' }}
              />
            </Col>
            <Col span={14}>
              <Row className="mrb10">
                <Col span={17}>
                  <Input
                    style={{ width: '100%' }}
                    placeholder="input with clear icon"
                    allowClear
                  />
                </Col>
                <Col span={7} style={{ paddingLeft: 5 }}>
                  <Input
                    style={{ width: '90%' }}
                    placeholder="input with clear icon"
                    allowClear
                  />
                </Col>
              </Row>
              <Row className="mrb10">
                <Col span={24} className="bold font-em1">
                  내용
                </Col>
              </Row>
              <Row className="mrb10">
                <TextArea
                  style={{
                    height: clientHeight - 430
                  }}
                  rows={15}
                />
              </Row>
              <Row>
                <Col span={24}>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture"
                    defaultFileList={[...fileList]}
                    className="upload-list-inline"
                    multiple={false}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="bg-basic color-white bold"
                    >
                      파일첨부
                    </Button>
                  </Upload>
                </Col>
              </Row>
              <Row className="right mrt10">
                <Col span={24}>
                  <Button className="bg-basic color-white bold">취소</Button>
                  {'  '}
                  <Button className="bg-basic color-white bold">
                    저장
                  </Button>{' '}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ManualForm;
