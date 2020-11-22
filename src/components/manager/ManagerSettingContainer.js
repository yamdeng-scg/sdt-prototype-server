import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Row, Col } from 'antd';
import ManagerSettingLeftMenu from './ManagerSettingLeftMenu';
import MemberList from './MemberList';
import TemplateCategoryContainer from './TemplateCategoryContainer';
import AutoMessage from './AutoMessage';
import BlackCustomerList from './BlackCustomerList';
import Constant from '../../config/Constant';

@withRouter
@inject('appStore', 'uiStore')
@observer
class ManagerSettingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.uiStore.changeSideBarSelectMenuKName(
      Constant.SIDE_BAR_MENU_MANAGER
    );
  }

  render() {
    let { match } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Col span={6} className="bor-right">
            <ManagerSettingLeftMenu />
          </Col>
          <Col span={18} className="pd10">
            <Switch>
              <Route
                exact
                path={`${match.path}`}
                render={props => <MemberList {...props} />}
              />
              <Route
                path={`${match.path}/members`}
                render={props => <MemberList {...props} />}
              />
              <Route
                path={`${match.path}/category`}
                render={props => <TemplateCategoryContainer {...props} />}
              />
              <Route
                path={`${match.path}/autoMessage`}
                render={props => <AutoMessage {...props} />}
              />
              <Route
                path={`${match.path}/blackCustomer`}
                render={props => <BlackCustomerList {...props} />}
              />
            </Switch>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ManagerSettingContainer;
