import styles from './app.module.css';
import { Button } from './components/button/button';
import { Select } from './components/select/select';

const App = () => {

  const sendRequest = () => {
    console.log('click')
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select</h1>
      <div className={styles.component}>
        <Select />
        <Button onClick={sendRequest}>Отправить</Button>
      </div>
    </div>
  );
};

export default App;
