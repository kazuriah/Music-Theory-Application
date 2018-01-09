import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import AppReducer from './reducers'
import AppContainer from './AppContainer'

let store = createStore(AppReducer);

const App = () => (
    <Provider store={store}>
        <AppContainer />
    </Provider>
);

export default App;
