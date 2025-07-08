import { KeyboardEvent, MouseEvent, ReactNode, useRef } from 'react';
import styles from './button.module.css';

type TButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick: VoidFunction;
}

export const Button = ({children, disabled, onClick, ...props}: TButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    onClick();
    buttonRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !disabled) {
      e.preventDefault();
      onClick();
      buttonRef.current?.blur();
    }
  };

  return (
    <div 
      role="button"
      tabIndex={disabled ? -1 : 0}
      ref={buttonRef}
      className={`${styles.button} ${disabled && styles.disabled}`}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}>
      {children}
    </div>
  )
}
