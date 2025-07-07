import { getResultOfSelectedOptionsApi } from "../api/api";
import { AppThunk } from "../store";
import { TError, TResponse, TValue } from "../types";

export const RESULT_OF_SELECTED_OPTION__REQUEST: 'RESULT_OF_SELECTED_OPTION__REQUEST' = 'RESULT_OF_SELECTED_OPTION__REQUEST';
export const RESULT_OF_SELECTED_OPTION_SUCCESS: 'RESULT_OF_SELECTED_OPTION_SUCCESS' = 'RESULT_OF_SELECTED_OPTION_SUCCESS';
export const RESULT_OF_SELECTED_OPTION__FAILED: 'RESULT_OF_SELECTED_OPTION__FAILED' = 'RESULT_OF_SELECTED_OPTION__FAILED';

export interface IResultOfSelectedOptionRequest {
  readonly type: typeof RESULT_OF_SELECTED_OPTION__REQUEST;
}

export interface IResultOfSelectedOptionSuccess {
  readonly type: typeof RESULT_OF_SELECTED_OPTION_SUCCESS;
  readonly data: TResponse;
}

export interface IResultOfSelectedOptionFailed {
  readonly type: typeof RESULT_OF_SELECTED_OPTION__FAILED;
  readonly error: string;
}

export type TResultOfSelectedOptionActions =
  | IResultOfSelectedOptionRequest
  | IResultOfSelectedOptionSuccess
  | IResultOfSelectedOptionFailed;

export const ResultOfSelectedOptionRequest = (): IResultOfSelectedOptionRequest => ({
  type: RESULT_OF_SELECTED_OPTION__REQUEST
})

export const ResultOfSelectedOptionSuccess = (data: TResponse): IResultOfSelectedOptionSuccess => ({
  type: RESULT_OF_SELECTED_OPTION_SUCCESS,
  data
})

export const ResultOfSelectedOptionFailed = (error: string): IResultOfSelectedOptionFailed => ({
  type: RESULT_OF_SELECTED_OPTION__FAILED,
  error
})

export const resultOfSelectedOption: AppThunk = (data: TValue) => {
  return function(dispatch) {
    dispatch(ResultOfSelectedOptionRequest());
    getResultOfSelectedOptionsApi(data)
    .then((res) => dispatch(ResultOfSelectedOptionSuccess(res)))
    .catch(err => dispatch(ResultOfSelectedOptionFailed((err.error))))
  }
}
