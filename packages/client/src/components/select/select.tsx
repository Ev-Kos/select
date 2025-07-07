import { CSSProperties, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './select.module.css';
import { FixedSizeList } from 'react-window';

type TOption = {
  name: string;
  value: string;
}

type TSelectProps = {
  options: TOption[];
  onChange: (value: TOption | null) => void;
  name: string;
}

const dropdownDirectionState = {
  up: 'up',
  down: 'down'
}

export const Select = ({options, onChange, name}: TSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<TOption | null>(null);
  const [dropdownDirection, setDropdownDirection] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<FixedSizeList>(null);

  console.log(inputValue)
  const filteredOptions = useMemo(() => 
    options.filter(option => 
    option.name.toLowerCase().startsWith(inputValue.toLowerCase())
  ),[options, inputValue]);

  useEffect(() => {
    if (!isOpen || !selectRef.current) return;
    
    const selectRect = selectRef.current.getBoundingClientRect();
    const spaceBottom = window.innerHeight - selectRect.bottom;
    const spaceTop = selectRect.top;
    const listHeight = Math.min(filteredOptions.length * 35, 250);
    
    setDropdownDirection(
      spaceBottom >= listHeight || spaceBottom > spaceTop 
        ? dropdownDirectionState.down 
        : dropdownDirectionState.up
    );
  }, [isOpen, filteredOptions.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && e.target === selectRef.current) {
      clearInput();
      e.preventDefault();
      return;
    }

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'ArrowDown':
        setHighlightedIndex(prev => {
          const newIndex = Math.min(prev + 1, filteredOptions.length - 1);
          listRef.current?.scrollToItem(newIndex, 'auto');
          return newIndex;
        });
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => {
          const newIndex = Math.max(prev - 1, 0);
          listRef.current?.scrollToItem(newIndex, 'auto');
          return newIndex;
        });
        e.preventDefault();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      case 'Backspace':
        setSelectedOption(null);
        break;
      case 'Delete':
        setSelectedOption(null);
        break;
    }
  };

  useEffect(() => {
    if(inputValue.length === 0) {
      onChange(null)
      setSelectedOption(null)
    }
  }, [inputValue])

  const handleOptionSelect = useCallback((option: TOption) => {
    onChange(option);
    setInputValue(option.name)
    setSelectedOption(option);
    setIsOpen(false);
  }, [onChange]);

  const clearInput = () => {
    setInputValue('');
    setSelectedOption(null)
    if (inputRef.current) inputRef.current.focus();
  };

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const option = filteredOptions[index];
    const isSelected = selectedOption?.value === option.value;
    const isHighlighted = highlightedIndex === index;
    
    return (
      <div
        style={style}
        className={`${styles.option} ${isSelected ? styles.selected : ''} ${isHighlighted ? styles.highlighted : ''}`}
        onClick={() => handleOptionSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        {option.name}
      </div>
    );
  };

  return (
    <div 
      ref={selectRef}
      className={isOpen ? styles.selectOpen : styles.select}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsOpen(true)}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={() => setIsOpen(true)}
        className={styles.input}
        name={name}
      />
      {inputValue && (
        <button className={styles.clearButton} onClick={clearInput}>
          ×
        </button>
      )}
      <button 
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        ▼
      </button>

      {isOpen && dropdownDirection && (
        <div className={dropdownDirection === dropdownDirectionState.down ? styles.dropdownDown : styles.dropdownUp}>
          <FixedSizeList
            ref={listRef}
            height={Math.min(filteredOptions.length * 35, 250)}
            itemCount={filteredOptions.length}
            itemSize={35}
            width={250}
            key={filteredOptions.length}
          >
            {Row}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
}
