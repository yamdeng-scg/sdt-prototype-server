import React from 'react';

class ManagerSettingLeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div>계정관리</div>
            <div>상담사 프로필 정보 확인 및 리스트 동기화</div>
          </li>
          <li style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div>계정관리</div>
            <div>상담사 프로필 정보 확인 및 리스트 동기화</div>
          </li>
          <li style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div>계정관리</div>
            <div>상담사 프로필 정보 확인 및 리스트 동기화</div>
          </li>
          <li style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div>계정관리</div>
            <div>상담사 프로필 정보 확인 및 리스트 동기화</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default ManagerSettingLeftMenu;
