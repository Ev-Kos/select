import { Reducer } from 'redux';
import { GET_OPTIONS_SUCCESS,
  GET_OPTIONS_REQUEST,
  GET_OPTIONS_FAILED,
  SELECTED_OPTION,
  TOptionsActions
} from '../actions/optionsAction';
import { TOption } from '../types';

type TInitialState = {
  request: boolean;
  failed: boolean;
  options: TOption[];
  selectedOption: TOption | null;
  error: string;
}

const initialState: TInitialState = {
  request: false,
  failed: false,
  options: [],
  error: '',
  selectedOption: null
}

export const optionsReducer: Reducer<TInitialState, any> = (
  state = initialState, 
  action: TOptionsActions
  ): TInitialState => {
    switch (action.type) {
      case GET_OPTIONS_REQUEST:{
        return {
          ...state,
          request: true,
          failed: false,
          error: ''
        }
      }
      case GET_OPTIONS_SUCCESS: {
        return {
          ...state,
          request: false,
          options: action.data
        }
      }
      case GET_OPTIONS_FAILED: {
        return {
          ...state,
          request: false,
          failed: true,
          error: action.error
        }
      }
      case SELECTED_OPTION: {
        return {
          ...state,
          selectedOption: action.data,
        }
      }
      default: {
        return state;
      }
    }
}
