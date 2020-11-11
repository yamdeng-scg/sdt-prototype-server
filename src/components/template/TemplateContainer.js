import React from 'react';
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
        <TemplateTree />
        <TemplateSearch />
      </div>
    );
  }
}

export default TemplateContainer;
