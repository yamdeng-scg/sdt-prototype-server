import React from 'react';
import { Row, Col } from 'antd';
import TemplateTree from './TemplateTree';
import TemplateSearch from './TemplateSearch';

class TemplateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
