// src/components/FilterSidebar.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';

import MultiSelectDropdown from '../../form/MultiSelectDropdown';
import SearchableSelect from '../../form/SearchableSelect';
import ProdButton from '../button/ProdBtn';

// Define the shape of your filter state
export interface OrdersFilterState {
  orderStatuses: string[];
  sapProductId: string | null;
  isRestricted: 'Yes' | 'No' | 'All';
  // Add other filter types here as you implement them (e.g., date ranges, machine)
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: OrdersFilterState; // Current active filters
  onApplyFilters: (newFilters: OrdersFilterState) => void; // Callback to apply filters
  allProductIDs: string[]; // List of all unique product IDs for the searchable select
}

const OrderStatusOptions = [
  { label: 'Approved', value: 'Approved' },
  { label: 'Pending Approval', value: 'Pending Approval' },
  { label: 'Canceled', value: 'Canceled' },
  { label: 'Posted', value: 'Posted' },
  { label: 'Not Posted', value: 'Not Posted' },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  allProductIDs,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  // Internal state for filters within the sidebar, updated only on "Apply"
  const [currentFilterState, setCurrentFilterState] = useState<OrdersFilterState>(filters);

  // Sync internal state when filters prop changes (e.g., when clearing filters from main page)
  useEffect(() => {
    setCurrentFilterState(filters);
  }, [filters]);

  const handleStatusChange = useCallback((selectedValues: string[]) => {
    setCurrentFilterState(prev => ({ ...prev, orderStatuses: selectedValues }));
  }, []);

  const handleProductIDChange = useCallback((selectedValue: string | null) => {
    setCurrentFilterState(prev => ({ ...prev, sapProductId: selectedValue }));
  }, []);

  const handleRestrictedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFilterState(prev => ({ ...prev, isRestricted: e.target.value as 'Yes' | 'No' | 'All' }));
  }, []);

  const handleApply = useCallback(() => {
    onApplyFilters(currentFilterState);
    onClose();
  }, [onApplyFilters, currentFilterState, onClose]);

  const handleClear = useCallback(() => {
    const clearedState: OrdersFilterState = {
      orderStatuses: [],
      sapProductId: null,
      isRestricted: 'All',
    };
    setCurrentFilterState(clearedState);
    onApplyFilters(clearedState); // Immediately apply clear filters
    onClose();
  }, [onApplyFilters, onClose]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);


  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      ref={sidebarRef}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Filters</h3>
        <ProdButton onClick={onClose} variant="ghost" className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
          <FiX className="h-6 w-6" />
        </ProdButton>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]"> {/* Adjust height for header/footer */}
        {/* Order Status Filter */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">Order Status</h4>
          <MultiSelectDropdown
            options={OrderStatusOptions}
            selectedValues={currentFilterState.orderStatuses}
            onChange={handleStatusChange}
            placeholder="Select Status(es)"
          />
        </div>

        {/* Product ID Filter */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">Product ID</h4>
          <SearchableSelect
            options={allProductIDs.map(id => ({ label: id, value: id }))}
            selectedValue={currentFilterState.sapProductId}
            onChange={handleProductIDChange}
            placeholder="Select Product ID"
          />
        </div>

        {/* Restricted Status Filter */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">Restricted Status</h4>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="isRestricted"
                value="All"
                checked={currentFilterState.isRestricted === 'All'}
                onChange={handleRestrictedChange}
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600"
              />
              <span className="ml-2">All</span>
            </label>
            <label className="inline-flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="isRestricted"
                value="Yes"
                checked={currentFilterState.isRestricted === 'Yes'}
                onChange={handleRestrictedChange}
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="isRestricted"
                value="No"
                checked={currentFilterState.isRestricted === 'No'}
                onChange={handleRestrictedChange}
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Add more filter sections here */}

      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
        <ProdButton onClick={handleClear} variant="outline">
          Clear All
        </ProdButton>
        <ProdButton onClick={handleApply} variant="primary">
          Apply Filters
        </ProdButton>
      </div>
    </div>
  );
};

export default FilterSidebar;