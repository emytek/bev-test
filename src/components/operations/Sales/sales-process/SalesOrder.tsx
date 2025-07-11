import {
  useState,
  useEffect,
  useCallback,
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import {
  FaSearch,
  FaTimes,
  FaSync,
  FaPrint,
  FaEdit,
  FaTrash,
  FaSave,
  FaClipboardCheck,
  FaCheckDouble,
  FaShareSquare,
  FaSpinner,
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";
import Input from "../../../form/input/InputField";
import Button from "../../../ui/button/Button";
import { toast, Toaster } from "sonner";
import Alert, { AlertProps } from "../../../ui/alert/Alert";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../../api/axiosInstance";
import { FiPlus } from "react-icons/fi";
import { useOrderNumber } from "../../../../hooks/useOrderNumber";
import { useUserAuth } from "../../../../context/AuthContext";
import {
  ConfirmationApprovalModal,
  ConfirmationFinishModal,
  ConfirmationModal,
  PostToSAPModal,
  WarningModal,
} from "../../../ui/modal/ConfirmationModal";
import {
  formattedProductionDate,
  formattedDateTime,
  getFormattedIdentifiedStockID,
  // formatDecimalQuantity,
} from "../../../../utils/idStockTime";
// For react-date-range
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format, parseISO } from "date-fns";
import { useAuth } from "../../../../hooks/useAuth";
import { isOrderFinalized } from "../../../../hooks/finishedState";
import Loader from "../../../ui/loader/Loader";
import { getSalesOrderStatus } from "../../../../utils/productionStatus";
import DynamicSalesButton from "../../../ui/button/DynamicBtn";
import { isValid } from "date-fns";
import { MdOutlineCancel } from "react-icons/md";
import { SalesDetail, SalesOrder } from "../../../../types/salesTypes";

// Context for SAP data
interface SAPDataContextType {
  sapData: SalesOrder | null;
  setSapData: Dispatch<SetStateAction<SalesOrder | null>>; // Changed to Dispatch
}

enum SalesStage {
  FINISH_SALES = "FINISH_SALES",
  APPROVE_SALES = "APPROVE_SALES",
  POST_TO_SAP = "POST_TO_SAP",
  COMPLETED = "COMPLETED",
  NONE = "NONE",
  CANCELLED = "CANCELLED",
}

// const machineOptions = [
//   { value: "", label: "Select Machine" },
//   { value: "Machine 1", label: "Machine 1" },
//   { value: "Machine 2", label: "Machine 2" },
//   { value: "Machine 3", label: "Machine 3" },
//   { value: "Machine 4", label: "Machine 4" },
// ];

const fieldBaseClass =
  "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition text-sm md:text-base";

const fieldWrapperClass = "flex flex-col w-full md:w-[180px]";

const SAPDataContext = createContext<SAPDataContextType | undefined>(undefined); // No default values

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADD_SALES_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/sales/add-sales-details`;
const EDIT_SALES_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/edit-Sales-details`;
const DELETE_SALES_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/delete-Sales-details`;
const GET_SALES_ORDER_ENDPOINT = `${API_BASE_URL}/api/v1/sales/get-sales-order`;
const ADD_SALES_HEADERS_ENDPOINT = `${API_BASE_URL}/api/v1/sales/add-sales-header`;
const FINISH_SALES_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/finish-Sales`;
const APPROVE_SALES_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/approve-Sales`;
const POST_TO_SAP_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/post-Sales`;
const EDIT_SALES_HEADER_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/edit-Sales-header`;
const CANCEL_SALES_ENDPOINT = `${API_BASE_URL}/api/v1/Sales/cancel-Sales`;

const SalesOrderPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFindSuccessful, setIsFindSuccessful] = useState(false);
  const [findError, setFindError] = useState<string | null>(null);
  const [SalesOrderDetails, setSalesOrderDetails] = useState<
    SalesOrder[] | null
  >(null);
  // const [productDescription, setProductDescription] = useState<string | null>(
  //   null
  // );
  // --- New state for input validation visibility ---
  const [_hasInteractedWithQuantity, setHasInteractedWithQuantity] =
    useState<boolean>(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [isSAPResponse, setIsSAPResponse] = useState<boolean>(false);
  const [sapData, setSapData] = useState<SalesOrder | null>(null); // Use useState here
  const [detailToDelete, setDetailToDelete] = useState<string | null>(null);

  // State for "Add New Entry" section
  const { user } = useAuth();
  const { token } = useUserAuth();
  const [_isNewButtonEnabled, setIsNewButtonEnabled] = useState(false);
  const [_showNewInputFields, setShowNewInputFields] = useState(false);
  const [uomQuantityPallet, _setUomQuantityPallet] = useState<number>(0);
  const [_quantity, setQuantity] = useState<number | null>(null);
  const [_restricted, setRestricted] = useState("");
  const [_shift, setShift] = useState("M");
  // Initial states at the top of your component
  //const [_lastSuccessfulShift, setLastSuccessfulShift] = useState<string>(""); // Stores the last selected value
  // No need for hasInteractedWithShift directly for this logic, as `lastSuccessfulShift` will implicitly track interaction.
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track editing detail
  const { orderNumber, setOrderNumber } = useOrderNumber();
  const [editingDetailId, setEditingDetailId] = useState<string | undefined>();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [finalLoading, setFinalLoading] = useState(false);
  const [_finalError, setFinalError] = useState<string | null>(null);
  const [_finalSuccessMessage, setFinalSuccessMessage] = useState<
    string | null
  >(null);
  const [isFinishedStage, _setIsFinishedStage] = useState(false);
  const [isApprovedStage, _setIsApprovedStage] = useState(false);
  const [isPostedStage, _setIsPostedStage] = useState(false);

  const [entryLoading, setEntryLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  // State for inline editing
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineEditedDetail, setInlineEditedDetail] =
    useState<SalesDetail | null>(null);
  const [quantityValidationMessage, _setQuantityValidationMessage] =
    useState("");
  // State for the form inputs
  const [selectedSalesDate, setSelectedSalesDate] = useState<string | null>(
    null
  );
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
  const [_isFinalized, setIsFinalized] = useState<boolean>(false);

  // --- Key Quantities from SAP/Middleware Response ---
  const [SalesHeaderIDData, _setSalesHeaderIDData] = useState<string>("");
  // const [sapPlannedQuantity, setSapPlannedQuantity] = useState<number>(0);
  // const [initialCompletedQuantity, setInitialCompletedQuantity] =
  //   useState<number>(0);
  const [_uomData, _setUomData] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isPosted, _setIsPosted] = useState<boolean>(false);
  //   const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelInstant, setIsCancelInstant] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [_approveError, setApproveError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  // const [postError, setPostError] = useState<string | null>(null);
  // Add a new state variable for pending SAP posting
  const [isPostingPending, setIsPostingPending] = useState(false);
  const [isPostInstant, setIsPostInstant] = useState(false);

  const [showQuantityModal, setShowQuantityModal] = useState(false);
  // const [currentTotalCompletedQuantity, setCurrentTotalCompletedQuantity] =
  //   useState<number>(0);

  // ... other states
  const [isSalesOrderSynced, setIsSalesOrderSynced] = useState<boolean>(false);
  const [isEditHeader, setIsEditHeader] = useState(false);
  const [isSavingEdits, setIsSavingEdits] = useState(false);
  // Keep track of the original values for potential revert on error
  const [originalSalesDate, setOriginalSalesDate] = useState<string | null>(
    null
  );
  const [originalMachine, setOriginalMachine] = useState<string>("");
  const [_convertedPlannedQuantity, _setConvertedPlannedQuantity] =
    useState<number>(0);

  const [_sapSalesOrderID, setSAPSalesOrderID] = useState<string>("");
  const [_sapSalesOrderObjectID, setSAPSalesOrderObjectID] =
    useState<string>("");
  const [_customerID, setCustomerID] = useState<string>("");
  const [salesDate, setSalesDate] = useState<string>("");
  const [sapQuantity, setSapQuantity] = useState<number>(0);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  //   sales details
  // const [salesDetailID, setSalesDetailID] = useState<string>("");
  // const [salesHeaderID, setSalesHeaderID] = useState<string>("");
  // const [lineno, setLineNo] = useState<string>("");
  const [productID, setProductID] = useState<string>("");
  const [_identifiedStockID, setIdentifiedStockID] = useState<string>("");
  const [quantitySales, setQuantitySales] = useState<number | null>(null);

  const userIdData = user?.id;
  const userRole = user?.roles?.[0];

  // This boolean will control the button's visibility
  const isAdmin = userRole === "Sales Supervisor";
  // Effect to check form completion
  useEffect(() => {
    // Form is completed if both fields have values AND it's a SAP response (meaning it needs syncing)
    setIsFormCompleted(!!salesDate && isSAPResponse);
  }, [salesDate, isSAPResponse]);

  useEffect(() => {
    if (userIdData && SalesHeaderIDData) {
      const finalized = isOrderFinalized(userIdData, SalesHeaderIDData);
      setIsFinalized(finalized);
    }
  }, [userIdData, SalesHeaderIDData]);

  useEffect(() => {
    if (isFindSuccessful) {
      const timer = setTimeout(() => {
        setSuccessAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFindSuccessful]);

  //   useEffect(() => {
  //     setQuantity(uomQuantityPallet);
  //   }, [uomQuantityPallet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = value === "" ? null : Number(value);
    setQuantitySales(parsed);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading Sales orders: {error}</div>;
  }

  const handleFindClick = () => {
    setIsModalOpen(true);
    setIsFindSuccessful(false);
    setFindError(null);
    setSearchQuery("");
    // setSalesOrderDetails(null);
    // setIsSAPResponse(true);
    // setSapData(null);
    setIsNewButtonEnabled(false); // Reset "New" button state
    setShowNewInputFields(false);
    setQuantity(uomQuantityPallet);
    setRestricted("");
    setShift("M");
    setEditingIndex(null);
  };

  const fetchSalesOrderDetails = useCallback(
    async (orderNumber: string) => {
      try {
        setOrderNumber(orderNumber);
        setSAPSalesOrderID("");
        setSAPSalesOrderObjectID("");
        setCustomerID("");
        // setSelectedSalesDate(null);
        setSalesDate("");
        setTotalAmount(0);
        setIsCanceled(false);
        setIsSalesOrderSynced(false);
        // setIsFinished(false);
        // setIsApproved(false);
        // setIsPosted(false);
        // setIsCancelled(false);
        // setSapPlannedQuantity(0);
        // setUomQuantityPallet(0);
        // setInitialCompletedQuantity(0);
        // setCurrentTotalCompletedQuantity(0);
        // setUomData(0);
        // setSalesHeaderIDData("");
        // setOriginalSalesDate(null);
        // setOriginalMachine("");
        // setIsEditHeader(false);
        // setConvertedPlannedQuantity(0);

        const response = await axiosInstance.get(
          `${GET_SALES_ORDER_ENDPOINT}?SalesOrderID=${orderNumber}`
        );

        const isFromMiddleware = response.data.jToken?.StatusCode !== undefined;
        // setIsSAPResponse is for showing/hiding the Sync button (true if from SAP)
        setIsSAPResponse(!isFromMiddleware);

        // *** NEW: Set isSalesOrderSynced based on data source ***
        // If it's from middleware, it means it's already synced.
        // If it's from SAP, it's NOT synced yet.
        setIsSalesOrderSynced(isFromMiddleware);

        // This 'adaptedData' will hold the unified structure, regardless of source
        let adaptedData: SalesOrder;

        if (!isFromMiddleware) {
          // Data directly from SAP
          setSapData(response.data.jToken); // Store raw SAP data for sync
          // Set the key quantities here!

          adaptedData = {
            SalesHeaderID: response.data.jToken.SalesHeaderID,
            SAPSalesOrderID: response.data.jToken.SAPSalesOrderID,
            SAPSalesOrderObjectID: response.data.jToken.SAPSalesOrderObjectID,
            CustomerID: response.data.jToken.CustomerID,
            SalesDate: response.data.jToken.SalesDate,
            TotalAmount: response.data.jToken.TotalAmount,
            SAPQuantity: response.data.jToken.SAPQuantity,
            isCanceled: response.data.jToken.isCanceled,
            SalesDetails: response.data.jToken.SalesDetails,
          };
        } else {
          // Data from Middleware DB (which includes synced data)
          adaptedData = {
            SalesHeaderID: response.data.jToken.SalesHeaderID,
            SAPSalesOrderID: response.data.jToken.SAPSalesOrderID,
            SAPSalesOrderObjectID: response.data.jToken.SAPSalesOrderObjectID,
            CustomerID: response.data.jToken.CustomerID,
            SalesDate: response.data.jToken.SalesDate,
            TotalAmount: response.data.jToken.TotalAmount,
            SAPQuantity: response.data.jToken.SAPQuantity,
            isCanceled: response.data.jToken.isCanceled,
            SalesDetails: response.data.jToken.SalesDetails,
          };
        }

        setSalesOrderDetails([adaptedData]);
        setSAPSalesOrderID(adaptedData.SAPSalesOrderID);
        setSAPSalesOrderObjectID(adaptedData.SAPSalesOrderObjectID);
        setCustomerID(adaptedData.CustomerID);
        setTotalAmount(adaptedData.TotalAmount);
        setSapQuantity(adaptedData.SAPQuantity);
        setIsCanceled(adaptedData.isCanceled);
        // setIsFinished(adaptedData.isFinished);
        // setIsApproved(adaptedData.isApproved);
        // setIsPosted(adaptedData.IsPosted);
        // setIsCancelled(adaptedData.isCanceled);
        // setSapPlannedQuantity(response.data.jToken.SAPPlannedQuantity);
        // setUomQuantityPallet(response.data.jToken.UoMQuantityPallet);
        // setInitialCompletedQuantity(response.data.jToken.CompletedQuantity);
        // setUomData(adaptedData.UoMQuantityPallet);

        // const sumOfDetails = adaptedData.SalesDetails?.reduce(
        //   (sum, detail) => sum + detail.CompletedQuantity,
        //   0
        // );
        // setCurrentTotalCompletedQuantity(sumOfDetails || 0);

        if (adaptedData.SalesDate) {
          const date = parseISO(adaptedData.SalesDate);
          if (isValid(date)) {
            setSalesDate(format(date, "yyyy-MM-dd"));
            setOriginalSalesDate(format(date, "yyyy-MM-dd"));
          } else {
            setSalesDate("");
            setOriginalSalesDate(null);
          }
        } else {
          setSalesDate("");
          setOriginalSalesDate(null);
        }

        return response.data;
      } catch (error: any) {
        setSalesOrderDetails(null);
        setSapData(null);
        setSalesDate("");
        setIsSAPResponse(false);
        setIsSalesOrderSynced(false);
        setOriginalSalesDate(null);
        setIsEditHeader(false);
        toast.error(error.message || "Failed to fetch Sales order details");
        throw new Error(error.message || "Failed to fetch Sales order details");
      }
    },
    [
      setOrderNumber,
      setSapData,
      setSalesOrderDetails,
      setSAPSalesOrderID,
      setIsSAPResponse,
      setSalesDate,
      setIsSalesOrderSynced,
    ]
  );

  useEffect(() => {
    if (orderNumber) {
      fetchSalesOrderDetails(orderNumber);
    }
  }, [orderNumber, fetchSalesOrderDetails]);

  const handleSearchClick = async () => {
    setFindError(null);
    setSearchLoading(true);
    try {
      const responseData = (await fetchSalesOrderDetails(searchQuery)) as any; // Type assertion

      if ((responseData as any)?.jToken?.SAPSalesOrderID !== searchQuery) {
        setFindError(`Sales Order "${searchQuery}" not found.`);
        toast.error(`Sales Order "${searchQuery}" not found.`);
        setIsFindSuccessful(false);
        return;
      }

      setIsFindSuccessful(true);
      setSuccessAlertVisible(true);
      setIsModalOpen(false);
      toast.success(`Sales Order "${searchQuery}" found!`);
      setSearchLoading(false);
      setIsNewButtonEnabled(true);
      setShowNewInputFields(false);
      setQuantitySales(0);
      setProductID("");
      //   setQuantity(uomQuantityPallet);
      //setQuantity(quantitySales);
      //   setRestricted("");
      //   setShift("M");
      setEditingIndex(null);
    } catch (error: any) {
      setFindError(error.message);
      toast.error(error.message);
      setSearchLoading(false);
      setIsFindSuccessful(false);
    }
  };

  const handleSyncData = async () => {
    if (!sapData) {
      toast.error(
        "No data to synchronize. Please fetch a SAP Sales order first."
      );
      return;
    }

    if (!salesDate) {
      toast.error("Please select a Sales Date.");
      return;
    }

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    // Convert the YYYY-MM-DD string from the input to an ISO string for the backend
    const dateAsISOString = new Date(salesDate).toISOString();

    const payload = [
      {
        sapSalesOrderID: sapData.SAPSalesOrderID,
        sapSalesOrderObjectID: sapData.SAPSalesOrderObjectID,
        SalesDate: dateAsISOString,
        customerID: sapData.CustomerID,
        totalAmount: sapData.TotalAmount,
        sapQuantity: sapData.SAPQuantity,
        // isCanceled: sapData.isCanceled
      },
    ];

    try {
      const response = await axiosInstance.post(
        ADD_SALES_HEADERS_ENDPOINT,
        payload,
        {
          headers: {
            ...authHeader,
          },
        }
      );
      toast.success(response.data.message || "Data synchronized successfully!");
      setIsSAPResponse(false);
      setIsSalesOrderSynced(true);
      //   if (response.data && response.data.SalesHeaderID) {
      //     setSalesHeaderIDData(response.data.SalesHeaderID);
      //   } else {
      //     console.warn(
      //       "Backend did not return new SalesHeaderID after sync. Consider re-fetching."
      //     );
      //     await fetchSalesOrderDetails(sapData.SAPSalesOrderID);
      //   }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while synchronizing data."
      );
    }
  };

  const handleSaveEdits = async () => {
    if (!SalesHeaderIDData) {
      toast.error("Sales Header ID is missing for saving edits.");
      return;
    }

    // Basic validation before saving
    if (!selectedSalesDate) {
      toast.error("Sales Date cannot be empty.");
      return;
    }
    if (!selectedMachine) {
      toast.error("Machine cannot be empty.");
      return;
    }

    setIsSavingEdits(true);

    // Format date for API payload
    const formattedDateForAPI = selectedSalesDate
      ? format(parseISO(selectedSalesDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
      : "";

    try {
      const payload = {
        SalesHeaderID: SalesHeaderIDData,
        SalesDate: formattedDateForAPI,
        machine: selectedMachine,
      };

      const response = await axiosInstance.post(
        EDIT_SALES_HEADER_ENDPOINT,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Record updated successfully!");
        // Update original values to reflect the newly saved state
        setOriginalSalesDate(selectedSalesDate);
        setOriginalMachine(selectedMachine);
        setIsEditHeader(false); // Exit edit mode on success
        // Optionally, re-fetch to ensure the main SalesOrderDetails object is in sync
        // await fetchSalesOrderDetails(actualOrderNumber);
      } else {
        throw new Error("Unexpected server response during edit save.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to save changes.";
      toast.error(`Error saving: ${message}`);
      // On error, revert the selected values back to their original fetched state
      setSelectedSalesDate(originalSalesDate);
      setSelectedMachine(originalMachine);
      setIsEditHeader(false);
    } finally {
      setIsSavingEdits(false);
    }
  };

  const successAlertProps: AlertProps = {
    variant: "success",
    title: "Success",
    message: `Sales Order found.`,
  };

  // Calculate the total completed quantity from the SalesDetails array
  //   const calculateTotalCompletedQuantity = useMemo(() => {
  //     if (
  //       !SalesOrderDetails ||
  //       !SalesOrderDetails[0]?.SalesDetails
  //     ) {
  //       return 0;
  //     }
  //     return SalesOrderDetails[0].SalesDetails.reduce(
  //       (sum, detail) => sum + detail.CompletedQuantity,
  //       0
  //     );
  //   }, [SalesOrderDetails]);

  //   useEffect(() => {
  //     setCurrentTotalCompletedQuantity(calculateTotalCompletedQuantity);
  //   }, [calculateTotalCompletedQuantity]);

  const handleCancelSales = async () => {
    if (!SalesHeaderIDData) {
      toast.error("Sales Header ID is missing for cancellation.");
      setIsCancelModalOpen(false);
      return;
    }

    setIsCancelling(true);
    try {
      const url = `${CANCEL_SALES_ENDPOINT}?SalesHeaderID=${SalesHeaderIDData}&userID=${userIdData}`;
      const response = await axiosInstance.post(url);

      if (response.status === 200 || response.status === 201) {
        toast.success("Sales order successfully cancelled!");
        setIsCanceled(true);
        setIsCancelInstant(true);
        setIsCancelModalOpen(false); // Close the modal
        // Optionally, refetch to confirm state from backend, but optimistic update is faster
        // fetchSalesOrderDetails(actualOrderNumber);
      } else {
        throw new Error("Unexpected server response during cancellation.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to cancel Sales order.";
      toast.error(`Error cancelling: ${message}`);
      setIsCancelModalOpen(false); // Close modal on error
    } finally {
      setIsCancelling(false); // Reset loading state
    }
  };

  const handleAddClick = async (
    productID: string,
    // identifiedStockID: string,
    quantitySales: number | null,
    setProductID: (value: string) => void,
    // setIdentifiedStockID: (value: string) => void,
    setQuantitySales: (value: number | null) => void,
    setShowNewInputFields: (value: boolean) => void,
    setSalesOrderDetails: React.Dispatch<
      React.SetStateAction<SalesOrder[] | null>
    >,
    editingDetailId?: string
  ) => {
    if (!quantitySales || !productID) {
      toast.error("Please complete the form.");
      return;
    }
    setEntryLoading(true);

    const newDetailToSend: Omit<
      SalesDetail,
      "SalesDetailID" | "SalesHeaderID"
    > = {
      ProductID: productID,
      IdentifiedStockID: getFormattedIdentifiedStockID(),
      Quantity: quantitySales,
    };

    try {
      let response: any;
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      if (editingIndex !== null && editingDetailId) {
        // Edit Path
        const editPayload = {
          ProductID: formattedDateTime(),
          IdentifiedStockID: getFormattedIdentifiedStockID(),
          Quantity: quantitySales,
        };

        response = await axiosInstance.post(
          EDIT_SALES_DETAILS_ENDPOINT,
          editPayload,
          {
            headers: {
              ...authHeader,
            },
          }
        );

        if (response.status >= 400) {
          throw new Error(
            response.data?.message || "Failed to update Sales detail."
          );
        }

        setSalesOrderDetails((prevDetails) => {
          if (
            !prevDetails ||
            !Array.isArray(prevDetails) ||
            !prevDetails[0]?.SalesDetails
          ) {
            return prevDetails;
          }
          const updatedDetails = [...prevDetails[0].SalesDetails];
          updatedDetails[editingIndex] = {
            ...updatedDetails[editingIndex],
            ProductID: formattedDateTime(),
            IdentifiedStockID: getFormattedIdentifiedStockID(),
            Quantity: quantitySales,
          };

          //   const newTotal = updatedDetails.reduce(
          //     (sum, detail) => sum + detail.CompletedQuantity,
          //     0
          //   );
          //   setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

          console.log(
            "Sales detail updated in state:",
            updatedDetails[editingIndex]
          );
          return [{ ...prevDetails[0], SalesDetails: updatedDetails }];
        });
        toast.success("Sales detail updated successfully!");
        setEntryLoading(false);
      } else {
        // Add new detail
        const payload = [
          {
            sapSalesOrderID: orderNumber,
            saleDetails: [newDetailToSend],
          },
        ];

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
        >(ADD_SALES_DETAILS_ENDPOINT, payload, {
          headers: {
            ...authHeader,
          },
        });

        if (response.status >= 400) {
          throw new Error(
            response.data?.[0]?.message || "Failed to add Sales detail."
          );
        }

        const newSalesDetailId = response.data[0]?.id;
        if (newSalesDetailId) {
          setSalesOrderDetails((prevDetails) => {
            if (!prevDetails) {
              return null;
            }
            const newSalesDetail: SalesDetail = {
              SalesDetailID: newSalesDetailId,
              SalesHeaderID: prevDetails[0]?.SalesHeaderID || "",
              ...newDetailToSend,
            };

            const updatedDetails = [
              ...(prevDetails[0]?.SalesDetails || []),
              newSalesDetail,
            ];

            // const newTotal = updatedDetails.reduce(
            //   (sum, detail) => sum + detail.CompletedQuantity,
            //   0
            // );
            // setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

            return [{ ...prevDetails[0], SalesDetails: updatedDetails }];
          });
          toast.success("Sales detail added successfully.");
          setEntryLoading(false);
        } else {
          console.error(
            "Error: New Sales Detail ID not received from backend."
          );
          toast.error("Failed to add Sales detail: ID not received.");
        }
      }

      setQuantitySales(0);
      setProductID("");
      setIdentifiedStockID("");
      setEditingIndex(null);
      setEditingDetailId(undefined);
      setShowNewInputFields(false);
    } catch (error: any) {
      console.error("Error during add/update operation:", error);
      toast.error(error.message || "Failed to add Sales detail");
      setEntryLoading(false);
    }
  };

  // Handles starting inline edit
  const handleInlineEditClick = useCallback((detail: SalesDetail) => {
    setInlineEditingId(detail.SalesDetailID || null);

    // Ensure all fields are properly defaulted
    setInlineEditedDetail({
      ...detail,
      ProductID: detail.ProductID,
      IdentifiedStockID: detail.IdentifiedStockID,
      Quantity: detail.Quantity,
    });

    setShowNewInputFields(false);
    setEditingIndex(null);
    setEditingDetailId(undefined);
  }, []);

  const handleInlineInputChange = (field: keyof SalesDetail, value: any) => {
    if (inlineEditedDetail) {
      const updatedDetail = { ...inlineEditedDetail, [field]: value };
      setInlineEditedDetail(updatedDetail);
    }
  };

  const handleInlineSave = async (index: number) => {
    if (!inlineEditedDetail || !inlineEditingId) return;

    setEntryLoading(true);

    //const numericQuantity = Number(inlineEditedDetail.CompletedQuantity);

    // Recalculate total for validation
    // let currentDetailsTotal = 0;
    // if (
    //   SalesOrderDetails &&
    //   SalesOrderDetails[0]?.SalesDetails
    // ) {
    //   currentDetailsTotal = SalesOrderDetails[0].SalesDetails.reduce(
    //     (sum, detail, idx) => {
    //       if (idx === index) {
    //         // Use the new value for the currently edited item
    //         return sum + numericQuantity;
    //       }
    //       return sum + detail.CompletedQuantity;
    //     },
    //     0
    //   );
    // }

    const editPayload = {
      SalesDetailID: inlineEditingId,
      ProductID: inlineEditedDetail.ProductID, // Assuming date is handled elsewhere or from detail
      IdentifiedStockID: inlineEditedDetail.IdentifiedStockID,
      Quantity: inlineEditedDetail.Quantity,
    };

    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axiosInstance.post(
        EDIT_SALES_DETAILS_ENDPOINT,
        editPayload,
        {
          headers: {
            ...authHeader,
          },
        }
      );

      if (response.status >= 400) {
        throw new Error(
          response.data?.message || "Failed to update Sales detail."
        );
      }

      setSalesOrderDetails((prevDetails) => {
        if (
          !prevDetails ||
          !Array.isArray(prevDetails) ||
          !prevDetails[0]?.SalesDetails
        ) {
          return prevDetails;
        }
        const updatedDetails = [...prevDetails[0].SalesDetails];
        updatedDetails[index] = {
          ...inlineEditedDetail,
          Quantity: inlineEditedDetail.Quantity,
        }; // Ensure numeric quantity is saved

        // const newTotal = updatedDetails.reduce(
        //   (sum, detail) => sum + detail.CompletedQuantity,
        //   0
        // );
        // setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

        return [{ ...prevDetails[0], SalesDetails: updatedDetails }];
      });
      toast.success("Sales detail updated successfully!");
      setInlineEditingId(null);
      setInlineEditedDetail(null);
    } catch (error: any) {
      console.error("Error during inline update operation:", error);
      toast.error(error.message || "Failed to update Sales detail");
    } finally {
      setEntryLoading(false);
    }
  };

  // Handles cancelling inline changes
  const handleInlineCancel = useCallback(() => {
    setInlineEditingId(null);
    setInlineEditedDetail(null);
  }, []);

  const currentSalesDetails =
    SalesOrderDetails && SalesOrderDetails[0]?.SalesDetails
      ? SalesOrderDetails[0].SalesDetails
      : [];

  const handleDeleteDetail = async (
    SalesDetailID: string,
    setSalesOrderDetails: React.Dispatch<
      React.SetStateAction<SalesOrder[] | null>
    >
  ) => {
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = {
        SalesDetailID: SalesDetailID,
      };

      const response = await axiosInstance.post(
        `${DELETE_SALES_DETAILS_ENDPOINT}?key=${SalesDetailID}`,
        payload,
        {
          headers: {
            ...authHeader,
          },
        }
      );

      if (response.status >= 400) {
        throw new Error(
          response.data?.message || "Failed to delete Sales detail."
        );
      }

      // --- CONSOLIDATE STATE UPDATE LOGIC ---
      setSalesOrderDetails((prevDetails) => {
        // If there are no previous details or it's not an array with at least one order,
        // just return the current state.
        if (
          !prevDetails ||
          !Array.isArray(prevDetails) ||
          prevDetails.length === 0
        ) {
          return prevDetails;
        }

        // Assuming you always display a single SalesOrder at index 0
        const currentOrder = prevDetails[0];
        const currentSalesDetails = currentOrder.SalesDetails || [];

        // Filter out the deleted detail
        const updatedDetails = currentSalesDetails.filter(
          (detail) => detail.SalesDetailID !== SalesDetailID
        );

        // Calculate the new total completed quantity
        // const newTotal = updatedDetails.reduce(
        //   (sum, detail) => sum + detail.CompletedQuantity,
        //   0
        // );
        // setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity
        return [{ ...currentOrder, SalesDetails: updatedDetails }];
      });

      toast.success("Sales detail deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting Sales detail:", error);
      toast.error(error.message || "Failed to delete Sales detail");
    }
  };

  const handleFinishSales = async () => {
    setFinalLoading(true);
    setFinalError(null);
    setFinalSuccessMessage(null);
    try {
      const url = `${FINISH_SALES_ENDPOINT}?SalesHeaderID=${SalesHeaderIDData}&userID=${userIdData}`;
      const response = await axiosInstance.post(url);

      if (response.status === 200 || response.status === 201) {
        setFinalSuccessMessage("Sales order successfully finalized.");
        toast.success("Sales order finalized. All entries have been saved.");
        setIsFinalModalOpen(false);
        // Update local state to reflect the change
        setIsFinished(true);
      } else {
        throw new Error("Unexpected server response.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong.";
      setFinalError(message);
      toast.error("Failed to finish Sales order. Please try again.");
    } finally {
      setFinalLoading(false);
    }
  };

  const handleApproveSales = async () => {
    setApproveLoading(true);
    setApproveError(null);
    try {
      const url = `${APPROVE_SALES_ENDPOINT}?SalesHeaderID=${SalesHeaderIDData}&userID=${userIdData}`;
      const response = await axiosInstance.post(url);

      if (response.status === 200 || response.status === 201) {
        toast.success("Sales order approved successfully.");
        setIsApproved(true);
        setIsApproveModalOpen(false);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Approval failed.";
      setApproveError(message);
      toast.error(`Error: ${message}`);
    } finally {
      setApproveLoading(false);
    }
  };

  // --- Determine current button stage ---

  const handlePostToSAP = async () => {
    if (!SalesHeaderIDData) {
      toast.error("Sales Header ID is missing. Cannot post to SAP.");
      return;
    }
    setPosting(true); // Indicates UI is busy
    setIsPostingPending(true); // Indicates that a posting action has been initiated

    try {
      const response = await axiosInstance.post<{
        data: any;
        message: string;
        status: boolean;
      }>(POST_TO_SAP_ENDPOINT, [SalesHeaderIDData]);

      if (response.status === 200 || response.status === 201) {
        // Success response from your middleware, but not necessarily SAP success yet.
        toast.info("Sales order scheduled for Posting.."); // Inform the user
        setIsPostInstant(true);
        // Crucially, DO NOT set isPosted(true) here immediately.
        // The actual 'isPosted' status should come from a fresh fetch.

        setIsDrawerOpen(false);

        if (orderNumber) {
          setTimeout(async () => {
            await fetchSalesOrderDetails(orderNumber);
            setIsPostingPending(false); // Clear pending status after fetch
          }, 1000); // Wait for 1 second before refetching
        } else {
          setIsPostingPending(false); // Clear if no orderNumber to fetch
        }
      } else {
        throw new Error("Unexpected server response during posting to SAP.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(`Failed to post to SAP. ${message}`);
      setIsPostingPending(false); // Clear pending status on error
    } finally {
      setPosting(false); // Always clear the busy state
    }
  };

  const currentSalesStage = useMemo(() => {
    if (SalesOrderDetails && SalesOrderDetails.length > 0) {
      //const { isFinished: fetchedIsFinished, isApproved: fetchedIsApproved, IsPosted: fetchedIsPosted } = SalesOrderDetails[0];

      // Use the *current* state values for the stage logic, as they reflect
      // the immediate result of an action, while fetched values are from last fetch.
      // Prioritize most advanced stage
      if (isCanceled) {
        // New condition for cancelled state
        return SalesStage.CANCELLED;
      }
      if (isPosted) {
        return SalesStage.COMPLETED;
      } else if (isApproved) {
        return SalesStage.POST_TO_SAP;
      } else if (isFinished) {
        return SalesStage.APPROVE_SALES;
      } else if (
        isSalesOrderSynced &&
        SalesOrderDetails[0].SalesDetails &&
        SalesOrderDetails[0].SalesDetails.length > 0
      ) {
        return SalesStage.FINISH_SALES;
      }
    }
    return SalesStage.NONE;
  }, [
    SalesOrderDetails,
    isSalesOrderSynced,
    isFinished,
    isApproved,
    isPosted,
    isCanceled,
  ]);

  const getButtonProps = () => {
    let buttonText = "";
    let handleClickBtn = () => {};
    let showButton = false;
    let isLoading = false;
    let isDisabledByRole = false;

    switch (currentSalesStage) {
      case SalesStage.FINISH_SALES:
        buttonText = "Finish Sales Order";
        handleClickBtn = handleFinishSales;
        showButton = true;
        isLoading = finalLoading;
        break;
      case SalesStage.APPROVE_SALES:
        buttonText = "Approve Sales";
        handleClickBtn = () => setIsApproveModalOpen(true);
        showButton = isAdmin; // Only show for Admin
        isLoading = approveLoading;
        isDisabledByRole = !isAdmin;
        break;
      case SalesStage.POST_TO_SAP:
        buttonText = "Post to SAP";
        handleClickBtn = () => setIsDrawerOpen(true);
        showButton = isAdmin; // Only show for Admin
        isLoading = posting;
        isDisabledByRole = !isAdmin;
        break;
      case SalesStage.COMPLETED:
        showButton = false;
        break;
      case SalesStage.NONE:
      default:
        showButton = false;
        break;
    }

    return {
      buttonText,
      handleClickBtn,
      showButton,
      isLoading,
      isDisabledByRole,
    };
  };

  const disableAllInteractions = isCanceled || !SalesOrderDetails;

  const {
    buttonText,
    handleClickBtn,
    showButton,
    // isLoading,
    isDisabledByRole,
  } = getButtonProps();

  const confirmDelete = (id: string) => {
    setDetailToDelete(id);
    setIsDeleteModalOpen(true); // Open the modal
  };

  const cancelDelete = () => {
    setDetailToDelete(null);
    setIsDeleteModalOpen(false); // Close the modal
  };

  const performDelete = () => {
    if (detailToDelete && SalesOrderDetails) {
      // added SalesOrderDetails check
      handleDeleteDetail(detailToDelete, setSalesOrderDetails);
      setDetailToDelete(null); // Clear state after deletion
    }
    setIsDeleteModalOpen(false); // Close modal after action
  };

  // const handleClick = (
  //   stockId: string,
  //   completedQuantity: number,
  //   productDescription: string | null,
  //   orderNumber: string | null
  // ) => {
  //   onPrint(stockId, completedQuantity, productDescription, orderNumber);
  // };

  // === STAGE DETECTION ===
  const currentStage = useMemo<"finish" | "approve" | "post" | null>(() => {
    if (!isFinishedStage && !isFinished) return "finish";
    if (!isApprovedStage && !isApproved) return "approve";
    if (!isPostedStage && !isPosted) return "post";
    return null; // all done
  }, [
    isFinishedStage,
    isFinished,
    isApprovedStage,
    isApproved,
    isPostedStage,
    isPosted,
  ]);

  // === DYNAMIC VALUES BASED ON STAGE ===
  const { isLoadingStage, isDisabled } = useMemo(() => {
    // Change 'loadingStage' to 'isLoading' for consistency if DynamicSalesButton expects 'loading'
    // or ensure the prop names match. I'm using `isLoading` here to map directly to the button's `loading` prop.
    switch (currentStage) {
      case "finish":
        return {
          action: handleFinishSales,
          text: finalLoading ? "Finishing..." : "Finish Sales",
          icon: FaClipboardCheck,
          isLoadingStage: finalLoading, // Use finalLoading here
          isDisabled: finalLoading,
        };
      case "approve":
        return {
          action: handleApproveSales,
          text: approveLoading ? "Approving..." : "Approve Sales",
          icon: FaCheckDouble,
          isLoadingStage: approveLoading, // Use approveLoading here
          isDisabled: approveLoading,
        };
      case "post":
        return {
          action: handlePostToSAP,
          // The button text should indicate the true state
          text: isPostingPending
            ? "Posting to SAP..."
            : posting
            ? "Posting..."
            : isPostInstant
            ? "Posting to SAP..."
            : "Post to SAP",
          icon: FaShareSquare,
          // THIS IS THE KEY CHANGE: Disable if posting or if pending
          isLoadingStage: posting || isPostingPending,
          isDisabled: posting || isPostingPending || isPostInstant || isPosted,
        };
      default:
        return {
          action: undefined,
          text: "Completed",
          icon: FaClipboardCheck,
          isLoadingStage: false,
          isDisabled: true,
        };
    }
  }, [
    currentStage,
    finalLoading,
    approveLoading,
    posting,
    isPostingPending,
    isPosted,
    isPostInstant,
  ]);

  // --- NEW: Dynamic Status Calculation (using current state) ---
  const [currentStatus] = useMemo(() => {
    let status = "";
    let colorClass = "";

    // Prioritize the "Posting in Progress" state
    if (isPostingPending) {
      status = "Posting to SAP...";
      colorClass = "text-yellow-600 dark:text-yellow-400 animate-pulse"; // Add animation for feedback
    }
    // Then check the definitive statuses from the fetched data
    else if (isPosted) {
      status = "Posted";
      colorClass = "text-blue-600 dark:text-blue-400";
    } else if (isApproved) {
      status = "Approved";
      colorClass = "text-red-600 dark:text-red-400"; // Assuming Approved is red before posting
    } else if (isFinished) {
      status = "Finished";
      colorClass = "text-green-600 dark:text-green-400";
    } else if (isCanceled) {
      status = "Cancelled";
      colorClass = "text-red-600 dark:text-red-400"; // Use red for cancelled
    } else if (SalesOrderDetails) {
      // If details are loaded but no definitive status flags are true
      status = "Pending"; // Or "New", "In Progress"
      colorClass = "text-gray-500 dark:text-gray-400";
    } else {
      // No Sales order loaded yet
      status = "N/A";
      colorClass = "text-gray-400 dark:text-gray-500";
    }
    return [status, colorClass];
  }, [
    isFinished,
    isApproved,
    isPosted,
    isCanceled,
    isPostingPending,
    SalesOrderDetails,
  ]);

  // Tailwind classes for the edit/save button
  const editSaveButtonClasses = useMemo(() => {
    let baseClasses =
      "min-w-[60px] px-4 py-2 text-sm rounded-md font-medium transition-colors duration-200 ease-in-out"; // Base classes for size and common styles

    if (isSavingEdits) {
      // Styles for saving state (spinner visible)
      return `${baseClasses} bg-gray-400 text-white cursor-not-allowed`;
    } else if (isEditHeader) {
      // Styles for "Save" button
      return `${baseClasses} bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`;
    } else {
      // Styles for "Edit" button
      return `${baseClasses} bg-brand-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`;
    }
  }, [isEditHeader, isSavingEdits]);

  console.log(totalAmount, "TOTAL AMT", sapQuantity, "SAPQty");

  return (
    <>
      <SAPDataContext.Provider value={{ sapData, setSapData }}>
        <div className="p-6 space-y-6">
          <div className="w-full sm:px-8 lg:px-20 xl:px-32 mt-6">
            <div className="flex flex-col items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Find Sales Order Button */}
                <Button
                  onClick={handleFindClick}
                  startIcon={<FaSearch />}
                  className="w-full min-w-[200px]"
                >
                  Find Sales Order
                </Button>

                {/* Sync Data Button - Conditional */}
                {isSAPResponse && isFormCompleted && !isSalesOrderSynced && (
                  <Button
                    onClick={handleSyncData}
                    variant="sync"
                    startIcon={<FaSync />}
                    className="w-full min-w-[200px]"
                  >
                    Sync Data
                  </Button>
                )}

                {/* Finish Sales Button - Conditional */}
                {showButton && (
                  <DynamicSalesButton
                    onClick={handleClickBtn}
                    disabled={isDisabledByRole || isDisabled} // Pass role disabled state
                    loadingStage={isLoadingStage} // Pass loading state to the button
                    buttonText={buttonText} // Pass the dynamic text
                    // You can pass an icon prop if you have one
                    // startIcon={icon ? React.createElement(icon) : undefined}
                  />
                )}
              </div>

              {/* Card UI - Conditional */}
              {SalesOrderDetails && (
                <div className="flex flex-col gap-y-6 w-full mt-6">
                  {SalesOrderDetails.map((order: SalesOrder) => {
                    // Determine the status and its color
                    const status = getSalesOrderStatus(
                      //   order.isFinished,
                      //   order.isApproved,
                      //   order.IsPosted,
                      order.isCanceled
                    );

                    let statusColorClass = "";
                    let bgColorClass = "";
                    let ringColorClass = "";

                    switch (status) {
                      case "Finished":
                        statusColorClass = "text-green-700 dark:text-green-400";
                        bgColorClass = "bg-green-100 dark:bg-green-900/20";
                        ringColorClass = "ring-green-400/40";
                        break;
                      case "Approved":
                        statusColorClass =
                          "text-yellow-700 dark:text-yellow-300";
                        bgColorClass = "bg-yellow-100 dark:bg-yellow-900/20";
                        ringColorClass = "ring-yellow-400/40";
                        break;
                      case "Posted":
                        statusColorClass = "text-blue-700 dark:text-blue-400";
                        bgColorClass = "bg-blue-100 dark:bg-blue-900/20";
                        ringColorClass = "ring-blue-400/40";
                        break;
                      case "Cancelled":
                        statusColorClass = "text-red-700 dark:text-red-400";
                        bgColorClass = "bg-red-100 dark:bg-red-900/20";
                        ringColorClass = "ring-red-400/40";
                        break;
                      case "Pending":
                        statusColorClass = "text-blue-700 dark:text-blue-300";
                        bgColorClass = "bg-blue-100 dark:bg-blue-900/20";
                        ringColorClass = "ring-blue-400/40";
                        break;
                      default:
                        statusColorClass = "text-gray-700 dark:text-gray-400";
                        bgColorClass = "bg-gray-100 dark:bg-gray-800/40";
                        ringColorClass = "ring-gray-300/30";
                        break;
                    }

                    return (
                      <div
                        key={order.SAPSalesOrderID}
                        className="w-full bg-white dark:bg-gray-900 shadow-md rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 relative transition-all"
                      >
                        {isAdmin &&
                          !isCanceled &&
                          !isPosted && ( // Show only if not already cancelled/posted/approved
                            <Button
                              onClick={() => setIsCancelModalOpen(true)}
                              variant="outline" // Use outlined variant for less prominence but still visible
                              disabled={isCancelling || disableAllInteractions} // Disable if already cancelling or general disable
                              className="min-w-[100px] px-2 py-1.5 text-base rounded-lg font-medium transition-colors duration-200 ease-in-out
                                    text-red-600 border border-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                                    dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
                            >
                              {isCancelling ? (
                                <span className="flex items-center">
                                  <FaSpinner
                                    size={20}
                                    color="inherit"
                                    className="animate-spin text-blue-500 text-xl -ml-1 mr-2"
                                  />
                                  Cancelling...
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <MdOutlineCancel className="h-5 w-5" /> Cancel
                                  Order
                                </span>
                              )}
                            </Button>
                          )}
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pt-6">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Sales Order #{order.SAPSalesOrderID}
                          </h3>
                          {!isCanceled || isCancelInstant ? (
                            <span
                              className={`
                                inline-flex items-center justify-center
                                font-semibold sm:text-sm lg:text-base
                                px-3 py-1 rounded-full
                                ${statusColorClass} ${bgColorClass} ${ringColorClass}
                                ring-2 shadow-sm
                                transition-all duration-300
                              `}
                            >
                              {currentStatus}
                            </span>
                          ) : (
                            <span
                              className={`
                                inline-flex items-center justify-center
                                font-semibold sm:text-sm lg:text-base
                                px-3 py-1 rounded-full
                                ${statusColorClass} ${bgColorClass} ${ringColorClass}
                                ring-2 shadow-sm
                                transition-all duration-300
                              `}
                            >
                              Cancelled
                            </span>
                          )}
                        </div>

                        {/* Info Grid - Existing 2-column layout (Product ID, Description, Quantities) */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          {[
                            { label: "Customer ID", value: order.CustomerID},
                            {
                              label: "Total Amount",
                              value: order.TotalAmount,
                            },
                            {
                                label: "Quantity",
                                value: order.SAPQuantity,
                            },
                          ].map((field, idx) => {

                            return (
                              <div
                              key={idx}
                             
                              className="flex items-start gap-x-2" 
                            >
                              <p className="font-semibold text-gray-600 dark:text-gray-400">
                                {field.label}:
                              </p>
                              <p className={`break-words flex-grow`}> 
                                {field.value}
                              </p>
                            </div>
                            );
                          })}
                        </div>                                   */}
                        {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6 items-end">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-12 gap-y-6">
                            
                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                              <label
                                htmlFor="SalesDate"
                                className="text-md font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Sales Date:
                              </label>
                              <input
                                type="date"
                                id="SalesDate"
                                value={salesDate || ""}
                                onChange={(e) =>
                                  setSalesDate(e.target.value)
                                }
                                required
                                disabled={isApproved || isCanceled}
                                className={`w-full px-3 py-2 rounded-md text-sm border focus:outline-none focus:ring-2 transition ${
                                  isApproved
                                    ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                    : "border-gray-300 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                }`}
                              />
                            </div>

                           
                            {isSalesOrderSynced && !isApproved && (
                              <div className="flex flex-col gap-1 w-full sm:w-auto lg:-mb-4 sm:mt-0 sm:mb-4">
                                {" "}
                               
                                <Button
                                  onClick={handleSaveEdits}
                                  variant="primary"
                                  disabled={
                                    isCanceled ||
                                    isApproved ||
                                    isSavingEdits ||
                                    !SalesOrderDetails
                                  }
                                  className={editSaveButtonClasses}
                                >
                                  {isSavingEdits ? (
                                    <FaSpinner className="animate-spin w-4 h-4" />
                                  ) : (
                                    <>
                                      <FaSave className="w-4 h-4" />
                                      <span>Save</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div> */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          {/* Left Column 1: Customer ID */}
                          <div className="flex items-start gap-x-2">
                            <p className="font-semibold text-gray-600 dark:text-gray-400">
                              Customer ID:
                            </p>
                            <p className="break-words flex-grow">
                              {order.CustomerID}
                            </p>
                          </div>

                          {/* Right Column 1: Total Amount */}
                          <div className="flex items-start gap-x-2">
                            <p className="font-semibold text-gray-600 dark:text-gray-400">
                              Total Amount:
                            </p>
                            <p className="break-words flex-grow">
                              {order.TotalAmount}
                            </p>
                          </div>

                          {/* Left Column 2: Quantity */}
                          <div className="flex items-start gap-x-2">
                            <p className="font-semibold text-gray-600 dark:text-gray-400">
                              Quantity:
                            </p>
                            <p className="break-words flex-grow">
                              {order.SAPQuantity}
                            </p>
                          </div>

                          {/* Right Column 2: Custom Div (e.g., Sales Date Input + Button) */}
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-12 gap-y-6">
                              {/* Sales Date Input */}
                              <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <label
                                  htmlFor="SalesDate"
                                  className="text-md font-semibold text-gray-700 dark:text-gray-300"
                                >
                                  Sales Date:
                                </label>
                                <input
                                  type="date"
                                  id="SalesDate"
                                  value={salesDate || ""}
                                  onChange={(e) => setSalesDate(e.target.value)}
                                  required
                                  disabled={isApproved || isCanceled}
                                  className={`w-full px-3 py-2 rounded-md text-sm border focus:outline-none focus:ring-2 transition ${
                                    isApproved
                                      ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                      : "border-gray-300 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                  }`}
                                />
                              </div>

                              {/* Save Button */}
                              {isSalesOrderSynced && !isApproved && (
                                <div className="flex flex-col gap-1 w-full sm:w-auto lg:-mb-4 sm:mt-0 sm:mb-4">
                                  <Button
                                    onClick={handleSaveEdits}
                                    variant="primary"
                                    disabled={
                                      isCanceled ||
                                      isApproved ||
                                      isSavingEdits ||
                                      !SalesOrderDetails
                                    }
                                    className={editSaveButtonClasses}
                                  >
                                    {isSavingEdits ? (
                                      <FaSpinner className="animate-spin w-4 h-4" />
                                    ) : (
                                      <>
                                        <FaSave className="w-4 h-4" />
                                        <span>Save</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {orderNumber &&
                isSalesOrderSynced &&
                !isFinished &&
                !isCanceled && (
                  <div className="w-full dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg space-y-6 mt-8">
                    <h5 className="text-lg font-bold text-gray-800 dark:text-white">
                      {editingIndex !== null ? "Update Entry" : "Add New Entry"}
                    </h5>
                    {/* Form fields: aligned horizontally on md+ screens */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                      {/* Shift Field */}

                      {/* Quantity Field */}
                      <div className={fieldWrapperClass}>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={quantitySales ?? ""}
                          onChange={handleChange}
                          onBlur={() => setHasInteractedWithQuantity(true)}
                          className={`${fieldBaseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-brand-500`}
                          disabled={isCanceled}
                        />
                      </div>

                      {/* Restricted Field */}
                      <div className={fieldWrapperClass}>
                        <select
                          value={productID}
                          onChange={(e) => setProductID(e.target.value)}
                          className={`${fieldBaseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-brand-500`}
                          disabled={isCanceled}
                        >
                          <option value="" disabled>
                            Select Product ID
                          </option>
                          <option value="AMST_33CL">AMST_33CL</option>
                          <option value="10375258Z">10375258Z</option>
                        </select>
                      </div>

                      {/* Add/Update Button */}
                      <div className={fieldWrapperClass}>
                        <Button
                          onClick={() =>
                            handleAddClick(
                              productID,
                              quantitySales ?? 0,
                              setProductID,
                              setQuantitySales,
                              //   setEditingIndex,
                              setShowNewInputFields,
                              setSalesOrderDetails,
                              editingDetailId
                            )
                          }
                          disabled={entryLoading || !orderNumber || isCanceled}
                          className={`lg:w-[80%] flex items-center justify-center gap-2 font-medium px-2 py-1 rounded-md shadow-md transition-all text-sm md:text-base ${
                            entryLoading || !orderNumber
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-brand-500 hover:bg-brand-600 text-white"
                          }`}
                        >
                          <FiPlus className="text-lg" />
                          {editingIndex !== null ? "Update Row" : "Add Row"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              {/* )} */}
            </div>

            {/* Display Sales Details Table */}
            {SalesOrderDetails &&
              SalesOrderDetails[0]?.SalesDetails &&
              SalesOrderDetails[0].SalesDetails.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-md mt-8 bg-white dark:bg-gray-900">
                  <h6 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white p-4">
                    Sales Details
                  </h6>

                  <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="px-4 py-3">Detail #</th>
                        <th className="px-4 py-3">Product ID</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Sales Date</th>
                        <th className="px-4 py-3">Stock ID</th>
                        <th className="px-4 py-3 w-36 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentSalesDetails.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-4 text-center">
                            No Sales details available.
                          </td>
                        </tr>
                      )}
                      {currentSalesDetails
                        .slice()
                        .reverse()
                        .map((detail, index) => {
                          const isEditing =
                            inlineEditingId === detail.SalesDetailID;
                          const currentDetail = isEditing
                            ? inlineEditedDetail
                            : detail;

                          if (!currentDetail) return null;

                          return (
                            <tr
                              key={detail.SalesDetailID || `new-${index}`}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                            >
                              <td className="px-4 py-3">{index + 1}</td>

                              <td className="px-4 py-2">
                                {isEditing ? (
                                  <select
                                    value={currentDetail.ProductID ?? ""}
                                    onChange={(e) =>
                                      handleInlineInputChange(
                                        "ProductID",
                                        e.target.value
                                      )
                                    }
                                    disabled={isCanceled}
                                    className="w-20 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="" disabled>
                                      Select Product ID
                                    </option>
                                    <option value="Yes">AMST_33CL</option>
                                    <option value="No">10375258Z</option>
                                  </select>
                                ) : (
                                  currentDetail.ProductID
                                )}
                              </td>

                              <td className="px-4 py-2">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    step="any"
                                    value={currentDetail.Quantity}
                                    onChange={(e) =>
                                      handleInlineInputChange(
                                        "Quantity",
                                        e.target.value
                                      )
                                    }
                                    disabled={isCanceled}
                                    className="w-25 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                ) : (
                                  currentDetail.Quantity
                                )}
                              </td>

                              <td className="px-6 py-4">
                                {formattedProductionDate()}
                              </td>
                              <td className="px-6 py-4">
                                {currentDetail.IdentifiedStockID}
                              </td>

                              <td className="px-4 py-2 w-36">
                                {" "}
                                {/* Added w-36 here as well */}
                                <div className="flex justify-center items-center gap-2">
                                  {" "}
                                  {/* Added flex, justify-center, items-center */}
                                  {isEditing ? (
                                    <>
                                      {/* These buttons are for "Save" and "Cancel" when actively editing.
            They should always be active during the inline edit flow. */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleInlineSave(index)}
                                        title="Save Edit"
                                        className="w-full"
                                        disabled={isCanceled}
                                      >
                                        {" "}
                                        {/* Added w-full */}
                                        <FaSave className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                          Save
                                        </span>
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleInlineCancel}
                                        title="Cancel Edit"
                                        className="w-full"
                                        disabled={isCanceled}
                                      >
                                        {" "}
                                        {/* Added w-full */}
                                        <FaTimes className="h-4 w-4 text-red-500 dark:text-yellow-400" />
                                        <span className="text-sm text-red-500 dark:text-green-400 font-medium">
                                          Cancel
                                        </span>
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      {/* Edit Button - Disabled if Sales order is finished */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleInlineEditClick(detail)
                                        }
                                        title="Edit"
                                        disabled={isFinished || isCanceled} // <--- Accurate disabling based on isFinishedStage
                                        className={`
                                        ${
                                          isFinished
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }
                                        // Add any other base classes for the edit button here if needed
                                      `}
                                      >
                                        <FaEdit className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                      </Button>

                                      {/* Delete Button - Disabled if Sales order is finished */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        title="Delete"
                                        disabled={isFinished || isCanceled}
                                        className={`
                                        ${
                                          isFinished
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }
                                        // Add any other base classes for the delete button here if needed
                                      `}
                                        onClick={() => {
                                          // This entire block will only execute if the button is NOT disabled,
                                          // but the 'disabled' prop is the primary control.
                                          if (detail.SalesDetailID) {
                                            confirmDelete(detail.SalesDetailID);
                                          } else {
                                            console.warn(
                                              "Cannot delete: ID missing"
                                            );
                                            toast.error(
                                              "Cannot delete: SalesDetailID is missing for this entry."
                                            );
                                          }
                                        }}
                                      >
                                        <FaTrash className="h-4 w-4 text-red-500 dark:text-red-400" />
                                      </Button>

                                      {/* Print Button - Always active (unless other conditions apply, which you didn't specify) */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        // onClick={() =>
                                        //   handleClick(
                                        //     currentDetail.IdentifiedStockID,
                                        //     currentDetail.CompletedQuantity,
                                        //     productDescription,
                                        //     orderNumber
                                        //   )
                                        // }
                                        disabled={isCanceled}
                                        title="Print"
                                        // No 'disabled' prop based on isFinishedStage, so it remains active
                                      >
                                        <FaPrint className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
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
              className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md space-y-6 relative"
                onClick={(e: any) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
                <h5 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
                  Enter Sales Order Number
                </h5>
                {findError && (
                  <Alert
                    variant="error"
                    title="Error"
                    message={`Sales Order not found.`}
                    style={{ marginBottom: "4px" }}
                  ></Alert>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Sales Order Number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    onClick={handleSearchClick}
                    startIcon={<FaSearch />}
                    disabled={searchLoading}
                    className={
                      searchLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-brand-500 hover:bg-brand-600 text-white"
                    }
                  >
                    Search
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Add UI Component */}
          {/* {isNewButtonEnabled && showNewInputFields && ( */}

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={cancelDelete}
            onConfirm={performDelete}
            title="Are you sure?"
            description="This action cannot be undone.  This will permanently delete this Sales detail."
          />
          <WarningModal
            show={showQuantityModal}
            onClose={() => setShowQuantityModal(false)}
            message={`You have entered a quantity that exceeds the planned order. Please note: ${quantityValidationMessage}`}
          />
          <ConfirmationFinishModal
            isOpen={isFinalModalOpen}
            onClose={() => setIsFinalModalOpen(false)}
            onConfirm={handleFinishSales}
            title="Confirm Finish Sales Order"
            description="Are you sure you want to finalize this Sales Order? This action cannot be reversed."
            confirmLabel="Finish"
            cancelLabel="Cancel"
          />
          <ConfirmationApprovalModal
            isOpen={isApproveModalOpen}
            onClose={() => setIsApproveModalOpen(false)}
            onConfirm={handleApproveSales}
            title="Confirm Approval"
            description="Are you sure you want to approve this Sales order? This action cannot be undone."
            isLoading={approveLoading}
          />
          {/* Drawer */}
          <PostToSAPModal
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onConfirm={handlePostToSAP}
            loading={posting}
            isPosted={isPosted}
          />

          {isCancelModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
              {/* Modal */}
              <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-3xl" />
                  <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Confirm Cancellation
                  </h2>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                  <p className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Are you sure you want to cancel Sales Order?
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    <span className="font-bold text-red-500">
                      This action is irreversible.
                    </span>{" "}
                    Cancelling this order will:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                    <li>
                      Prevent any further processing or completion of this
                      order.
                    </li>
                    <li>Mark the order as 'Cancelled' in the system.</li>
                    <li>Disable all related Sales actions for this order.</li>
                  </ul>

                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md flex items-start gap-3">
                    <FaBan className="text-red-500 dark:text-red-400 text-xl flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-300 font-medium text-sm">
                      Only proceed if you are absolutely certain this Sales
                      order should no longer be processed.
                    </p>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex justify-end items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    disabled={isCancelling}
                    className="text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                  >
                    No, Keep Order (Cancel)
                  </button>
                  <button
                    onClick={handleCancelSales}
                    disabled={isCancelling}
                    className="bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    {isCancelling ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Continuing...
                      </>
                    ) : (
                      "Yes, Continue (Cancel Order)"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SAPDataContext.Provider>
      <Toaster richColors />
    </>
  );
};

export default SalesOrderPage;
