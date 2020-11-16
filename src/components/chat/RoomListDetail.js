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
  DatePicker
} from 'antd';
import Code from '../../config/Code';
import { ReloadOutlined } from '@ant-design/icons';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.',
  'Los Angeles battles huge wildfires.'
];

class RoomListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    return (
      <div>
        <p className="pd-top30 center bold font-em2 none">
          상담내역이 없습니다
        </p>
        <List
          dataSource={data}
          style={{
            overflowY: 'scroll',
            height: document.documentElement.clientHeight - 240
          }}
          renderItem={item => (
            <List.Item
              style={{
                position: 'relative'
              }}
              className="pd-left20 pd-right20 bor-bottom"
            >
              <p
                className="dot-fill"
                style={{ position: 'absolute', top: 15, left: 10 }}
              />{' '}
              오국환님 <Badge count={25} className="site-badge-count-room" />
              <Button
                type="primary"
                shape="round"
                size="small"
                style={{ position: 'absolute', top: 15, right: 15 }}
              >
                서울도시가스
              </Button>
              <div style={{ position: 'relative' }}>
                <Paragraph style={{ marginTop: 10, width: '75%' }} ellipsis>
                  Ant Design, a design language for background applications, is
                  refined by Ant UED Team. Ant Design, a design language for
                  background applications, is refined by Ant UED Team. Ant
                  Design, a design language for background applications, is
                  refined by Ant UED Team. Ant Design, a design language for
                  background applications, is refined by Ant UED Team. Ant
                  Design, a design language for background applications, is
                  refined by Ant UED Team. Ant Design, a design language for
                  background applications, is refined by Ant UED Team.
                </Paragraph>
                <p style={{ position: 'absolute', top: 0, right: 0 }}>
                  <span className="red">01:25:20</span>
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button
                  shape="round"
                  size="small"
                  onClick={this.openHitoryPopup}
                >
                  챗봇대화
                </Button>{' '}
                <Button
                  shape="round"
                  size="small"
                  onClick={this.openTalkMovePopup}
                >
                  상담하기
                </Button>{' '}
                <Button
                  shape="round"
                  size="small"
                  onClick={this.openAlertPopup}
                >
                  이관
                </Button>{' '}
                <Button
                  shape="round"
                  size="small"
                  onClick={this.openConfirmPopup}
                >
                  종료
                </Button>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default RoomListDetail;
