import React from 'react';
import EmptyStartImage from '../../resources/images/star_empty.png';
import CloseImage from '../../resources/images/close.png';
import ModalType from '../../config/ModalType';
import ModalService from '../../services/ModalService';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openTemplateFormPopup = () => {
    ModalService.openMiddlePopup(ModalType.TEMPLATE_FORM_POPUP, {});
  };

  render() {
    let clientHeight = this.props.clientHeight;
    return (
      <React.Fragment>
        <div
          style={{
            height: clientHeight,
            overflowY: 'scroll',
            position: 'relative',
            padding: '0px 3px 50px 3px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                textAlign: 'center',
                padding: '11px 15px 9px',
                color: 'red'
              }}
            >
              <div>
                메시지 asdasdasdaasda
                <br />
                asdasd
              </div>
            </div>
          </div>
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
                  bottom: -2,
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
                      bottom: -2,
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
      </React.Fragment>
    );
  }
}

export default MessageList;
