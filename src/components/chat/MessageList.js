import React from 'react';
import { Row, Col, Button } from 'antd';
import EmptyStartImage from '../../resources/images/star_empty.png';
import CloseImage from '../../resources/images/close.png';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
                ></span>
                <span
                  style={{
                    backgroundImage: `url(${CloseImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16,
                    display: 'inline-block'
                  }}
                ></span>
                <div style={{ color: '#a2a2a2' }}>오후 12:56</div>
              </div>
            </div>
          </div>
          {/* left messsage */}
          {data.map((info) => {
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
                    ></span>
                    <span
                      style={{
                        backgroundImage: `url(${CloseImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left top',
                        width: 16,
                        height: 16,
                        display: 'inline-block'
                      }}
                    ></span>
                    <div style={{ color: '#a2a2a2' }}>오후 12:56</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Button type="primary" shape="circle" size="large">
            검색
          </Button>{' '}
          <Button type="primary" shape="circle" size="large">
            이관
          </Button>{' '}
          <Button type="primary" shape="circle" size="large">
            종료
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default MessageList;
