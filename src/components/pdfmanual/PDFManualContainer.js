import React from 'react';
import PDFManualList from './PDFManualList';
import PDFManualDetail from './PDFManualDetail';

class PDFManualContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <PDFManualList />
        <PDFManualDetail />
      </div>
    );
  }
}

export default PDFManualContainer;
