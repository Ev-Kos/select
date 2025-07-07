import { getOptionsApi } from "../api/api";
import { AppThunk } from "../store";
import { TOption } from "../types";

export const GET_OPTIONS_SUCCESS: 'GET_OPTIONS_SUCCESS' = 'GET_OPTIONS_SUCCESS';
export const GET_OPTIONS_REQUEST: 'GET_OPTIONS_REQUEST' = 'GET_OPTIONS_REQUEST';
export const GET_OPTIONS_FAILED: 'GET_OPTIONS_FAILED' = 'GET_OPTIONS_FAILED';

export const SELECTED_OPTION: 'SELECTED_OPTION' = 'SELECTED_OPTION';

export interface IGetOptionsRequest {
  readonly type: typeof GET_OPTIONS_REQUEST;
}

export interface IGetOptionsSuccess {
  readonly type: typeof GET_OPTIONS_SUCCESS;
  readonly data: TOption[];
}

export interface IGetOptionsFailed {
  readonly type: typeof GET_OPTIONS_FAILED;
  readonly error: string;
}

export interface ISelectedOption {
  readonly type: typeof SELECTED_OPTION;
  readonly data: TOption | null;
}

export type TOptionsActions =
  | IGetOptionsRequest
  | IGetOptionsSuccess
  | IGetOptionsFailed
  | ISelectedOption;

export const GetOptionsRequest = (): IGetOptionsRequest => ({
  type: GET_OPTIONS_REQUEST
})

export const GetOptionsSuccess = (data: TOption[]): IGetOptionsSuccess => ({
  type: GET_OPTIONS_SUCCESS,
  data
})

export const GetOptionsFailed = (error: string): IGetOptionsFailed => ({
  type: GET_OPTIONS_FAILED,
  error
})

export const SelectedOption = (data: TOption | null): ISelectedOption => ({
  type: SELECTED_OPTION,
  data
})

export const getOptions: AppThunk = () => {
  return function(dispatch) {
    dispatch(GetOptionsRequest());
    getOptionsApi()
      .then(data => {
        dispatch(GetOptionsSuccess(data));    
      })
      .catch(error => {
        dispatch(GetOptionsFailed(error.error))       
      })
  }
}
