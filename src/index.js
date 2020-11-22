import './resources/index.css';
import moment from 'moment';
import 'moment/locale/ko';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import rootStore from './stores/RootStore';
import AppHistory from './utils/AppHistory';
import * as serviceWorker from './serviceWorker';

// moment 전역 locale 설정
moment.locale('ko');

// state의 상태는 action을 통해서만 가능하게끔 셋팅
configure({
  enforceActions: 'always'
});

ReactDOM.render(
  <Provider {...rootStore}>
    <Router history={AppHistory}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
