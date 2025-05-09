import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  FaSearch,
  FaTimes,
  FaSync,
  FaPrint,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import Input from "../../../form/input/InputField";
import Button from "../../../ui/button/Button";
import { toast, Toaster } from "sonner";
import Alert, { AlertProps } from "../../../ui/alert/Alert";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../../api/axiosInstance";
import { FiPlus } from "react-icons/fi";
import { useOrderNumber } from "../../../../hooks/useOrderNumber";
import { useAuth } from "../../../../context/AuthContext";
import { ConfirmationModal } from "../../../ui/modal/ConfirmationModal";
import {
  formattedProductionDate,
  getFormattedIdentifiedStockID,
} from "../../../../utils/idStockTime";

// interface ProductionOrderProps {
//   setStockIdToPrint: (id: string) => void;
//   onPrint: (stockId: string) => void;
// }
interface ProductionOrderProps {
  setStockIdToPrint: (stockId: string) => void;
  onPrint: (
    stockId: string,
    completedQuantity: number,
    productDescription: string | null
  ) => void;
}

interface ProductionOrder {
  ProductionHeaderID: string;
  SAPProductionOrderID: string;
  SAPProductionOrderObjectID: string;
  SAPProductionProposalID: string;
  SAPProductionProposalObjectID: string;
  SAPSupplyTaskID: string;
  SAPMakeTaskID: string;
  SAPProductID: string;
  SAPProductDescription: string;
  SAPPlannedQuantity: number;
  CompletedQuantity: number;
  ProductionDetails?: ProductionDetail[]; // Optional, as you mentioned
}

interface ProductionDetail {
  ProductionDetailID: string | undefined;
  ProductionHeaderID: string;
  ProductionDate: string;
  Shift: string;
  isRestricted: string | null;
  CompletedQuantity: number;
  IdentifiedStockID: string;
}

// Context for SAP data
interface SAPDataContextType {
  sapData: ProductionOrder | null;
  setSapData: Dispatch<SetStateAction<ProductionOrder | null>>; // Changed to Dispatch
}


const SAPDataContext = createContext<SAPDataContextType | undefined>(undefined); // No default values

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADD_PRODUCTION_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/production/add-production-details`;
const EDIT_PRODUCTION_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/production/edit-production-details`;
const DELETE_PRODUCTION_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/production/delete-production-details`;
const GET_PRODUCTION_ORDER_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-production-order`;
const ADD_PRODUCTION_HEADERS_ENDPOINT = `${API_BASE_URL}/api/v1/production/add-production-headers`;

const ProductionOrderPage: React.FC<ProductionOrderProps> = ({ onPrint }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFindSuccessful, setIsFindSuccessful] = useState(false);
  const [findError, setFindError] = useState<string | null>(null);
  const [productionOrderDetails, setProductionOrderDetails] = useState<
    ProductionOrder[] | null
  >(null);
  const [productDescription, setProductDescription] = useState < string | null > (
    null
  );

  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [isSAPResponse, setIsSAPResponse] = useState(false);
  const [sapData, setSapData] = useState<ProductionOrder | null>(null); // Use useState here
  const [detailToDelete, setDetailToDelete] = useState<string | null>(null);

  // State for "Add New Entry" section
  const { token } = useAuth();
  const [isNewButtonEnabled, setIsNewButtonEnabled] = useState(false);
  const [showNewInputFields, setShowNewInputFields] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [restricted, setRestricted] = useState("");
  const [shift, setShift] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track editing detail
  const { orderNumber, setOrderNumber } = useOrderNumber();
  const [editingDetailId, setEditingDetailId] = useState<string | undefined>();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  // const [stockIdToPrint, setStockIdToPrint] = useState<string | null>(null);
  // const [localProductionOrderDetails, setLocalProductionOrderDetails] =
  //   useState<ProductionOrder[]>([]);
  // const [showPrintContent, setShowPrintContent] = useState(false);

  useEffect(() => {
    if (isFindSuccessful) {
      const timer = setTimeout(() => {
        setSuccessAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFindSuccessful]);


  if (loading) {
    return <div>Loading production orders...</div>;
  }

  if (error) {
    return <div>Error loading production orders: {error}</div>;
  }

  const handleFindClick = () => {
    setIsModalOpen(true);
    setIsFindSuccessful(false);
    setFindError(null);
    setSearchQuery("");
    setProductionOrderDetails(null);
    setIsSAPResponse(false);
    setSapData(null);
    setIsNewButtonEnabled(false); // Reset "New" button state
    setShowNewInputFields(false);
    setQuantity("");
    setRestricted("");
    setShift("");
    setEditingIndex(null);
  };

  const fetchProductionOrderDetails = useCallback(
    async (orderNumber: string) => {
      try {
        setOrderNumber(orderNumber);
        const response = await axiosInstance.get(
          `${GET_PRODUCTION_ORDER_ENDPOINT}?productionOrderID=${orderNumber}`
        );

        const isFromMiddleware = response.data.jToken?.StatusCode !== undefined;
        setIsSAPResponse(!isFromMiddleware);

        if (!isFromMiddleware) {
          setSapData(response.data.jToken);
          const adaptedData: ProductionOrder = {
            ProductionHeaderID: response.data.jToken.ProductionHeaderID,
            SAPProductionOrderID: response.data.jToken.SAPProductionOrderID,
            SAPProductionOrderObjectID:
              response.data.jToken.SAPProductionOrderObjectID,
            SAPProductionProposalID:
              response.data.jToken.SAPProductionProposalID,
            SAPProductionProposalObjectID:
              response.data.jToken.SAPProductionProposalObjectID,
            SAPSupplyTaskID: response.data.jToken.SAPSupplyTaskID,
            SAPMakeTaskID: response.data.jToken.SAPMakeTaskID,
            SAPProductID: response.data.jToken.SAPProductID,
            SAPProductDescription: response.data.jToken.SAPProductDescription,
            SAPPlannedQuantity: response.data.jToken.SAPPlannedQuantity,
            CompletedQuantity: response.data.jToken.CompletedQuantity,
            ProductionDetails: response.data.jToken.ProductionDetails || [], // Get ProductionDetails
          };
          setProductionOrderDetails([adaptedData]);
          setProductDescription(adaptedData.SAPProductDescription); 
        } else {
          const adaptedData: ProductionOrder = {
            ProductionHeaderID: response.data.jToken.ProductionHeaderID,
            SAPProductionOrderID: response.data.jToken.SAPProductionOrderID,
            SAPProductionOrderObjectID:
              response.data.jToken.SAPProductionOrderObjectID,
            SAPProductionProposalID:
              response.data.jToken.SAPProductionProposalID,
            SAPProductionProposalObjectID:
              response.data.jToken.SAPProductionProposalObjectID,
            SAPSupplyTaskID: response.data.jToken.SAPSupplyTaskID,
            SAPMakeTaskID: response.data.jToken.SAPMakeTaskID,
            SAPProductID: response.data.jToken.SAPProductID,
            SAPProductDescription: response.data.jToken.SAPProductDescription,
            SAPPlannedQuantity: response.data.jToken.SAPPlannedQuantity,
            CompletedQuantity: response.data.jToken.CompletedQuantity,
            ProductionDetails: response.data.jToken.ProductionDetails || [],
          };
          setProductionOrderDetails([adaptedData]);
          setProductDescription(adaptedData.SAPProductDescription); 
        }

        return response.data;
      } catch (error: any) {
        setProductionOrderDetails(null);
        setSapData(null);
        setProductDescription(null);
        throw new Error(
          error.message || "Failed to fetch production order details"
        );
      }
    },
    [setOrderNumber, setSapData, setProductionOrderDetails, setProductDescription]
  );

  // Fetch data when the component mounts or orderNumber changes
  useEffect(() => {
    if (orderNumber) {
      fetchProductionOrderDetails(orderNumber);
    }
  }, [orderNumber, fetchProductionOrderDetails]);

  const handleSearchClick = async () => {
    setFindError(null);
    try {
      const responseData = (await fetchProductionOrderDetails(
        searchQuery
      )) as any; // Type assertion

      if ((responseData as any)?.jToken?.SAPProductionOrderID !== searchQuery) {
        setFindError(`Production Order "${searchQuery}" not found.`);
        toast.error(`Production Order "${searchQuery}" not found.`);
        setIsFindSuccessful(false);
        return;
      }

      setIsFindSuccessful(true);
      setSuccessAlertVisible(true);
      setIsModalOpen(false);
      toast.success(`Production Order "${searchQuery}" found!`);
      setIsNewButtonEnabled(true); // Enable "New" button on successful search
      setShowNewInputFields(false); //hide add new inputs
      setQuantity("");
      setRestricted("");
      setShift("");
      setEditingIndex(null);
    } catch (error: any) {
      setFindError(error.message);
      toast.error(error.message);
      setIsFindSuccessful(false);
    }
  };

  const handleSyncData = async () => {
    if (!sapData) {
      toast.error("No data to synchronize.");
      return;
    }

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const payload = [
      {
        sapProductionOrderID: sapData.SAPProductionOrderID,
        sapProductionOrderObjectID: sapData.SAPProductionOrderObjectID,
        sapProductionProposalID: sapData.SAPProductionProposalID,
        sapProductionProposalObjectID: sapData.SAPProductionProposalObjectID,
        sapSupplyTaskID: sapData.SAPSupplyTaskID,
        sapMakeTaskID: sapData.SAPMakeTaskID,
        sapProductID: sapData.SAPProductID,
        sapProductDescription: sapData.SAPProductDescription,
        sapPlannedQuantity: sapData.SAPPlannedQuantity,
        completedQuantity: 0,
      },
    ];

    try {
      const response = await axiosInstance.post(
        ADD_PRODUCTION_HEADERS_ENDPOINT,
        payload,
        {
          headers: {
            ...authHeader,
          },
        }
      );
      toast.success(response.data.message || "Data synchronized successfully!");
      setIsSAPResponse(false);
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while synchronizing data."
      );
    }
  };

  const successAlertProps: AlertProps = {
    variant: "success",
    title: "Success",
    message: `Production Order found.`,
  };

  // --- CRUD Operations for Production Details ---

  const handleAddClick = async (
    quantity: string,
    restricted: string,
    shift: string,
    setQuantity: (value: string) => void,
    setRestricted: (value: string) => void,
    setShift: (value: string) => void,
    setEditingIndex: (value: number | null) => void,
    setShowNewInputFields: (value: boolean) => void,
    setProductionOrderDetails: React.Dispatch<
      React.SetStateAction<ProductionOrder[] | null>
    >,
    editingDetailId?: string // Make editingDetailId optional
  ) => {
    if (!quantity || !restricted || !shift) {
      toast.error("Please complete the form.");
      return;
    }
    
    const newDetailToSend: Omit<
      ProductionDetail,
      "ProductionDetailID" | "ProductionHeaderID"
    > = {
      ProductionDate: formattedProductionDate(),
      Shift: shift,
      isRestricted: restricted,
      CompletedQuantity: Number(quantity),
      // IdentifiedStockID: formattedIdentifiedStockID,
      IdentifiedStockID: getFormattedIdentifiedStockID(),
    };

    try {
      let response: any;
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      if (editingIndex !== null && editingDetailId) {
        // Edit Path
        const editPayload = {
          productionDetailID: editingDetailId,
          productionDate: formattedProductionDate(),
          shift: shift,
          isRestricted: restricted,
          completedQuantity: Number(quantity),
          identifiedStockID: getFormattedIdentifiedStockID(),
        };

        console.log("Edit payload:", editPayload);

        response = await axiosInstance.post(
          EDIT_PRODUCTION_DETAILS_ENDPOINT,
          editPayload,
          {
            headers: {
              ...authHeader,
            },
          }
        );

        if (response.status >= 400) {
          throw new Error(
            response.data?.message || "Failed to update production detail."
          );
        }

        setProductionOrderDetails((prevDetails) => {
          if (
            !prevDetails ||
            !Array.isArray(prevDetails) ||
            !prevDetails[0]?.ProductionDetails
          ) {
            return prevDetails;
          }
          const updatedDetails = [...prevDetails[0].ProductionDetails];
          updatedDetails[editingIndex] = {
            ...updatedDetails[editingIndex],
            ProductionDate: formattedProductionDate(),
            Shift: shift,
            isRestricted: restricted,
            CompletedQuantity: Number(quantity),
            IdentifiedStockID: getFormattedIdentifiedStockID(),
          };

          console.log(
            "Production detail updated in state:",
            updatedDetails[editingIndex]
          );
          return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
        });
        toast.success("Production detail updated successfully!");
      } else {
        // Add new detail
        const payload = [
          {
            sapProductionOrderID: orderNumber,
            productionDetails: [newDetailToSend],
          },
        ];

        console.log("Add payload:", payload);

        response = await axiosInstance.post<
          {
            isSuccess: boolean;
            message: string;
            id: string;
            messageList: null;
            jObject: null;
            errorMessage: string[];
            jToken: null;
            periodOpen: boolean;
          }[]
        >(ADD_PRODUCTION_DETAILS_ENDPOINT, payload, {
          headers: {
            ...authHeader,
          },
        });

        if (response.status >= 400) {
          throw new Error(
            response.data?.[0]?.message || "Failed to add production detail."
          );
        }
        console.log("Add response:", response.data[0]);

        const newProductionDetailId = response.data[0]?.id;
        if (newProductionDetailId) {
          setProductionOrderDetails((prevDetails) => {
            if (!prevDetails) {
              return null;
            }
            const newProductionDetail: ProductionDetail = {
              ProductionDetailID: newProductionDetailId,
              ProductionHeaderID: prevDetails[0]?.ProductionHeaderID || "",
              ...newDetailToSend,
            };

            const updatedDetails = [
              ...(prevDetails[0]?.ProductionDetails || []),
              newProductionDetail,
            ];

            console.log(
              "New production detail added to state with ID:",
              newProductionDetail
            );
            return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
          });
          toast.success("Production detail added successfully.");
        } else {
          console.error(
            "Error: New Production Detail ID not received from backend."
          );
          toast.error("Failed to add production detail: ID not received.");
        }
      }

      setQuantity("");
      setRestricted("");
      setShift("");
      setEditingIndex(null);
      setShowNewInputFields(false);
    } catch (error: any) {
      console.error("Error during add/update operation:", error);
      toast.error(error.message || "Failed to add production detail");
    }
  };

  const handleEditDetail = (
    index: number,
    detail: ProductionDetail,
    setEditingDetailId: (id: string | undefined) => void
  ) => {
    // Added setEditingDetailId
    setQuantity(detail.CompletedQuantity.toString());
    setRestricted(detail.isRestricted || "");
    setShift(detail.Shift);
    setEditingIndex(index);
    setShowNewInputFields(true);
    setEditingDetailId(detail.ProductionDetailID); // Set the editingDetailId
  };

  console.log(editingDetailId, "EditDetail ID:::");

  const handleDeleteDetail = async (
    productionDetailID: string,
    setProductionOrderDetails: React.Dispatch<
      React.SetStateAction<ProductionOrder[] | null>
    >
  ) => {
    console.log("Delete Click!");
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = {
        productionDetailID: productionDetailID,
      };

      const response = await axiosInstance.post(
        // Use axiosInstance
        `${DELETE_PRODUCTION_DETAILS_ENDPOINT}?key=${productionDetailID}`,
        payload,
        {
          headers: {
            ...authHeader,
          },
        }
      );

      if (response.status >= 400) {
        throw new Error(
          response.data?.message || "Failed to delete production detail."
        );
      }

      setProductionOrderDetails((prevDetails) => {
        if (
          !prevDetails ||
          !Array.isArray(prevDetails) ||
          !prevDetails[0]?.ProductionDetails
        ) {
          return prevDetails; // Or return [], handle as appropriate
        }
        const updatedDetails = prevDetails[0].ProductionDetails.filter(
          (detail) => detail.ProductionDetailID !== productionDetailID
        );

        // Check if updatedDetails is empty.  If so, you might want to remove the entire order.
        if (updatedDetails.length === 0) {
          // Remove the ProductionOrder if there are no more ProductionDetails
          return prevDetails.length > 0 ? prevDetails.slice(1) : null;
        }

        return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
      });

      toast.success("Production detail deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting production detail:", error);
      toast.error(error.message || "Failed to delete production detail");
    }
  };

  console.log(orderNumber, "Order Number!");

  // const handleAdd = () => {
  //   handleAddClick(
  //     quantity,
  //     restricted,
  //     shift,
  //     setQuantity,
  //     setRestricted,
  //     setShift,
  //     setEditingIndex,
  //     setShowNewInputFields,
  //     setProductionOrderDetails,
  //     editingDetailId
  //   );
  // };

  const confirmDelete = (id: string) => {
    setDetailToDelete(id);
    setIsDeleteModalOpen(true); // Open the modal
  };

  const cancelDelete = () => {
    setDetailToDelete(null);
    setIsDeleteModalOpen(false); // Close the modal
  };

  const performDelete = () => {
    if (detailToDelete && productionOrderDetails) {
      // added productionOrderDetails check
      handleDeleteDetail(detailToDelete, setProductionOrderDetails);
      setDetailToDelete(null); // Clear state after deletion
    }
    setIsDeleteModalOpen(false); // Close modal after action
  };

  const handleClick = (
    stockId: string,
    completedQuantity: number,
    productDescription: string | null
  ) => {
    onPrint(stockId, completedQuantity, productDescription); 
  };

  console.log(productionOrderDetails, "Desc Production Order Detail:::")
  console.log(productDescription, "Prod Desc:::")

  
  return (
    <>
      <SAPDataContext.Provider value={{ sapData, setSapData }}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button onClick={handleFindClick} startIcon={<FaSearch />}>
              Find
            </Button>
            {isNewButtonEnabled && (
              <Button
                onClick={() => {
                  setShowNewInputFields(!showNewInputFields);
                  setQuantity("");
                  setRestricted("");
                  setShift("");
                  setEditingIndex(null);
                }}
                className="bg-brand-500 hover:bg-brand-600 text-white"
              >
                <HiOutlineSparkles className="text-lg" />
                New
              </Button>
            )}
            {isSAPResponse && (
              <Button
                onClick={handleSyncData}
                variant="sync"
                // className="bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                startIcon={<FaSync />}
              >
                Sync Data
              </Button>
            )}
          </div>

          <AnimatePresence>
            {successAlertVisible && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert {...successAlertProps} />
              </motion.div>
            )}
          </AnimatePresence>

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
                <h5 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
                  Enter Production Order Number
                </h5>
                {findError && (
                  <Alert
                    variant="error"
                    title="Error"
                    message={findError}
                    style={{ marginBottom: "4px" }}
                  ></Alert>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Production Order Number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleSearchClick} startIcon={<FaSearch />}>
                    Search
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {productionOrderDetails && productionOrderDetails.length > 0 && (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Production Order ID
                    </th>
                    {/* <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Order Object ID
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Proposal ID
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Proposal Object ID
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Supply Task ID
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Make Task ID
                    </th> */}
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Product ID
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Product Description
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Planned Quantity
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                      Completed Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {productionOrderDetails.map((order) => (
                    <tr
                      key={order.SAPProductionOrderID}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {order.SAPProductionOrderID}
                      </td>
                      {/* <td className="px-6 py-4">
                        {order.SAPProductionOrderObjectID}
                      </td>
                      <td className="px-6 py-4">
                        {order.SAPProductionProposalID}
                      </td>
                      <td className="px-6 py-4">
                        {order.SAPProductionProposalObjectID}
                      </td>
                      <td className="px-6 py-4">{order.SAPSupplyTaskID}</td>
                      <td className="px-6 py-4">{order.SAPMakeTaskID}</td> */}
                      <td className="px-6 py-4">{order.SAPProductID}</td>
                      <td className="px-6 py-4">
                        {order.SAPProductDescription}
                      </td>
                      <td className="px-6 py-4">{order.SAPPlannedQuantity}</td>
                      <td className="px-6 py-4">{order.CompletedQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add UI Component */}
          {isNewButtonEnabled && showNewInputFields && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6 mt-8">
              <h5 className="text-lg font-bold text-gray-800 dark:text-white">
                {editingIndex !== null ? "Update Entry" : "Add New Entry"}
              </h5>
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select
                  value={restricted}
                  onChange={(e) => setRestricted(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                >
                  <option value="" disabled>
                    Restricted (Yes/No)
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                >
                  <option value="" disabled>
                    Shift
                  </option>
                  <option value="M">M</option>
                  <option value="A">A</option>
                  <option value="N">N</option>
                </select>
                <Button
                  onClick={() => {
                    handleAddClick(
                      quantity,
                      restricted,
                      shift,
                      setQuantity,
                      setRestricted,
                      setShift,
                      setEditingIndex,
                      setShowNewInputFields,
                      setProductionOrderDetails,
                      editingDetailId // Pass editingDetailId here
                    );
                  }}
                  className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all"
                >
                  <FiPlus className="text-lg" />
                  {editingIndex !== null ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          )}

          {/* Display Production Details Table */}
          {productionOrderDetails &&
            productionOrderDetails[0]?.ProductionDetails &&
            productionOrderDetails[0].ProductionDetails.length > 0 && (
              <div className="overflow-x-auto rounded-lg shadow-md mt-8">
                <h6 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Production Details
                </h6>
                <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Detail Number
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Quantity
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Restricted
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Shift
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Production Date
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Identified Stock ID
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {productionOrderDetails[0].ProductionDetails.map(
                      (detail, index) => (
                        <tr
                          key={detail.ProductionDetailID}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                        >
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">
                            {detail.CompletedQuantity}
                          </td>
                          <td className="px-6 py-4">{detail.isRestricted}</td>
                          <td className="px-6 py-4">{detail.Shift}</td>
                          <td className="px-6 py-4">{detail.ProductionDate}</td>
                          <td className="px-6 py-4">
                            {detail.IdentifiedStockID}
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleClick(
                                  detail.IdentifiedStockID,
                                  detail.CompletedQuantity,
                                  productDescription 
                                )
                              }
                              //onClick={() => handleClick(detail.IdentifiedStockID)}
                              data-stockid={detail.IdentifiedStockID}
                              title="Print"
                            >
                              <FaPrint className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditDetail(
                                  index,
                                  detail,
                                  setEditingDetailId
                                )
                              }
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Delete"
                              onClick={() => {
                                if (detail.ProductionDetailID) {
                                  confirmDelete(detail.ProductionDetailID);
                                } else {
                                  console.warn(
                                    "Cannot delete: ProductionDetailID is undefined"
                                  );
                                }
                              }}
                              // onClick={() =>
                              //   confirmDelete(detail.ProductionDetailID)
                              // } // Open modal
                            >
                              <FaTrash className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
             
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={cancelDelete}
            onConfirm={performDelete}
            title="Are you sure?"
            description="This action cannot be undone.  This will permanently delete this production detail."
          />
        </div>
      </SAPDataContext.Provider>
      <Toaster richColors />
    </>
  );
};

export default ProductionOrderPage;
