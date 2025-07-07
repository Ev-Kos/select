import styles from './info-message.module.css';

type TInfoMessageProps = {
  text: string;
  className?: string;
}

export const InfoMessage = ({text, className}: TInfoMessageProps) => {
  return (
    <p className={`${styles.info} ${className}`}>{text}</p> 
  )
}
