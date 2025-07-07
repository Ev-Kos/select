import { combineReducers } from 'redux';
import { optionsReducer } from './optionsReducer';
import { resultOfSelectedOptionsReducer } from './resultOfSelectedOptionsReducer';

const rootReducer = combineReducers({
  optionsReducer,
  resultOfSelectedOptionsReducer
})
  
export default rootReducer;
