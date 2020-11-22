import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Select, Button } from 'antd';
import _ from 'lodash';
import ApiService from '../../services/ApiService';
const { Option } = Select;

@inject('alertModalStore')
@observer
class TalkMovePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberSelectList: [{ name: '상담 대기건으로 보내기', id: '' }],
      transferValue: ''
    };
    this.changeTransferValue = this.changeTransferValue.bind(this);
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  changeTransferValue(transferValue) {
    this.setState({ transferValue: transferValue });
  }

  ok() {
    let { alertModalStore, modalData } = this.props;
    let { transferValue, memberSelectList } = this.state;
    let searchIndex = _.findIndex(
      memberSelectList,
      info => info.id === transferValue
    );
    let selectInfo = null;
    if (searchIndex !== -1) {
      selectInfo = memberSelectList[searchIndex];
    }
    if (modalData.ok) {
      alertModalStore.hideModal();
      modalData.ok(transferValue, selectInfo);
    } else {
      alertModalStore.hideModal();
    }
  }

  cancel() {
    this.props.alertModalStore.hideModal();
  }

  componentDidMount() {
    ApiService.get('member').then(response => {
      let data = response.data.data;
      let memberSelectList = this.state.memberSelectList.concat(data);
      this.setState({ memberSelectList: memberSelectList });
    });
  }

  render() {
    let { modalData } = this.props;
    let { memberSelectList, transferValue } = this.state;
    let { customerName } = modalData;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>상담 이관</Col>
        </Row>
        <Row className="center pd-top10">
          <Col span={24}>
            <span className="bold font-em1">'{customerName}'</span>님의
            상담채팅을 어디로 이관하시겠습니까?
          </Col>
        </Row>
        <Row className="center mrb10">
          <Col span={24} className="pd10">
            <Select
              value={transferValue}
              className="left"
              style={{ width: '100%' }}
              onChange={this.changeTransferValue}
            >
              {memberSelectList.map(info => {
                return <Option value={info.id}>{info.name}</Option>;
              })}
            </Select>
          </Col>
        </Row>
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

export default TalkMovePopup;
