import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';

const { Text, Title } = Typography;

class TopHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openMemberStateChangePopup = this.openMemberStateChangePopup.bind(
      this
    );
  }

  openMemberStateChangePopup() {
    ModalService.openMiddlePopup(ModalType.MEMBER_STATE_CHANGE_POPUP, {});
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: 50,
          position: 'fixed',
          top: 0,
          left: 0,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Row>
          <Col
            span={12}
            style={{ textAlign: 'left', paddingTop: 5, paddingLeft: 10 }}
          >
            <Title
              level={3}
              style={{ display: 'inline-block', marginRight: 20 }}
            >
              <Text type="success" strong>
                서울도시가스
              </Text>
            </Title>
            <Text strong>
              홍길동 상담사님 2020년 10월21일 {'     '}진행 10건 완료 10건
            </Text>
          </Col>
          <Col
            span={12}
            style={{ textAlign: 'right', paddingTop: 5, paddingRight: 10 }}
          >
            <Button type="primary" shape="circle" style={{ padding: 0 }}>
              {' '}
            </Button>
            <span onClick={this.openMemberStateChangePopup}>상담중</span>{' '}
            로그아웃
          </Col>
        </Row>
      </div>
    );
  }
}

export default TopHeader;
