import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import SideBar from '../layout/SideBar';
import ChatContainer from '../chat/ChatContainer';
import TemplateContainer from '../template/TemplateContainer';
import ManagerSettingContainer from '../manager/ManagerSettingContainer';
import LinkManageContainer from '../link/LinkManageContainer';

@withRouter
@inject('appStore', 'uiStore')
@observer
class AdminMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ height: '100%' }}>
          <SideBar />
          <div
            style={{
              height: '100%',
              marginLeft: 110
            }}
          >
            <Switch>
              <Route
                exact
                path="/"
                render={props => <ChatContainer {...props} />}
              />
              <Route
                exact
                path="/chat"
                render={props => <ChatContainer {...props} />}
              />
              <Route
                exact
                path="/template"
                render={props => <TemplateContainer {...props} />}
              />
              <Route
                path="/manager"
                render={props => <ManagerSettingContainer {...props} />}
              />
              <Route
                path="/link"
                render={props => <LinkManageContainer {...props} />}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminMain;
