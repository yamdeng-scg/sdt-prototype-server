import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Select, message, Button } from 'antd';
import ApiService from '../../services/ApiService';
import Code from '../../config/Code';
const { Option } = Select;

@inject('alertModalStore', 'appStore')
@observer
class MemberStateChangePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { memberState: null };
  }

  changeState = state => {
    this.setState({ memberState: state });
  };

  updateMemberState = () => {
    let { appStore, alertModalStore } = this.props;
    let { profile } = appStore;
    let { memberState } = this.state;
    ApiService.put('member/' + profile.id + '/state', {
      state: memberState
    }).then(response => {
      let profile = response.data;
      message.success('상태가 변경되었습니다', 5);
      this.setState({ memberState: null });
      appStore.changeProfile(profile);
      alertModalStore.hideModal();
    });
  };

  closePopup = () => {
    this.props.alertModalStore.hideModal();
  };

  render() {
    let { memberState } = this.state;
    let memberStateCodeList = Code.memberStateCodeList;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>상담사 상태 변경</Col>
        </Row>
        <Row className="center">
          <Col span={24} className="pd10">
            <Select
              defaultValue="lucy"
              style={{ width: '100%' }}
              className="left"
              placeholder="상태를 선택해주세요"
              onChange={this.changeState}
              value={memberState}
            >
              {memberStateCodeList.map(code => {
                return <Option value={code.value}>{code.name}</Option>;
              })}
            </Select>
          </Col>
        </Row>
        <Row className="center">
          <Col span={12}>
            <Button
              block
              className="pd10 bold cancelbtn"
              onClick={this.closePopup}
            >
              취소
            </Button>
          </Col>
          <Col span={12}>
            <Button
              block
              className="pd10 bold okbtn"
              disabled={memberState === null}
              onClick={this.updateMemberState}
            >
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MemberStateChangePopup;
