import React from 'react';
import Constant from '../../config/Constant';
import moment from 'moment';

const replaceHighLighText = function(message, searchValue) {
  let resultMessage = message;
  if (searchValue) {
    var regEx = new RegExp(searchValue, 'g');
    resultMessage = message.replace(
      regEx,
      '<span class="bg-yellow color-black">' + searchValue + '</span>'
    );
  }
  return resultMessage;
};

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  convertMessageListToComponet() {
    let { messageList, searchValue } = this.props;
    let messsageListComponent = messageList.map(messageInfo => {
      let isEmployee = messageInfo.isEmployee;
      let isSystemMessage = messageInfo.isSystemMessage;
      let messageType = messageInfo.messageType;
      let messageId = messageInfo.id;
      let message = messageInfo.message;
      let messageDetail = messageInfo.messageDetail;
      let noReadCount = messageInfo.noReadCount;
      let resultMessage = messageDetail ? messageDetail : message;
      let messageComponent = null;
      resultMessage = replaceHighLighText(resultMessage, searchValue);
      resultMessage = resultMessage.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      if (isSystemMessage) {
        messageComponent = (
          <div
            id={messageId + 'message'}
            key={messageId}
            style={{ textAlign: 'center', marginBottom: 15 }}
          >
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                textAlign: 'center',
                padding: '11px 15px 9px',
                color: 'red'
              }}
            >
              <div>{message}</div>
            </div>
          </div>
        );
      } else if (isEmployee) {
        messageComponent = (
          <div
            id={messageId + 'message'}
            key={messageId}
            style={{ textAlign: 'right', marginBottom: 15 }}
          >
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                position: 'relative',
                borderRadius: '13px 0px 13px 13px',
                backgroundColor:
                  messageType === Constant.MESSAGE_TYPE_LINK
                    ? 'orange'
                    : '#78c0fd',
                fontWeight:
                  messageType === Constant.MESSAGE_TYPE_LINK ? 'bold' : '',
                textAlign: 'left',
                padding: '11px 15px 9px',
                color: '#fff'
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: resultMessage
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -82,
                  bottom: -2,
                  textAlign: 'right',
                  color: 'black'
                }}
              >
                <div style={{ color: '#a2a2a2' }}>
                  <span className={noReadCount ? 'red' : 'none'}>
                    {noReadCount}
                  </span>
                  {moment(messageInfo.createDate).format('LTS')}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        messageComponent = (
          <div
            id={messageId + 'message'}
            key={messageId}
            style={{ textAlign: 'left', marginBottom: 15 }}
          >
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                position: 'relative',
                borderRadius: '13px 0px 13px 13px',
                backgroundColor:
                  messageType === Constant.MESSAGE_TYPE_LINK
                    ? 'orange'
                    : '#78c0fd',
                fontWeight:
                  messageType === Constant.MESSAGE_TYPE_LINK ? 'bold' : '',
                textAlign: 'left',
                padding: '11px 15px 9px',
                color: '#fff'
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: resultMessage
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -82,
                  bottom: -2,
                  textAlign: 'left',
                  color: 'black'
                }}
              >
                <div style={{ color: '#a2a2a2' }}>
                  {moment(messageInfo.createDate).format('LTS')}
                  <span className={noReadCount ? 'red' : 'none'}>
                    {noReadCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return messageComponent;
    });
    return messsageListComponent;
  }

  render() {
    let { clientHeight, index } = this.props;
    let messsageListComponent = this.convertMessageListToComponet();
    return (
      <React.Fragment>
        <div
          style={{
            height: clientHeight,
            overflowY: 'scroll',
            position: 'relative',
            padding: '10px 10px 90px 10px'
          }}
          id={'messageListScroll' + index}
        >
          {messsageListComponent}
        </div>
      </React.Fragment>
    );
  }
}

export default MessageList;
