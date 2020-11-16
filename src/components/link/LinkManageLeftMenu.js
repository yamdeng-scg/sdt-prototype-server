import React from 'react';

class LinkManageLeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div>링크관리</div>
            <div>상담 중 고객에게 발송하는 페이지 링크 관리</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default LinkManageLeftMenu;
