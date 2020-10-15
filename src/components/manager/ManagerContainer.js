import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ManagerMenu from './ManagerMenu';
import StatsContiner from './StatsContiner';
import EmployeeList from './EmployeeList';
import TemplateCategory from './TemplateCategory';
import AutoMessage from './AutoMessage';
import BlackCustomerList from './BlackCustomerList';

class ManagerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { match } = this.props;
    return (
      <div>
        <ManagerMenu />
        <Switch>
          <Route
            exact
            path={match.path}
            render={(props) => <StatsContiner {...props} />}
          />
          <Route
            path={`${match.path}/stats`}
            render={(props) => <StatsContiner {...props} />}
          />
          <Route
            path={`${match.path}/emps`}
            render={(props) => <EmployeeList {...props} />}
          />
          <Route
            path={`${match.path}/category`}
            render={(props) => <TemplateCategory {...props} />}
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

export default ManagerContainer;
