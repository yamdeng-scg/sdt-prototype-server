import React from 'react';
import Logger from '../utils/Logger';
import AnalyticsService from '../services/AnalyticsService';

const HOC = {};

// document.title 변경 및 title 기준으로 페이징 트래킹
const documentTitle = (title, category) => (WrappedComponent) =>
  class WithSubscription extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {};
    }
    componentDidMount() {
      document.title = title;
      AnalyticsService.sendPageInfo({ pageName: title, category: category });
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

HOC.documentTitle = documentTitle;

export default HOC;
