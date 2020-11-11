import React from 'react';
import ManualList from './ManualList';
import ManualDetail from './ManualDetail';

class ManualContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ManualList />
        <ManualDetail />
      </div>
    );
  }
}

export default ManualContainer;
