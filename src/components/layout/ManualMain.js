import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { Row, Col } from 'antd';
import NotFound from '../NotFound';
import ManualDetail from '../manual/ManualDetail';
import ManualForm from '../manual/ManualForm';
import ManualList from '../manual/ManualList';
import ManualEmpty from '../manual/ManualEmpty';
import Constant from '../../config/Constant';

@withRouter
@inject('appStore', 'uiStore')
@observer
class ManualMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.uiStore.changeSideBarSelectMenuKName(
      Constant.SIDE_BAR_MENU_MANUAL
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={8}>
            <ManualList />
          </Col>
          <Col span={16}>
            <Switch>
              <Route
                exact
                path="/manual"
                render={props => <ManualEmpty {...props} />}
              />
              <Route
                exact
                path="/manual/:id/detail"
                render={props => <ManualDetail {...props} />}
              />
              <Route
                exact
                path="/manual/:id/update"
                render={props => <ManualForm {...props} />}
              />
              <Route
                exact
                path="/manual/create"
                render={props => <ManualForm {...props} />}
              />
              <Route component={NotFound} />
            </Switch>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ManualMain;
