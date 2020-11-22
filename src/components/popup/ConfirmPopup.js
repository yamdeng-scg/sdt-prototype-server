import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Button } from 'antd';
import Constant from '../../config/Constant';

@inject('alertModalStore')
@observer
class ConfirmPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  ok() {
    let { alertModalStore, modalData } = this.props;
    if (modalData.ok) {
      alertModalStore.hideModal();
      modalData.ok();
    } else {
      alertModalStore.hideModal();
    }
  }

  cancel() {
    let modalData = this.props.modalData;
    if (modalData.cancel) {
      this.props.alertModalStore.hideModal();
      modalData.cancel();
    } else {
      this.props.alertModalStore.hideModal();
    }
  }

  render() {
    let { modalData } = this.props;
    let title = modalData.title;
    let body = modalData.body;
    let okLabel = modalData.okLabel || Constant.LABEL_MODAL_OK;
    let cancelLabel = modalData.cancelLabel || Constant.LABEL_MODAL_CANCEL;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>{title}</Col>
        </Row>
        <Row className="center pd-top10 mrb10">
          <Col span={24}>{body}</Col>
        </Row>
        <Row className="center">
          <Col span={12}>
            <Button block className="pd10 bold cancelbtn" onClick={this.cancel}>
              {cancelLabel}
            </Button>
          </Col>
          <Col span={12}>
            <Button block className="pd10 bold okbtn" onClick={this.ok}>
              {okLabel}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConfirmPopup;
