// pages/ApprovedProductionOrderDetailsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaInfoCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaTag,
  FaFlask,
  FaBoxes,
  FaScroll,
} from "react-icons/fa";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";
import Button from "../../ui/button/Button";
import { formatDate, formatDateTime } from "../../../utils/idStockTime";
import { getRestrictedStatusColor } from "../../../utils/OrderMgtUtils";
import { PostToSAPDrawer } from "../../ui/modal/ConfirmationModal";
// Import the new Drawer component

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
interface ProductionOrderHeader {
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
  Machine: string | null;
  isFinished: boolean;
  isApproved: boolean; // This is the crucial flag
  ProductionDate: string | null; // This is the header's production date
  UoMQuantityPallet: number;
  ProductionDetails: ProductionDetail[]; // Array of detailed production entries
}

const GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-approved-production`;
const POST_TO_SAP_ENDPOINT = `${API_BASE_URL}/api/v1/production/post-production`;

const ApprovedProductionOrderDetailsPage: React.FC = () => {
  const { sapProductionOrderID } = useParams<{
    sapProductionOrderID: string;
  }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const headerID = searchParams.get('headerID');
  const navigate = useNavigate();
  const { user } = useAuth();
  // const userIdData = user?.id;
  const userRole = user?.roles?.[0];
  const isAdmin = userRole === "Production Supervisor";
  console.log(sapProductionOrderID, "Order ID")
  console.log(headerID, "Header ID")

  const [productionOrder, setProductionOrder] =
    useState<ProductionOrderHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPostingToSAP, setIsPostingToSAP] = useState(false); // State for Post to SAP button loading
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility

  const fetchProductionOrderDetails = useCallback(async () => {
    if (!sapProductionOrderID) {
      setError("SAP Production Order ID is missing from URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{
        data: ProductionOrderHeader;
        message: string;
        status: boolean;
      }>(GET_SINGLE_APPROVED_PRODUCTION_ENDPOINT, {
        params: { sapProductionOrderID: sapProductionOrderID },
      });

      if (response.data.status && response.data.data) {
        setProductionOrder(response.data.data);
        toast.success(
          response.data.message ||
            "Approved production order details loaded successfully!"
        );
      } else {
        setError(
          response.data.message ||
            "Failed to fetch approved production order details."
        );
        toast.error(
          response.data.message ||
            "Failed to load approved production order details."
        );
      }
    } catch (err: any) {
      console.error("Error fetching approved production order details:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching approved production order details."
      );
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching approved production order details."
      );
    } finally {
      setLoading(false);
    }
  }, [sapProductionOrderID]);

  useEffect(() => {
    fetchProductionOrderDetails();
  }, [fetchProductionOrderDetails]);

  // Handler for opening the drawer
  const handleOpenPostToSAPDrawer = useCallback(() => {
    if (productionOrder?.IsPosted) {
      toast.info("This order has already been posted to SAP.");
      return;
    }
    setIsDrawerOpen(true);
  }, [productionOrder?.IsPosted]);

  // Handler for confirming the Post to SAP action from the drawer
  const handleConfirmPostToSAP = useCallback(async () => {
    // Consolidated validation for the single header ID
    // If you need sapProductionOrderID for toast messages, keep it.
    // If headerID is a separate state/prop, include it in the check.
    if (!headerID || !sapProductionOrderID) { // Keep sapProductionOrderID for error message clarity
      toast.error("Production Order ID or Header ID is missing. Cannot post to SAP.");
      setIsDrawerOpen(false); // Close drawer on error
      return;
    }

    setIsPostingToSAP(true); // Indicate that posting is in progress
    // The drawer already shows "Posting..." via its 'loading' prop - no need for toast.info here

    try {
      const response = await axiosInstance.post<{ data: any; message: string; status: boolean }>(
        POST_TO_SAP_ENDPOINT,
        [headerID] // This will be sent as an array of strings in the request body
      );

      // Check for success based on HTTP status code (200 or 201)
      // The original `response.data.status` might be from a custom API response structure.
      // We will retain the check for `response.data.status` if your backend explicitly sends it,
      // but HTTP status is usually the primary indicator.
      if (response.status === 200 || response.status === 201) {
        // Assuming your backend still returns a 'message' in the success response data
        toast.success(
          response.data?.message ||
          `Production order ${sapProductionOrderID} successfully posted to SAP!`
        );

        // Update the local state to reflect that it's posted
        setProductionOrder((prev) =>
          prev ? { ...prev, IsPosted: true } : null
        );

        // No need to re-fetch data if setProductionOrder updates the local state correctly
        // fetchProductionOrderDetails(); // Only uncomment if a full re-fetch is absolutely necessary
      } else {
        // For non-2xx status codes not caught by the catch block (e.g., 400, 500 if Axios doesn't throw)
        // If your backend always returns 200/201 but indicates errors via response.data.status, keep this.
        // Otherwise, this branch might be redundant if Axios throws for non-2xx codes.
        const errorMessage = response.data?.message || `Failed to post production order ${sapProductionOrderID} to SAP. Unexpected status: ${response.status}`;
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error("Error posting to SAP:", err);
      // Extracting message from error response
      const message =
        err.response?.data?.message ||
        err.message ||
        `An error occurred while posting production order ${sapProductionOrderID} to SAP.`;
      toast.error(message);
      setError(message);
    } finally {
      setIsPostingToSAP(false); // Reset posting state
      setIsDrawerOpen(false); // Always close the drawer after the attempt
    }
  }, [
    headerID,
    sapProductionOrderID,
    setIsDrawerOpen,
    setIsPostingToSAP,
    setProductionOrder,
    setError,
  ]);// Dependencies for useCallback

  // Handler for cancelling the Post to SAP action from the drawer
  const handleCancelPostToSAP = useCallback(() => {
    setIsDrawerOpen(false); // Simply close the drawer
    toast.info("Post to SAP request cancelled.");
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-lg text-gray-700 dark:text-gray-300">
          Loading approved production order details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-lg text-red-600 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          Error: {error}
          <Button
            onClick={() => navigate("/production")} // Changed back to /production as per your original button
            className="mt-4"
          >
            Go Back to Approved Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!productionOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-lg text-gray-700 dark:text-gray-300 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          No approved production order found for the given ID.
          <Button
            onClick={() => navigate("/production")} // Changed back to /production as per your original button
            className="mt-4"
          >
            Go Back to Approved Orders
          </Button>
        </div>
      </div>
    );
  }

  // Helper for status text/color (kept as is)
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <button
              onClick={() => navigate("/production")}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>

            <h1 className="text-xl text-center sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white break-words">
              Approved Order Details: {productionOrder.SAPProductionOrderID}
            </h1>

            {/* Post to SAP Button - Now opens the drawer */}
            {isAdmin &&
              (productionOrder.IsPosted ? (
                <Button
                  variant="sync"
                  disabled
                  startIcon={<FaCheckCircle />}
                  className="self-center sm:self-auto"
                >
                  Posted to SAP
                </Button>
              ) : (
                <Button
                  onClick={handleOpenPostToSAPDrawer}
                  variant="primary"
                  disabled={isPostingToSAP}
                  startIcon={<FaCheckCircle />}
                  className="self-center sm:self-auto"
                >
                  Post to SAP
                </Button>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Header Information - Organized into cards for visual appeal */}
            {/* ... (rest of your existing UI for production order details) ... */}

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
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
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

      {/* Post to SAP Confirmation Drawer */}
      <PostToSAPDrawer
        isOpen={isDrawerOpen}
        onClose={handleCancelPostToSAP} // Close handler for the drawer
        onConfirm={handleConfirmPostToSAP} // This is the function that makes the API call
        loading={isPostingToSAP} // Pass the loading state to the drawer button
        isPosted={productionOrder.IsPosted} // Pass the posted status to the drawer button
      />
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default ApprovedProductionOrderDetailsPage;
