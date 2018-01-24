import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppReducer from './reducers';
import RootDrawer from './components/Menu';

// NOTE(chebert): why is a provider, a redux store, or appreducer necessary?
const store = createStore(AppReducer);

const App = () => (
  <Provider store={store}>
    <RootDrawer />
  </Provider>
);

export default App;
