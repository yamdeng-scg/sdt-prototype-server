import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import SideBar from '../layout/SideBar';
import TopHeader from '../layout/TopHeader';
import ChatContainer from '../chat/ChatContainer';
import TemplateContainer from '../template/TemplateContainer';
import CompanyStatsContainer from '../stats/CompanyStatsContainer';
import ManagerSettingContainer from '../manager/ManagerSettingContainer';
import LinkManageContainer from '../link/LinkManageContainer';

@withRouter
@inject('appStore', 'uiStore')
@observer
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let { appStore } = this.props;
    appStore.loadProfile();
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <TopHeader />
          <SideBar />
          <div
            style={{
              height: '100%',
              marginLeft: 100,
              marginTop: 50
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
                exact
                path="/stats"
                render={props => <CompanyStatsContainer {...props} />}
              />
              <Route
                path="/manager"
                render={props => <ManagerSettingContainer {...props} />}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Main;
