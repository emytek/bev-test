// pages/FinishedOrderDetailsPage.tsx (MODIFIED for single fetch with userID)
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"; // Import useLocation if you passed state

import { FaArrowLeft, FaCheckCircle } from "react-icons/fa"; // Assuming you use this icon

import { ProductionOrderHeader } from "./tabs/OrdersManagementTab";
import { toast, Toaster } from "sonner";
import Button from "../../ui/button/Button";
import { formatDate, formatDateTime } from "../../../utils/idStockTime";
import { getRestrictedStatusColor } from "../../../utils/OrderMgtUtils";
import axiosInstance from "../../../api/axiosInstance";
import Loader from "../../ui/loader/Loader";
import { useAuth } from "../../../hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// This endpoint might need to be adjusted based on how your backend handles
// fetching a single order by its header ID and userID.
// If it's `get-finished-production-by-id` and expects headerID in path and userID as query,
// or if it's the same `get-finished-production` as used in the modal.
// For consistency, let's assume your backend `get-finished-production-by-id`
// now takes `productionHeaderID` in the path and `userID` as a query param.
// If it also expects `sapProductionOrderID` here, you'd need to pass it via state from OrdersManagementTab.
const GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-finished-production`;
const APPROVE_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/approve-production`;

// ... (Your existing interfaces for ProductionOrderHeader, ProductionDetail)

const FinishedOrderDetailsPage: React.FC = () => {
  // Use useSearchParams to get query parameters
  const { user } = useAuth()
  // const userIdData = user?.id;
  const userRole = user?.roles?.[0];
  const isAdmin = userRole === "Production Supervisor";

  const [searchParams] = useSearchParams();
  const sapProductionOrderID = searchParams.get("sapProductionOrderID");
  const userID = searchParams.get("userID"); // User ID from query param

  // Use useLocation to get state passed during navigation
  const location = useLocation();
  const productionHeaderID = (location.state as { productionHeaderID?: string })
    ?.productionHeaderID;
  // If you also needed sapProductionOrderID for some reason from state, it would be similar:
  // const sapProductionOrderIDFromState = (location.state as { sapProductionOrderID?: string })?.sapProductionOrderID;

  const [productionOrder, setProductionOrder] =
    useState<ProductionOrderHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApprovedState, setIsApprovedState] = useState(false);

  const navigate = useNavigate();

  const fetchProductionOrderDetails = useCallback(async () => {
    // Ensure both sapProductionOrderID and userID are available from query params
    if (!sapProductionOrderID || !userID) {
      setError(
        "SAP Production Order ID or User ID is missing from URL query parameters."
      );
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
      }>(GET_SINGLE_FINISHED_PRODUCTION_ENDPOINT, {
        params: {
          sapProductionOrderID: sapProductionOrderID, // Use the ID from query params
          userID: userID,
        },
      });

      if (response.data.status) {
        setProductionOrder(response.data.data);
        setIsApproved(response.data.data.StatusCode === 1);
        setIsApprovedState(response.data.data.isApproved);
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
    } catch (err) {
      console.error("Error fetching production order details:", err);
      setError("An error occurred while fetching production order details.");
      toast.error("An error occurred while fetching production order details.");
    } finally {
      setLoading(false);
    }
  }, [sapProductionOrderID, userID, axiosInstance]); // Dependencies for useCallback

  useEffect(() => {
    // Only fetch if required query params are present
    if (sapProductionOrderID && userID) {
      fetchProductionOrderDetails();
    } else {
      setLoading(false);
      setError(
        "Missing necessary parameters in the URL to fetch production order details."
      );
    }
  }, [fetchProductionOrderDetails, sapProductionOrderID, userID]); // Dependencies for useEffect

  const handleApproveProduction = async () => {
    // We need productionHeaderID (from state) and userID (from query params) for approval
    if (!productionHeaderID || !userID) {
      toast.error("Required IDs for approval are missing.");
      return;
    }

    setIsApproving(true);
    try {
        const url = `${APPROVE_PRODUCTION_ENDPOINT}?productionHeaderID=${productionHeaderID}&userID=${userID}`;
        const response = await axiosInstance.post(url);
    //   const response = await axiosInstance.post(APPROVE_PRODUCTION_ENDPOINT, {
    //     productionHeaderID: productionHeaderID, // Use productionHeaderID from location.state
    //     userID: userID, // Use userID from query params
    //   });

    if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Production successfully approved!"
        );
        setIsApproved(true);
        fetchProductionOrderDetails(); // Re-fetch to update status if necessary
      } else {
        toast.error(response.data.message || "Failed to approve production.");
      }
    } catch (error) {
      console.error("Error approving production:", error);
      toast.error("An error occurred during approval.");
    } finally {
      setIsApproving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8"><Loader /></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!productionOrder) {
    return (
      <div className="text-center py-8">
        No order found for the given parameters.
      </div>
    );
  }

  // --- Render your beautiful design with fetched data ---
  return (
    <>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
      <button
        onClick={() => navigate('/production')}
        className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        <FaArrowLeft className="mr-2" />
        Go Back
      </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">
          Production Order Details: {productionOrder.SAPProductionOrderID}
        </h1>

        {/* Approval Section */}
        { isAdmin && 
        <div className="flex justify-end mb-6">
          {isApprovedState || isApproved ? (
            <Button variant="sync" disabled startIcon={<FaCheckCircle />}>
              Production Approved
            </Button>
          ) : (
            <Button
              onClick={handleApproveProduction}
              variant="red"
              disabled={isApproving} // Also disable during approval process
              startIcon={<FaCheckCircle />}
            >
              {isApproving ? "Approving..." : "Approve Production"}
            </Button>
          )}
        </div>
        }

        {/* Display Order Header Information */}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Order Header
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 mb-8">
          <p>
            <strong>SAP Production Order ID:</strong>{" "}
            {productionOrder.SAPProductionOrderID}
          </p>
          <p>
            <strong>Product ID:</strong> {productionOrder.SAPProductID}
          </p>
          <p>
            <strong>Product Description:</strong>{" "}
            {productionOrder.SAPProductDescription}
          </p>
          <p>
            <strong>Planned Quantity:</strong>{" "}
            {productionOrder.SAPPlannedQuantity.toLocaleString()}
          </p>
          <p>
            <strong>Completed Quantity:</strong>{" "}
            {productionOrder.CompletedQuantity.toLocaleString()}
          </p>
          <p>
            <strong>Machine:</strong> {productionOrder.Machine || "N/A"}
          </p>
          <p>
            <strong>Production Date (Header):</strong>{" "}
            {formatDate(productionOrder.ProductionDate)}
          </p>
          <p>
            <strong>UoM Quantity Pallet:</strong>{" "}
            {productionOrder.UoMQuantityPallet.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {productionOrder.StatusCode}{" "}
            {productionOrder.Failed ? "(Failed)" : ""}
          </p>
        </div>

        {/* Display Production Details */}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Production Entries
        </h3>
        {productionOrder.ProductionDetails &&
        productionOrder.ProductionDetails.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
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
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No individual production entries found for this order.
          </p>
        )}
      </div>
      <Toaster richColors />
    </>
  );
};

export default FinishedOrderDetailsPage;
