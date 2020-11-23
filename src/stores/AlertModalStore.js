import { observable, action } from 'mobx';

class AlertModalStore {
  // modalType : ModalType.js
  @observable modalType = '';

  // this.props.modalData 모달 커스텀 data
  @observable modalData = {};

  // 모달 show/hide 여부 : AlertModalContainer.js 참고
  @observable displayModal = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  showModal(modalType, modalData) {
    this.modalType = modalType;
    this.modalData = modalData || {};
    this.displayModal = true;
  }

  @action
  hideModal() {
    this.modalType = '';
    this.displayModal = false;
  }
}

export default AlertModalStore;
