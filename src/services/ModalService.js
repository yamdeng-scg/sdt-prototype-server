import rootStore from '../stores/RootStore';
import ModalType from '../config/ModalType';

class ModalService {
  // AlertModal 모달 오픈
  alert(modalData) {
    rootStore.alertModalStore.showModal(ModalType.ALERT, modalData);
  }

  // ConfirmModal 모달 오픈
  confirm(modalData) {
    rootStore.alertModalStore.showModal(ModalType.CONFIRM, modalData);
  }

  // AlertModalContainer에 정의한 모달 오픈
  openMiddlePopup(modalType, modalData) {
    rootStore.alertModalStore.showModal(modalType, modalData);
  }

  // ModalContainer에 정의한 모달 오픈
  openFullPopup(modalType, modalData) {
    rootStore.modalStore.showModal(modalType, modalData);
  }

  // AlertModalContainer에 정의한 모달 닫기
  closeMiddlePopup() {
    rootStore.alertModalStore.hideModal();
  }

  // ModalContainer에 정의한 모달 닫기
  closeFullPopup() {
    rootStore.modalStore.hideModal();
  }
}

export default new ModalService();
