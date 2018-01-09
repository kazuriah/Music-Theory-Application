import { combineReducers } from 'redux'
import { reducer as keys } from './keys'

const AppReducer = combineReducers({
  keys,
})

export default AppReducer;
