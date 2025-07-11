// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FiSearch, FiFilter, FiPlusCircle, FiDownload, FiEye, FiEdit2, FiPrinter, FiList, FiCheckCircle } from 'react-icons/fi';
// import { toast, Toaster } from 'sonner';
// import Button from '../../../ui/button/Button';
// import { ConfirmationApprovalModal, ViewOrderModal } from '../../../ui/modal/ConfirmationModal';
// import { useAuth } from '../../../../hooks/useAuth';
// import axiosInstance from '../../../../api/axiosInstance';
// import Loader from '../../../ui/loader/Loader';

// // Adjust path based on your modal component location

// // --- API Endpoints ---
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const GET_ALL_FINISHED_PRODUCTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-all-finished-productions`;
// // NEW: Endpoint for a single finished production order
// const GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-finished-production`;
// const APPROVE_BULK_PRODUCTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/production/approve-production-bulk`;

// // --- Type Definitions (Must be consistent) ---
// export interface ProductionDetail {
//   ProductionDetailID: string;
//   ProductionHeaderID: string;
//   ProductionDate: string; // ISO 8601 string
//   Shift: 'M' | 'A' | 'N';
//   isRestricted: 'Yes' | 'No' | null;
//   CompletedQuantity: number;
//   IdentifiedStockID: string;
// }

// export interface ProductionOrderHeader {
//   ProductionHeaderID: string;
//   SAPProductionOrderID: string;
//   SAPProductionOrderObjectID: string;
//   SAPProductionProposalID: string;
//   SAPProductionProposalObjectID: string;
//   SAPSupplyTaskID: string | null;
//   SAPMakeTaskID: string | null;
//   SAPProductID: string;
//   SAPProductDescription: string;
//   SAPPlannedQuantity: number;
//   CompletedQuantity: number;
//   StatusCode: number; // Assuming 0 for pending, 1 for approved etc.
//   Failed: boolean;
//   Machine: string | null;
//   isFinished: boolean;
//   isApproved: boolean;
//   // isPosted: boolean;
//   ProductionDate: string | null;
//   UoMQuantityPallet: number;
//   ProductionDetails: ProductionDetail[];
// }

// // --- Helper Functions (retained) ---
// const getRestrictedStatusColor = (isRestricted: 'Yes' | 'No' | null): string => {
//   if (isRestricted === 'Yes') return 'bg-red-100 text-red-700';
//   if (isRestricted === 'No') return 'bg-green-100 text-green-700';
//   return 'bg-gray-100 text-gray-600';
// };

// const formatDate = (dateString: string | null) => {
//   if (!dateString) return 'N/A';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       if (dateString.includes('T')) {
//         return new Date(dateString.split('T')[0]).toLocaleDateString('en-GB');
//       }
//       return new Date(dateString).toLocaleDateString('en-GB');
//     }
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });
//   } catch (error) {
//     console.error('Error formatting date:', dateString, error);
//     return dateString;
//   }
// };

// const formatDateTime = (dateString: string | null) => {
//   if (!dateString) return 'N/A';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       return dateString;
//     }
//     return date.toLocaleString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//     });
//   } catch (error) {
//     console.error('Error formatting date-time:', dateString, error);
//     return dateString;
//   }
// };

// const OrdersManagementTab: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [finishedOrders, setFinishedOrders] = useState<ProductionOrderHeader[]>([]);
//   // NEW: State for selected order IDs for bulk approval
//   const [selectedOrderIDs, setSelectedOrderIDs] = useState<string[]>([]);
//   // NEW: State for confirmation modal visibility and loading
//   const [isApprovalConfirmModalOpen, setIsApprovalConfirmModalOpen] = useState(false);
//   const [isApproving, setIsApproving] = useState(false); // For approval button loading state

//   // State for the quick-view modal and the data fetched for it
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState<string | null>(null);
//   const [selectedOrderForModal, setSelectedOrderForModal] = useState<ProductionOrderHeader | null>(null);

//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const userData = user?.id;

//   // --- Data Fetching for All Finished Orders (Table) ---
//   const fetchFinishedProductionOrders = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get<{ data: ProductionOrderHeader[]; message: string; status: boolean }>(
//         GET_ALL_FINISHED_PRODUCTIONS_ENDPOINT
//       );
//       if (response.data.status) {
//         setFinishedOrders(response.data.data);
//         // Clear selected orders after re-fetch, as old selections might no longer be valid
//         setSelectedOrderIDs([]);
//       } else {
//         setError(response.data.message || 'Failed to fetch finished production orders.');
//         toast.error(response.data.message || "Failed to load finished production orders.");
//       }
//     } catch (err: any) { // Use 'any' for unknown error types from axios
//       console.error("Error fetching finished production orders:", err);
//       setError(err.response?.data?.message || err.message || 'An error occurred while fetching data.');
//       toast.error(err.response?.data?.message || err.message || "An error occurred while fetching finished production orders.");
//     } finally {
//       setLoading(false);
//     }
//   }, []); // Depend on axiosInstance if it's dynamic, otherwise, an empty array is fine.

//   useEffect(() => {
//     fetchFinishedProductionOrders();
//   }, [fetchFinishedProductionOrders]);

//   // --- Filtering Logic (retained) ---
//   const filteredOrders = useMemo(() => {
//     return finishedOrders.filter(order =>
//       order.SAPProductDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.SAPProductionOrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.SAPProductID.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm, finishedOrders]);

//   // --- Checkbox Handlers ---
//   const handleCheckboxChange = useCallback((productionHeaderID: string, isChecked: boolean) => {
//     setSelectedOrderIDs(prev =>
//       isChecked
//         ? [...prev, productionHeaderID]
//         : prev.filter(id => id !== productionHeaderID)
//     );
//   }, []);

//   const handleSelectAllChange = useCallback((isChecked: boolean) => {
//     if (isChecked) {
//       const allHeaderIDs = filteredOrders.map(order => order.ProductionHeaderID);
//       setSelectedOrderIDs(allHeaderIDs);
//     } else {
//       setSelectedOrderIDs([]);
//     }
//   }, [filteredOrders]);

//   // Determine if all filtered orders are selected
//   const allFilteredOrdersSelected = useMemo(() => {
//     if (filteredOrders.length === 0) return false;
//     return filteredOrders.every(order => selectedOrderIDs.includes(order.ProductionHeaderID));
//   }, [filteredOrders, selectedOrderIDs]);

//   // --- Navigation to Dedicated Details Page (Uses query params) ---
//   const handleNavigateToDetailsPage = useCallback((orderID: string, headerID: string) => {
//     if (!userData) {
//       toast.error("User ID not available for navigation.");
//       return;
//     }
//     const queryString = new URLSearchParams({
//       sapProductionOrderID: orderID,
//       userID: userData
//     }).toString();
//     navigate(`/finished-orders?${queryString}`, { state: { productionHeaderID: headerID } });
//   }, [navigate, userData]);

//   // --- Open Quick-View Modal (FETCHES SINGLE ORDER using query params) ---
//   const handleOpenDetailsModal = useCallback(async (order: ProductionOrderHeader) => {
//     setModalLoading(true);
//     setModalError(null);
//     setSelectedOrderForModal(null);
//     setIsDetailsModalOpen(true);

//     const orderID = order.SAPProductionOrderID;
//     // const headerID = order.ProductionHeaderID; // Not directly used here, but in full details page

//     try {
//       if (!userData) {
//         throw new Error('User ID is not available.');
//       }

//       const response = await axiosInstance.get<{ data: ProductionOrderHeader; message: string; status: boolean }>(
//         GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT,
//         {
//           params: {
//             sapProductionOrderID: orderID,
//             userID: userData
//           }
//         }
//       );

//       if (response.data.status) {
//         setSelectedOrderForModal(response.data.data);
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

//   // --- Bulk Approval Logic ---
//   const handleOpenApprovalConfirmModal = useCallback(() => {
//     if (selectedOrderIDs.length === 0) {
//       toast.info("Please select at least one production order to approve.");
//       return;
//     }
//     setIsApprovalConfirmModalOpen(true);
//   }, [selectedOrderIDs]);

//   const handleCloseApprovalConfirmModal = useCallback(() => {
//     setIsApprovalConfirmModalOpen(false);
//     setIsApproving(false); // Reset loading state if modal is closed
//   }, []);

//   const handleConfirmBulkApproval = useCallback(async () => {
//     if (selectedOrderIDs.length === 0) {
//       toast.error("No orders selected for approval.");
//       return;
//     }

//     setIsApproving(true);
//     // Optimistic UI update or full re-fetch depending on requirements
//     // For enterprise level, re-fetching is often safer after a bulk operation.

//     try {
//       const response = await axiosInstance.post<{ data: any; message: string; status: boolean }>(
//         APPROVE_BULK_PRODUCTIONS_ENDPOINT,
//         selectedOrderIDs // This will be sent as an array of strings in the request body
//       );

//       if (response.data.status) {
//         toast.success(response.data.message || `${selectedOrderIDs.length} production order(s) approved successfully!`);
//         // Re-fetch all finished orders to reflect the changes (approved orders will disappear)
//         await fetchFinishedProductionOrders();
//         setSelectedOrderIDs([]); // Clear selections after successful approval
//       } else {
//         // Handle partial success or specific backend error messages if available
//         toast.error(response.data.message || `Failed to approve ${selectedOrderIDs.length} production order(s).`);
//       }
//     } catch (err: any) {
//       console.error("Error during bulk approval:", err);
//       toast.error(err.response?.data?.message || err.message || "An error occurred during bulk approval.");
//     } finally {
//       setIsApproving(false);
//       setIsApprovalConfirmModalOpen(false); // Close modal regardless of success/failure
//     }
//   }, [selectedOrderIDs, axiosInstance, fetchFinishedProductionOrders]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[500px] bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
//         <Loader />
//         <p className="text-gray-600 dark:text-gray-300 ml-3">Loading finished production orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
//         <p className="text-red-500">Error: {error}</p>
//         <Button
//           onClick={fetchFinishedProductionOrders}
//           className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//         >
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
//         {/* Header and Actions */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//           <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Finished Production Orders</h2>
//           <div className="flex items-center space-x-2">
//             {selectedOrderIDs.length > 0 && ( // Conditionally render Approve button
//               <Button
//                 onClick={handleOpenApprovalConfirmModal} // Opens confirmation modal
//                 variant="primary" // Or 'success' if you have one
//                 startIcon={<FiCheckCircle className="h-5 w-5" />}
//                 disabled={isApproving} // Disable while approval is in progress
//               >
//                 {isApproving ? 'Approving...' : `Approve PO(s) (${selectedOrderIDs.length})`}
//               </Button>
//             )}
//             {/* The old 'Create New' button was replaced by 'Approve PO(s)'.
//                 If you still need 'Create New', place it here conditionally or always visible. */}
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
//           <Button onClick={() => toast.info('Filters functionality coming soon!')} variant="outline" startIcon={<FiFilter className="h-5 w-5" />}>
//             Filters
//           </Button>
//         </div>

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
//                     checked={allFilteredOrdersSelected && filteredOrders.length > 0}
//                     ref={input => {
//                       if (input) {
//                         input.indeterminate = selectedOrderIDs.length > 0 && !allFilteredOrdersSelected;
//                       }
//                     }}
//                   />
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">SAP Order ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Planned Qty</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Completed Qty</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Restricted?</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Header Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//               {filteredOrders.map((order) => (
//                 <tr key={order.ProductionHeaderID} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
//                       checked={selectedOrderIDs.includes(order.ProductionHeaderID)}
//                       onChange={(e) => handleCheckboxChange(order.ProductionHeaderID, e.target.checked)}
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
//                       onClick={() => handleNavigateToDetailsPage(order.SAPProductionOrderID, order.ProductionHeaderID)}>
//                     {order.SAPProductionOrderID}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900 dark:text-white">{order.SAPProductDescription}</div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">{order.SAPProductID}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.SAPPlannedQuantity.toLocaleString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.CompletedQuantity.toLocaleString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(order.ProductionDetails[0]?.isRestricted)}`}>
//                       {order.ProductionDetails[0]?.isRestricted || 'N/A'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(order.ProductionDate)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-3">
//                       <button
//                         onClick={() => handleOpenDetailsModal(order)}
//                         className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
//                         title="Quick View Details"
//                       >
//                         <FiEye className="h-5 w-5" />
//                       </button>
//                       <button className="text-gray-400 cursor-not-allowed" title="Quick Edit (Coming Soon)" disabled>
//                         <FiEdit2 className="h-5 w-5" />
//                       </button>
//                       <button className="text-gray-400 cursor-not-allowed" title="Print Barcode (Coming Soon)" disabled>
//                         <FiPrinter className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredOrders.length === 0 && (
//           <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//             <FiList size={48} className="mx-auto mb-2" />
//             No finished production orders found.
//           </div>
//         )}

//         {/* Pagination (Conceptual) */}
//         <div className="mt-6 flex justify-between items-center dark:text-gray-300">
//           <span className="text-sm">Showing 1 to {Math.min(10, filteredOrders.length)} of {filteredOrders.length} results</span>
//           <div className="flex space-x-1">
//             <Button onClick={() => console.log('Previous')} variant="outline" disabled>Previous</Button>
//             <Button onClick={() => console.log('Next')} variant="outline" disabled>Next</Button>
//           </div>
//         </div>

//         {/* Quick-View Details Modal (remains unchanged) */}
//         <ViewOrderModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} title={`Details for Order: ${selectedOrderForModal?.SAPProductionOrderID || (modalLoading ? 'Loading...' : 'N/A')}`}>
//           {modalLoading ? (
//             <div className="p-4 text-center text-gray-600 dark:text-gray-300">Loading details...</div>
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
//                 {/* <p><strong>Is Posted:</strong> {selectedOrderForModal. ? 'Yes' : 'No'}</p> */}
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
//                       {selectedOrderForModal.ProductionDetails.map((detail) => (
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
//                   <Button onClick={() => handleNavigateToDetailsPage(selectedOrderForModal.SAPProductionOrderID, selectedOrderForModal.ProductionHeaderID)} variant="primary">
//                       View Full Details Page
//                   </Button>
//               </div>
//             </div>
//           ) : null}
//         </ViewOrderModal>

//         {/* Confirmation Approval Modal */}
//         <ConfirmationApprovalModal
//           isOpen={isApprovalConfirmModalOpen}
//           onClose={handleCloseApprovalConfirmModal}
//           onConfirm={handleConfirmBulkApproval}
//           title={`Confirm Approval for ${selectedOrderIDs.length} Order(s)`}
//           description={`You are about to approve ${selectedOrderIDs.length} production order(s). This action cannot be reversed. Are you sure you want to proceed?`}
//           isLoading={isApproving}
//         />
//       </div>
//       <Toaster richColors position="bottom-right"/>
//     </>
//   );
// };

// export default OrdersManagementTab;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Removed axios import as axiosInstance is used
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit2,
  FiPrinter,
  FiList,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { toast, Toaster } from "sonner";
import Button from "../../../ui/button/Button";
import {
  ConfirmationApprovalModal,
  ViewOrderModal,
} from "../../../ui/modal/ConfirmationModal";
import { useAuth } from "../../../../hooks/useAuth";
import axiosInstance from "../../../../api/axiosInstance";
import Loader from "../../../ui/loader/Loader";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import FilterSidebar, { OrdersFilterState } from "../../../ui/filter/FilterSidebar";
import ProdButton from "../../../ui/button/ProdBtn";

// --- API Endpoints ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GET_ALL_FINISHED_PRODUCTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-all-finished-productions`;
const GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-finished-production`;
const APPROVE_BULK_PRODUCTIONS_ENDPOINT = `${API_BASE_URL}/api/v1/production/approve-production-bulk`;

// --- Type Definitions (Must be consistent) ---
interface ProductionDetail {
  ProductionDetailID: string;
  ProductionHeaderID: string;
  ProductionDate: string; // ISO string
  Shift: string;
  // Change this line:
  isRestricted?: 'Yes' | 'No'; 
  CompletedQuantity: number;
  IdentifiedStockID: string;
}

export interface ProductionOrderHeader {
  ProductionHeaderID: string;
  SAPProductionOrderID: string;
  SAPProductionOrderObjectID: string;
  SAPProductionProposalID: string;
  SAPProductionProposalObjectID: string;
  SAPSupplyTaskID: string | null;
  SAPMakeTaskID: string | null;
  SAPProductID: string;
  SAPProductDescription: string;
  SAPPlannedQuantity: number;
  CompletedQuantity: number;
  StatusCode: number; // Assuming 0 for pending, 1 for approved etc.
  Failed: boolean;
  Machine: string | null;
  isFinished: boolean;
  isApproved: boolean;
  IsPosted: boolean;
  isCanceled: boolean;
  ProductionDate: string | null;
  UoMQuantityPallet: number;
  ProductionDetails: ProductionDetail[];
}

// --- Helper Functions (retained) ---
export const getRestrictedStatusColor = (isRestricted: 'Yes' | 'No' | undefined | null): string => {
  // Handle null by treating it like undefined, or a default 'No' if that makes sense
  // For color, 'N/A' (undefined/null) will default to green as it's not 'Yes'
  return isRestricted === 'Yes'
    ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      if (dateString.includes("T")) {
        return new Date(dateString.split("T")[0]).toLocaleDateString("en-GB");
      }
      return new Date(dateString).toLocaleDateString("en-GB");
    }
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting date-time:", dateString, error);
    return dateString;
  }
};

// const OrdersManagementTab: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [finishedOrders, setFinishedOrders] = useState<ProductionOrderHeader[]>(
//     []
//   );

//   // State for selected order IDs for bulk approval
//   const [selectedOrderIDs, setSelectedOrderIDs] = useState<string[]>([]);
//   // State for confirmation modal visibility and loading
//   const [isApprovalConfirmModalOpen, setIsApprovalConfirmModalOpen] =
//     useState(false);
//   const [isApproving, setIsApproving] = useState(false); // For approval button loading state

//   // State for the quick-view modal and the data fetched for it
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState<string | null>(null);
//   const [selectedOrderForModal, setSelectedOrderForModal] =
//     useState<ProductionOrderHeader | null>(null);

//   // --- Pagination States ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

//   // --- Sorting States ---
//   const [sortColumn, setSortColumn] = useState<
//     keyof ProductionOrderHeader | null
//   >(null);
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const userData = user?.id;

//   // --- Data Fetching for All Finished Orders (Table) ---
//   const fetchFinishedProductionOrders = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get<{
//         data: ProductionOrderHeader[];
//         message: string;
//         status: boolean;
//       }>(GET_ALL_FINISHED_PRODUCTIONS_ENDPOINT);
//       if (response.data.status) {
//         setFinishedOrders(response.data.data);
//         // Clear selected orders after re-fetch, as old selections might no longer be valid
//         setSelectedOrderIDs([]);
//         setCurrentPage(1); // Reset to first page on new data fetch
//       } else {
//         setError(
//           response.data.message || "Failed to fetch finished production orders."
//         );
//         toast.error(
//           response.data.message || "Failed to load finished production orders."
//         );
//       }
//     } catch (err: any) {
//       // Use 'any' for unknown error types from axios
//       console.error("Error fetching finished production orders:", err);
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "An error occurred while fetching data."
//       );
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "An error occurred while fetching finished production orders."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchFinishedProductionOrders();
//   }, [fetchFinishedProductionOrders]);

//   // --- Filtering Logic ---
//   const filteredOrders = useMemo(() => {
//     return finishedOrders.filter(
//       (order) =>
//         order.SAPProductDescription.toLowerCase().includes(
//           searchTerm.toLowerCase()
//         ) ||
//         order.SAPProductionOrderID.toLowerCase().includes(
//           searchTerm.toLowerCase()
//         ) ||
//         order.SAPProductID.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm, finishedOrders]);

//   // --- Sorting Logic ---
//   const sortedOrders = useMemo(() => {
//     if (!sortColumn) {
//       return filteredOrders;
//     }

//     const sortableOrders = [...filteredOrders];

//     sortableOrders.sort((a, b) => {
//       const valA = a[sortColumn];
//       const valB = b[sortColumn];

//       // Special handling for SAPProductionOrderID as it's a string representing a number
//       if (sortColumn === "SAPProductionOrderID") {
//         const numA = parseInt(String(valA), 10);
//         const numB = parseInt(String(valB), 10);
//         if (sortDirection === "asc") {
//           return numA - numB;
//         } else {
//           return numB - numA;
//         }
//       }

//       // Default string or number comparison
//       if (typeof valA === "string" && typeof valB === "string") {
//         return sortDirection === "asc"
//           ? valA.localeCompare(valB)
//           : valB.localeCompare(valA);
//       }
//       if (typeof valA === "number" && typeof valB === "number") {
//         return sortDirection === "asc" ? valA - valB : valB - valA;
//       }
//       return 0; // Fallback for other types or if values are not comparable
//     });

//     return sortableOrders;
//   }, [filteredOrders, sortColumn, sortDirection]);

//   // --- Sorting Handler ---
//   const handleSort = useCallback(
//     (column: keyof ProductionOrderHeader) => {
//       if (sortColumn === column) {
//         setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
//       } else {
//         setSortColumn(column);
//         setSortDirection("asc");
//       }
//     },
//     [sortColumn]
//   );

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
//   const handlePageChange = useCallback(
//     (pageNumber: number) => {
//       setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages))); // Ensure page is within bounds
//     },
//     [totalPages]
//   );

//   const handleItemsPerPageChange = useCallback(
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       setItemsPerPage(Number(e.target.value));
//       setCurrentPage(1); // Reset to first page when items per page changes
//     },
//     []
//   );

//   // --- Checkbox Handlers ---
//   const handleCheckboxChange = useCallback(
//     (productionHeaderID: string, isChecked: boolean) => {
//       setSelectedOrderIDs((prev) =>
//         isChecked
//           ? [...prev, productionHeaderID]
//           : prev.filter((id) => id !== productionHeaderID)
//       );
//     },
//     []
//   );

//   const handleSelectAllChange = useCallback(
//     (isChecked: boolean) => {
//       if (isChecked) {
//         // Select only currently visible (paginated) orders that are NOT approved AND NOT canceled
//         const eligibleHeaderIDsOnPage = paginatedOrders
//           .filter((order) => !order.isApproved && !order.isCanceled)
//           .map((order) => order.ProductionHeaderID);
//         setSelectedOrderIDs((prev) =>
//           Array.from(new Set([...prev, ...eligibleHeaderIDsOnPage]))
//         );
//       } else {
//         // Remove only currently visible (paginated) orders from selection
//         const currentPageEligibleHeaderIDs = paginatedOrders
//           .filter((order) => !order.isApproved && !order.isCanceled)
//           .map((order) => order.ProductionHeaderID);
//         setSelectedOrderIDs((prev) =>
//           prev.filter((id) => !currentPageEligibleHeaderIDs.includes(id))
//         );
//       }
//     },
//     [paginatedOrders]
//   );

//   // Determine if all CURRENT PAGE *eligible* orders are selected
//   const allCurrentPageEligibleOrders = useMemo(() => {
//     return paginatedOrders.filter(
//       (order) => !order.isApproved && !order.isCanceled
//     );
//   }, [paginatedOrders]);

//   const allCurrentPageOrdersSelected = useMemo(() => {
//     if (allCurrentPageEligibleOrders.length === 0) return false;
//     return allCurrentPageEligibleOrders.every((order) =>
//       selectedOrderIDs.includes(order.ProductionHeaderID)
//     );
//   }, [allCurrentPageEligibleOrders, selectedOrderIDs]);

//   // --- Navigation to Dedicated Details Page (Uses query params) ---
//   const handleNavigateToDetailsPage = useCallback(
//     (orderID: string, headerID: string) => {
//       if (!userData) {
//         toast.error("User ID not available for navigation.");
//         return;
//       }
//       const queryString = new URLSearchParams({
//         sapProductionOrderID: orderID,
//         userID: userData,
//       }).toString();
//       navigate(`/finished-orders?${queryString}`, {
//         state: { productionHeaderID: headerID },
//       });
//     },
//     [navigate, userData]
//   );

//   // --- Open Quick-View Modal (FETCHES SINGLE ORDER using query params) ---
//   const handleOpenDetailsModal = useCallback(
//     async (order: ProductionOrderHeader) => {
//       setModalLoading(true);
//       setModalError(null);
//       setSelectedOrderForModal(null);
//       setIsDetailsModalOpen(true);

//       const orderID = order.SAPProductionOrderID;

//       try {
//         if (!userData) {
//           throw new Error("User ID is not available.");
//         }

//         const response = await axiosInstance.get<{
//           data: ProductionOrderHeader;
//           message: string;
//           status: boolean;
//         }>(GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT, {
//           params: {
//             sapProductionOrderID: orderID,
//             userID: userData,
//           },
//         });

//         if (response.data.status) {
//           setSelectedOrderForModal(response.data.data);
//           toast.success(
//             response.data.message || "Single production order details loaded!"
//           );
//         } else {
//           setModalError(
//             response.data.message ||
//               "Failed to fetch single production order details."
//           );
//           toast.error(
//             response.data.message ||
//               "Failed to load single production order details."
//           );
//         }
//       } catch (err: any) {
//         console.error("Error fetching single production order:", err);
//         setModalError(
//           err.response?.data?.message ||
//             err.message ||
//             "An error occurred while fetching single order data."
//         );
//         toast.error(
//           err.response?.data?.message ||
//             err.message ||
//             "An error occurred while fetching single production order."
//         );
//       } finally {
//         setModalLoading(false);
//       }
//     },
//     [axiosInstance, userData]
//   );

//   // --- Close Quick-View Modal ---
//   const handleCloseDetailsModal = useCallback(() => {
//     setIsDetailsModalOpen(false);
//     setSelectedOrderForModal(null);
//     setModalError(null);
//   }, []);

//   // --- Bulk Approval Logic ---
//   const handleOpenApprovalConfirmModal = useCallback(() => {
//     // Filter selectedOrderIDs to ensure only eligible ones are considered for approval
//     const eligibleSelectedForApproval = selectedOrderIDs.filter((id) => {
//       const order = finishedOrders.find((o) => o.ProductionHeaderID === id);
//       return order && !order.isApproved && !order.isCanceled;
//     });

//     if (eligibleSelectedForApproval.length === 0) {
//       toast.info(
//         "Please select at least one finished production order that has not been approved or canceled yet."
//       );
//       // If no eligible orders, clear selection to avoid confusion
//       setSelectedOrderIDs([]);
//       return;
//     }

//     // Update selectedOrderIDs to only include truly eligible ones before opening modal
//     setSelectedOrderIDs(eligibleSelectedForApproval);
//     setIsApprovalConfirmModalOpen(true);
//   }, [selectedOrderIDs, finishedOrders]);

//   const handleCloseApprovalConfirmModal = useCallback(() => {
//     setIsApprovalConfirmModalOpen(false);
//     setIsApproving(false); // Reset loading state if modal is closed
//   }, []);

//   const handleConfirmBulkApproval = useCallback(async () => {
//     if (selectedOrderIDs.length === 0) {
//       toast.error("No orders selected for approval.");
//       handleCloseApprovalConfirmModal(); // Close modal if somehow empty
//       return;
//     }

//     setIsApproving(true);

//     try {
//       const response = await axiosInstance.post<{
//         data: any;
//         message: string;
//         status: boolean;
//       }>(
//         APPROVE_BULK_PRODUCTIONS_ENDPOINT,
//         selectedOrderIDs // This will be sent as an array of strings in the request body
//       );

//       if (response.data.status) {
//         toast.success(
//           response.data.message ||
//             `${selectedOrderIDs.length} production order(s) approved successfully!`
//         );
//         // Re-fetch all finished orders to reflect the changes (approved orders will disappear)
//         await fetchFinishedProductionOrders();
//         setSelectedOrderIDs([]); // Clear selections after successful approval
//       } else {
//         // Handle partial success or specific backend error messages if available
//         toast.error(
//           response.data.message ||
//             `Failed to approve ${selectedOrderIDs.length} production order(s).`
//         );
//       }
//     } catch (err: any) {
//       console.error("Error during bulk approval:", err);
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "An error occurred during bulk approval."
//       );
//     } finally {
//       setIsApproving(false);
//       setIsApprovalConfirmModalOpen(false); // Close modal regardless of success/failure
//     }
//   }, [
//     selectedOrderIDs,
//     axiosInstance,
//     fetchFinishedProductionOrders,
//     handleCloseApprovalConfirmModal,
//   ]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[500px] bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
//         <Loader />
//         <p className="text-gray-600 dark:text-gray-300 ml-3">
//           Loading finished production orders...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
//         <p className="text-red-500">Error: {error}</p>
//         <Button
//           onClick={fetchFinishedProductionOrders}
//           className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//         >
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
//         {/* Header and Actions */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//           <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
//             Finished Production Orders
//           </h2>
//           <div className="flex items-center space-x-2">
//             {selectedOrderIDs.length > 0 && ( // Conditionally render Approve button
//               <Button
//                 onClick={handleOpenApprovalConfirmModal} // Opens confirmation modal
//                 variant="primary" // Or 'success' if you have one
//                 startIcon={<FiCheckCircle className="h-5 w-5" />}
//                 disabled={isApproving} // Disable while approval is in progress
//               >
//                 {isApproving
//                   ? "Approving..."
//                   : `Approve PO(s) (${selectedOrderIDs.length})`}
//               </Button>
//             )}
//             <Button
//               onClick={() => toast.info("Export functionality coming soon!")}
//               variant="outline"
//               startIcon={<FiDownload className="h-5 w-5" />}
//             >
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
//             onClick={() => toast.info("Filters functionality coming soon!")}
//             variant="outline"
//             startIcon={<FiFilter className="h-5 w-5" />}
//           >
//             Filters
//           </Button>
//         </div>

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
//                     // Only check "select all" if all eligible items on the current page are selected
//                     checked={allCurrentPageOrdersSelected}
//                     // Indeterminate state if some, but not all, eligible items are selected
//                     ref={(input) => {
//                       if (input) {
//                         input.indeterminate =
//                           selectedOrderIDs.length > 0 &&
//                           !allCurrentPageOrdersSelected &&
//                           allCurrentPageEligibleOrders.length > 0;
//                       }
//                     }}
//                     // Disable select all if there are no eligible orders on the current page
//                     disabled={allCurrentPageEligibleOrders.length === 0}
//                   />
//                 </th>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer select-none"
//                   onClick={() => handleSort("SAPProductionOrderID")}
//                 >
//                   <div className="flex items-center">
//                     SAP Order ID
//                     {sortColumn === "SAPProductionOrderID" && (
//                       <span className="ml-1">
//                         {sortDirection === "asc" ? (
//                           <FaSortUp className="h-4 w-4" />
//                         ) : (
//                           <FaSortDown className="h-4 w-4" />
//                         )}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Planned Qty
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Completed Qty
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Restricted?
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Header Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Status
//                 </th>{" "}
//                 {/* Added Status Column */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//               {paginatedOrders.length > 0 ? (
//                 paginatedOrders.map((order) => (
//                   <tr
//                     key={order.ProductionHeaderID}
//                     className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {/* CONDITIONAL RENDERING OF CHECKBOX: Only if NOT approved AND NOT canceled */}
//                       {!order.isApproved && !order.isCanceled && (
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
//                           checked={selectedOrderIDs.includes(
//                             order.ProductionHeaderID
//                           )}
//                           onChange={(e) =>
//                             handleCheckboxChange(
//                               order.ProductionHeaderID,
//                               e.target.checked
//                             )
//                           }
//                         />
//                       )}
//                     </td>
//                     <td
//                       className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
//                       onClick={() =>
//                         handleNavigateToDetailsPage(
//                           order.SAPProductionOrderID,
//                           order.ProductionHeaderID
//                         )
//                       }
//                     >
//                       {order.SAPProductionOrderID}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 dark:text-white">
//                         {order.SAPProductDescription}
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         {order.SAPProductID}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                       {order.SAPPlannedQuantity.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                       {order.CompletedQuantity.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(
//                           order.ProductionDetails[0]?.isRestricted
//                         )}`}
//                       >
//                         {order.ProductionDetails[0]?.isRestricted || "N/A"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                       {formatDate(order.ProductionDate)}
//                     </td>
//                     {/* Status Column */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {order.isCanceled ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
//                           Canceled
//                         </span>
//                       ) : order.isApproved ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
//                           Approved
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
//                           Pending Approval
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
//                         <button
//                           className="text-gray-400 cursor-not-allowed"
//                           title="Quick Edit (Coming Soon)"
//                           disabled
//                         >
//                           <FiEdit2 className="h-5 w-5" />
//                         </button>
//                         <button
//                           className="text-gray-400 cursor-not-allowed"
//                           title="Print Barcode (Coming Soon)"
//                           disabled
//                         >
//                           <FiPrinter className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="text-center py-4 text-gray-500 dark:text-gray-400"
//                   >
//                     No orders found matching your search.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {paginatedOrders.length === 0 && filteredOrders.length === 0 && (
//           <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//             <FiList size={48} className="mx-auto mb-2" />
//             No finished production orders to display.
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
//             Showing{" "}
//             {Math.min(
//               sortedOrders.length,
//               (currentPage - 1) * itemsPerPage + 1
//             )}{" "}
//             to {Math.min(currentPage * itemsPerPage, sortedOrders.length)} of{" "}
//             {sortedOrders.length} results
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

//         {/* Quick-View Details Modal */}
//         <ViewOrderModal
//           isOpen={isDetailsModalOpen}
//           onClose={handleCloseDetailsModal}
//           title={`Details for Order: ${
//             selectedOrderForModal?.SAPProductionOrderID ||
//             (modalLoading ? "Loading..." : "N/A")
//           }`}
//         >
//           {modalLoading ? (
//             <div className="p-4 text-center text-gray-600 dark:text-gray-300">
//               <Loader />
//             </div>
//           ) : modalError ? (
//             <div className="p-4 text-center text-red-500">
//               Error: {modalError}
//             </div>
//           ) : selectedOrderForModal ? (
//             <div className="p-4 text-gray-700 dark:text-gray-300 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//                 Order Header Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
//                 <p>
//                   <strong>Product:</strong>{" "}
//                   {selectedOrderForModal.SAPProductDescription} (
//                   {selectedOrderForModal.SAPProductID})
//                 </p>
//                 <p>
//                   <strong>Planned Quantity:</strong>{" "}
//                   {selectedOrderForModal.SAPPlannedQuantity.toLocaleString()}
//                 </p>
//                 <p>
//                   <strong>Completed Quantity:</strong>{" "}
//                   {selectedOrderForModal.CompletedQuantity.toLocaleString()}
//                 </p>
//                 <p>
//                   <strong>Machine:</strong>{" "}
//                   {selectedOrderForModal.Machine || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Production Date (Header):</strong>{" "}
//                   {formatDate(selectedOrderForModal.ProductionDate)}
//                 </p>
//                 <p>
//                   <strong>Status Code:</strong>{" "}
//                   {selectedOrderForModal.StatusCode}{" "}
//                   {selectedOrderForModal.Failed ? "(Failed)" : ""}
//                 </p>
//                 <p>
//                   <strong>UoM Quantity Pallet:</strong>{" "}
//                   {selectedOrderForModal.UoMQuantityPallet.toLocaleString()}
//                 </p>
//                 <p>
//                   <strong>Is Finished:</strong>{" "}
//                   {selectedOrderForModal.isFinished ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <strong>Is Approved:</strong>{" "}
//                   {selectedOrderForModal.isApproved ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <strong>Is Canceled:</strong>{" "}
//                   {selectedOrderForModal.isCanceled ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <strong>Is Posted:</strong>{" "}
//                   {selectedOrderForModal.IsPosted ? "Yes" : "No"}
//                 </p>
//               </div>

//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
//                 Individual Production Entries
//               </h3>
//               {selectedOrderForModal.ProductionDetails &&
//               selectedOrderForModal.ProductionDetails.length > 0 ? (
//                 <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
//                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-50 dark:bg-gray-700">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                           Date & Time
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                           Shift
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                           Completed Qty
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                           Restricted
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                           Stock ID
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//                       {selectedOrderForModal.ProductionDetails.map((detail) => (
//                         <tr
//                           key={detail.ProductionDetailID}
//                           className="hover:bg-gray-50 dark:hover:bg-gray-700"
//                         >
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
//                             {formatDateTime(detail.ProductionDate)}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
//                             {detail.Shift}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
//                             {detail.CompletedQuantity.toLocaleString()}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap">
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(
//                                 detail.isRestricted
//                               )}`}
//                             >
//                               {detail.isRestricted || "N/A"}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
//                             {detail.IdentifiedStockID}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   No individual production entries found for this order.
//                 </p>
//               )}
//               <div className="flex justify-end pt-4">
//                 <Button
//                   onClick={() =>
//                     handleNavigateToDetailsPage(
//                       selectedOrderForModal.SAPProductionOrderID,
//                       selectedOrderForModal.ProductionHeaderID
//                     )
//                   }
//                   variant="primary"
//                 >
//                   View Full Details Page
//                 </Button>
//               </div>
//             </div>
//           ) : null}
//         </ViewOrderModal>

//         {/* Confirmation Approval Modal */}
//         <ConfirmationApprovalModal
//           isOpen={isApprovalConfirmModalOpen}
//           onClose={handleCloseApprovalConfirmModal}
//           onConfirm={handleConfirmBulkApproval}
//           title={`Confirm Approval for ${selectedOrderIDs.length} Order(s)`}
//           description={`You are about to approve ${selectedOrderIDs.length} production order(s). This action cannot be reversed. Are you sure you want to proceed?`}
//           isLoading={isApproving}
//         />
//       </div>
//       <Toaster richColors position="bottom-right" />
//     </>
//   );
// };

// export default OrdersManagementTab;


const OrdersManagementTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finishedOrders, setFinishedOrders] = useState<ProductionOrderHeader[]>([]);

  // NEW: State for Filter Sidebar visibility
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  // NEW: State for active filters
  const [activeFilters, setActiveFilters] = useState<OrdersFilterState>({
    orderStatuses: [],
    sapProductId: null,
    isRestricted: 'All',
  });

  // State for selected order IDs for bulk approval
  const [selectedOrderIDs, setSelectedOrderIDs] = useState<string[]>([]);
  // State for confirmation modal visibility and loading
  const [isApprovalConfirmModalOpen, setIsApprovalConfirmModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false); // For approval button loading state

  // State for the quick-view modal and the data fetched for it
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<ProductionOrderHeader | null>(null);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // --- Sorting States ---
  const [sortColumn, setSortColumn] = useState<keyof ProductionOrderHeader | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  const { user } = useAuth();
  const navigate = useNavigate();
  const userData = user?.id;


  // --- Data Fetching for All Finished Orders (Table) ---
  const fetchFinishedProductionOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: ProductionOrderHeader[]; message: string; status: boolean }>(
        GET_ALL_FINISHED_PRODUCTIONS_ENDPOINT
      );
      if (response.data.status) {
        // Ensure isRestricted is 'Yes' or 'No' and not just boolean or undefined
        const formattedData = response.data.data.map(order => ({
          ...order,
          ProductionDetails: order.ProductionDetails.map(detail => ({
            ...detail,
            // Ensure 'isRestricted' is explicitly 'Yes' or 'No'.
            // If detail.isRestricted from API can be anything else (e.g., boolean, null, undefined),
            // you need to cast it or handle it robustly.
            isRestricted: (detail.isRestricted === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No' // Type assertion
          }))
        }));
        setFinishedOrders(formattedData);
        // Clear selected orders after re-fetch, as old selections might no longer be valid
        setSelectedOrderIDs([]);
        setCurrentPage(1); // Reset to first page on new data fetch
      } else {
        setError(response.data.message || 'Failed to fetch finished production orders.');
        toast.error(response.data.message || "Failed to load finished production orders.");
      }
    } catch (err: any) { // Use 'any' for unknown error types from axios
      console.error("Error fetching finished production orders:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching data.');
      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching finished production orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinishedProductionOrders();
  }, [fetchFinishedProductionOrders]);

  // Extract unique Product IDs for the filter dropdown
  const allProductIDs = useMemo(() => {
    const ids = new Set<string>();
    finishedOrders.forEach(order => ids.add(order.SAPProductID));
    return Array.from(ids).sort(); // Sort them alphabetically
  }, [finishedOrders]);


  // --- Filtering Logic (updated) ---
  const applyAllFilters = useMemo(() => {
    return finishedOrders.filter(order => {
      // 1. Search Term Filter (existing)
      const matchesSearchTerm =
        order.SAPProductDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.SAPProductionOrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.SAPProductID.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearchTerm) return false; // If doesn't match search, no need to check other filters

      // 2. Order Status Filter
      const hasOrderStatusFilter = activeFilters.orderStatuses.length > 0;
      if (hasOrderStatusFilter) {
        let statusMatch = false;
        if (activeFilters.orderStatuses.includes('Approved') && order.isApproved) statusMatch = true;
        if (activeFilters.orderStatuses.includes('Pending Approval') && !order.isApproved && !order.isCanceled) statusMatch = true; // Define 'Pending Approval'
        if (activeFilters.orderStatuses.includes('Canceled') && order.isCanceled) statusMatch = true;
        if (activeFilters.orderStatuses.includes('Posted') && order.IsPosted) statusMatch = true;
        if (activeFilters.orderStatuses.includes('Not Posted') && !order.IsPosted) statusMatch = true;
        // You might also want to add filters for isFinished/Not Finished etc.
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
        // Assume isRestricted from production details for display purposes,
        // if multiple details exist, this logic might need refinement based on business rules.
        const headerRestrictedStatus = order.ProductionDetails[0]?.isRestricted || 'No'; // Default to 'No' if undefined
        if (activeFilters.isRestricted === 'Yes' && headerRestrictedStatus !== 'Yes') return false;
        if (activeFilters.isRestricted === 'No' && headerRestrictedStatus !== 'No') return false;
      }

      return true; // All filters passed
    });
  }, [searchTerm, finishedOrders, activeFilters]);


  // --- Sorting Logic ---
  const sortedOrders = useMemo(() => {
    if (!sortColumn) {
      return applyAllFilters; // Use applyAllFilters here instead of filteredOrders
    }

    const sortableOrders = [...applyAllFilters];

    sortableOrders.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      // Special handling for SAPProductionOrderID as it's a string representing a number
      if (sortColumn === 'SAPProductionOrderID') {
        const numA = parseInt(String(valA), 10);
        const numB = parseInt(String(valB), 10);
        if (sortDirection === 'asc') {
          return numA - numB;
        } else {
          return numB - numA;
        }
      }

      // Default string or number comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0; // Fallback for other types or if values are not comparable
    });

    return sortableOrders;
  }, [applyAllFilters, sortColumn, sortDirection]); // Dependency changed to applyAllFilters


  // --- Sorting Handler ---
  const handleSort = useCallback((column: keyof ProductionOrderHeader) => {
    if (sortColumn === column) {
      setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);


  // --- Pagination Calculations ---
  const totalPages = useMemo(() => {
    return Math.ceil(sortedOrders.length / itemsPerPage);
  }, [sortedOrders.length, itemsPerPage]);

  const paginatedOrders = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedOrders, currentPage, itemsPerPage]);

  // --- Pagination Handlers ---
  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages))); // Ensure page is within bounds
  }, [totalPages]);

  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  // --- Checkbox Handlers ---
  const handleCheckboxChange = useCallback((productionHeaderID: string, isChecked: boolean) => {
    setSelectedOrderIDs(prev =>
      isChecked
        ? [...prev, productionHeaderID]
        : prev.filter(id => id !== productionHeaderID)
    );
  }, []);

  const handleSelectAllChange = useCallback((isChecked: boolean) => {
    if (isChecked) {
      const eligibleHeaderIDsOnPage = paginatedOrders
        .filter(order => !order.isApproved && !order.isCanceled)
        .map(order => order.ProductionHeaderID);
      setSelectedOrderIDs(prev => Array.from(new Set([...prev, ...eligibleHeaderIDsOnPage])));
    } else {
      const currentPageEligibleHeaderIDs = paginatedOrders
        .filter(order => !order.isApproved && !order.isCanceled)
        .map(order => order.ProductionHeaderID);
      setSelectedOrderIDs(prev => prev.filter(id => !currentPageEligibleHeaderIDs.includes(id)));
    }
  }, [paginatedOrders]);

  // Determine if all CURRENT PAGE *eligible* orders are selected
  const allCurrentPageEligibleOrders = useMemo(() => {
    return paginatedOrders.filter(order => !order.isApproved && !order.isCanceled);
  }, [paginatedOrders]);

  const allCurrentPageOrdersSelected = useMemo(() => {
    if (allCurrentPageEligibleOrders.length === 0) return false;
    return allCurrentPageEligibleOrders.every(order => selectedOrderIDs.includes(order.ProductionHeaderID));
  }, [allCurrentPageEligibleOrders, selectedOrderIDs]);


  // --- Navigation to Dedicated Details Page (Uses query params) ---
  const handleNavigateToDetailsPage = useCallback((orderID: string, headerID: string) => {
    if (!userData) {
      toast.error("User ID not available for navigation.");
      return;
    }
    const queryString = new URLSearchParams({
      sapProductionOrderID: orderID,
      userID: userData
    }).toString();
    navigate(`/finished-orders?${queryString}`, { state: { productionHeaderID: headerID } });
  }, [navigate, userData]);


  // --- Open Quick-View Modal (FETCHES SINGLE ORDER using query params) ---
  const handleOpenDetailsModal = useCallback(async (order: ProductionOrderHeader) => {
    setModalLoading(true);
    setModalError(null);
    setSelectedOrderForModal(null);
    setIsDetailsModalOpen(true);

    const orderID = order.SAPProductionOrderID;

    try {
      if (!userData) {
        throw new Error('User ID is not available.');
      }

      const response = await axiosInstance.get<{ data: ProductionOrderHeader; message: string; status: boolean }>(
        GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT,
        {
          params: {
            sapProductionOrderID: orderID,
            userID: userData
          }
        }
      );

      if (response.data.status) {
        // Ensure isRestricted is 'Yes' or 'No' for modal display
        const formattedModalData = {
          ...response.data.data,
          ProductionDetails: response.data.data.ProductionDetails.map(detail => ({
            ...detail,
            isRestricted: (detail.isRestricted === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No' // Type assertion
          }))
        };
        setSelectedOrderForModal(formattedModalData);
        toast.success(response.data.message || "Single production order details loaded!");
      } else {
        setModalError(response.data.message || 'Failed to fetch single production order details.');
        toast.error(response.data.message || "Failed to load single production order details.");
      }
    } catch (err: any) {
      console.error("Error fetching single production order:", err);
      setModalError(err.response?.data?.message || err.message || 'An error occurred while fetching single order data.');
      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching single production order.");
    } finally {
      setModalLoading(false);
    }
  }, [axiosInstance, userData]);


  // --- Close Quick-View Modal ---
  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedOrderForModal(null);
    setModalError(null);
  }, []);

  // --- Bulk Approval Logic ---
  const handleOpenApprovalConfirmModal = useCallback(() => {
    const eligibleSelectedForApproval = selectedOrderIDs.filter(id => {
      const order = finishedOrders.find(o => o.ProductionHeaderID === id);
      return order && !order.isApproved && !order.isCanceled;
    });

    if (eligibleSelectedForApproval.length === 0) {
      toast.info("Please select at least one finished production order that has not been approved or canceled yet.");
      setSelectedOrderIDs([]);
      return;
    }

    setSelectedOrderIDs(eligibleSelectedForApproval);
    setIsApprovalConfirmModalOpen(true);
  }, [selectedOrderIDs, finishedOrders]);


  const handleCloseApprovalConfirmModal = useCallback(() => {
    setIsApprovalConfirmModalOpen(false);
    setIsApproving(false);
  }, []);

  const handleConfirmBulkApproval = useCallback(async () => {
    if (selectedOrderIDs.length === 0) {
      toast.error("No orders selected for approval.");
      handleCloseApprovalConfirmModal();
      return;
    }

    setIsApproving(true);

    try {
      const response = await axiosInstance.post<{ data: any; message: string; status: boolean }>(
        APPROVE_BULK_PRODUCTIONS_ENDPOINT,
        selectedOrderIDs
      );

      if (response.data.status) {
        toast.success(response.data.message || `${selectedOrderIDs.length} production order(s) approved successfully!`);
        await fetchFinishedProductionOrders();
        setSelectedOrderIDs([]);
      } else {
        toast.error(response.data.message || `Failed to approve ${selectedOrderIDs.length} production order(s).`);
      }
    } catch (err: any) {
      console.error("Error during bulk approval:", err);
      toast.error(err.response?.data?.message || err.message || "An error occurred during bulk approval.");
    } finally {
      setIsApproving(false);
      setIsApprovalConfirmModalOpen(false);
    }
  }, [selectedOrderIDs, axiosInstance, fetchFinishedProductionOrders, handleCloseApprovalConfirmModal]);


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
    setSearchTerm(''); // Also clear search term when clearing filters
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
        <p className="text-gray-600 dark:text-gray-300 ml-3">Loading finished production orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center py-10 dark:bg-gray-800">
        <p className="text-red-500">Error: {error}</p>
        <Button
          onClick={fetchFinishedProductionOrders}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 min-h-[70vh] relative"> {/* Added relative for sidebar positioning */}
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Finished Production Orders</h2>
          <div className="flex items-center space-x-2">
            {selectedOrderIDs.length > 0 && (
              <ProdButton
                onClick={handleOpenApprovalConfirmModal}
                variant="primary"
                startIcon={<FiCheckCircle className="h-5 w-5" />}
                isLoading={isApproving}
              >
                {isApproving ? 'Approving...' : `Approve PO(s) (${selectedOrderIDs.length})`}
              </ProdButton>
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
            onClick={() => setIsFilterSidebarOpen(true)} // Open filter sidebar
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
                    checked={allCurrentPageOrdersSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = selectedOrderIDs.length > 0 && !allCurrentPageOrdersSelected && allCurrentPageEligibleOrders.length > 0;
                      }
                    }}
                    disabled={allCurrentPageEligibleOrders.length === 0}
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
                      {!order.isApproved && !order.isCanceled && (
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                          checked={selectedOrderIDs.includes(order.ProductionHeaderID)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isCanceled ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          Canceled
                        </span>
                      ) : order.isApproved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                          Pending Approval
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
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedOrders.length === 0 && applyAllFilters.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <FiList size={48} className="mx-auto mb-2" />
            No finished production orders to display.
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center dark:text-gray-300 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="block w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
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
        <ViewOrderModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} title={`Details for Order: ${selectedOrderForModal?.SAPProductionOrderID || (modalLoading ? 'Loading...' : 'N/A')}`}>
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
                <p><strong>Is Canceled:</strong> {selectedOrderForModal.isCanceled ? 'Yes' : 'No'}</p>
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
                <Button onClick={() => handleNavigateToDetailsPage(selectedOrderForModal.SAPProductionOrderID, selectedOrderForModal.ProductionHeaderID)} variant="primary">
                  View Full Details Page
                </Button>
              </div>
            </div>
          ) : null}
        </ViewOrderModal>

        {/* Confirmation Approval Modal (remains unchanged) */}
        <ConfirmationApprovalModal
          isOpen={isApprovalConfirmModalOpen}
          onClose={handleCloseApprovalConfirmModal}
          onConfirm={handleConfirmBulkApproval}
          title={`Confirm Approval for ${selectedOrderIDs.length} Order(s)`}
          description={`You are about to approve ${selectedOrderIDs.length} production order(s). This action cannot be reversed. Are you sure you want to proceed?`}
          isLoading={isApproving}
        />

        {/* Filter Sidebar Component */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          filters={activeFilters}
          onApplyFilters={handleApplyFilters}
          allProductIDs={allProductIDs} // Pass unique product IDs
        />

      </div>
      <Toaster richColors position="bottom-right"/>
    </>
  );
};

export default OrdersManagementTab;