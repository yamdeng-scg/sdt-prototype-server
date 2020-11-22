import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Input, Button, Select } from 'antd';
import Code from '../../config/Code';
const { TextArea } = Input;
const { Option } = Select;

@inject('alertModalStore')
@observer
class BlackCustomerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blockType: '', remark: '' };
    this.changeBlockType = this.changeBlockType.bind(this);
    this.changeRemark = this.changeRemark.bind(this);
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  changeBlockType(blockType) {
    this.setState({ blockType: blockType });
  }

  changeRemark(event) {
    this.setState({ remark: event.target.value });
  }

  ok() {
    let { alertModalStore, modalData } = this.props;
    let { blockType, remark } = this.state;
    if (modalData.ok) {
      alertModalStore.hideModal();
      modalData.ok(blockType, remark);
    } else {
      alertModalStore.hideModal();
    }
  }

  cancel() {
    this.props.alertModalStore.hideModal();
  }

  render() {
    let { blockType, remark } = this.state;
    let blockTypeCodeList = Code.blockTypeCodeList;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>관심고객 설정</Col>
        </Row>
        <div className="pd10">
          <Row className="mrb10">
            <Col span={4} className="center bold">
              지정사유
            </Col>
            <Col span={20}>
              <Select
                defaultValue="lucy"
                style={{ width: '100%' }}
                className="left"
                placeholder="상태를 선택해주세요"
                onChange={this.changeBlockType}
                value={blockType}
              >
                {blockTypeCodeList.map(code => {
                  return <Option value={code.value}>{code.name}</Option>;
                })}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={4} className="center bold">
              추가 메모
            </Col>
            <Col span={20}>
              <TextArea
                autoSize={false}
                onChange={this.changeRemark}
                value={remark}
              />
            </Col>
          </Row>
        </div>
        <Row className="center">
          <Col span={12}>
            <Button block className="pd10 bold cancelbtn" onClick={this.cancel}>
              취소
            </Button>
          </Col>
          <Col span={12}>
            <Button block className="pd10 bold okbtn" onClick={this.ok}>
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BlackCustomerPopup;
