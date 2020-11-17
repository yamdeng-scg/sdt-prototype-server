import React from 'react';
import { Row, Col, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
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
          left: 0
        }}
        className="bor-bottom"
      >
        <Row>
          <Col
            span={18}
            style={{ textAlign: 'left', paddingTop: 5, paddingLeft: 10 }}
          >
            <Title
              level={3}
              style={{ display: 'inline-block', marginRight: 20 }}
            >
              <Text className="color-basic" strong>
                서울도시가스
              </Text>
            </Title>
            <div style={{ display: 'inline-block' }}>
              <span className="bold font-em4 text">홍길동</span>{' '}
              <span className="font-em2 mrr5 inblock">상담사님</span> 2020-11-16
              {' | '}
              진행 10건 완료 10건
            </div>
          </Col>
          <Col
            span={6}
            style={{ textAlign: 'right', paddingTop: 10, paddingRight: 10 }}
          >
            <div className="inblock" onClick={this.openMemberStateChangePopup}>
              <span className="inblock mrr5 font-em1">상담중</span>
              <span
                className="inblock mrr5 bg-basic"
                style={{
                  padding: 6,
                  marginRight: 70,
                  borderRadius: '50%'
                }}
              />
            </div>

            <span className="inblock font-em1">
              로그아웃{' '}
              <LogoutOutlined
                className="color-basic bold"
                style={{ fontSize: 16 }}
              />
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TopHeader;
