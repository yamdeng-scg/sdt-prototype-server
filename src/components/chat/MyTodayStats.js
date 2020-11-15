import React from 'react';
import {
  Tabs,
  Button,
  Badge,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  List,
  Typography,
  DatePicker,
  Divider
} from 'antd';
import Code from '../../config/Code';
import { ReloadOutlined } from '@ant-design/icons';
const { Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.'
];

class MyTodayStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    return (
      <div
        style={{
          boxShadow: '0 0 50px 10px rgba(175,175,175,.5)',
          height: '100%'
        }}
      >
        <div style={{ padding: 10 }}>
          <p>
            상담대기 <span>1</span>건
          </p>
          <p>
            최장 대기시간<span>00:00:25</span>
          </p>
          <Button type="primary" shape="round" block>
            대기상담 가져오기
          </Button>
        </div>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{ padding: '0px 5px 0px 5px', marginBottom: 0 }}
        >
          <TabPane tab={<Badge status="success">진행</Badge>} key="1">
            <Row style={{ padding: 5 }}>
              <Col span={8}>
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
                </Select>
              </Col>
              <Col span={16}>
                <Search
                  placeholder="검색어를 입력하세요"
                  onSearch={value => console.log(value)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
            <Row
              style={{
                padding: 10,
                borderTop: '1px solid #f0f0f0'
              }}
            >
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>

            <List
              bordered
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <span className="dot-fill" /> 오국환님{' '}
                  <Button type="primary" shape="round" size="small">
                    서울도시가스
                  </Button>
                  <Paragraph ellipsis>
                    Ant Design, a design language for background applications,
                    is refined by Ant UED Team. Ant Design, a design language
                    for background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team.
                  </Paragraph>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="종료" key="2">
            <Row style={{ padding: 5, borderBottom: '1px solid #f0f0f0' }}>
              <Col span={24}>
                <RangePicker style={{ width: '90%' }} /> <ReloadOutlined />
              </Col>
            </Row>
            <Row style={{ padding: 10 }}>
              <Col span={24}>
                <Checkbox onChange={() => {}}>내상담만 보기</Checkbox>
              </Col>
            </Row>
            <List
              bordered
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <span className="dot-fill" /> 오국환님{' '}
                  <Button type="primary" shape="round" size="small">
                    서울도시가스
                  </Button>
                  <Paragraph ellipsis>
                    Ant Design, a design language for background applications,
                    is refined by Ant UED Team. Ant Design, a design language
                    for background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team. Ant
                    Design, a design language for background applications, is
                    refined by Ant UED Team. Ant Design, a design language for
                    background applications, is refined by Ant UED Team.
                  </Paragraph>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MyTodayStats;
