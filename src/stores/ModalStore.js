import { observable, action } from 'mobx';

class ModalStore {
  // modalType : ModalType.js
  @observable modalType = '';

  // this.props.modalData 모달 커스텀 data
  @observable modalData = {};

  // 모달 show/hide 여부 : ModalContainer.js 참고
  @observable displayModal = false;

  @observable historyModalData = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  showModal(modalType, modalData, disableHistoryModalData = false) {
    this.modalType = modalType;
    modalData.modalType = modalType;
    this.modalData = modalData;
    this.modalData.modalType = modalType;
    this.displayModal = true;
    if (disableHistoryModalData) {
      this.historyModalData = [modalData];
    } else {
      this.historyModalData.push(modalData);
    }
  }

  @action
  hideModal() {
    if (this.historyModalData.length > 1) {
      this.modalData = this.historyModalData[this.historyModalData.length - 2];
      this.modalType = this.modalData.modalType;
      this.historyModalData.splice(-1, 1);
    } else {
      this.modalType = null;
      this.displayModal = false;
      this.historyModalData = [];
    }
  }

  @action
  hideAllModal() {
    this.displayModal = false;
    this.historyModalData = [];
  }
}

export default ModalStore;
