import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@withRouter
@inject('appStore', 'uiStore', 'managerStore')
@observer
class ManagerSettingLeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { uiStore, managerStore } = this.props;
    let { currentMenuIndex } = managerStore;
    return (
      <div>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li
            className={
              currentMenuIndex === 1
                ? 'bor-bottom pd10 bg-baisc-low'
                : 'bor-bottom pd10'
            }
            onClick={() => uiStore.goPage('/manager/members')}
          >
            <div className="font-em3 bold text">계정관리</div>
            <div className="color-basic bold mrt10">
              상담사 프로필 정보 확인 및 리스트 동기화
            </div>
          </li>
          <li
            className={
              currentMenuIndex === 2
                ? 'bor-bottom pd10 bg-baisc-low'
                : 'bor-bottom pd10'
            }
            onClick={() => uiStore.goPage('/manager/category')}
          >
            <div className="font-em3 bold text">템플릿 카테고리 관리</div>
            <div className="color-basic bold mrt10">
              답변템플릿 카테고리 확인 및 편집
            </div>
          </li>
          <li
            className={
              currentMenuIndex === 3
                ? 'bor-bottom pd10 bg-baisc-low'
                : 'bor-bottom pd10'
            }
            onClick={() => uiStore.goPage('/manager/autoMessage')}
          >
            <div className="font-em3 bold text">자동 메시지 관리</div>
            <div className="color-basic bold mrt10">
              고객 대화창 자동 전송 메시지 문구 관리
            </div>
          </li>
          <li
            className={
              currentMenuIndex === 4
                ? 'bor-bottom pd10 bg-baisc-low'
                : 'bor-bottom pd10'
            }
            onClick={() => uiStore.goPage('/manager/blackCustomer')}
          >
            <div className="font-em3 bold text">관심고객 관리</div>
            <div className="color-basic bold mrt10">
              상담채팅 시 강성 클레임 고객 관리
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default ManagerSettingLeftMenu;
