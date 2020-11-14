import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'antd';
import ModalType from '../../config/ModalType';
import AlertPopup from '../popup/AlertPopup';
import ConfirmPopup from '../popup/ConfirmPopup';
import BlackCustomerPopup from '../popup/BlackCustomerPopup';
import ChatBotHistroyPopup from '../popup/ChatBotHistroyPopup';
import JoinHistoryPopup from '../popup/JoinHistoryPopup';
import ManualTagListPopup from '../popup/ManualTagListPopup';
import MemberStateChangePopup from '../popup/MemberStateChangePopup';
import MinwonAddPopup from '../popup/MinwonAddPopup';
import TalkMovePopup from '../popup/TalkMovePopup';
import TemplateFormPopup from '../popup/TemplateFormPopup';

@inject('alertModalStore')
@observer
class ModalContainer extends React.Component {
  render() {
    let modalComponent = null;
    let alertModalStore = this.props.alertModalStore;
    let { modalType, modalData, displayModal } = alertModalStore;
    switch (modalType) {
      case ModalType.ALERT_POPUP:
        modalComponent = <AlertPopup modalData={modalData} />;
        break;
      case ModalType.CONFRIM_POPUP:
        modalComponent = <ConfirmPopup modalData={modalData} />;
        break;
      case ModalType.BLACK_CUSTOMER_POPUP:
        modalComponent = <BlackCustomerPopup modalData={modalData} />;
        break;
      case ModalType.CHAT_BOT_HISTORY_POPUP:
        modalComponent = <ChatBotHistroyPopup modalData={modalData} />;
        break;
      case ModalType.JOIN_HISTORY_POPUP:
        modalComponent = <JoinHistoryPopup modalData={modalData} />;
        break;
      case ModalType.MANUAL_TAGLIST_POPUP:
        modalComponent = <ManualTagListPopup modalData={modalData} />;
        break;
      case ModalType.MEMBER_STATE_CHANGE_POPUP:
        modalComponent = <MemberStateChangePopup modalData={modalData} />;
        break;
      case ModalType.MINWON_ADD_POPUP:
        modalComponent = <MinwonAddPopup modalData={modalData} />;
        break;
      case ModalType.TALK_MOVE_POPUP:
        modalComponent = <TalkMovePopup modalData={modalData} />;
        break;
      case ModalType.TEMPLATE_FORM_POPUP:
        modalComponent = <TemplateFormPopup modalData={modalData} />;
        break;
      default:
        break;
    }
    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        visible={displayModal}
        footer={null}
        onCancel={() => alertModalStore.hideModal()}
      >
        {modalComponent}
      </Modal>
    );
  }
}

export default ModalContainer;
