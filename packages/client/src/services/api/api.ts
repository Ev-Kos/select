import { TOption, TResponse, TValue } from "../types";

const checkResponse = <T>(res: Response): Promise<T> => {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err))
}

const base_url = 'http://localhost:5000/';

export const getOptionsApi = () => {
  return fetch(`${base_url}options/for/select`)
    .then((res) => checkResponse<TOption[]>(res))
}

export const getResultOfSelectedOptionsApi = (data: TValue) => {
  return fetch(`${base_url}selected/option`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((res) => checkResponse<TResponse>(res))
}
