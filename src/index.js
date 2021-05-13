import 'react-app-polyfill/stable';
import React from 'react';
import dva, { dynamic, router } from 'dva';
import createLoading from 'dva-loading';
import { createHashHistory } from 'history';
import axios from 'axios';

import LanguageProvider from 'components/LanguageProvider';
import createRoutes from '@/routes';
import 'assets/styles/index.less';
import config from './config';
import * as serviceWorker from './serviceWorker';
import $$ from "cmn-utils";

const { Router } = router;

// -> initialization
const app = dva({
  history: createHashHistory({
    basename: ''
  })
});

// -> Plugin
app.use(createLoading());
app.use({ onError: config.exception.global });

// -> request
axios.defaults.baseURL = '/api/v1';
axios.interceptors.response.use((response) => response, (error) => {
  if ((!!error.response.data.errors && error.response.data.errors === 401) || error.response.status === 401) setTimeout(() => window.location.reload(), 1000);
  config.notice.error(error.response.data);
  return Promise.reject(error);
});
axios.defaults.headers.common['X-localization'] = $$.getStore(config.store.language, "vi");

// -> Developer mock data
// if (process.env.NODE_ENV === 'development') {
//   require('./__mocks__');
// }

// -> loading
dynamic.setDefaultLoadingComponent(() => config.router.loading);

// -> Register global model
app.model(require('./models/global').default);

// -> Initialize route
app.router(({ history, app }) => (
  <LanguageProvider>
    <Router history={history}>{createRoutes(app)}</Router>
  </LanguageProvider>
));

// -> Start
app.start('#root');

// export global
export default {
  app,
  store: app._store,
  dispatch: app._store.dispatch
};

// If you want to be able to use offline, use register() instead of unregister(). May bring some problems, such as caching, etc.
// Related information can be found at https://bit.ly/CRA-PWA
serviceWorker.unregister();
