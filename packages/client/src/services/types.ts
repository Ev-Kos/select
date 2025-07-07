export type TOption = {
  name: string;
  value: string;
}

export type TValue = Omit<TOption, 'name'>;

export type TResponse = {
  message: string
}

export type TError = {
  error: string
}
