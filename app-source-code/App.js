import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppReducer from './reducers';
import RootDrawer from './components/Menu';

const store = createStore(AppReducer);

const App = () => (
  <Provider store={store}>
    <RootDrawer />
  </Provider>
);

export default App;
