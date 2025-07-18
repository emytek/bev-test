import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom'; // For ReactDOM.createPortal
import { motion, AnimatePresence } from 'framer-motion'; // For modal animations
import { FaTimes, FaSpinner, FaSortUp, FaSortDown } from 'react-icons/fa'; // For the close icon in the modal and spinner
import { FiSearch, FiFilter, FiDownload, FiEye, FiEdit2, FiPrinter, FiList, FiX } from 'react-icons/fi'; // Removed FiPlusCircle
import { MdWarningAmber } from "react-icons/md"; // For confirmation modal icon
import { toast, Toaster } from 'sonner';
import Button from '../../../ui/button/Button'; // Assuming your Button component path
import Loader from '../../../ui/loader/Loader'; // Assuming your Loader component path
import axiosInstance from '../../../../api/axiosInstance';
// import { useAuth } from '../../../../hooks/useAuth';
// import { ConfirmationApprovalModal } from '../../../ui/modal/ConfirmationModal';
//import { formatDate, formatDateTime } from '../../../../utils/idStockTime';
import FilterSidebar, { OrdersFilterState } from '../../../ui/filter/FilterSidebar';
//import { getRestrictedStatusColor } from '../../../../utils/OrderMgtUtils';
//import { ProductionDetail } from '../../../../types/productionTypes';
import ProdButton from '../../../ui/button/ProdBtn';


// --- API Endpoints ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GET_ALL_APPROVED_PRODUCTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-all-approved-productions`;
const GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-approved-production`;
const POST_TO_SAP_ENDPOINT = `${API_BASE_URL}/api/v1/production/post-production`; // New endpoint for posting to SAP

// --- Type Definitions (Consistent with your backend response) ---
export interface ProductionDetail {
  ProductionDetailID?: string; // It was undefined, keep it consistent if possible
  ProductionHeaderID: string;
  ProductionDate: string;
  Shift: string;
  CompletedQuantity: number;
  IdentifiedStockID: string;
  // Change this line:
  isRestricted: 'Yes' | 'No' | null | undefined; // Allow 'Yes', 'No', null, or undefined
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
  IsPosted: boolean;
  isCanceled: boolean;
  Machine: string | null;
  isFinished: boolean;
  isApproved: boolean; // Crucial for this tab
  ProductionDate: string | null;
  UoMQuantityPallet: number;
  ProductionDetails: ProductionDetail[];
}

// --- Helper Functions (retained and slightly adjusted for nulls) ---
// --- Helper Functions (retained and slightly adjusted for nulls) ---
const getRestrictedStatusColor = (isRestricted: 'Yes' | 'No' | null | undefined): string => {
  if (isRestricted === 'Yes') return 'bg-red-100 text-red-700';
  if (isRestricted === 'No') return 'bg-green-100 text-green-700';
  // If it's null or undefined, return the gray/neutral color
  return 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Handle cases where time component might break Date parsing for simple date display
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

// --- ViewOrderModal Component (as provided by you) ---
interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const modalRoot = document.getElementById('modal-root') || document.body; // Ensure a modal root exists in your index.html or body

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
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
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


// --- ConfirmationModal Component (Modified for context) ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode; // Changed type from string to React.ReactNode
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  isLoading = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" // Increased z-index
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close icon */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <MdWarningAmber className="h-16 w-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                {description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                {cancelButtonText}
              </Button>
              <Button
                variant="primary" // Changed to primary for confirm action
                onClick={onConfirm}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  confirmButtonText
                )}
                {isLoading ? "Posting..." : confirmButtonText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};


const ApprovedOrdersManagementTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvedOrders, setApprovedOrders] = useState<ProductionOrderHeader[]>([]);

  // State for Filter Sidebar visibility
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  // State for active filters (reusing OrdersFilterState type from FilterSidebar)
  const [activeFilters, setActiveFilters] = useState<OrdersFilterState>({
    orderStatuses: [],
    sapProductId: null,
    isRestricted: 'All',
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for the quick-view modal and the data fetched for it
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<ProductionOrderHeader | null>(null);

  // States for bulk posting
  const [selectedHeaderIDs, setSelectedHeaderIDs] = useState<string[]>([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // States for sorting
  const [sortColumn, setSortColumn] = useState<keyof ProductionOrderHeader | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // const { user } = useAuth();
  const navigate = useNavigate();

  // --- Data Fetching for All Approved Orders (Table) ---
  const fetchApprovedProductionOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: ProductionOrderHeader[]; message: string; status: boolean }>(
        GET_ALL_APPROVED_PRODUCTIONS_ENDPOINT
      );
      if (response.data.status) {
        // Ensure ProductionDetails[0]?.isRestricted is always 'Yes' | 'No' on initial load for consistency
        const formattedData = response.data.data.map(order => ({
          ...order,
          ProductionDetails: order.ProductionDetails.map(detail => {
            // Determine the correct 'isRestricted' value based on the API response.
            // If detail.isRestricted is 'Yes', use 'Yes'.
            // If detail.isRestricted is 'No', use 'No'.
            // If it's null, use null.
            // Otherwise (e.g., empty string, or any other string not 'Yes'/'No'), use undefined.
            const restrictedStatus: 'Yes' | 'No' | null | undefined =
              detail.isRestricted === 'Yes'
                ? 'Yes'
                : detail.isRestricted === 'No'
                  ? 'No'
                  : (detail.isRestricted === null ? null : undefined); // Handles null explicitly, others to undefined
        
            return {
              ...detail,
              isRestricted: restrictedStatus // Assign the explicitly typed value
            };
          })
        }));
        setApprovedOrders(formattedData);
        setCurrentPage(1);
        setSelectedHeaderIDs([]);
      } else {
        setError(response.data.message || 'Failed to fetch approved production orders.');
        toast.error(response.data.message || "Failed to load approved production orders.");
      }
    } catch (err: any) {
      console.error("Error fetching approved production orders:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching approved orders.');
      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching approved production orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedProductionOrders();
  }, [fetchApprovedProductionOrders]);

  // Extract unique Product IDs for the Product Filter dropdown
  const allProductIDs = useMemo(() => {
    const ids = new Set<string>();
    approvedOrders.forEach(order => ids.add(order.SAPProductID));
    return Array.from(ids).sort();
  }, [approvedOrders]);

  // --- Combined Filtering Logic (Search Term + Filter Sidebar Filters) ---
  const applyAllFilters = useMemo(() => {
    return approvedOrders.filter(order => {
      // 1. Search Term Filter
      const matchesSearchTerm =
        order.SAPProductDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.SAPProductionOrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.SAPProductID.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearchTerm) return false;

      // 2. Order Status Filter
      const hasOrderStatusFilter = activeFilters.orderStatuses.length > 0;
      if (hasOrderStatusFilter) {
        let statusMatch = false;
        // Logic for statuses relevant to Approved Orders tab
        if (activeFilters.orderStatuses.includes('Approved') && order.isApproved) statusMatch = true;
        if (activeFilters.orderStatuses.includes('Posted') && order.IsPosted) statusMatch = true;
        if (activeFilters.orderStatuses.includes('Not Posted') && order.isApproved && !order.IsPosted && !order.isCanceled) statusMatch = true; // Approved but not yet posted/canceled
        if (activeFilters.orderStatuses.includes('Canceled') && order.isCanceled) statusMatch = true;
        if (activeFilters.orderStatuses.includes('Failed') && order.Failed) statusMatch = true;
        // You can add more specific statuses here if needed
        if (!statusMatch) return false;
      }

      // 3. Product ID Filter
      const hasProductIDFilter = activeFilters.sapProductId !== null && activeFilters.sapProductId !== '';
      if (hasProductIDFilter && order.SAPProductID !== activeFilters.sapProductId) {
        return false;
      }

      // 4. Restricted Status Filter
      const hasRestrictedFilter = activeFilters.isRestricted !== 'All';
      if (hasRestrictedFilter) {
        // Access ProductionDetails[0]?.isRestricted carefully, default to 'No' for filtering if undefined
        const headerRestrictedStatus = order.ProductionDetails[0]?.isRestricted || 'No';
        if (activeFilters.isRestricted === 'Yes' && headerRestrictedStatus !== 'Yes') return false;
        if (activeFilters.isRestricted === 'No' && headerRestrictedStatus !== 'No') return false;
      }

      return true; // All filters passed
    });
  }, [searchTerm, approvedOrders, activeFilters]);

  // --- Sorting Logic (applied to the filtered results) ---
  const sortedOrders = useMemo(() => {
    if (!sortColumn) {
      return applyAllFilters;
    }

    const sortableOrders = [...applyAllFilters];

    sortableOrders.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (sortColumn === 'SAPProductionOrderID') {
        const numA = parseInt(String(valA), 10);
        const numB = parseInt(String(valB), 10);
        if (sortDirection === 'asc') {
          return numA - numB;
        } else {
          return numB - numA;
        }
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    return sortableOrders;
  }, [applyAllFilters, sortColumn, sortDirection]);

  // --- Sorting Handler ---
  const handleSort = useCallback((column: keyof ProductionOrderHeader) => {
    if (sortColumn === column) {
      setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);


  // --- Checkbox Handlers ---
  const handleCheckboxChange = useCallback((headerID: string, isChecked: boolean) => {
    setSelectedHeaderIDs(prev => {
      if (isChecked) {
        return [...prev, headerID];
      } else {
        return prev.filter(id => id !== headerID);
      }
    });
  }, []);

  const handleSelectAllChange = useCallback((isChecked: boolean) => {
    // Select all *currently visible (filtered and sorted) orders* that are NOT yet posted AND NOT canceled
    const eligibleVisibleOrders = sortedOrders
      .filter(order => !order.IsPosted && !order.isCanceled)
      .map(order => order.ProductionHeaderID);

    if (isChecked) {
      // Add all eligible visible orders to selection
      setSelectedHeaderIDs(prev => Array.from(new Set([...prev, ...eligibleVisibleOrders])));
    } else {
      // Remove only the currently visible eligible orders from selection
      setSelectedHeaderIDs(prev => prev.filter(id => !eligibleVisibleOrders.includes(id)));
    }
  }, [sortedOrders]); // Depend on sortedOrders to get the currently displayed set


  // Determine if all *visible, unposted, and uncanceled* orders are selected
  const eligibleDisplayedOrders = useMemo(() => {
    return sortedOrders.filter(order => !order.IsPosted && !order.isCanceled);
  }, [sortedOrders]);

  const allCurrentPageEligibleOrdersSelected = useMemo(() => {
    if (eligibleDisplayedOrders.length === 0) return false;
    return eligibleDisplayedOrders.every(order => selectedHeaderIDs.includes(order.ProductionHeaderID));
  }, [eligibleDisplayedOrders, selectedHeaderIDs]);


  // --- Pagination Logic ---
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage); // Use sortedOrders for total count

  const paginatedOrders = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedOrders, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages))); // Ensure page is within bounds
  }, [totalPages]);

  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  // --- Navigation to Dedicated Details Page ---
  const handleNavigateToDetailsPage = useCallback(
    (sapProductionOrderID: string, productionHeaderID: string) => {
      navigate(
        `/approved-production-order-details/${sapProductionOrderID}?headerID=${productionHeaderID}`
      );
    },
    [navigate]
  );

  // --- Bulk Post to SAP Functionality ---
  const handleOpenConfirmationModal = useCallback(() => {
    // Only allow posting if there are selected orders that are NOT yet posted AND NOT canceled
    const eligibleSelectedOrders = selectedHeaderIDs.filter(id => {
        const order = approvedOrders.find(o => o.ProductionHeaderID === id);
        return order && !order.IsPosted && !order.isCanceled;
    });

    if (eligibleSelectedOrders.length === 0) {
      toast.error("Please select at least one production order that has not been posted or canceled yet.");
      // Clear selectedHeaderIDs if none are eligible to prevent confusion
      setSelectedHeaderIDs([]);
      return;
    }
    // Update selectedHeaderIDs to only include eligible ones for the actual post
    setSelectedHeaderIDs(eligibleSelectedOrders);
    setIsConfirmationModalOpen(true);
  }, [selectedHeaderIDs, approvedOrders]);


  const handleCloseConfirmationModal = useCallback(() => {
    setIsConfirmationModalOpen(false);
  }, []);

  const handleBulkPostToSAP = useCallback(async () => {
    if (selectedHeaderIDs.length === 0) {
      toast.error("No production orders selected for posting.");
      handleCloseConfirmationModal();
      return;
    }

    setIsPosting(true);
    try {
      const response = await axiosInstance.post<{ data: any; message: string; status: boolean }>(
        POST_TO_SAP_ENDPOINT,
        selectedHeaderIDs
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`${selectedHeaderIDs.length} production order(s) successfully posted to SAP.`);
        setSelectedHeaderIDs([]);
        fetchApprovedProductionOrders(); // Re-fetch data to reflect changes
      } else {
        throw new Error(response.data?.message || "Unexpected server response during bulk posting to SAP.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong during bulk posting.";
      toast.error(`Failed to post to SAP. ${message}`);
      console.error("Error during bulk SAP posting:", err);
    } finally {
      setIsPosting(false);
      handleCloseConfirmationModal();
    }
  }, [selectedHeaderIDs, fetchApprovedProductionOrders, handleCloseConfirmationModal]);


  // --- Open Quick-View Modal (FETCHES SINGLE APPROVED ORDER) ---
  const handleOpenDetailsModal = useCallback(async (order: ProductionOrderHeader) => {
    setModalLoading(true);
    setModalError(null);
    setSelectedOrderForModal(null);
    setIsDetailsModalOpen(true);

    const sapProductionOrderID = order.SAPProductionOrderID;

    try {
      const response = await axiosInstance.get<{ data: ProductionOrderHeader; message: string; status: boolean }>(
        GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT,
        {
          params: { sapProductionOrderID: sapProductionOrderID }
        }
      );

      if (response.data.status && response.data.data) {
        // Ensure ProductionDetails[0]?.isRestricted is typed correctly here too
        const formattedModalData = {
          ...response.data.data,
          ProductionDetails: response.data.data.ProductionDetails.map(detail => {
            // Apply the same robust type narrowing here
            const restrictedStatus: 'Yes' | 'No' | null | undefined =
              detail.isRestricted === 'Yes'
                ? 'Yes'
                : detail.isRestricted === 'No'
                  ? 'No'
                  : (detail.isRestricted === null ? null : undefined);
        
            return {
              ...detail,
              isRestricted: restrictedStatus
            };
          })
        };
        setSelectedOrderForModal(formattedModalData);
        toast.success(response.data.message || "Single approved production order details loaded!");
      } else {
        setModalError(response.data.message || 'Failed to fetch single approved production order details.');
        toast.error(response.data.message || "Failed to load single approved production order details.");
      }
    } catch (err: any) {
      console.error("Error fetching single approved production order:", err);
      setModalError(err.response?.data?.message || err.message || 'An error occurred while fetching single order data.');
      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching single approved production order.");
    } finally {
      setModalLoading(false);
    }
  }, []);

  // --- Close Quick-View Modal ---
  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedOrderForModal(null);
    setModalError(null);
  }, []);

  // --- Filter Sidebar Handlers ---
  const handleApplyFilters = useCallback((newFilters: OrdersFilterState) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters({
      orderStatuses: [],
      sapProductId: null,
      isRestricted: 'All',
    });
    setSearchTerm('');
    setCurrentPage(1);
    toast.info("All filters cleared.");
  }, []);

  // Logic to display active filter pills
  const activeFilterPills = useMemo(() => {
    const pills: { label: string; onRemove: () => void }[] = [];

    if (searchTerm) {
      pills.push({
        label: `Search: "${searchTerm}"`,
        onRemove: () => setSearchTerm(''),
      });
    }

    activeFilters.orderStatuses.forEach(status => {
      pills.push({
        label: `Status: ${status}`,
        onRemove: () => setActiveFilters(prev => ({
          ...prev,
          orderStatuses: prev.orderStatuses.filter(s => s !== status)
        })),
      });
    });

    if (activeFilters.sapProductId) {
      pills.push({
        label: `Product ID: ${activeFilters.sapProductId}`,
        onRemove: () => setActiveFilters(prev => ({ ...prev, sapProductId: null })),
      });
    }

    if (activeFilters.isRestricted !== 'All') {
      pills.push({
        label: `Restricted: ${activeFilters.isRestricted}`,
        onRemove: () => setActiveFilters(prev => ({ ...prev, isRestricted: 'All' })),
      });
    }

    return pills;
  }, [searchTerm, activeFilters]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
        <Loader />
        <p className="text-gray-600 dark:text-gray-300 ml-3">Loading approved production orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
        <p className="text-red-500">Error: {error}</p>
        <Button
          onClick={fetchApprovedProductionOrders}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 min-h-[70vh] relative">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Approved Production Orders</h2>
          <div className="flex items-center space-x-2">
            {selectedHeaderIDs.length > 0 && (
              <Button
                onClick={handleOpenConfirmationModal}
                variant="primary"
                startIcon={isPosting ? <FaSpinner className="animate-spin" /> : null}
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : `Post Order(s) (${selectedHeaderIDs.length})`}
              </Button>
            )}
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
          <Button
            onClick={() => setIsFilterSidebarOpen(true)}
            variant="outline"
            startIcon={<FiFilter className="h-5 w-5" />}
          >
            Filters {activeFilterPills.length > 0 && `(${activeFilterPills.length})`}
          </Button>
        </div>

        {/* Active Filter Pills Display */}
        {activeFilterPills.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Active Filters:</span>
            {activeFilterPills.map((pill, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {pill.label}
                <FiX className="ml-1 cursor-pointer h-3 w-3" onClick={pill.onRemove} />
              </span>
            ))}
            <ProdButton
              onClick={handleClearAllFilters}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
            >
              Clear All
            </ProdButton>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                    checked={allCurrentPageEligibleOrdersSelected}
                    // This creates an indeterminate state if some eligible items are selected but not all
                    ref={input => {
                        if (input) {
                            const someSelected = selectedHeaderIDs.length > 0 && !allCurrentPageEligibleOrdersSelected;
                            input.indeterminate = someSelected;
                        }
                    }}
                    disabled={eligibleDisplayedOrders.length === 0}
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer select-none"
                  onClick={() => handleSort('SAPProductionOrderID')}
                >
                  <div className="flex items-center">
                    SAP Order ID
                    {sortColumn === 'SAPProductionOrderID' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FaSortUp className="h-4 w-4" /> : <FaSortDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Planned Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Completed Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Restricted?</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Header Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.ProductionHeaderID} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* CONDITIONAL RENDERING OF CHECKBOX: Only if NOT posted AND NOT canceled */}
                      {!order.IsPosted && !order.isCanceled && (
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedHeaderIDs.includes(order.ProductionHeaderID)}
                          onChange={(e) => handleCheckboxChange(order.ProductionHeaderID, e.target.checked)}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
                      onClick={() => handleNavigateToDetailsPage(order.SAPProductionOrderID, order.ProductionHeaderID)}>
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
                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isCanceled ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          Canceled
                        </span>
                      ) : order.IsPosted ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Posted
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                          Pending Post
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
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
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No approved production orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedOrders.length === 0 && applyAllFilters.length === 0 && ( // Changed to applyAllFilters
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <FiList size={48} className="mx-auto mb-2" />
            No approved production orders to display.
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

          <span className="text-sm">
            Showing {Math.min(sortedOrders.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(currentPage * itemsPerPage, sortedOrders.length)} of {sortedOrders.length} results
          </span>

          <div className="flex space-x-1">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              variant="outline"
              disabled={currentPage === 1 || sortedOrders.length === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              variant="outline"
              disabled={currentPage === totalPages || sortedOrders.length === 0}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Quick-View Details Modal */}
        <ViewOrderModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          title={`Details for Order: ${selectedOrderForModal?.SAPProductionOrderID || (modalLoading ? 'Loading...' : 'N/A')}`}
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
                <p><strong>Is Canceled:</strong> {selectedOrderForModal.isCanceled ? 'Yes' : 'No'}</p>
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
                      {selectedOrderForModal.ProductionDetails.map((detail: ProductionDetail) => ( // Added explicit type here
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
                <Button onClick={() => handleNavigateToDetailsPage(selectedOrderForModal.SAPProductionOrderID, selectedOrderForModal.ProductionHeaderID)} variant="primary">
                  View Full Details Page
                </Button>
              </div>
            </div>
          ) : null}
        </ViewOrderModal>

        {/* Confirmation Modal for Bulk Post */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleBulkPostToSAP}
          title={`Confirm Posting to SAP (${selectedHeaderIDs.length} Order${selectedHeaderIDs.length > 1 ? 's' : ''})`}
          description={
            <>
              You are about to post <span className="font-bold text-blue-600 dark:text-blue-400">{selectedHeaderIDs.length}</span> approved production order{selectedHeaderIDs.length > 1 ? 's' : ''} to SAP.
              <br /><br />
              <span className="font-semibold text-red-600 dark:text-red-400">This action is irreversible</span> and will synchronize the completed production data with the SAP system. Please ensure all details are accurate before proceeding.
            </>
          }
          confirmButtonText="Post"
          cancelButtonText="Cancel"
          isLoading={isPosting}
        />

        {/* Filter Sidebar Component (reused) */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          filters={activeFilters}
          onApplyFilters={handleApplyFilters}
          allProductIDs={allProductIDs}
        />
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default ApprovedOrdersManagementTab;



// const ApprovedOrdersManagementTab: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [approvedOrders, setApprovedOrders] = useState<ProductionOrderHeader[]>([]);

//   // State for Filter Sidebar visibility
//   const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
//   // State for active filters (reusing OrdersFilterState type)
//   const [activeFilters, setActiveFilters] = useState<OrdersFilterState>({
//     orderStatuses: [],
//     sapProductId: null,
//     isRestricted: 'All',
//   });

//   // State for selected order IDs for bulk action (e.g., posting, or re-approving non-posted)
//   const [selectedOrderIDs, setSelectedOrderIDs] = useState<string[]>([]);
//   // State for confirmation modal visibility and loading
//   const [isApprovalConfirmModalOpen, setIsApprovalConfirmModalOpen] = useState(false);
//   const [isApproving, setIsApproving] = useState(false); // For action button loading state

//   // State for the quick-view modal and the data fetched for it
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState<string | null>(null);
//   const [selectedOrderForModal, setSelectedOrderForModal] = useState<ProductionOrderHeader | null>(null);

//   // --- Pagination States ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

//   // --- Sorting States ---
//   const [sortColumn, setSortColumn] = useState<keyof ProductionOrderHeader | null>(null);
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const userData = user?.id;


//   // --- Data Fetching for All Approved Orders (Table) ---
//   const fetchApprovedProductionOrders = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get<{ data: ProductionOrderHeader[]; message: string; status: boolean }>(
//         GET_ALL_APPROVED_PRODUCTIONS_ENDPOINT // Using new endpoint
//       );
//       if (response.data.status) {
//         const formattedData = response.data.data.map(order => ({
//           ...order,
//           ProductionDetails: order.ProductionDetails.map(detail => ({
//             ...detail,
//             isRestricted: (detail.isRestricted === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No' // Type assertion
//           }))
//         }));
//         setApprovedOrders(formattedData);
//         setSelectedOrderIDs([]);
//         setCurrentPage(1);
//       } else {
//         setError(response.data.message || 'Failed to fetch approved production orders.');
//         toast.error(response.data.message || "Failed to load approved production orders.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching approved production orders:", err);
//       setError(err.response?.data?.message || err.message || 'An error occurred while fetching data.');
//       toast.error(err.response?.data?.message || err.message || "An error occurred while fetching approved production orders.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchApprovedProductionOrders();
//   }, [fetchApprovedProductionOrders]);

//   // Extract unique Product IDs for the filter dropdown
//   const allProductIDs = useMemo(() => {
//     const ids = new Set<string>();
//     approvedOrders.forEach(order => ids.add(order.SAPProductID));
//     return Array.from(ids).sort();
//   }, [approvedOrders]);


//   // --- Filtering Logic (updated for Approved Orders context) ---
//   const applyAllFilters = useMemo(() => {
//     return approvedOrders.filter(order => {
//       // 1. Search Term Filter (existing)
//       const matchesSearchTerm =
//         order.SAPProductDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.SAPProductionOrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.SAPProductID.toLowerCase().includes(searchTerm.toLowerCase());

//       if (!matchesSearchTerm) return false;

//       // 2. Order Status Filter (adapted for approved orders)
//       const hasOrderStatusFilter = activeFilters.orderStatuses.length > 0;
//       if (hasOrderStatusFilter) {
//         let statusMatch = false;
//         // For Approved Orders tab, 'Approved' is implied for most, but other states are important
//         if (activeFilters.orderStatuses.includes('Approved') && order.isApproved) statusMatch = true;
//         if (activeFilters.orderStatuses.includes('Posted') && order.IsPosted) statusMatch = true;
//         if (activeFilters.orderStatuses.includes('Not Posted') && !order.IsPosted && !order.isCanceled) statusMatch = true; // Not Posted, not cancelled
//         if (activeFilters.orderStatuses.includes('Canceled') && order.isCanceled) statusMatch = true;
//         if (activeFilters.orderStatuses.includes('Failed') && order.Failed) statusMatch = true;
//         // Add more relevant statuses for approved orders as needed
//         if (!statusMatch) return false;
//       }

//       // 3. Product ID Filter
//       const hasProductIDFilter = activeFilters.sapProductId !== null && activeFilters.sapProductId !== '';
//       if (hasProductIDFilter && order.SAPProductID !== activeFilters.sapProductId) {
//         return false;
//       }

//       // 4. Restricted Status Filter
//       const hasRestrictedFilter = activeFilters.isRestricted !== 'All';
//       if (hasRestrictedFilter) {
//         const headerRestrictedStatus = order.ProductionDetails[0]?.isRestricted || 'No';
//         if (activeFilters.isRestricted === 'Yes' && headerRestrictedStatus !== 'Yes') return false;
//         if (activeFilters.isRestricted === 'No' && headerRestrictedStatus !== 'No') return false;
//       }

//       return true; // All filters passed
//     });
//   }, [searchTerm, approvedOrders, activeFilters]);


//   // --- Sorting Logic ---
//   const sortedOrders = useMemo(() => {
//     if (!sortColumn) {
//       return applyAllFilters;
//     }

//     const sortableOrders = [...applyAllFilters];

//     sortableOrders.sort((a, b) => {
//       const valA = a[sortColumn];
//       const valB = b[sortColumn];

//       if (sortColumn === 'SAPProductionOrderID') {
//         const numA = parseInt(String(valA), 10);
//         const numB = parseInt(String(valB), 10);
//         if (sortDirection === 'asc') {
//           return numA - numB;
//         } else {
//           return numB - numA;
//         }
//       }

//       if (typeof valA === 'string' && typeof valB === 'string') {
//         return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
//       }
//       if (typeof valA === 'number' && typeof valB === 'number') {
//         return sortDirection === 'asc' ? valA - valB : valB - valA;
//       }
//       return 0;
//     });

//     return sortableOrders;
//   }, [applyAllFilters, sortColumn, sortDirection]);


//   // --- Sorting Handler ---
//   const handleSort = useCallback((column: keyof ProductionOrderHeader) => {
//     if (sortColumn === column) {
//       setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
//     } else {
//       setSortColumn(column);
//       setSortDirection('asc');
//     }
//   }, [sortColumn]);


//   // --- Pagination Calculations ---
//   const totalPages = useMemo(() => {
//     return Math.ceil(sortedOrders.length / itemsPerPage);
//   }, [sortedOrders.length, itemsPerPage]);

//   const paginatedOrders = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
//   }, [sortedOrders, currentPage, itemsPerPage]);

//   // --- Pagination Handlers ---
//   const handlePageChange = useCallback((pageNumber: number) => {
//     setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
//   }, [totalPages]);

//   const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   }, []);

//   // --- Checkbox Handlers ---
//   // For Approved Orders tab, we might allow selecting any order for a bulk action like "Post"
//   const handleCheckboxChange = useCallback((productionHeaderID: string, isChecked: boolean) => {
//     setSelectedOrderIDs(prev =>
//       isChecked
//         ? [...prev, productionHeaderID]
//         : prev.filter(id => id !== productionHeaderID)
//     );
//   }, []);

//   const handleSelectAllChange = useCallback((isChecked: boolean) => {
//     if (isChecked) {
//       // On an Approved Orders tab, we might select all orders on the page, regardless of their sub-status, for a generic bulk action.
//       // Adjust this if your business logic dictates only specific sub-statuses are selectable.
//       const eligibleHeaderIDsOnPage = paginatedOrders.map(order => order.ProductionHeaderID);
//       setSelectedOrderIDs(prev => Array.from(new Set([...prev, ...eligibleHeaderIDsOnPage])));
//     } else {
//       const currentPageHeaderIDs = paginatedOrders.map(order => order.ProductionHeaderID);
//       setSelectedOrderIDs(prev => prev.filter(id => !currentPageHeaderIDs.includes(id)));
//     }
//   }, [paginatedOrders]);

//   // Determine if all CURRENT PAGE orders are selected
//   const allCurrentPageOrdersSelected = useMemo(() => {
//     if (paginatedOrders.length === 0) return false;
//     return paginatedOrders.every(order => selectedOrderIDs.includes(order.ProductionHeaderID));
//   }, [paginatedOrders, selectedOrderIDs]);


//   // --- Navigation to Dedicated Details Page ---
//   const handleNavigateToDetailsPage = useCallback((orderID: string, headerID: string) => {
//     if (!userData) {
//       toast.error("User ID not available for navigation.");
//       return;
//     }
//     const queryString = new URLSearchParams({
//       sapProductionOrderID: orderID,
//       userID: userData
//     }).toString();
//     navigate(`/approved-orders?${queryString}`, { state: { productionHeaderID: headerID } }); // NEW ROUTE
//   }, [navigate, userData]);


//   // --- Open Quick-View Modal ---
//   const handleOpenDetailsModal = useCallback(async (order: ProductionOrderHeader) => {
//     setModalLoading(true);
//     setModalError(null);
//     setSelectedOrderForModal(null);
//     setIsDetailsModalOpen(true);

//     const orderID = order.SAPProductionOrderID;

//     try {
//       if (!userData) {
//         throw new Error('User ID is not available.');
//       }

//       const response = await axiosInstance.get<{ data: ProductionOrderHeader; message: string; status: boolean }>(
//         GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT, // Using new endpoint
//         {
//           params: {
//             sapProductionOrderID: orderID,
//             userID: userData
//           }
//         }
//       );

//       if (response.data.status) {
//         const formattedModalData = {
//           ...response.data.data,
//           ProductionDetails: response.data.data.ProductionDetails.map(detail => ({
//             ...detail,
//             isRestricted: (detail.isRestricted === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No'
//           }))
//         };
//         setSelectedOrderForModal(formattedModalData);
//         toast.success(response.data.message || "Single production order details loaded!");
//       } else {
//         setModalError(response.data.message || 'Failed to fetch single production order details.');
//         toast.error(response.data.message || "Failed to load single production order details.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching single production order:", err);
//       setModalError(err.response?.data?.message || err.message || 'An error occurred while fetching single order data.');
//       toast.error(err.response?.data?.message || err.message || "An error occurred while fetching single production order.");
//     } finally {
//       setModalLoading(false);
//     }
//   }, [axiosInstance, userData]);


//   // --- Close Quick-View Modal ---
//   const handleCloseDetailsModal = useCallback(() => {
//     setIsDetailsModalOpen(false);
//     setSelectedOrderForModal(null);
//     setModalError(null);
//   }, []);

//   // --- Bulk Action Logic (e.g., Approve / Post) ---
//   const handleOpenConfirmModalForBulkAction = useCallback(() => {
//     if (selectedOrderIDs.length === 0) {
//       toast.info("Please select at least one approved production order for this action.");
//       return;
//     }

//     // You might want to filter `selectedOrderIDs` further here if only certain sub-statuses are actionable.
//     // E.g., if this button is for 'Posting', only select those not yet posted.
//     // For now, let's just proceed with selected orders.

//     setIsApprovalConfirmModalOpen(true); // Reusing ApprovalConfirmModal, might rename it later
//   }, [selectedOrderIDs]);


//   const handleCloseConfirmModalForBulkAction = useCallback(() => {
//     setIsApprovalConfirmModalOpen(false);
//     setIsApproving(false);
//   }, []);

//   const handleConfirmBulkAction = useCallback(async () => {
//     if (selectedOrderIDs.length === 0) {
//       toast.error("No orders selected for action.");
//       handleCloseConfirmModalForBulkAction();
//       return;
//     }

//     setIsApproving(true);
//     // This endpoint should be updated to a 'POSTING' or relevant action endpoint if different
//     try {
//       const response = await axiosInstance.post<{ data: any; message: string; status: boolean }>(
//         APPROVE_BULK_PRODUCTIONS_ENDPOINT, // Reusing, but could be specific for 'Approved' tab's action
//         selectedOrderIDs
//       );

//       if (response.data.status) {
//         toast.success(response.data.message || `${selectedOrderIDs.length} production order(s) processed successfully!`);
//         await fetchApprovedProductionOrders(); // Re-fetch data
//         setSelectedOrderIDs([]);
//       } else {
//         toast.error(response.data.message || `Failed to process ${selectedOrderIDs.length} production order(s).`);
//       }
//     } catch (err: any) {
//       console.error("Error during bulk action:", err);
//       toast.error(err.response?.data?.message || err.message || "An error occurred during bulk action.");
//     } finally {
//       setIsApproving(false);
//       setIsApprovalConfirmModalOpen(false);
//     }
//   }, [selectedOrderIDs, axiosInstance, fetchApprovedProductionOrders, handleCloseConfirmModalForBulkAction]);


//   // --- Filter Sidebar Handlers ---
//   const handleApplyFilters = useCallback((newFilters: OrdersFilterState) => {
//     setActiveFilters(newFilters);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, []);

//   const handleClearAllFilters = useCallback(() => {
//     setActiveFilters({
//       orderStatuses: [],
//       sapProductId: null,
//       isRestricted: 'All',
//     });
//     setSearchTerm('');
//     setCurrentPage(1);
//     toast.info("All filters cleared.");
//   }, []);

//   // Logic to display active filter pills
//   const activeFilterPills = useMemo(() => {
//     const pills: { label: string; onRemove: () => void }[] = [];

//     if (searchTerm) {
//       pills.push({
//         label: `Search: "${searchTerm}"`,
//         onRemove: () => setSearchTerm(''),
//       });
//     }

//     activeFilters.orderStatuses.forEach(status => {
//       pills.push({
//         label: `Status: ${status}`,
//         onRemove: () => setActiveFilters(prev => ({
//           ...prev,
//           orderStatuses: prev.orderStatuses.filter(s => s !== status)
//         })),
//       });
//     });

//     if (activeFilters.sapProductId) {
//       pills.push({
//         label: `Product ID: ${activeFilters.sapProductId}`,
//         onRemove: () => setActiveFilters(prev => ({ ...prev, sapProductId: null })),
//       });
//     }

//     if (activeFilters.isRestricted !== 'All') {
//       pills.push({
//         label: `Restricted: ${activeFilters.isRestricted}`,
//         onRemove: () => setActiveFilters(prev => ({ ...prev, isRestricted: 'All' })),
//       });
//     }

//     return pills;
//   }, [searchTerm, activeFilters]);


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[500px] bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
//         <Loader />
//         <p className="text-gray-600 dark:text-gray-300 ml-3">Loading approved production orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
//         <p className="text-red-500">Error: {error}</p>
//         <Button
//           onClick={fetchApprovedProductionOrders}
//           className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//         >
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 min-h-[70vh] relative">
//         {/* Header and Actions */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//           <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Approved Production Orders</h2>
//           <div className="flex items-center space-x-2">
//             {selectedOrderIDs.length > 0 && (
//               <ProdButton
//                 onClick={handleOpenConfirmModalForBulkAction}
//                 variant="primary"
//                 startIcon={<FiCheckCircle className="h-5 w-5" />}
//                 isLoading={isApproving}
//               >
//                 {isApproving ? 'Processing...' : `Process Selected (${selectedOrderIDs.length})`}
//               </ProdButton>
//             )}
//             <Button onClick={() => toast.info('Export functionality coming soon!')} variant="outline" startIcon={<FiDownload className="h-5 w-5" />}>
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
//           <div className="relative flex-grow w-full sm:w-auto">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by Order ID, Product..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//             />
//           </div>
//           <Button
//             onClick={() => setIsFilterSidebarOpen(true)}
//             variant="outline"
//             startIcon={<FiFilter className="h-5 w-5" />}
//           >
//             Filters {activeFilterPills.length > 0 && `(${activeFilterPills.length})`}
//           </Button>
//         </div>

//         {/* Active Filter Pills Display */}
//         {activeFilterPills.length > 0 && (
//           <div className="mb-4 flex flex-wrap items-center gap-2">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Active Filters:</span>
//             {activeFilterPills.map((pill, index) => (
//               <span
//                 key={index}
//                 className="inline-flex items-center bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
//               >
//                 {pill.label}
//                 <FiX className="ml-1 cursor-pointer h-3 w-3" onClick={pill.onRemove} />
//               </span>
//             ))}
//             <ProdButton
//               onClick={handleClearAllFilters}
//               variant="ghost"
//               size="sm"
//               className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
//             >
//               Clear All
//             </ProdButton>
//           </div>
//         )}

//         {/* Orders Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
//                     onChange={(e) => handleSelectAllChange(e.target.checked)}
//                     checked={allCurrentPageOrdersSelected}
//                     ref={input => {
//                       if (input) {
//                         input.indeterminate = selectedOrderIDs.length > 0 && !allCurrentPageOrdersSelected && paginatedOrders.length > 0;
//                       }
//                     }}
//                     disabled={paginatedOrders.length === 0}
//                   />
//                 </th>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer select-none"
//                   onClick={() => handleSort('SAPProductionOrderID')}
//                 >
//                   <div className="flex items-center">
//                     SAP Order ID
//                     {sortColumn === 'SAPProductionOrderID' && (
//                       <span className="ml-1">
//                         {sortDirection === 'asc' ? <FaSortUp className="h-4 w-4" /> : <FaSortDown className="h-4 w-4" />}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Planned Qty</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Completed Qty</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Restricted?</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Header Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//               {paginatedOrders.length > 0 ? (
//                 paginatedOrders.map((order) => (
//                   <tr key={order.ProductionHeaderID} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
//                           checked={selectedOrderIDs.includes(order.ProductionHeaderID)}
//                           onChange={(e) => handleCheckboxChange(order.ProductionHeaderID, e.target.checked)}
//                         />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
//                       onClick={() => handleNavigateToDetailsPage(order.SAPProductionOrderID, order.ProductionHeaderID)}>
//                       {order.SAPProductionOrderID}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 dark:text-white">{order.SAPProductDescription}</div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">{order.SAPProductID}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.SAPPlannedQuantity.toLocaleString()}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.CompletedQuantity.toLocaleString()}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(order.ProductionDetails[0]?.isRestricted)}`}>
//                         {order.ProductionDetails[0]?.isRestricted || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(order.ProductionDate)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {order.isCanceled ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
//                           Canceled
//                         </span>
//                       ) : order.IsPosted ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
//                           Posted
//                         </span>
//                       ) : order.isApproved ? ( // This would be the primary status on this tab
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
//                           Approved (Not Posted)
//                         </span>
//                       ) : (
//                         // Fallback, though ideally all on this tab are 'approved'
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
//                           Unknown Status
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-3">
//                         <button
//                           onClick={() => handleOpenDetailsModal(order)}
//                           className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
//                           title="Quick View Details"
//                         >
//                           <FiEye className="h-5 w-5" />
//                         </button>
//                         <button className="text-gray-400 cursor-not-allowed" title="Quick Edit (Coming Soon)" disabled>
//                           <FiEdit2 className="h-5 w-5" />
//                         </button>
//                         <button className="text-gray-400 cursor-not-allowed" title="Print Barcode (Coming Soon)" disabled>
//                           <FiPrinter className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-400">
//                     No approved orders found matching your criteria.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {paginatedOrders.length === 0 && applyAllFilters.length === 0 && (
//           <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//             <FiList size={48} className="mx-auto mb-2" />
//             No approved production orders to display.
//           </div>
//         )}

//         {/* Pagination Controls */}
//         <div className="mt-6 flex flex-col sm:flex-row justify-between items-center dark:text-gray-300 gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm">Items per page:</span>
//             <select
//               value={itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="block w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//           </div>
//           <span className="text-sm">
//             Showing {Math.min(sortedOrders.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(currentPage * itemsPerPage, sortedOrders.length)} of {sortedOrders.length} results
//           </span>
//           <div className="flex space-x-1">
//             <Button
//               onClick={() => handlePageChange(currentPage - 1)}
//               variant="outline"
//               disabled={currentPage === 1 || sortedOrders.length === 0}
//             >
//               Previous
//             </Button>
//             <Button
//               onClick={() => handlePageChange(currentPage + 1)}
//               variant="outline"
//               disabled={currentPage === totalPages || sortedOrders.length === 0}
//             >
//               Next
//             </Button>
//           </div>
//         </div>

//         {/* Quick-View Details Modal (reused) */}
//         <ViewOrderModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} title={`Details for Order: ${selectedOrderForModal?.SAPProductionOrderID || (modalLoading ? 'Loading...' : 'N/A')}`}>
//           {modalLoading ? (
//             <div className="p-4 text-center text-gray-600 dark:text-gray-300"><Loader /></div>
//           ) : modalError ? (
//             <div className="p-4 text-center text-red-500">Error: {modalError}</div>
//           ) : selectedOrderForModal ? (
//             <div className="p-4 text-gray-700 dark:text-gray-300 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Header Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
//                 <p><strong>Product:</strong> {selectedOrderForModal.SAPProductDescription} ({selectedOrderForModal.SAPProductID})</p>
//                 <p><strong>Planned Quantity:</strong> {selectedOrderForModal.SAPPlannedQuantity.toLocaleString()}</p>
//                 <p><strong>Completed Quantity:</strong> {selectedOrderForModal.CompletedQuantity.toLocaleString()}</p>
//                 <p><strong>Machine:</strong> {selectedOrderForModal.Machine || 'N/A'}</p>
//                 <p><strong>Production Date (Header):</strong> {formatDate(selectedOrderForModal.ProductionDate)}</p>
//                 <p><strong>Status Code:</strong> {selectedOrderForModal.StatusCode} {selectedOrderForModal.Failed ? '(Failed)' : ''}</p>
//                 <p><strong>UoM Quantity Pallet:</strong> {selectedOrderForModal.UoMQuantityPallet.toLocaleString()}</p>
//                 <p><strong>Is Finished:</strong> {selectedOrderForModal.isFinished ? 'Yes' : 'No'}</p>
//                 <p><strong>Is Approved:</strong> {selectedOrderForModal.isApproved ? 'Yes' : 'No'}</p>
//                 <p><strong>Is Canceled:</strong> {selectedOrderForModal.isCanceled ? 'Yes' : 'No'}</p>
//                 <p><strong>Is Posted:</strong> {selectedOrderForModal.IsPosted ? 'Yes' : 'No'}</p>
//               </div>

//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Individual Production Entries</h3>
//               {selectedOrderForModal.ProductionDetails && selectedOrderForModal.ProductionDetails.length > 0 ? (
//                 <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
//                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-50 dark:bg-gray-700">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date & Time</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Shift</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Completed Qty</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Restricted</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Stock ID</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//                     {selectedOrderForModal.ProductionDetails.map((detail: any) => (
//                         <tr key={detail.ProductionDetailID} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{formatDateTime(detail.ProductionDate)}</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.Shift}</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.CompletedQuantity.toLocaleString()}</td>
//                           <td className="px-4 py-3 whitespace-nowrap">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(detail.isRestricted)}`}>
//                               {detail.isRestricted || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.IdentifiedStockID}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">No individual production entries found for this order.</p>
//               )}
//               <div className="flex justify-end pt-4">
//                 <Button onClick={() => handleNavigateToDetailsPage(selectedOrderForModal.SAPProductionOrderID, selectedOrderForModal.ProductionHeaderID)} variant="primary">
//                   View Full Details Page
//                 </Button>
//               </div>
//             </div>
//           ) : null}
//         </ViewOrderModal>

//         {/* Confirmation Approval Modal (reused, but action context changes) */}
//         <ConfirmationApprovalModal
//           isOpen={isApprovalConfirmModalOpen}
//           onClose={handleCloseConfirmModalForBulkAction}
//           onConfirm={handleConfirmBulkAction}
//           title={`Confirm Action for ${selectedOrderIDs.length} Order(s)`}
//           description={`You are about to post ${selectedOrderIDs.length} production order(s) to SAP. This action cannot be reversed. Are you sure you want to proceed?`}
//           isLoading={isApproving}
//         />

//         {/* Filter Sidebar Component (reused) */}
//         <FilterSidebar
//           isOpen={isFilterSidebarOpen}
//           onClose={() => setIsFilterSidebarOpen(false)}
//           filters={activeFilters}
//           onApplyFilters={handleApplyFilters}
//           allProductIDs={allProductIDs}
//         />

//       </div>
//       <Toaster richColors position="bottom-right"/>
//     </>
//   );
// };

// export default ApprovedOrdersManagementTab;