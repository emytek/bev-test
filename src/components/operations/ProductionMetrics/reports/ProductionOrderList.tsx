import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiDownload,
  FiRefreshCcw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Button from "../../../ui/button/Button";
import axiosInstance from "../../../../api/axiosInstance";
import { toast, Toaster } from "sonner";
import Loader from "../../../ui/loader/Loader";

// Re-defining interfaces for clarity, assume they might be in a shared types file
interface ProductionDetail {
  ProductionDetailID: string;
  ProductionHeaderID: string;
  ProductionDate: string; // ISO 8601 string
  Shift: "M" | "A" | "N";
  isRestricted: "Yes" | "No" | null;
  CompletedQuantity: number;
  IdentifiedStockID: string;
}

interface ProductionOrder {
  ProductionHeaderID: string; // Add this, it's crucial for the detail page
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
  StatusCode: number; // Added based on your backend response
  Failed: boolean; // Added based on your backend response
  IsPosted: boolean; // Added based on your backend response
  Machine: string | null; // Added based on your backend response
  isFinished: boolean; // Added based on your backend response
  isApproved: boolean; // Added based on your backend response
  ProductionDate: string | null; // Added based on your backend response (Header Production Date)
  UoMQuantityPallet: number; // Added based on your backend response
  ProductionDetails: ProductionDetail[]; // Added based on your backend response
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    TotalRecords: number;
    PageNumber: number;
    PageSize: number;
    Data: ProductionOrder[];
  };
}

export default function ProductionOrderReports() {
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(
    []
  );
  const [startDate, setStartDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Default page size
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const navigate = useNavigate(); // Initialize useNavigate

  const startDateInputRef = useRef<HTMLInputElement | null>(null);
  const endDateInputRef = useRef<HTMLInputElement | null>(null);

  // useCallback to memoize the fetch function, preventing unnecessary re-renders
  const fetchProductionOrders = useCallback(
    async (page: number, size: number, from: string, to: string) => {
      setLoading(true);
      setError(null);
      try {
        // Construct the API URL with all query parameters
        const url = `/api/v1/production/get-all-productions-by-date?startDate=${from}&endDate=${to}&pageNumber=${page}&pageSize=${size}`;
        const response = await axiosInstance.get<ApiResponse>(url);

        if (response.data.status) {
          setProductionOrders(response.data.data.Data);
          setTotalRecords(response.data.data.TotalRecords);
          setTotalPages(Math.ceil(response.data.data.TotalRecords / size)); // Calculate total pages
          setCurrentPage(response.data.data.PageNumber); // Ensure current page matches server if it adjusts
          toast.success(
            response.data.message || "Production orders loaded successfully!"
          );
        } else {
          setError(
            response.data.message || "Failed to load production orders."
          );
          setProductionOrders([]);
          setTotalPages(1);
          setTotalRecords(0);
          toast.error(
            response.data.message || "Failed to load production orders."
          );
        }
      } catch (err: any) {
        setError(
          err.message ||
            "An unexpected error occurred while fetching production orders."
        );
        setProductionOrders([]);
        setTotalPages(1);
        setTotalRecords(0);
        toast.error(
          err.message ||
            "An unexpected error occurred while fetching production orders."
        );
        console.error("Fetch Production Orders Error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  ); // No external dependencies for this useCallback, parameters are passed in

  // Initial fetch on component mount and when page/size/dates change
  useEffect(() => {
    fetchProductionOrders(currentPage, pageSize, startDate, endDate);
  }, [currentPage, pageSize, startDate, endDate, fetchProductionOrders]);

  const handleLoadData = () => {
    // Reset to first page when new date range is loaded
    setCurrentPage(1);
    // fetchProductionOrders will be called by the useEffect
  };

  const handleReset = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setStartDate(today);
    setEndDate(today);
    setCurrentPage(1); // Reset to first page
    setPageSize(10); // Reset page size to default
    // fetchProductionOrders will be called by the useEffect
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleRowClick = (order: ProductionOrder) => {
    // Navigate to the details page, passing the ProductionHeaderID via state
    // You can also pass SAPProductionOrderID or other identifiers if needed for the details page
    navigate(`/production-orders/${order.ProductionHeaderID}/details`, {
      state: {
        productionHeaderID: order.ProductionHeaderID,
        sapProductionOrderID: order.SAPProductionOrderID, // Pass this if the details page needs it
        // userID: 'some-user-id' // If the details page needs a userID for its fetch, get it from your auth context here
      },
    });
  };

  return (
    <>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100">
          <h4 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-100">
            Production Order Reports
          </h4>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                From:
              </label>
              <input
                ref={startDateInputRef}
                type="date"
                id="startDate"
                className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                To:
              </label>
              <input
                ref={endDateInputRef}
                type="date"
                id="endDate"
                className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              onClick={handleLoadData}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span>
              ) : (
                <FiDownload />
              )}
              <span>Load Data</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-b-2 border-brand-500 rounded-full"></span>
              ) : (
                <FiRefreshCcw />
              )}
              <span>Reset</span>
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Production Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Product ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Product Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Planned Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Completed Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {productionOrders.length > 0 ? (
                  productionOrders.map((order) => (
                    <tr
                      key={order.ProductionHeaderID}
                      onClick={() => handleRowClick(order)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {order.SAPProductionOrderID}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {order.SAPProductID}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {order.SAPProductDescription}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {order.SAPPlannedQuantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {order.CompletedQuantity.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : !loading && error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                     <Loader />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No production orders found for the selected range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <span>Items per page:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <span>
                  Page {currentPage} of {totalPages} ({totalRecords} records)
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <FiChevronLeft className="mr-1" /> Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  Next <FiChevronRight className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}
