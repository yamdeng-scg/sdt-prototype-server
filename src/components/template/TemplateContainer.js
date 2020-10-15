import React from 'react';
import TemplateMenu from './TemplateMenu';
import TemplateSearch from './TemplateSearch';

class TemplateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <TemplateMenu />
        <TemplateSearch />
      </div>
    );
  }
}

export default TemplateContainer;
