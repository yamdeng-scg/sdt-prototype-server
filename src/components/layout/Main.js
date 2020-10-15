import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import ChatContainer from '../chat/ChatContainer';
import TemplateContainer from '../template/TemplateContainer';
import PDFManualContainer from '../pdfmanual/PDFManualContainer';
import ManagerContainer from '../manager/ManagerContainer';

@withRouter
@inject('appStore', 'uiStore')
@observer
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route
            exact
            path="/chat"
            render={(props) => <ChatContainer {...props} />}
          />
          <Route
            exact
            path="/template"
            render={(props) => <TemplateContainer {...props} />}
          />
          <Route
            exact
            path="/pdfmanual"
            render={(props) => <PDFManualContainer {...props} />}
          />
          <Route
            path="/manager"
            render={(props) => <ManagerContainer {...props} />}
          />
          <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default Main;
