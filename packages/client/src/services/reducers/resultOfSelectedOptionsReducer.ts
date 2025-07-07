import { Reducer } from 'redux';
import { RESULT_OF_SELECTED_OPTION__REQUEST,
  RESULT_OF_SELECTED_OPTION_SUCCESS,
  RESULT_OF_SELECTED_OPTION__FAILED,
  TResultOfSelectedOptionActions
} from '../actions/resultOfSelectedOptionsActions';
import { TResponse } from '../types';

type TInitialState = {
  request: boolean;
  failed: boolean;
  result: TResponse | null;
  error: string;
}

const initialState: TInitialState = {
  request: false,
  failed: false,
  result: null,
  error: ''
}

export const resultOfSelectedOptionsReducer: Reducer<TInitialState, any> = (
  state = initialState, 
  action: TResultOfSelectedOptionActions
  ): TInitialState => {
    switch (action.type) {
      case RESULT_OF_SELECTED_OPTION__REQUEST:{
        return {
          ...state,
          request: true,
          failed: false,
          error: '',
          result: null
        }
      }
      case RESULT_OF_SELECTED_OPTION_SUCCESS: {
        return {
          ...state,
          request: false,
          result: action.data
        }
      }
      case RESULT_OF_SELECTED_OPTION__FAILED: {
        return {
          ...state,
          request: false,
          failed: true,
          error: action.error
        }
      }
      default: {
        return state;
      }
    }
}
