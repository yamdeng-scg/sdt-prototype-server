import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ManagerSettingLeftMenu from './ManagerSettingLeftMenu';
import MemberList from './MemberList';
import TemplateCategoryContainer from './TemplateCategoryContainer';
import AutoMessage from './AutoMessage';
import BlackCustomerList from './BlackCustomerList';

class ManagerSettingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { match } = this.props;
    return (
      <div>
        <ManagerSettingLeftMenu />
        <Switch>
          <Route
            path={`${match.path}/members`}
            render={(props) => <MemberList {...props} />}
          />
          <Route
            path={`${match.path}/category`}
            render={(props) => <TemplateCategoryContainer {...props} />}
          />
          <Route
            path={`${match.path}/autoMessage`}
            render={(props) => <AutoMessage {...props} />}
          />
          <Route
            path={`${match.path}/blackCustomer`}
            render={(props) => <BlackCustomerList {...props} />}
          />
        </Switch>
      </div>
    );
  }
}

export default ManagerSettingContainer;
