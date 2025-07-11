// src/components/ui/MultiSelectDropdown.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

  const handleOptionClick = useCallback((value: string) => {
    onChange(
      selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
    );
  }, [selectedValues, onChange]);

  const handleRemoveTag = useCallback((valueToRemove: string) => {
    onChange(selectedValues.filter(v => v !== valueToRemove));
  }, [selectedValues, onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabels = useMemo(() =>
    options.filter(option => selectedValues.includes(option.value)).map(option => option.label),
    [options, selectedValues]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex flex-wrap items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-2 cursor-pointer bg-white dark:bg-gray-700 min-h-[40px]"
        onClick={handleToggle}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        ) : (
          selectedLabels.map(label => (
            <span
              key={label}
              className="flex items-center bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {label}
              <FiX className="ml-1 cursor-pointer h-3 w-3" onClick={(e) => { e.stopPropagation(); handleRemoveTag(options.find(o => o.label === label)?.value || ''); }} />
            </span>
          ))
        )}
        <FiChevronDown className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} text-gray-500 dark:text-gray-400`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
            >
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleOptionClick(option.value)}
                className="form-checkbox h-4 w-4 text-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:checked:bg-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;