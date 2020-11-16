import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col } from 'antd';
import LinkManageLeftMenu from './LinkManageLeftMenu';
import LinkMenuList from './LinkMenuList';

class LinkManageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { match } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Col span={6} style={{ borderRight: '1px solid #f0f0f0' }}>
            <LinkManageLeftMenu />
          </Col>
          <Col span={18}>
            <Switch>
              <Route
                exact
                path={`${match.path}`}
                render={props => <LinkMenuList {...props} />}
              />
              <Route
                path={`${match.path}/links`}
                render={props => <LinkMenuList {...props} />}
              />
            </Switch>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LinkManageContainer;
