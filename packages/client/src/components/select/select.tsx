import { 
  CSSProperties, 
  KeyboardEvent, 
  MouseEvent as ReactMouseEvent, 
  ChangeEvent,
  useCallback, 
  useEffect, 
  useMemo, 
  useRef, 
  useState 
} from 'react';
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

const DROPDOWN_DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN'
} as const;

export const Select = ({ options, onChange, name }: TSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedOption, setSelectedOption] = useState<TOption | null>(null);
  const [dropdownDirection, setDropdownDirection] = 
    useState<keyof typeof DROPDOWN_DIRECTION | ''>('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<FixedSizeList>(null);
  
  const filteredOptions = useMemo(() => 
    options.filter(option => 
      option.name.toLowerCase().startsWith(inputText.toLowerCase())
    ),
    [options, inputText]
  );

  useEffect(() => {
    if (!isOpen) return;
    
    const selectedIndex = selectedOption 
      ? filteredOptions.findIndex(opt => opt.value === selectedOption.value) 
      : -1;
      
    const newIndex = Math.max(
      selectedIndex, 
      filteredOptions.length > 0 ? 0 : -1
    );
    
    setHighlightedIndex(newIndex);
  }, [isOpen, filteredOptions, selectedOption]);

  useEffect(() => {
    if (!isOpen) return;
    
    setHighlightedIndex(prev => {
      if (filteredOptions.length === 0) return -1;
      return Math.min(Math.max(prev, 0), filteredOptions.length - 1);
    });
  }, [filteredOptions, isOpen]);

  useEffect(() => {
    if (!isOpen || !selectRef.current) return;
    
    const selectRect = selectRef.current.getBoundingClientRect();
    const spaceBottom = window.innerHeight - selectRect.bottom;
    const spaceTop = selectRect.top;
    const listHeight = Math.min(filteredOptions.length * 35, 250);
    
    setDropdownDirection(
      spaceBottom >= listHeight || spaceBottom > spaceTop 
        ? DROPDOWN_DIRECTION.DOWN 
        : DROPDOWN_DIRECTION.UP
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

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      if (selectedOption) {
        setInputText(selectedOption.name);
      }
    }
  }, [isOpen, selectedOption]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      listRef.current.scrollToItem(highlightedIndex, 'auto');
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && e.target === selectRef.current) {
      clearInput();
      e.preventDefault();
      return;
    }

    if (!isOpen) {
      if (['Enter', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
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
        setHighlightedIndex(prev => 
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        e.preventDefault();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleOptionSelect = useCallback((option: TOption) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  }, [onChange]);

  const clearInput = (e?: ReactMouseEvent) => {
    if (e) e.stopPropagation();
    setInputText('');
    setSelectedOption(null);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    
    if (value && filteredOptions.length > 0) {
      setHighlightedIndex(0);
    }
  };

  const OptionRow = useCallback(({ index, style }: { index: number; style: CSSProperties }) => {
    const option = filteredOptions[index];
    const isSelected = selectedOption?.value === option.value;
    const isHighlighted = highlightedIndex === index;
    
    return (
      <div
        style={style}
        className={`${styles.option} 
          ${isSelected ? styles.selected : ''} 
          ${isHighlighted ? styles.highlighted : ''}`}
        onClick={() => handleOptionSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        {option.name}
      </div>
    );
  }, [filteredOptions, selectedOption, highlightedIndex, handleOptionSelect]);

  const handleOpenDropdown = (e: ReactMouseEvent) => {
    const target = e.target as HTMLElement;
    const isInput = target === inputRef.current;
    const isButton = target.tagName === 'BUTTON' || target.closest('button');
    if (!isOpen && !isButton && !isInput) {
      setIsOpen(true);
    }
  }

  return (
     <div 
      ref={selectRef}
      className={isOpen ? styles.selectOpen : styles.select}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e: ReactMouseEvent) => handleOpenDropdown(e)}>
      <input
        ref={inputRef}
        type="text"
        value={isOpen ? inputText : (selectedOption?.name || '')}
        onChange={handleInputChange}
        className={styles.input}
        name={name}
        tabIndex={0}
        onFocus={() => !isOpen && setIsOpen(true)}
      />
      {isHovered && (inputText || selectedOption) && (
        <button 
          className={styles.clearButton} 
          onClick={clearInput}
          aria-label="Clear selection">
          ×
        </button>
      )}
      <button 
        className={styles.dropdownButton}
        onClick={(e: ReactMouseEvent) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        aria-expanded={isOpen}>
        &#9660;
      </button>
      {isOpen && dropdownDirection && filteredOptions.length > 0 && (
        <div 
          className={dropdownDirection === DROPDOWN_DIRECTION.DOWN 
            ? styles.dropdownDown 
            : styles.dropdownUp}>
          <FixedSizeList
            ref={listRef}
            height={Math.min(filteredOptions.length * 35, 250)}
            itemCount={filteredOptions.length}
            itemSize={35}
            width={250}
          >
            {OptionRow}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
};
