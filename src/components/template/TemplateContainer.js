import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import TemplateTree from './TemplateTree';
import TemplateSearch from './TemplateSearch';
import Constant from '../../config/Constant';

@withRouter
@inject('chatStore', 'uiStore')
@observer
class TemplateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.uiStore.changeSideBarSelectMenuKName(
      Constant.SIDE_BAR_MENU_TEMPLATE
    );
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={6}>
            <TemplateTree />
          </Col>
          <Col span={18}>
            <TemplateSearch />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TemplateContainer;
