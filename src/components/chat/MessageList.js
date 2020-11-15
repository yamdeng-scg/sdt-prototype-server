import React from 'react';
import { Row, Col, Input } from 'antd';
import {
  CloseOutlined,
  UpCircleTwoTone,
  DownCircleTwoTone
} from '@ant-design/icons';
import EmptyStartImage from '../../resources/images/star_empty.png';
import CloseImage from '../../resources/images/close.png';
import ModalType from '../../config/ModalType';
import ModalService from '../../services/ModalService';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openTemplateFormPopup = this.openTemplateFormPopup.bind(this);
  }

  openTemplateFormPopup() {
    ModalService.openMiddlePopup(ModalType.TEMPLATE_FORM_POPUP, {});
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            height: 200,
            overflowY: 'scroll',
            paddingBottom: 100,
            position: 'relative',
            padding: '0px 3px 0px 3px'
          }}
        >
          <div style={{ textAlign: 'right', marginBottom: 15 }}>
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                position: 'relative',
                borderRadius: '13px 0px 13px 13px',
                backgroundColor: '#78c0fd',
                textAlign: 'left',
                padding: '11px 15px 9px',
                color: '#fff'
              }}
            >
              <div>메시지 asdasdasdaasda</div>
              <div
                style={{
                  position: 'absolute',
                  left: -70,
                  bottom: 0,
                  textAlign: 'right',
                  color: 'black'
                }}
              >
                <span
                  style={{
                    backgroundImage: `url(${EmptyStartImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16,
                    display: 'inline-block'
                  }}
                  onClick={this.openTemplateFormPopup}
                />
                <span
                  style={{
                    backgroundImage: `url(${CloseImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16,
                    display: 'inline-block'
                  }}
                />
                <div style={{ color: '#a2a2a2' }}>오후 12:56</div>
              </div>
            </div>
          </div>
          {/* left messsage */}
          {data.map(info => {
            return (
              <div style={{ textAlign: 'left', marginBottom: 15 }}>
                <div
                  style={{
                    maxWidth: '80%',
                    display: 'inline-block',
                    position: 'relative',
                    borderRadius: '13px 0px 13px 13px',
                    backgroundColor: '#78c0fd',
                    textAlign: 'left',
                    padding: '11px 15px 9px',
                    color: '#fff'
                  }}
                >
                  <div>메시지 asdasdasdaasda</div>
                  <div
                    style={{
                      position: 'absolute',
                      right: -70,
                      bottom: 0,
                      textAlign: 'left',
                      color: 'black'
                    }}
                  >
                    <span
                      style={{
                        backgroundImage: `url(${EmptyStartImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left top',
                        width: 16,
                        height: 16,
                        display: 'inline-block'
                      }}
                    />
                    <span
                      style={{
                        backgroundImage: `url(${CloseImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left top',
                        width: 16,
                        height: 16,
                        display: 'inline-block'
                      }}
                    />
                    <div style={{ color: '#a2a2a2' }}>오후 12:56</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Button type="primary" shape="circle" size="large">
            검색
          </Button>{' '}
          <Button type="primary" shape="circle" size="large">
            이관
          </Button>{' '}
          <Button type="primary" shape="circle" size="large">
            종료
          </Button>
        </div> */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '0px 10px',
            marginBottom: 5,
            zIndex: 10
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '13px 13px 13px 13px',
              border: '1px solid #cac8c8',
              padding: 5,
              display: 'none'
            }}
          >
            <Row style={{ marginBottom: 5 }}>
              <Col span={8} offset={8} style={{ textAlign: 'center' }}>
                대화내용 검색
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <CloseOutlined />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Input style={{ width: '85%' }} allowClear />{' '}
                <UpCircleTwoTone style={{ fontSize: 20 }} /> {'  '}
                <DownCircleTwoTone style={{ fontSize: 20 }} />
              </Col>
            </Row>
          </div>
          {/* <Button type="primary" shape="circle" size="large">
            검색
          </Button>{' '}
          <Button type="primary" shape="circle" size="large">
            이관
          </Button>{' '}
          <Button type="primary" shape="circle" size="large">
            종료
          </Button> */}
        </div>
      </React.Fragment>
    );
  }
}

export default MessageList;
