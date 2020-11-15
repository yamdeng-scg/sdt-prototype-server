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
  Card
} from 'antd';
import Code from '../../config/Code';
import { ReloadOutlined } from '@ant-design/icons';
const { Title } = Typography;
const gridStyle = {
  width: '20%',
  textAlign: 'center',
  border: '0px',
  padding: 30
};

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
    return (
      <div
        style={{
          padding: 30,
          height: '100%'
        }}
      >
        <div>
          <Row>
            <Col span={12}>
              <Title level={3} style={{ display: 'inline-block' }}>
                상담 도우미
              </Title>
              <span style={{ display: 'inline-block' }}>asdasdsad</span>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button>자세히보기</Button>
            </Col>
          </Row>
        </div>
        <div>나의 상담 요약</div>
        <div className="none-border">
          <Card title={null} bordered={false}>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
          </Card>
        </div>
        <div>나의 상담 시간 분석</div>
        <div className="none-border">
          <Card title={null} bordered={false}>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <div style={{ textAlign: 'center' }}>대기</div>
              <div style={{ textAlign: 'center' }}>0</div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default MyTodayStats;
