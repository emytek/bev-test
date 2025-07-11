// src/components/ui/SearchableSelect.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FiChevronDown, FiX, FiSearch } from 'react-icons/fi';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  selectedValue,
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(() =>
    options.find(option => option.value === selectedValue)?.label || '',
    [options, selectedValue]
  );

  const filteredOptions = useMemo(() =>
    options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [options, searchTerm]
  );

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) { // When opening, focus the search input
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleOptionClick = useCallback((value: string) => {
    onChange(value);
    setIsOpen(false);
    setSearchTerm(''); // Clear search term after selection
  }, [onChange]);

  const handleClearSelection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onChange(null);
  }, [onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(''); // Clear search when closing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <div
        className="flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-md p-2 cursor-pointer bg-white dark:bg-gray-700 min-h-[40px]"
        onClick={handleToggle}
      >
        <span className={`flex-grow truncate ${selectedValue ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
          {selectedValue ? selectedLabel : placeholder}
        </span>
        {selectedValue && (
          <FiX className="ml-2 h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" onClick={handleClearSelection} />
        )}
        <FiChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} text-gray-500 dark:text-gray-400`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input click
              />
            </div>
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;