import { useEffect, useMemo, useState } from 'react';
import styles from './app.module.css';
import { Button } from './components/button/button';
import { Select } from './components/select/select';
import { TOption } from './services/types';
import { useAppDispatch, useAppSelector } from './services/store';
import { getOptions, SelectedOption } from './services/actions/optionsAction';
import { resultOfSelectedOption } from './services/actions/resultOfSelectedOptionsActions';
import { InfoMessage } from './components/info-message/info-message';

const App = () => {

  const {options, request, error, selectedOption} = useAppSelector((store) => store.optionsReducer);
  const {request: sendOption, error: sendOptionError, result} = useAppSelector((store) => store.resultOfSelectedOptionsReducer);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('')

  useEffect(() => {
    try {
      dispatch(getOptions())
    } catch (error) {
      console.error(`Ошибка getOptions: ${error}`)
    }
  }, [])

  const sendRequest = () => {
    if (selectedOption) {
      try {
        dispatch(resultOfSelectedOption({ value: selectedOption.value }))
      } catch (error) {
        console.error(`Ошибка resultOfSelectedOption: ${error}`)
      }
    }
  }

  const onChange = (option: TOption | null) => {
    dispatch(SelectedOption(option))
  }

  const info = useMemo(() => {
    return error.length !== 0
      ? error
      : sendOptionError.length !== 0
      ? sendOptionError
      : result
      ? result.message
      : ''
  }, [error, sendOptionError, result])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{request ? '...Загрузка' : 'Select'}</h1>
      <div className={styles.componentsWrap}>
        {options.length !== 0 && (
          <div className={styles.selectAndButtton}>
            <Select options={options} 
              onChange={(option) => onChange(option)} 
              name='numbers'
            />
            <Button onClick={sendRequest}>Отправить</Button>
          </div>
        )}
        {!options || options.length === 0 && (
          <p className={styles.title}>К сожалению, данные не загрузились</p>
        )}
        <InfoMessage text={info} />
      </div>
    </div>
  );
};

export default App;
