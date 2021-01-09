import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import config from "./aws-exports";
import Amplify from "aws-amplify";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/reducers';
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

Amplify.configure(config);
const render = () => {
  ReactDOM.render(
      <Provider store={store}><App /></Provider>, document.getElementById('root'));
};

store.subscribe(render);
render();

