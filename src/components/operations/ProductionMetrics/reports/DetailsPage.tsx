// pages/ProductionOrderDetailsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaInfoCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaTag,
  FaFlask,
  FaBoxes,
  FaScroll,
} from "react-icons/fa"; // Removed FaCheckCircle, FaExclamationTriangle, FaCube, FaHourglassHalf as they are not needed for this component

import { toast, Toaster } from "sonner";
import Button from "../../../ui/button/Button";
import { formatDate, formatDateTime } from "../../../../utils/idStockTime";
import { getRestrictedStatusColor } from "../../../../utils/OrderMgtUtils";
import axiosInstance from "../../../../api/axiosInstance";
import Loader from "../../../ui/loader/Loader";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interface for a single Production Detail entry
interface ProductionDetail {
  ProductionDetailID: string;
  ProductionHeaderID: string;
  ProductionDate: string; // ISO 8601 string
  Shift: "M" | "A" | "N";
  isRestricted: "Yes" | "No" | undefined;
  CompletedQuantity: number;
  IdentifiedStockID: string;
}

// Interface for the Production Order Header, including nested details
// This matches the structure of the jToken data in the /get-production-order response
interface ProductionOrderHeader {
  ProductionHeaderID: string;
  SAPProductionOrderID: string; // This is the production order number (e.g., "2")
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
  Machine: string | null;
  isFinished: boolean;
  isApproved: boolean;
  ProductionDate: string | null; // This is the header's production date
  UoMQuantityPallet: number;
  ProductionDetails: ProductionDetail[]; // Array of detailed production entries
}

// Interface for the full API response structure
interface ApiResponse {
  isSuccess: boolean;
  message: string;
  id: string | null;
  messageList: string | null;
  jObject: any | null; // Can be more specific if needed
  errorMessage: string[];
  jToken: ProductionOrderHeader | null; // The main data is here
  periodOpen: boolean;
}

const GET_PRODUCTION_ORDER_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-production-order`;

const ProductionOrderDetailsPage: React.FC = () => {
  // We'll primarily use sapProductionOrderID to fetch the data
  //const { productionHeaderID } = useParams<{ productionHeaderID: string }>(); // This route param is not directly used for the new API, but kept for consistency
  const location = useLocation();
  const navigate = useNavigate();

  const [productionOrder, setProductionOrder] =
    useState<ProductionOrderHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductionOrderDetails = useCallback(async () => {
    // Extract sapProductionOrderID from location.state which was passed from ProductionOrderReports
    const sapProductionOrderID = (
      location.state as { sapProductionOrderID?: string }
    )?.sapProductionOrderID;

    if (!sapProductionOrderID) {
      setError("SAP Production Order ID is missing. Cannot fetch details.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `${GET_PRODUCTION_ORDER_ENDPOINT}?productionOrderID=${sapProductionOrderID}`;
      const response = await axiosInstance.get<ApiResponse>(url);

      if (response.data.isSuccess && response.data.jToken) {
        setProductionOrder(response.data.jToken);
        toast.success(
          response.data.message ||
            "Production order details loaded successfully!"
        );
      } else {
        setError(
          response.data.message || "Failed to fetch production order details."
        );
        toast.error(
          response.data.message || "Failed to load production order details."
        );
      }
    } catch (err: any) {
      console.error("Error fetching production order details:", err);
      setError(
        err.message ||
          "An error occurred while fetching production order details."
      );
      toast.error(
        err.message ||
          "An error occurred while fetching production order details."
      );
    } finally {
      setLoading(false);
    }
  }, [location.state]); // Dependency on location.state to re-fetch if navigation state changes

  useEffect(() => {
    fetchProductionOrderDetails();
  }, [fetchProductionOrderDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-lg text-gray-700 dark:text-gray-300">
         <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-lg text-red-600 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          Error: {error}
          <Button onClick={() => navigate("/production")} className="mt-4">
            Go Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  if (!productionOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-lg text-gray-700 dark:text-gray-300 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          No production order found for the given ID.
          <Button onClick={() => navigate("/production")} className="mt-4">
            Go Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  // Helper for status text/color
  const getStatusText = (
    statusCode: number,
    failed: boolean,
    isFinished: boolean,
    isPosted: boolean,
    isApproved: boolean
  ) => {
    let statusText = "Unknown";
    let colorClass = "bg-gray-200 text-gray-800";

    if (failed) {
      statusText = "Failed";
      colorClass = "bg-red-100 text-red-800";
    } else if (isApproved) {
      // Use the 'isApproved' flag directly from the fetched data
      statusText = "Approved";
      colorClass = "bg-green-100 text-green-800";
    } else if (isFinished) {
      statusText = "Finished (Not Approved)";
      colorClass = "bg-yellow-100 text-yellow-800";
    } else if (isPosted) {
      statusText = "Posted";
      colorClass = "bg-blue-100 text-blue-800";
    } else {
      switch (statusCode) {
        case 0:
          statusText = "Pending";
          colorClass = "bg-blue-100 text-blue-800";
          break;
        // Add more status codes as per your backend's definition
        default:
          statusText = "Processing";
          colorClass = "bg-purple-100 text-purple-800";
          break;
      }
    }
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
      >
        {statusText}
      </span>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
            <button
              onClick={() => navigate("/production")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Go Back to Reports
            </button>

            <h4 className="text-xl sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold text-gray-800 dark:text-white break-words text-center sm:text-left">
              Order Details: {productionOrder.SAPProductionOrderID}
            </h4>

            {/* Approve Production button removed */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Header Information - Organized into cards for visual appeal */}

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaInfoCircle className="text-blue-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  Order ID
                </h5>
                <p className="text-gray-900 dark:text-gray-500 font-mono text-sm break-all">
                  {productionOrder.SAPProductionOrderID}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaTag className="text-green-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  Product
                </h5>
                <p className="text-gray-900 dark:text-gray-500">
                  {productionOrder.SAPProductID} -{" "}
                  {productionOrder.SAPProductDescription}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaCalendarAlt className="text-purple-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  Production Date (Header)
                </h5>
                <p className="text-gray-900 dark:text-gray-500">
                  {formatDate(productionOrder.ProductionDate)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaClipboardList className="text-yellow-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  Quantities
                </h5>
                <p className="text-gray-900 dark:text-gray-500">
                  Planned: {productionOrder.SAPPlannedQuantity.toLocaleString()}
                </p>
                <p className="text-gray-900 dark:text-gray-500">
                  Completed:{" "}
                  {productionOrder.CompletedQuantity.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaFlask className="text-orange-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  Machine
                </h5>
                <p className="text-gray-900 dark:text-gray-500">
                  {productionOrder.Machine || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaBoxes className="text-cyan-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  UoM Quantity Pallet
                </h5>
                <p className="text-gray-900 dark:text-gray-500">
                  {productionOrder.UoMQuantityPallet.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center space-x-4">
              <FaInfoCircle className="text-indigo-500 text-2xl" />
              <div>
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">
                  Overall Status
                </h5>
                {getStatusText(
                  productionOrder.StatusCode,
                  productionOrder.Failed,
                  productionOrder.isFinished,
                  productionOrder.IsPosted,
                  productionOrder.isApproved
                )}
                <p className="text-gray-900 dark:text-gray-500 text-sm">
                  {productionOrder.Failed && "(Failed) "}
                  {productionOrder.isFinished && "(Finished) "}
                  {productionOrder.IsPosted && "(Posted) "}
                  {productionOrder.isApproved ? "(Approved)" : "(Not Approved)"}
                </p>
              </div>
            </div>
          </div>

          {/* Production Details Section */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <FaScroll className="text-gray-600 dark:text-gray-400" />
            <span>Individual Production Entries</span>
          </h3>
          {productionOrder.ProductionDetails &&
          productionOrder.ProductionDetails.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Shift
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Completed Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Restricted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Stock ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {productionOrder.ProductionDetails.map((detail) => (
                    <tr
                      key={detail.ProductionDetailID}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {formatDateTime(detail.ProductionDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {detail.Shift}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {detail.CompletedQuantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRestrictedStatusColor(
                            detail.isRestricted
                          )}`}
                        >
                          {detail.isRestricted || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {detail.IdentifiedStockID}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm italic py-4">
              No individual production entries found for this order.
            </p>
          )}
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default ProductionOrderDetailsPage;
