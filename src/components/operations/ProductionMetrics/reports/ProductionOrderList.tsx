import React, { useState, useEffect, useRef } from "react";
import {
  FiDownload,
  FiRefreshCcw,
} from "react-icons/fi";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import Button from "../../../ui/button/Button";
import axiosInstance from "../../../../api/axiosInstance";
import { toast, Toaster } from "sonner";

interface ProductionOrder {
  sapProductionOrderID: string;
  sapProductionOrderObjectID: string | null;
  sapProductionProposalID: string | null;
  sapProductionProposalObjectID: string | null;
  sapSupplyTaskID: string | null;
  sapMakeTaskID: string | null;
  sapProductID: string;
  sapProductDescription: string;
  sapPlannedQuantity: number;
  completedQuantity: number;
}

interface ApiResponse {
  status: boolean;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  data: ProductionOrder[];
}

export default function ProductionOrderReports() {
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [dateFrom, setDateFrom] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canLoadData, setCanLoadData] = useState(true);

  const dateFromInputRef = useRef<HTMLInputElement | null>(null);
  const dateToInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchProductionOrders(dateFrom, dateTo);
  }, []);

  useEffect(() => {
    setCanLoadData(dateFrom !== "" && dateTo !== "");
  }, [dateFrom, dateTo]);

  const fetchProductionOrders = async (fromDate: string, toDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ApiResponse>(
        `/api/v1/production/get-production-by-range?dateFrom=${fromDate}&dateTo=${toDate}`
      );
      if (response.data.status) {
        setProductionOrders(response.data.data);
        toast.success("Production orders loaded successfully!");
      } else {
        setError(
          response.data.pagination
            ? "No production orders found within the selected range."
            : "Failed to load production orders."
        );
        setProductionOrders([]);
        toast.error(
          response.data.pagination
            ? "No production orders found within the selected range."
            : "Failed to load production orders."
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          "An unexpected error occurred while fetching production orders."
      );
      setProductionOrders([]);
      toast.error(
        err.message ||
          "An unexpected error occurred while fetching production orders."
      );
      console.error("Fetch Production Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadData = () => {
    if (dateFrom && dateTo) {
      fetchProductionOrders(dateFrom, dateTo);
    } else {
      toast.error("Please select both 'From' and 'To' dates.");
    }
  };

  const handleReset = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setDateFrom(today);
    setDateTo(today);
    fetchProductionOrders(today, today);
  };

  const logInputDetails = (ref: React.RefObject<HTMLInputElement | null>, id: string) => {
    if (ref.current) {
    } else {
    console.log(`[${id}] Input Ref is null`);
    }
  };

  const handleDateFromFocus = () => {
    logInputDetails(dateFromInputRef, "dateFrom");
  };

  const handleDateToFocus = () => {
    logInputDetails(dateToInputRef, "dateTo");
  };

  useEffect(() => {
    logInputDetails(dateFromInputRef, "dateFrom - onMount");
    logInputDetails(dateToInputRef, "dateTo - onMount");
  }, []);

  return (
    <>
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100">
        <h4 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-100">
          Production Order Reports
        </h4>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From:
            </label>
            <input
              ref={dateFromInputRef}
              type="date"
              id="dateFrom"
              className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              onFocus={handleDateFromFocus}
            />
          </div>
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To:
            </label>
            <input
              ref={dateToInputRef}
              type="date"
              id="dateTo"
              className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              onFocus={handleDateToFocus}
            />
          </div>
          <Button onClick={handleLoadData} disabled={!canLoadData || loading} className="flex items-center space-x-2">
            {loading ? <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span> : <FiDownload />}
            <span>Load Data</span>
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading} className="flex items-center space-x-2">
            {loading ? <span className="animate-spin h-5 w-5 border-b-2 border-brand-500 rounded-full"></span> : <FiRefreshCcw />}
            <span>Reset</span>
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Production Order ID
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Product ID
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Product Description
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Planned Quantity
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Completed Quantity
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {productionOrders.map((order) => (
                <TableRow key={order.sapProductionOrderID} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {order.sapProductionOrderID}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {order.sapProductID}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {order.sapProductDescription}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {order.sapPlannedQuantity}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {order.completedQuantity}
                  </TableCell>
                </TableRow>
              ))}
              {productionOrders.length === 0 && !loading && error && (
                <TableRow>
                  <TableCell colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    {error}
                  </TableCell>
                </TableRow>
              )}
              {productionOrders.length === 0 && loading && (
                <TableRow>
                  <TableCell colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading production orders...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    <Toaster richColors/>
    </>
  );
}