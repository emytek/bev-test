// pages/PostedOrdersManagementTab.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom'; // For ReactDOM.createPortal
import { motion, AnimatePresence } from 'framer-motion'; // For modal animations
import { FaTimes } from 'react-icons/fa'; // For the close icon in the modal
import { FiSearch, FiFilter, FiPlusCircle, FiDownload, FiEye, FiEdit2, FiPrinter, FiList, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { toast, Toaster } from 'sonner';
import Button from '../../../ui/button/Button'; // Assuming your Button component path
import axiosInstance from '../../../../api/axiosInstance'; // Your configured Axios instance
import Loader from '../../../ui/loader/Loader';
import FilterSidebar, { OrdersFilterState } from '../../../ui/filter/FilterSidebar';


// --- API Endpoints ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// NEW: Endpoint for all posted production orders
const GET_ALL_POSTED_PRODUCTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-all-posted-productions`;
// Reuse existing endpoint for single approved/posted production for quick view
const GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-approved-production`;

// --- Type Definitions (Consistent with your backend response) ---
export interface ProductionDetail {
  ProductionDetailID: string;
  ProductionHeaderID: string;
  ProductionDate: string; // ISO 8601 string
  Shift: 'M' | 'A' | 'N';
  isRestricted: 'Yes' | 'No' | null;
  CompletedQuantity: number;
  IdentifiedStockID: string;
}

export interface ProductionOrderHeader {
  ProductionHeaderID: string;
  SAPProductionOrderID: string;
  SAPProductionOrderObjectID: string | null;
  SAPProductionProposalID: string | null;
  SAPProductionProposalObjectID: string | null;
  SAPSupplyTaskID: string | null;
  SAPMakeTaskID: string | null;
  SAPProductID: string;
  SAPProductDescription: string;
  SAPPlannedQuantity: number;
  CompletedQuantity: number;
  StatusCode: number;
  Failed: boolean;
  IsPosted: boolean; // Crucial for this tab
  Machine: string | null;
  isFinished: boolean;
  isApproved: boolean;
  ProductionDate: string | null;
  UoMQuantityPallet: number;
  ProductionDetails: ProductionDetail[];
}

// --- Helper Functions (retained) ---
const getRestrictedStatusColor = (isRestricted: 'Yes' | 'No' | null): string => {
  if (isRestricted === 'Yes') return 'bg-red-100 text-red-700';
  if (isRestricted === 'No') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const dateOnly = dateString.split('T')[0];
      return new Date(dateOnly).toLocaleDateString('en-GB');
    }
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error('Error formatting date-time:', dateString, error);
    return dateString;
  }
};

// --- ViewOrderModal Component (Reused - ensure it's imported or defined globally if needed) ---
interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const modalRoot = document.getElementById('modal-root') || document.body;

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};


const PostedOrdersManagementTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postedOrders, setPostedOrders] = useState<ProductionOrderHeader[]>([]);

  // --- FILTER STATES (matching OrdersFilterState) ---
  const [filters, setFilters] = useState<OrdersFilterState>({
    orderStatuses: [],
    sapProductId: null,
    isRestricted: 'All',
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // --- SORTING STATES ---
  const [sortColumn, setSortColumn] = useState<keyof ProductionOrderHeader | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<ProductionOrderHeader | null>(null);

  const navigate = useNavigate();

  // --- Data Fetching for All Posted Orders (Table) ---
  const fetchPostedProductionOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: ProductionOrderHeader[]; message: string; status: boolean }>(
        GET_ALL_POSTED_PRODUCTIONS_ENDPOINT
      );
      if (response.data.status) {
        setPostedOrders(response.data.data);
        setCurrentPage(1); // Reset page on new data fetch
      } else {
        setError(response.data.message || 'Failed to fetch posted production orders.');
        toast.error(response.data.message || "Failed to load posted production orders.");
      }
    } catch (err: any) {
      console.error("Error fetching posted production orders:", err);
      setError(err.message || 'An error occurred while fetching data.');
      toast.error(err.message || "An error occurred while fetching posted production orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostedProductionOrders();
  }, [fetchPostedProductionOrders]);

  // --- Prepare allProductIDs for FilterSidebar ---
  const allProductIDs = useMemo(() => {
    const ids = new Set<string>();
    postedOrders.forEach(order => {
      if (order.SAPProductID) {
        ids.add(order.SAPProductID);
      }
    });
    return Array.from(ids);
  }, [postedOrders]);

  // --- Callback to handle applying filters from the sidebar ---
  const handleApplyFilters = useCallback((newFilters: OrdersFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters are applied
  }, []);

  // --- Sorting Handler ---
  const handleSort = useCallback((column: keyof ProductionOrderHeader) => {
    setSortDirection(prevDirection => {
      if (sortColumn === column) {
        return prevDirection === 'asc' ? 'desc' : 'asc';
      }
      return 'asc'; // Default to ascending if new column
    });
    setSortColumn(column);
    setCurrentPage(1); // Reset to first page on sort change
  }, [sortColumn]);

  // --- Filtering & Sorting Logic ---
  const sortedAndFilteredOrders = useMemo(() => {
    let currentOrders = [...postedOrders]; // Create a mutable copy

    // 1. Apply general search term
    if (searchTerm) {
      currentOrders = currentOrders.filter(order =>
        order.SAPProductDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.SAPProductionOrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.SAPProductID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Apply filters from the FilterSidebar
    if (filters.orderStatuses && filters.orderStatuses.length > 0) {
      currentOrders = currentOrders.filter(order =>
        // Convert order.StatusCode to a string before checking for inclusion
        filters.orderStatuses.includes(String(order.StatusCode))
      );
    }

    if (filters.sapProductId) {
      currentOrders = currentOrders.filter(order =>
        order.SAPProductID === filters.sapProductId
      );
    }

    if (filters.isRestricted !== 'All') {
      currentOrders = currentOrders.filter(order => {
        // Assuming ProductionDetails[0]?.isRestricted holds the relevant boolean/string
        // You'll need to confirm the exact type and value for 'isRestricted' in your data
        const isOrderRestricted = order.ProductionDetails && order.ProductionDetails.length > 0
          ? order.ProductionDetails[0]?.isRestricted === 'Yes' // Assuming 'Yes'/'No' string or boolean true/false
          : false; // Default to not restricted if no details or value is missing

        return filters.isRestricted === 'Yes' ? isOrderRestricted : !isOrderRestricted;
      });
    }

    // 3. Apply Sorting
    if (sortColumn) {
      currentOrders.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        // Special handling for ProductionDate (which is string but needs to be compared as date)
        if (sortColumn === 'ProductionDate' && typeof aValue === 'string' && typeof bValue === 'string') {
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }
        // Fallback for other types or if types are mixed
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return currentOrders;
  }, [searchTerm, postedOrders, filters, sortColumn, sortDirection]); // Dependencies for useMemo

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return sortedAndFilteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedAndFilteredOrders, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  }, []);

  // --- Navigation to Dedicated Details Page (for Approved/Posted Orders) ---
  const handleNavigateToDetailsPage = useCallback((sapProductionOrderID: string) => {
    navigate(`/approved-production-order-details/${sapProductionOrderID}`); // This path might need adjustment for "posted" vs "approved" details
  }, [navigate]);

  // --- Open Quick-View Modal (FETCHES SINGLE APPROVED/POSTED ORDER) ---
  const handleOpenDetailsModal = useCallback(async (order: ProductionOrderHeader) => {
    setModalLoading(true);
    setModalError(null);
    setSelectedOrderForModal(null); // Clear previous data
    setIsDetailsModalOpen(true); // Open modal immediately with loading indicator

    const sapProductionOrderID = order.SAPProductionOrderID;

    try {
      const response = await axiosInstance.get<{ data: ProductionOrderHeader; message: string; status: boolean }>(
        GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT, // Assuming this endpoint can fetch posted orders too
        {
          params: { sapProductionOrderID: sapProductionOrderID }
        }
      );

      if (response.data.status && response.data.data) {
        setSelectedOrderForModal(response.data.data);
        toast.success(response.data.message || "Single production order details loaded!");
      } else {
        setModalError(response.data.message || 'Failed to fetch single production order details.');
        toast.error(response.data.message || "Failed to load single production order details.");
      }
    } catch (err: any) {
      console.error("Error fetching single production order:", err);
      setModalError(err.message || 'An error occurred while fetching single order data.');
      toast.error(err.message || "An error occurred while fetching single production order.");
    } finally {
      setModalLoading(false);
    }
  }, []);

  // --- Close Quick-View Modal ---
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrderForModal(null);
    setModalError(null);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300"><Loader /></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={fetchPostedProductionOrders}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Posted Production Orders</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => toast.info('Create New functionality coming soon!')} variant="primary" startIcon={<FiPlusCircle className="h-5 w-5" />}>
              Create New
            </Button>
            <Button onClick={() => toast.info('Export functionality coming soon!')} variant="outline" startIcon={<FiDownload className="h-5 w-5" />}>
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID, Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <Button onClick={() => setIsFilterSidebarOpen(true)} variant="outline" startIcon={<FiFilter className="h-5 w-5" />}>
            Filters
          </Button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  onClick={() => handleSort('SAPProductionOrderID')}
                >
                  <div className="flex items-center">
                    SAP Order ID
                    {sortColumn === 'SAPProductionOrderID' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Planned Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Completed Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Restricted?</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  onClick={() => handleSort('ProductionDate')}
                >
                  <div className="flex items-center">
                    Header Date
                    {sortColumn === 'ProductionDate' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  onClick={() => handleSort('StatusCode')}
                >
                  <div className="flex items-center">
                    Status
                    {sortColumn === 'StatusCode' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {currentItems.map((order) => (
                <tr key={order.ProductionHeaderID} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
                    onClick={() => handleNavigateToDetailsPage(order.SAPProductionOrderID)}>
                    {order.SAPProductionOrderID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{order.SAPProductDescription}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{order.SAPProductID}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.SAPPlannedQuantity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.CompletedQuantity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(order.ProductionDetails[0]?.isRestricted)}`}>
                      {order.ProductionDetails[0]?.isRestricted || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(order.ProductionDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.StatusCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      {/* Eye Icon: Opens the quick-view modal by fetching single order */}
                      <button
                        onClick={() => handleOpenDetailsModal(order)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        title="Quick View Details"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 cursor-not-allowed" title="Quick Edit (Coming Soon)" disabled>
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 cursor-not-allowed" title="Print Barcode (Coming Soon)" disabled>
                        <FiPrinter className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentItems.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <FiList size={48} className="mx-auto mb-2" />
            No posted production orders found.
          </div>
        )}

        {/* Pagination and Page Size Control */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm">Items per page:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="block w-20 pl-3 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <span className="text-sm">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedAndFilteredOrders.length)} of {sortedAndFilteredOrders.length} results</span>

          <div className="flex space-x-1">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              variant="outline"
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              variant="outline"
              disabled={currentPage === totalPages || totalPages === 0}
            >
            Next
            </Button>
          </div>
        </div>

        {/* Quick-View Details Modal */}
        <ViewOrderModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          title={`Details for Posted Order: ${selectedOrderForModal?.SAPProductionOrderID || (modalLoading ? 'Loading...' : 'N/A')}`}
        >
          {modalLoading ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-300"><Loader /></div>
          ) : modalError ? (
            <div className="p-4 text-center text-red-500">Error: {modalError}</div>
          ) : selectedOrderForModal ? (
            <div className="p-4 text-gray-700 dark:text-gray-300 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Header Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <p><strong>Product:</strong> {selectedOrderForModal.SAPProductDescription} ({selectedOrderForModal.SAPProductID})</p>
                <p><strong>Planned Quantity:</strong> {selectedOrderForModal.SAPPlannedQuantity.toLocaleString()}</p>
                <p><strong>Completed Quantity:</strong> {selectedOrderForModal.CompletedQuantity.toLocaleString()}</p>
                <p><strong>Machine:</strong> {selectedOrderForModal.Machine || 'N/A'}</p>
                <p><strong>Production Date (Header):</strong> {formatDate(selectedOrderForModal.ProductionDate)}</p>
                <p><strong>Status Code:</strong> {selectedOrderForModal.StatusCode} {selectedOrderForModal.Failed ? '(Failed)' : ''}</p>
                <p><strong>UoM Quantity Pallet:</strong> {selectedOrderForModal.UoMQuantityPallet.toLocaleString()}</p>
                <p><strong>Is Finished:</strong> {selectedOrderForModal.isFinished ? 'Yes' : 'No'}</p>
                <p><strong>Is Approved:</strong> {selectedOrderForModal.isApproved ? 'Yes' : 'No'}</p>
                <p><strong>Is Posted:</strong> {selectedOrderForModal.IsPosted ? 'Yes' : 'No'}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Individual Production Entries</h3>
              {selectedOrderForModal.ProductionDetails && selectedOrderForModal.ProductionDetails.length > 0 ? (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date & Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Shift</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Completed Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Restricted</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Stock ID</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {selectedOrderForModal.ProductionDetails.map((detail) => (
                        <tr key={detail.ProductionDetailID} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{formatDateTime(detail.ProductionDate)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.Shift}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.CompletedQuantity.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(detail.isRestricted)}`}>
                              {detail.isRestricted || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.IdentifiedStockID}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No individual production entries found for this order.</p>
              )}
              <div className="flex justify-end pt-4">
                <Button onClick={() => handleNavigateToDetailsPage(selectedOrderForModal.SAPProductionOrderID)} variant="primary">
                  View Full Details Page
                </Button>
              </div>
            </div>
          ) : null}
        </ViewOrderModal>

        {/* Filter Sidebar Component */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          allProductIDs={allProductIDs}
        />
      </div>
      <Toaster richColors position="bottom-right"/>
    </>
  );
};

export default PostedOrdersManagementTab;
