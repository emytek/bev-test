import React, {
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
import { useUserAuth } from "../../../../context/auth/AuthContext";
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
  formatQuantity,
  formatDecimalQuantity,
  // formatDecimalQuantity,
} from "../../../../utils/idStockTime";
// For react-date-range
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format, parseISO } from "date-fns";
import { useAuth } from "../../../../hooks/useAuth";
import { isOrderFinalized } from "../../../../hooks/finishedState";
import Loader from "../../../ui/loader/Loader";
import { getProductionOrderStatus } from "../../../../utils/productionStatus";
import DynamicProductionButton from "../../../ui/button/DynamicBtn";
import { isValid } from "date-fns";
import { MdOutlineCancel } from "react-icons/md";
import {
  ProductionDetail,
  ProductionOrder,
  ProductionOrderProps,
} from "../../../../types/production/productionTypes";

// Context for SAP data
interface SAPDataContextType {
  sapData: ProductionOrder | null;
  setSapData: Dispatch<SetStateAction<ProductionOrder | null>>; // Changed to Dispatch
}

// Interface for the raw API response (jToken part)
// interface ApiResponseJToken {
//   SAPProductionOrderID: string;
//   SAPProductionOrderObjectID: string;
//   SAPProductionProposalID: string;
//   SAPProductionProposalObjectID: string;
//   SAPSupplyTaskID: string;
//   SAPMakeTaskID: string;
//   SAPProductID: string;
//   SAPProductDescription: string;
//   SAPPlannedQuantity: number;
//   CompletedQuantity: number; // This is the total completed quantity from SAP/Middleware
//   Machine: string | null;
//   ProductionDate: string | null;
//   UoMQuantityPallet: number;
//   // Potentially other fields for middleware response, e.g., StatusCode
//   StatusCode?: number; // Added for middleware check
//   ProductionDetails?: ProductionDetail[]; // Optional as it might not always be there
// }

enum ProductionStage {
  FINISH_PRODUCTION = "FINISH_PRODUCTION",
  APPROVE_PRODUCTION = "APPROVE_PRODUCTION",
  POST_TO_SAP = "POST_TO_SAP",
  COMPLETED = "COMPLETED",
  NONE = "NONE",
  CANCELLED = "CANCELLED",
}

const machineOptions = [
  { value: "", label: "Select Machine" },
  { value: "Machine 1", label: "Machine 1" },
  { value: "Machine 2", label: "Machine 2" },
  { value: "Machine 3", label: "Machine 3" },
  { value: "Machine 4", label: "Machine 4" },
];

// Zod schema for quantity validation
// const quantitySchema = z
//   .number()
//   .int()
//   .positive("Quantity must be a positive integer.");

const fieldBaseClass =
  "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition text-sm md:text-base";

const fieldWrapperClass = "flex flex-col w-full md:w-[180px]";

const SAPDataContext = createContext<SAPDataContextType | undefined>(undefined); // No default values

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADD_PRODUCTION_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/production/add-production-details`;
const EDIT_PRODUCTION_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/production/edit-production-details`;
const DELETE_PRODUCTION_DETAILS_ENDPOINT = `${API_BASE_URL}/api/v1/production/delete-production-details`;
const GET_PRODUCTION_ORDER_ENDPOINT = `${API_BASE_URL}/api/v1/production/get-production-order`;
const ADD_PRODUCTION_HEADERS_ENDPOINT = `${API_BASE_URL}/api/v1/production/add-production-header`;
const FINISH_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/finish-production`;
const APPROVE_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/approve-production`;
const POST_TO_SAP_ENDPOINT = `${API_BASE_URL}/api/v1/production/post-production`;
const EDIT_PRODUCTION_HEADER_ENDPOINT = `${API_BASE_URL}/api/v1/production/edit-production-header`;
const CANCEL_PRODUCTION_ENDPOINT = `${API_BASE_URL}/api/v1/production/cancel-production`;

const ProductionOrderPage: React.FC<ProductionOrderProps> = ({ onPrint }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFindSuccessful, setIsFindSuccessful] = useState(false);
  const [findError, setFindError] = useState<string | null>(null);
  const [productionOrderDetails, setProductionOrderDetails] = useState<
    ProductionOrder[] | null
  >(null);
  const [productDescription, setProductDescription] = useState<string | null>(
    null
  );
  // --- New state for input validation visibility ---
  const [_hasInteractedWithQuantity, setHasInteractedWithQuantity] =
    useState<boolean>(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [isSAPResponse, setIsSAPResponse] = useState<boolean>(false);
  const [sapData, setSapData] = useState<ProductionOrder | null>(null); // Use useState here
  const [detailToDelete, setDetailToDelete] = useState<string | null>(null);

  // State for "Add New Entry" section
  const { user } = useAuth();
  const { token } = useUserAuth();
  const [isNewButtonEnabled, setIsNewButtonEnabled] = useState(false);
  const [_showNewInputFields, setShowNewInputFields] = useState(false);
  const [uomQuantityPallet, setUomQuantityPallet] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [restricted, setRestricted] = useState("");
  const [_shift, setShift] = useState("M");
  // Initial states at the top of your component
  const [currentShiftSelection, setCurrentShiftSelection] =
    useState<string>("");
  const [_lastSuccessfulShift, setLastSuccessfulShift] = useState<string>(""); // Stores the last selected value
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
    useState<ProductionDetail | null>(null);
  const [quantityValidationMessage, setQuantityValidationMessage] =
    useState("");
  // State for the form inputs
  const [selectedProductionDate, setSelectedProductionDate] = useState<
    string | null
  >(null);
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
  const [_isFinalized, setIsFinalized] = useState<boolean>(false);

  // --- Key Quantities from SAP/Middleware Response ---
  const [productionHeaderIDData, setProductionHeaderIDData] =
    useState<string>("");
  const [sapPlannedQuantity, setSapPlannedQuantity] = useState<number>(0);
  const [initialCompletedQuantity, setInitialCompletedQuantity] =
    useState<number>(0);
  const [_uomData, setUomData] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isPosted, setIsPosted] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
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
  const [currentTotalCompletedQuantity, setCurrentTotalCompletedQuantity] =
    useState<number>(0);

  // ... other states
  const [isProductionOrderSynced, setIsProductionOrderSynced] =
    useState<boolean>(false);
  const [isEditHeader, setIsEditHeader] = useState(false);
  const [isSavingEdits, setIsSavingEdits] = useState(false);
  // Keep track of the original values for potential revert on error
  const [originalProductionDate, setOriginalProductionDate] = useState<
    string | null
  >(null);
  const [originalMachine, setOriginalMachine] = useState<string>("");
  const [_convertedPlannedQuantity, setConvertedPlannedQuantity] =
    useState<number>(0);

  const userIdData = user?.id;
  const userRole = user?.roles?.[0];

  // This boolean will control the button's visibility
  const isAdmin = userRole === "Production Supervisor";
  // Effect to check form completion
  useEffect(() => {
    // Form is completed if both fields have values AND it's a SAP response (meaning it needs syncing)
    setIsFormCompleted(
      !!selectedProductionDate && !!selectedMachine && isSAPResponse
    );
  }, [selectedProductionDate, selectedMachine, isSAPResponse]);

  useEffect(() => {
    if (userIdData && productionHeaderIDData) {
      const finalized = isOrderFinalized(userIdData, productionHeaderIDData);
      setIsFinalized(finalized);
    }
  }, [userIdData, productionHeaderIDData]);

  useEffect(() => {
    if (isFindSuccessful) {
      const timer = setTimeout(() => {
        setSuccessAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFindSuccessful]);

  useEffect(() => {
    setQuantity(uomQuantityPallet);
  }, [uomQuantityPallet]);
  
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuantity(e.target.value);
  //   const newQuantity = Number(e.target.value);

  //   // Calculate the potential new total completed quantity
  //   let potentialNewTotal = currentTotalCompletedQuantity;
  //   if (
  //     editingIndex !== null &&
  //     productionOrderDetails &&
  //     productionOrderDetails[0]?.ProductionDetails
  //   ) {
  //     // If in edit mode, subtract the old quantity of the item being edited
  //     const oldDetail =
  //       productionOrderDetails[0].ProductionDetails[editingIndex];
  //     if (oldDetail) {
  //       potentialNewTotal -= oldDetail.CompletedQuantity;
  //     }
  //   }
  //   // Add the new quantity from the input field
  //   potentialNewTotal += newQuantity;

  //   if (sapPlannedQuantity > 0 && potentialNewTotal > sapPlannedQuantity) {
  //     setQuantityValidationMessage(
  //       `The planned quantity for this order is ${formatQuantity(
  //         sapPlannedQuantity
  //       )}.`
  //     );
  //     setShowQuantityModal(true);
  //   }
  //   // Determine the relevant planned quantity for validation based on QuantityUnitCode
  //   // const orderUnitCode = productionOrderDetails?.[0]?.QuantityUnitCode;

  //   // // Determine the planned quantity to use for the comparison
  //   // let plannedQuantityToCompare: number = 0; // Initialize with a default value

  //   // if (orderUnitCode === "MIL") {
  //   //   // If the unit is "MIL", use the already calculated convertedPlannedQuantity
  //   //   plannedQuantityToCompare = convertedPlannedQuantity;
  //   // } else {
  //   //   // Otherwise, use the original sapPlannedQuantity
  //   //   plannedQuantityToCompare = sapPlannedQuantity;
  //   // }

  //   // // Now, apply the validation using the 'plannedQuantityToCompare'
  //   // if (
  //   //   plannedQuantityToCompare > 0 &&
  //   //   calculateTotalCompletedQuantity > plannedQuantityToCompare
  //   // ) {
  //   //   setQuantityValidationMessage(
  //   //     `The total completed quantity will exceed the planned quantity of ${formatQuantity(
  //   //       plannedQuantityToCompare // Use the correctly chosen value for the message
  //   //     )} if this entry is added/updated.`
  //   //   );
  //   //   setShowQuantityModal(true);
  //   // }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = value === "" ? null : Number(value);
    setQuantity(parsed);
  
    const newQuantity = parsed ?? 0;
  
    let potentialNewTotal = currentTotalCompletedQuantity;
  
    if (
      editingIndex !== null &&
      productionOrderDetails &&
      productionOrderDetails[0]?.ProductionDetails
    ) {
      const oldDetail =
        productionOrderDetails[0].ProductionDetails[editingIndex];
      if (oldDetail) {
        potentialNewTotal -= oldDetail.CompletedQuantity;
      }
    }
  
    potentialNewTotal += newQuantity;
  
    if (sapPlannedQuantity > 0 && potentialNewTotal > sapPlannedQuantity) {
      setQuantityValidationMessage(
        `The planned quantity for this order is ${formatQuantity(
          sapPlannedQuantity
        )}.`
      );
      setShowQuantityModal(true);
    }
  };
  
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading production orders: {error}</div>;
  }

  console.log(isNewButtonEnabled);
  // console.log(user?.id, "USER Auth")

  const handleFindClick = () => {
    setIsModalOpen(true);
    setIsFindSuccessful(false);
    setFindError(null);
    setSearchQuery("");
    // setProductionOrderDetails(null);
    // setIsSAPResponse(true);
    // setSapData(null);
    setIsNewButtonEnabled(false); // Reset "New" button state
    setShowNewInputFields(false);
    setQuantity(uomQuantityPallet);
    setRestricted("");
    setShift("M");
    setEditingIndex(null);
  };

  const fetchProductionOrderDetails = useCallback(
    async (orderNumber: string) => {
      try {
        setOrderNumber(orderNumber);
        setProductionOrderDetails(null);
        setSapData(null);
        setProductDescription(null);
        // setSelectedProductionDate(null);
        setSelectedMachine("");
        setIsSAPResponse(false);
        setIsProductionOrderSynced(false);
        setIsFinished(false);
        setIsApproved(false);
        setIsPosted(false);
        setIsCancelled(false);
        setSapPlannedQuantity(0);
        setUomQuantityPallet(0);
        setInitialCompletedQuantity(0);
        setCurrentTotalCompletedQuantity(0);
        setUomData(0);
        setProductionHeaderIDData(""); 
        setOriginalProductionDate(null);
        setOriginalMachine("");
        setIsEditHeader(false);
        setConvertedPlannedQuantity(0);

        const response = await axiosInstance.get(
          `${GET_PRODUCTION_ORDER_ENDPOINT}?productionOrderID=${orderNumber}`
        );

        const isFromMiddleware = response.data.jToken?.StatusCode !== undefined;
        // setIsSAPResponse is for showing/hiding the Sync button (true if from SAP)
        setIsSAPResponse(!isFromMiddleware);

        // *** NEW: Set isProductionOrderSynced based on data source ***
        // If it's from middleware, it means it's already synced.
        // If it's from SAP, it's NOT synced yet.
        setIsProductionOrderSynced(isFromMiddleware);

        // This 'adaptedData' will hold the unified structure, regardless of source
        let adaptedData: ProductionOrder;

        if (!isFromMiddleware) {
          // Data directly from SAP
          setSapData(response.data.jToken); // Store raw SAP data for sync
          // Set the key quantities here!

          adaptedData = {
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
            Machine: response.data.jToken.Machine || "",
            ProductionDate: response.data.jToken.ProductionDate || "",
            UoMQuantityPallet: response.data.jToken.UoMQuantityPallet,
            QuantityUnitCode: response.data.jToken.QuantityUnitCode,
            isFinished: response.data.jToken.isFinished,
            isApproved: response.data.jToken.isApproved,
            IsPosted: response.data.jToken.IsPosted,
            isCanceled: response.data.jToken.isCanceled,
          };
        } else {
          // Data from Middleware DB (which includes synced data)
          adaptedData = {
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
            Machine: response.data.jToken.Machine || "",
            ProductionDate: response.data.jToken.ProductionDate || "",
            UoMQuantityPallet: response.data.jToken.UoMQuantityPallet,
            QuantityUnitCode: response.data.jToken.QuantityUnitCode,
            isFinished: response.data.jToken.isFinished,
            isApproved: response.data.jToken.isApproved,
            IsPosted: response.data.jToken.IsPosted,
            isCanceled: response.data.jToken.isCanceled,
          };
        }

        setProductionOrderDetails([adaptedData]);
        setProductDescription(adaptedData.SAPProductDescription);
        setProductionHeaderIDData(adaptedData.ProductionHeaderID);
        setIsFinished(adaptedData.isFinished);
        setIsApproved(adaptedData.isApproved);
        setIsPosted(adaptedData.IsPosted);
        setIsCancelled(adaptedData.isCanceled);
        setSapPlannedQuantity(response.data.jToken.SAPPlannedQuantity);
        setUomQuantityPallet(response.data.jToken.UoMQuantityPallet);
        setInitialCompletedQuantity(response.data.jToken.CompletedQuantity);
        setUomData(adaptedData.UoMQuantityPallet);

        // --- Calculate and set the convertedPlannedQuantity ---
        // let calculatedConvertedPlannedQuantity = adaptedData.SAPPlannedQuantity;
        // if (adaptedData.QuantityUnitCode === "MIL") {
        //   calculatedConvertedPlannedQuantity =
        //     adaptedData.SAPPlannedQuantity * 1000;
        // }
        // setConvertedPlannedQuantity(calculatedConvertedPlannedQuantity);

        // Recalculate and set the currentTotalCompletedQuantity after fetching
        const sumOfDetails = adaptedData.ProductionDetails?.reduce(
          (sum, detail) => sum + detail.CompletedQuantity,
          0
        );
        setCurrentTotalCompletedQuantity(sumOfDetails || 0);

        if (adaptedData.ProductionDate) {
          const date = parseISO(adaptedData.ProductionDate);
          if (isValid(date)) {
            setSelectedProductionDate(format(date, "yyyy-MM-dd"));
            setOriginalProductionDate(format(date, "yyyy-MM-dd"));
          } else {
            setSelectedProductionDate(null);
            setOriginalProductionDate(null);
          }
        } else {
          setSelectedProductionDate(null);
          setOriginalProductionDate(null);
        }
        setSelectedMachine(adaptedData.Machine || "");
        setOriginalMachine(adaptedData.Machine || "");

        return response.data;
      } catch (error: any) {
        setProductionOrderDetails(null);
        setSapData(null);
        setProductDescription(null);
        setSelectedProductionDate(null);
        setSelectedMachine("");
        setIsSAPResponse(false);
        setIsProductionOrderSynced(false);
        setOriginalProductionDate(null);
        setOriginalMachine("");
        setIsEditHeader(false);
        setConvertedPlannedQuantity(0);
        toast.error(
          error.message || "Failed to fetch production order details"
        );
        throw new Error(
          error.message || "Failed to fetch production order details"
        );
      }
    },
    [
      setOrderNumber,
      setSapData,
      setProductionOrderDetails,
      setProductDescription,
      setIsSAPResponse,
      setSelectedProductionDate,
      setSelectedMachine,
      setIsProductionOrderSynced,
      setConvertedPlannedQuantity,
    ]
  );

  useEffect(() => {
    if (orderNumber) {
      fetchProductionOrderDetails(orderNumber);
    }
  }, [orderNumber, fetchProductionOrderDetails]);

  const handleSearchClick = async () => {
    setFindError(null);
    setSearchLoading(true);
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
      setSearchLoading(false);
      setIsNewButtonEnabled(true);
      setShowNewInputFields(false);
      setQuantity(uomQuantityPallet);
      setRestricted("");
      setShift("M");
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
        "No data to synchronize. Please fetch a SAP production order first."
      );
      return;
    }

    if (!selectedProductionDate) {
      toast.error("Please select a Production Date.");
      return;
    }

    if (!selectedMachine) {
      toast.error("Please select a Machine.");
      return;
    }

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    // Convert the YYYY-MM-DD string from the input to an ISO string for the backend
    const dateAsISOString = new Date(selectedProductionDate).toISOString();

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
        sapPlannedQuantity: sapPlannedQuantity,
        completedQuantity: initialCompletedQuantity,
        machine: selectedMachine,
        productionDate: dateAsISOString,
        uoMQuantityPallet: uomQuantityPallet,
        quantityUnitCode: sapData.QuantityUnitCode,
      },
    ];

    console.log("sapData.UoMQuantityPallet:", sapData.UoMQuantityPallet);

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
      setIsProductionOrderSynced(true);
      if (response.data && response.data.productionHeaderID) {
        setProductionHeaderIDData(response.data.productionHeaderID);
      } else {
        console.warn(
          "Backend did not return new ProductionHeaderID after sync. Consider re-fetching."
        );
        await fetchProductionOrderDetails(sapData.SAPProductionOrderID);
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while synchronizing data."
      );
    }
  };

  const handleSaveEdits = async () => {
    if (!productionHeaderIDData) {
      toast.error("Production Header ID is missing for saving edits.");
      return;
    }

    // Basic validation before saving
    if (!selectedProductionDate) {
      toast.error("Production Date cannot be empty.");
      return;
    }
    if (!selectedMachine) {
      toast.error("Machine cannot be empty.");
      return;
    }

    setIsSavingEdits(true);

    // Format date for API payload
    const formattedDateForAPI = selectedProductionDate
      ? format(parseISO(selectedProductionDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
      : "";

    try {
      const payload = {
        productionHeaderID: productionHeaderIDData,
        productionDate: formattedDateForAPI,
        machine: selectedMachine,
      };

      const response = await axiosInstance.post(
        EDIT_PRODUCTION_HEADER_ENDPOINT,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Record updated successfully!");
        // Update original values to reflect the newly saved state
        setOriginalProductionDate(selectedProductionDate);
        setOriginalMachine(selectedMachine);
        setIsEditHeader(false); // Exit edit mode on success
        // Optionally, re-fetch to ensure the main productionOrderDetails object is in sync
        // await fetchProductionOrderDetails(actualOrderNumber);
      } else {
        throw new Error("Unexpected server response during edit save.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to save changes.";
      toast.error(`Error saving: ${message}`);
      // On error, revert the selected values back to their original fetched state
      setSelectedProductionDate(originalProductionDate);
      setSelectedMachine(originalMachine);
      setIsEditHeader(false);
    } finally {
      setIsSavingEdits(false);
    }
  };

  const successAlertProps: AlertProps = {
    variant: "success",
    title: "Success",
    message: `Production Order found.`,
  };

  // Calculate the total completed quantity from the ProductionDetails array
  const calculateTotalCompletedQuantity = useMemo(() => {
    if (
      !productionOrderDetails ||
      !productionOrderDetails[0]?.ProductionDetails
    ) {
      return 0;
    }
    return productionOrderDetails[0].ProductionDetails.reduce(
      (sum, detail) => sum + detail.CompletedQuantity,
      0
    );
  }, [productionOrderDetails]);

  useEffect(() => {
    setCurrentTotalCompletedQuantity(calculateTotalCompletedQuantity);
  }, [calculateTotalCompletedQuantity]);

  const handleCancelProduction = async () => {
    if (!productionHeaderIDData) {
      toast.error("Production Header ID is missing for cancellation.");
      setIsCancelModalOpen(false);
      return;
    }

    setIsCancelling(true);
    try {
      const url = `${CANCEL_PRODUCTION_ENDPOINT}?productionHeaderID=${productionHeaderIDData}&userID=${userIdData}`;
      const response = await axiosInstance.post(url);

      if (response.status === 200 || response.status === 201) {
        toast.success("Production order successfully cancelled!");
        setIsCancelled(true);
        setIsCancelInstant(true);
        setIsCancelModalOpen(false); // Close the modal
        // Optionally, refetch to confirm state from backend, but optimistic update is faster
        // fetchProductionOrderDetails(actualOrderNumber);
      } else {
        throw new Error("Unexpected server response during cancellation.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to cancel production order.";
      toast.error(`Error cancelling: ${message}`);
      setIsCancelModalOpen(false); // Close modal on error
    } finally {
      setIsCancelling(false); // Reset loading state
    }
  };

  const handleAddClick = async (
    quantity: number | null,
    restricted: string,
    _shiftToUse: string,
    setQuantity: (value: number | null) => void,
    setRestricted: (value: string) => void,
    setEditingIndex: (value: number | null) => void,
    setShowNewInputFields: (value: boolean) => void,
    setProductionOrderDetails: React.Dispatch<
      React.SetStateAction<ProductionOrder[] | null>
    >,
    editingDetailId?: string
  ) => {
    const delayTime = 1500; 

    if (!quantity || !restricted || !currentShiftSelection) {
      toast.error("Please complete the form.");
      return;
    }
    setEntryLoading(true);

    const numericQuantity = Number(quantity);

    let oldQuantity = 0;
    if (
      editingIndex !== null &&
      productionOrderDetails &&
      productionOrderDetails[0]?.ProductionDetails
    ) {
      oldQuantity =
        productionOrderDetails[0].ProductionDetails[editingIndex]
          .CompletedQuantity;

      void oldQuantity; 
    }

    // Calculate the total completed quantity including the current addition/edit
    let calculatedTotalCompletedQuantity = 0;
    if (
      productionOrderDetails &&
      productionOrderDetails[0]?.ProductionDetails
    ) {
      calculatedTotalCompletedQuantity =
        productionOrderDetails[0].ProductionDetails.reduce((sum, detail) => {
          if (
            editingIndex !== null &&
            detail.ProductionDetailID === editingDetailId
          ) {
            // If editing, use the new numericQuantity for this specific detail
            return sum + numericQuantity;
          }
          return sum + detail.CompletedQuantity;
        }, 0);

      if (editingIndex === null) {
        // If adding a new row
        calculatedTotalCompletedQuantity += numericQuantity;
      }
    } else {
      // No existing production details
      calculatedTotalCompletedQuantity = numericQuantity;
    }

    if (
      sapPlannedQuantity > 0 &&
      calculatedTotalCompletedQuantity > sapPlannedQuantity
    ) {
      setQuantityValidationMessage(
        `The total completed quantity will exceed the planned quantity of ${formatQuantity(
          sapPlannedQuantity
        )} if this entry is added/updated.`
      );
      setShowQuantityModal(true);
    }
    // const orderUnitCode = productionOrderDetails?.[0]?.QuantityUnitCode;

    // // Determine the planned quantity to use for the comparison
    // let plannedQuantityToCompare: number = 0; // Initialize with a default value

    // if (orderUnitCode === "MIL") {
    //   // If the unit is "MIL", use the already calculated convertedPlannedQuantity
    //   plannedQuantityToCompare = convertedPlannedQuantity;
    // } else {
    //   // Otherwise, use the original sapPlannedQuantity
    //   plannedQuantityToCompare = sapPlannedQuantity;
    // }

    // if (
    //   plannedQuantityToCompare > 0 &&
    //   calculatedTotalCompletedQuantity > plannedQuantityToCompare
    // ) {
    //   setQuantityValidationMessage(
    //     `The total completed quantity will exceed the planned quantity of ${formatQuantity(
    //       plannedQuantityToCompare // Use the correctly chosen value for the message
    //     )} if this entry is added/updated.`
    //   );
    //   setShowQuantityModal(true);
    // }

    const newDetailToSend: Omit<
      ProductionDetail,
      "ProductionDetailID" | "ProductionHeaderID"
    > = {
      ProductionDate: formattedDateTime(),
      Shift: currentShiftSelection,
      isRestricted: restricted,
      CompletedQuantity: numericQuantity,
      IdentifiedStockID: getFormattedIdentifiedStockID(),
    };

    try {
      let response: any;
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      if (editingIndex !== null && editingDetailId) {
        // Edit Path
        const editPayload = {
          productionDetailID: editingDetailId,
          productionDate: formattedDateTime(),
          shift: currentShiftSelection,
          isRestricted: restricted,
          completedQuantity: numericQuantity,
          identifiedStockID: getFormattedIdentifiedStockID(),
        };

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
            ProductionDate: formattedDateTime(),
            Shift: currentShiftSelection,
            isRestricted: restricted,
            CompletedQuantity: numericQuantity, 
            IdentifiedStockID: getFormattedIdentifiedStockID(),
          };

          const newTotal = updatedDetails.reduce(
            (sum, detail) => sum + detail.CompletedQuantity,
            0
          );
          setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

          console.log(
            "Production detail updated in state:",
            updatedDetails[editingIndex]
          );
          return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
        });
        toast.success("Production detail updated successfully!");
        setEntryLoading(false);
        // --- Added delay before printing for edit path ---
        await new Promise((resolve) => setTimeout(resolve, delayTime));
        onPrint(
          newDetailToSend.IdentifiedStockID,
          numericQuantity,
          productDescription,
          orderNumber
        );
      } else {
        // Add new detail
        const payload = [
          {
            sapProductionOrderID: orderNumber,
            productionDetails: [newDetailToSend],
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

            const newTotal = updatedDetails.reduce(
              (sum, detail) => sum + detail.CompletedQuantity,
              0
            );
            setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

            return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
          });
          toast.success("Production detail added successfully.");
          setEntryLoading(false);
          // --- Added delay before printing for add path ---
          await new Promise((resolve) => setTimeout(resolve, delayTime));
          onPrint(
            newDetailToSend.IdentifiedStockID,
            numericQuantity,
            productDescription,
            orderNumber
          );
        } else {
          console.error(
            "Error: New Production Detail ID not received from backend."
          );
          toast.error("Failed to add production detail: ID not received.");
        }
      }

      setQuantity(uomQuantityPallet);
      setRestricted("No");
      setEditingIndex(null);
      setEditingDetailId(undefined); // Clear editing detail ID
      setShowNewInputFields(false);
    } catch (error: any) {
      console.error("Error during add/update operation:", error);
      toast.error(error.message || "Failed to add production detail");
      setEntryLoading(false);
    }
  };

  // Handles starting inline edit
  const handleInlineEditClick = useCallback((detail: ProductionDetail) => {
    setInlineEditingId(detail.ProductionDetailID || null);

    // Ensure all fields are properly defaulted
    setInlineEditedDetail({
      ...detail,
      CompletedQuantity: detail.CompletedQuantity ?? 0,
      isRestricted: detail.isRestricted ?? "No",
      Shift: detail.Shift ?? "",
    });

    setShowNewInputFields(false);
    setEditingIndex(null);
    setEditingDetailId(undefined);
  }, []);

  const handleInlineInputChange = (
    field: keyof ProductionDetail,
    value: any
  ) => {
    if (inlineEditedDetail) {
      const updatedDetail = { ...inlineEditedDetail, [field]: value };
      setInlineEditedDetail(updatedDetail);

      if (field === "CompletedQuantity") {
        const newQuantity = Number(value);
        let currentDetailsTotal = 0;
        if (
          productionOrderDetails &&
          productionOrderDetails[0]?.ProductionDetails
        ) {
          currentDetailsTotal =
            productionOrderDetails[0].ProductionDetails.reduce(
              (sum, detail) => {
                if (detail.ProductionDetailID === inlineEditingId) {
                  return sum + newQuantity; // Use the new value for the currently edited item
                }
                return sum + detail.CompletedQuantity;
              },
              0
            );
        }

        if (
          sapPlannedQuantity > 0 &&
          currentDetailsTotal > sapPlannedQuantity
        ) {
          setQuantityValidationMessage(
            `The total completed quantity will exceed the planned quantity of ${formatQuantity(
              sapPlannedQuantity
            )}. ` +
              `Current total: ${formatQuantity(
                currentDetailsTotal
              )}. Planned: ${formatQuantity(sapPlannedQuantity)}`
          );
          setShowQuantityModal(true);
        }
      }
    }
  };

  // Handles saving inline changes
  // const handleInlineSave = useCallback(
  //   (originalIndex: number) => {
  //     if (!inlineEditedDetail) return;

  //     handleAddOrUpdateClick(
  //       inlineEditedDetail.CompletedQuantity,
  //       inlineEditedDetail.isRestricted ?? "", // Provide default if null/undefined
  //       inlineEditedDetail.Shift ?? "", // Provide default if null/undefined
  //       inlineEditedDetail.ProductionDetailID,
  //       originalIndex
  //     );
  //   },
  //   [inlineEditedDetail, handleAddOrUpdateClick]
  // );

  const handleInlineSave = async (index: number) => {
    if (!inlineEditedDetail || !inlineEditingId) return;

    setEntryLoading(true);

    const numericQuantity = Number(inlineEditedDetail.CompletedQuantity);

    // Recalculate total for validation
    let currentDetailsTotal = 0;
    if (
      productionOrderDetails &&
      productionOrderDetails[0]?.ProductionDetails
    ) {
      currentDetailsTotal = productionOrderDetails[0].ProductionDetails.reduce(
        (sum, detail, idx) => {
          if (idx === index) {
            // Use the new value for the currently edited item
            return sum + numericQuantity;
          }
          return sum + detail.CompletedQuantity;
        },
        0
      );
    }

    if (sapPlannedQuantity > 0 && currentDetailsTotal > sapPlannedQuantity) {
      setQuantityValidationMessage(
        `The total completed quantity will exceed the planned quantity of ${formatQuantity(
          sapPlannedQuantity
        )} if this entry is saved.`
      );
      setShowQuantityModal(true);
      // Proceed with save as per requirement
    }
    // const orderUnitCode = productionOrderDetails?.[0]?.QuantityUnitCode;

    // // Determine the planned quantity to use for the comparison
    // let plannedQuantityToCompare: number = 0; // Initialize with a default value

    // if (orderUnitCode === "MIL") {
    //   // If the unit is "MIL", use the already calculated convertedPlannedQuantity
    //   plannedQuantityToCompare = convertedPlannedQuantity;
    // } else {
    //   // Otherwise, use the original sapPlannedQuantity
    //   plannedQuantityToCompare = sapPlannedQuantity;
    // }
    // // Now, apply the validation using the 'plannedQuantityToCompare'
    // if (
    //   plannedQuantityToCompare > 0 &&
    //   currentDetailsTotal > plannedQuantityToCompare
    // ) {
    //   setQuantityValidationMessage(
    //     `The total completed quantity will exceed the planned quantity of ${formatQuantity(
    //       plannedQuantityToCompare // Use the correctly chosen value for the message
    //     )} if this entry is added/updated.`
    //   );
    //   setShowQuantityModal(true);
    // }

    const editPayload = {
      productionDetailID: inlineEditingId,
      productionDate: inlineEditedDetail.ProductionDate, // Assuming date is handled elsewhere or from detail
      shift: inlineEditedDetail.Shift,
      isRestricted: inlineEditedDetail.isRestricted,
      completedQuantity: numericQuantity,
      identifiedStockID: inlineEditedDetail.IdentifiedStockID,
    };

    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axiosInstance.post(
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
        updatedDetails[index] = {
          ...inlineEditedDetail,
          CompletedQuantity: numericQuantity,
        }; // Ensure numeric quantity is saved

        const newTotal = updatedDetails.reduce(
          (sum, detail) => sum + detail.CompletedQuantity,
          0
        );
        setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

        return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
      });
      toast.success("Production detail updated successfully!");
      setInlineEditingId(null);
      setInlineEditedDetail(null);
    } catch (error: any) {
      console.error("Error during inline update operation:", error);
      toast.error(error.message || "Failed to update production detail");
    } finally {
      setEntryLoading(false);
    }
  };

  // Handles cancelling inline changes
  const handleInlineCancel = useCallback(() => {
    setInlineEditingId(null);
    setInlineEditedDetail(null);
  }, []);

  useEffect(() => {
    if (sapPlannedQuantity > 0) {
      const currentDetailsTotal = calculateTotalCompletedQuantity; // Use the memoized value

      if (currentDetailsTotal > sapPlannedQuantity) {
        setQuantityValidationMessage(
          `The total completed quantity (${formatQuantity(
            currentDetailsTotal
          )}) currently exceeds the planned quantity (${formatQuantity(
            sapPlannedQuantity
          )}).`
        );
        setShowQuantityModal(true);
      } else {
        setShowQuantityModal(false);
      }
    }
  }, [
    productionOrderDetails,
    sapPlannedQuantity,
    calculateTotalCompletedQuantity,
  ]);

  const currentProductionDetails =
    productionOrderDetails && productionOrderDetails[0]?.ProductionDetails
      ? productionOrderDetails[0].ProductionDetails
      : [];

  // const handleDeleteDetail = async (
  //   productionDetailID: string,
  //   setProductionOrderDetails: React.Dispatch<
  //     React.SetStateAction<ProductionOrder[] | null>
  //   >
  // ) => {
  //   console.log("Delete Click!");
  //   try {
  //     const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  //     const payload = {
  //       productionDetailID: productionDetailID,
  //     };

  //     const response = await axiosInstance.post(
  //       // Use axiosInstance
  //       `${DELETE_PRODUCTION_DETAILS_ENDPOINT}?key=${productionDetailID}`,
  //       payload,
  //       {
  //         headers: {
  //           ...authHeader,
  //         },
  //       }
  //     );

  //     if (response.status >= 400) {
  //       throw new Error(
  //         response.data?.message || "Failed to delete production detail."
  //       );
  //     }

  //     setProductionOrderDetails((prevDetails) => {
  //       if (
  //         !prevDetails ||
  //         !Array.isArray(prevDetails) ||
  //         !prevDetails[0]?.ProductionDetails
  //       ) {
  //         return prevDetails;
  //       }
  //       const updatedDetails = prevDetails[0].ProductionDetails.filter(
  //         (detail) => detail.ProductionDetailID !== productionDetailID
  //       );

  //       const newTotal = updatedDetails.reduce(
  //         (sum, detail) => sum + detail.CompletedQuantity,
  //         0
  //       );
  //       setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

  //       // Check against planned quantity after deletion (less likely to exceed, but good for consistency)
  //       if (sapPlannedQuantity > 0 && newTotal > sapPlannedQuantity) {
  //         setQuantityValidationMessage(
  //           `Even after deleting this entry, the total completed quantity (${formatQuantity(
  //             newTotal
  //           )}) still exceeds the planned quantity (${formatQuantity(
  //             sapPlannedQuantity
  //           )}).`
  //         );
  //         setShowQuantityModal(true);
  //       } else {
  //         setShowQuantityModal(false); // Hide if it falls within limits
  //       }

  //       return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
  //     });

  //     setProductionOrderDetails((prevDetails) => {
  //       if (
  //         !prevDetails ||
  //         !Array.isArray(prevDetails) ||
  //         !prevDetails[0]?.ProductionDetails
  //       ) {
  //         return prevDetails; // Or return [], handle as appropriate
  //       }
  //       const updatedDetails = prevDetails[0].ProductionDetails.filter(
  //         (detail) => detail.ProductionDetailID !== productionDetailID
  //       );

  //       // Check if updatedDetails is empty.  If so, you might want to remove the entire order.
  //       if (updatedDetails.length === 0) {
  //         // Remove the ProductionOrder if there are no more ProductionDetails
  //         return prevDetails.length > 0 ? prevDetails.slice(1) : null;
  //       }

  //       return [{ ...prevDetails[0], ProductionDetails: updatedDetails }];
  //     });

  //     toast.success("Production detail deleted successfully.");
  //   } catch (error: any) {
  //     console.error("Error deleting production detail:", error);
  //     toast.error(error.message || "Failed to delete production detail");
  //   }
  // };

  const handleDeleteDetail = async (
    productionDetailID: string,
    setProductionOrderDetails: React.Dispatch<
      React.SetStateAction<ProductionOrder[] | null>
    >
  ) => {
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = {
        productionDetailID: productionDetailID,
      };

      const response = await axiosInstance.post(
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

      // --- CONSOLIDATE STATE UPDATE LOGIC ---
      setProductionOrderDetails((prevDetails) => {
        // If there are no previous details or it's not an array with at least one order,
        // just return the current state.
        if (
          !prevDetails ||
          !Array.isArray(prevDetails) ||
          prevDetails.length === 0
        ) {
          return prevDetails;
        }

        // Assuming you always display a single ProductionOrder at index 0
        const currentOrder = prevDetails[0];
        const currentProductionDetails = currentOrder.ProductionDetails || [];

        // Filter out the deleted detail
        const updatedDetails = currentProductionDetails.filter(
          (detail) => detail.ProductionDetailID !== productionDetailID
        );

        // Calculate the new total completed quantity
        const newTotal = updatedDetails.reduce(
          (sum, detail) => sum + detail.CompletedQuantity,
          0
        );
        setCurrentTotalCompletedQuantity(newTotal); // Update the total completed quantity

        // Update quantity validation message based on new total
        if (sapPlannedQuantity > 0 && newTotal > sapPlannedQuantity) {
          setQuantityValidationMessage(
            `Even after deleting this entry, the total completed quantity (${formatQuantity(
              newTotal
            )}) still exceeds the planned quantity (${formatQuantity(
              sapPlannedQuantity
            )}).`
          );
          setShowQuantityModal(true);
        } else {
          setShowQuantityModal(false); // Hide if it falls within limits
        }
        // const orderUnitCode = productionOrderDetails?.[0]?.QuantityUnitCode;

        // // Determine the planned quantity to use for the comparison
        // let plannedQuantityToCompare: number = 0; // Initialize with a default value

        // if (orderUnitCode === "MIL") {
        //   // If the unit is "MIL", use the already calculated convertedPlannedQuantity
        //   plannedQuantityToCompare = convertedPlannedQuantity;
        // } else {
        //   // Otherwise, use the original sapPlannedQuantity
        //   plannedQuantityToCompare = sapPlannedQuantity;
        // }

        // // Now, apply the validation using the 'plannedQuantityToCompare'
        // if (
        //   plannedQuantityToCompare > 0 &&
        //   newTotal > plannedQuantityToCompare
        // ) {
        //   setQuantityValidationMessage(
        //     `The total completed quantity will exceed the planned quantity of ${formatQuantity(
        //       plannedQuantityToCompare // Use the correctly chosen value for the message
        //     )} if this entry is added/updated.`
        //   );
        //   setShowQuantityModal(true);
        // }

        // Return a new state where the first ProductionOrder object remains,
        // but its ProductionDetails array is updated (potentially empty).
        return [{ ...currentOrder, ProductionDetails: updatedDetails }];
      });

      toast.success("Production detail deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting production detail:", error);
      toast.error(error.message || "Failed to delete production detail");
    }
  };
 
  const handleFinishProduction = async () => {
    setFinalLoading(true);
    setFinalError(null);
    setFinalSuccessMessage(null);
    try {
      const url = `${FINISH_PRODUCTION_ENDPOINT}?productionHeaderID=${productionHeaderIDData}&userID=${userIdData}`;
      const response = await axiosInstance.post(url);

      if (response.status === 200 || response.status === 201) {
        setFinalSuccessMessage("Production order successfully finalized.");
        toast.success(
          "Production order finalized. All entries have been saved."
        );
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
      toast.error("Failed to finish production order. Please try again.");
    } finally {
      setFinalLoading(false);
    }
  };

  const handleApproveProduction = async () => {
    setApproveLoading(true);
    setApproveError(null);
    try {
      const url = `${APPROVE_PRODUCTION_ENDPOINT}?productionHeaderID=${productionHeaderIDData}&userID=${userIdData}`;
      const response = await axiosInstance.post(url);

      if (response.status === 200 || response.status === 201) {
        toast.success("Production order approved successfully.");
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

  // const handlePostToSAP = async () => {
  //   if (!productionHeaderIDData) {
  //     toast.error("Production Header ID is missing. Cannot post to SAP.");
  //     return;
  //   }
  //   setPosting(true);
  //   try {
  //     const response = await axiosInstance.post<{
  //       data: any;
  //       message: string;
  //       status: boolean;
  //     }>(
  //       POST_TO_SAP_ENDPOINT,
  //       [productionHeaderIDData] // This will be sent as an array of strings in the request body
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       toast.success("Production order successfully posted to SAP.");
  //       setIsPosted(true);
  //       setIsDrawerOpen(false);
  //       // If there was an setIsDrawerOpen, it would be here, but not in this component.
  //     } else {
  //       throw new Error("Unexpected server response during posting to SAP.");
  //     }
  //   } catch (err: any) {
  //     const message =
  //       err.response?.data?.message || err.message || "Something went wrong.";
  //     // It's good practice to provide specific error context if possible
  //     toast.error(`Failed to post to SAP. ${message}`);
  //   } finally {
  //     setPosting(false);
  //   }
  // };

  // --- Determine current button stage ---

  const handlePostToSAP = async () => {
    if (!productionHeaderIDData) {
      toast.error("Production Header ID is missing. Cannot post to SAP.");
      return;
    }
    setPosting(true); // Indicates UI is busy
    setIsPostingPending(true); // Indicates that a posting action has been initiated

    try {
      const response = await axiosInstance.post<{
        data: any;
        message: string;
        status: boolean;
      }>(POST_TO_SAP_ENDPOINT, [productionHeaderIDData]);

      if (response.status === 200 || response.status === 201) {
        // Success response from your middleware, but not necessarily SAP success yet.
        toast.info("Production order scheduled for Posting.."); // Inform the user
        setIsPostInstant(true);
        // Crucially, DO NOT set isPosted(true) here immediately.
        // The actual 'isPosted' status should come from a fresh fetch.

        setIsDrawerOpen(false);

        if (orderNumber) {
          setTimeout(async () => {
            await fetchProductionOrderDetails(orderNumber);
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

  const currentProductionStage = useMemo(() => {
    if (productionOrderDetails && productionOrderDetails.length > 0) {
      //const { isFinished: fetchedIsFinished, isApproved: fetchedIsApproved, IsPosted: fetchedIsPosted } = productionOrderDetails[0];

      // Use the *current* state values for the stage logic, as they reflect
      // the immediate result of an action, while fetched values are from last fetch.
      // Prioritize most advanced stage
      if (isCancelled) {
        // New condition for cancelled state
        return ProductionStage.CANCELLED;
      }
      if (isPosted) {
        return ProductionStage.COMPLETED;
      } else if (isApproved) {
        return ProductionStage.POST_TO_SAP;
      } else if (isFinished) {
        return ProductionStage.APPROVE_PRODUCTION;
      } else if (
        isProductionOrderSynced &&
        productionOrderDetails[0].ProductionDetails &&
        productionOrderDetails[0].ProductionDetails.length > 0
      ) {
        return ProductionStage.FINISH_PRODUCTION;
      }
    }
    return ProductionStage.NONE;
  }, [
    productionOrderDetails,
    isProductionOrderSynced,
    isFinished,
    isApproved,
    isPosted,
    isCancelled,
  ]);

  const getButtonProps = () => {
    let buttonText = "";
    let handleClickBtn = () => {};
    let showButton = false;
    let isLoading = false;
    let isDisabledByRole = false;

    switch (currentProductionStage) {
      case ProductionStage.FINISH_PRODUCTION:
        buttonText = "Finish Production Order";
        handleClickBtn = handleFinishProduction;
        showButton = true;
        isLoading = finalLoading;
        break;
      case ProductionStage.APPROVE_PRODUCTION:
        buttonText = "Approve Production";
        handleClickBtn = () => setIsApproveModalOpen(true);
        showButton = isAdmin; // Only show for Admin
        isLoading = approveLoading;
        isDisabledByRole = !isAdmin;
        break;
      case ProductionStage.POST_TO_SAP:
        buttonText = "Post to SAP";
        handleClickBtn = () => setIsDrawerOpen(true);
        showButton = isAdmin; // Only show for Admin
        isLoading = posting;
        isDisabledByRole = !isAdmin;
        break;
      case ProductionStage.COMPLETED:
        showButton = false;
        break;
      case ProductionStage.NONE:
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

  const disableAllInteractions = isCancelled || !productionOrderDetails;

  const {
    buttonText,
    handleClickBtn,
    showButton,
    // isLoading,
    isDisabledByRole,
  } = getButtonProps();

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
    productDescription: string | null,
    orderNumber: string | null
  ) => {
    onPrint(stockId, completedQuantity, productDescription, orderNumber);
  };

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
    // Change 'loadingStage' to 'isLoading' for consistency if DynamicProductionButton expects 'loading'
    // or ensure the prop names match. I'm using `isLoading` here to map directly to the button's `loading` prop.
    switch (currentStage) {
      case "finish":
        return {
          action: handleFinishProduction,
          text: finalLoading ? "Finishing..." : "Finish Production",
          icon: FaClipboardCheck,
          isLoadingStage: finalLoading, // Use finalLoading here
          isDisabled: finalLoading,
        };
      case "approve":
        return {
          action: handleApproveProduction,
          text: approveLoading ? "Approving..." : "Approve Production",
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
    } else if (isCancelled) {
      status = "Cancelled";
      colorClass = "text-red-600 dark:text-red-400"; // Use red for cancelled
    } else if (productionOrderDetails) {
      // If details are loaded but no definitive status flags are true
      status = "Pending"; // Or "New", "In Progress"
      colorClass = "text-gray-500 dark:text-gray-400";
    } else {
      // No production order loaded yet
      status = "N/A";
      colorClass = "text-gray-400 dark:text-gray-500";
    }
    return [status, colorClass];
  }, [
    isFinished,
    isApproved,
    isPosted,
    isCancelled,
    isPostingPending,
    productionOrderDetails,
  ]);

  // === CONDITIONS TO DISPLAY THE BUTTON ===
  // const shouldRenderButton =
  //   currentStage &&
  //   isProductionOrderSynced &&
  //   productionOrderDetails?.length > 0 &&
  //   productionOrderDetails[0].ProductionDetails?.length > 0;

  // === DISABLED CONDITIONS ===
  // const disabled = loading || !!finalError || !!approveError || !!postError;

  // === BUTTON ONCLICK HANDLER ===
  // const handleBtnClick = useCallback(() => {
  //   if (action) {
  //     action();
  //   }
  // }, [action]);

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

  return (
    <>
      <SAPDataContext.Provider value={{ sapData, setSapData }}>
        <div className="p-6 space-y-6">
          <div className="w-full sm:px-8 lg:px-20 xl:px-32 mt-6">
            <div className="flex flex-col items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Find Production Order Button */}
                <Button
                  onClick={handleFindClick}
                  startIcon={<FaSearch />}
                  className="w-full min-w-[200px]"
                >
                  Find Production Order
                </Button>

                {/* Sync Data Button - Conditional */}
                {isSAPResponse &&
                  isFormCompleted &&
                  !isProductionOrderSynced && (
                    <Button
                      onClick={handleSyncData}
                      variant="sync"
                      startIcon={<FaSync />}
                      className="w-full min-w-[200px]"
                    >
                      Sync Data
                    </Button>
                  )}

                {/* Finish Production Button - Conditional */}
                {showButton && (
                  <DynamicProductionButton
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
              {productionOrderDetails && (
                <div className="flex flex-col gap-y-6 w-full mt-6">
                  {productionOrderDetails.map((order: ProductionOrder) => {
                    // Determine the status and its color
                    const status = getProductionOrderStatus(
                      order.isFinished,
                      order.isApproved,
                      order.IsPosted,
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

                    const hasPlannedQuantity = sapPlannedQuantity > 0;
                    const isCompletedQuantityExceeded =
                      hasPlannedQuantity &&
                      currentTotalCompletedQuantity > sapPlannedQuantity;
                    const isCompletedQuantityUnder =
                      hasPlannedQuantity &&
                      currentTotalCompletedQuantity < sapPlannedQuantity;
                    return (
                      <div
                        key={order.SAPProductionOrderID}
                        className="w-full bg-white dark:bg-gray-900 shadow-md rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 relative transition-all"
                      >
                        {isAdmin &&
                          !isCancelled &&
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
                            Production Order #{order.SAPProductionOrderID}
                          </h3>
                          {!isCancelled || isCancelInstant ? (
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          {[
                            { label: "Product ID", value: order.SAPProductID },
                            {
                              label: "Product Description",
                              value: order.SAPProductDescription,
                            },
                            {
                              label: "Planned Quantity",
                              value: Number.isInteger(order.SAPPlannedQuantity)
                              ? formatQuantity(order.SAPPlannedQuantity)
                              : formatDecimalQuantity(order.SAPPlannedQuantity),
                            },
                            {
                              label: "Completed Quantity",
                              value: Number.isInteger(currentTotalCompletedQuantity)
                              ? formatQuantity(currentTotalCompletedQuantity)
                              : formatDecimalQuantity(currentTotalCompletedQuantity),
                              isCompletedQuantityField: true,
                            },
                            {
                              label: "Unit of Quantity Pallet",
                              value: order.UoMQuantityPallet,
                            },
                            {
                              label: "Quantity Unit Code",
                              value:
                                order.QuantityUnitCode === "MIL"
                                  ? "1000 (Thousand)"
                                  : order.QuantityUnitCode === "EA"
                                  ? "Each (ea)"
                                  : "N/A",
                            },
                          ].map((field, idx) => {
                            // Determine the color for Completed Quantity based on its value
                            let textColorClass =
                              "text-gray-800 dark:text-gray-100"; // Default neutral color

                            if (field.isCompletedQuantityField) {
                              if (isCompletedQuantityExceeded) {
                                textColorClass =
                                  "text-red-600 dark:text-red-400";
                              } else if (isCompletedQuantityUnder) {
                                textColorClass =
                                  "text-green-600 dark:text-green-400";
                              }
                            }

                            return (
                              <div
                              key={idx}
                              // MODIFICATION HERE: Use flex for consistent spacing
                              className="flex items-start gap-x-2" // Use items-start to align top if value wraps
                            >
                              <p className="font-semibold text-gray-600 dark:text-gray-400">
                                {field.label}:
                              </p>
                              <p className={`break-words flex-grow ${textColorClass}`}> {/* Add flex-grow to value */}
                                {field.value}
                              </p>
                            </div>
                            );
                          })}
                        </div>

                        {/* New Third Row: Production Date, Machine, Save (left) | Shift (right) */}
                        {/* We'll use a 2-column grid for this entire row on large screens */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6 items-end">
                          {/* Left Side Group: Production Date, Machine, Save Button */}
                          {/* This div will take the left column on sm and up */}
                          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-12 gap-y-6">
                            {/* Production Date Input field */}
                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                              <label
                                htmlFor="productionDate"
                                className="text-md font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Production Date:
                              </label>
                              <input
                                type="date"
                                id="productionDate"
                                value={selectedProductionDate || ""}
                                onChange={(e) =>
                                  setSelectedProductionDate(e.target.value)
                                }
                                required
                                disabled={isApproved || isCancelled}
                                className={`w-full px-3 py-2 rounded-md text-sm border focus:outline-none focus:ring-2 transition ${
                                  isApproved
                                    ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                    : "border-gray-300 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                }`}
                              />
                            </div>

                            {/* Machine Input field */}
                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                              <label
                                htmlFor="machine"
                                className="text-md font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Machine:
                              </label>
                              <select
                                id="machine"
                                value={selectedMachine}
                                onChange={(e) =>
                                  setSelectedMachine(e.target.value)
                                }
                                required
                                disabled={isApproved || isCancelled}
                                className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 transition ${
                                  isApproved
                                    ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                    : "border-gray-300 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                }`}
                              >
                                {machineOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Save Button - Positioned inline with Production Date and Machine */}
                            {isProductionOrderSynced && !isApproved && (
                              <div className="flex flex-col gap-1 w-full sm:w-auto lg:-mb-4 sm:mt-0 sm:mb-4">
                                {" "}
                                {/* Added responsive margin-top */}
                                <Button
                                  onClick={handleSaveEdits}
                                  variant="primary"
                                  disabled={
                                    isCancelled ||
                                    isApproved ||
                                    isSavingEdits ||
                                    !productionOrderDetails
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

                          {/* Right Side: Shift Dropdown */}
                          {/* This div will take the right column on sm and up */}
                          <div className="flex flex-col gap-1 w-full sm:w-auto sm:ml-auto">
                            <label
                              htmlFor="shift"
                              className="text-md font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Shift:
                            </label>
                            <select
                              id="shift"
                              value={currentShiftSelection}
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                setCurrentShiftSelection(selectedValue);
                                setLastSuccessfulShift(selectedValue);
                              }}
                              disabled={isCancelled}
                              className="w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 transition dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            >
                              <option value="" disabled>
                                Select Shift
                              </option>
                              <option value="M">M</option>
                              <option value="A">A</option>
                              <option value="N">N</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {orderNumber &&
                isProductionOrderSynced &&
                !isFinished &&
                !isCancelled && (
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
                          value={quantity ?? ""} 
                          onChange={handleChange}
                          onBlur={() => setHasInteractedWithQuantity(true)}
                          className={`${fieldBaseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-brand-500`}
                          disabled={isCancelled}
                        />
                      </div>

                      {/* Restricted Field */}
                      <div className={fieldWrapperClass}>
                        <select
                          value={restricted}
                          onChange={(e) => setRestricted(e.target.value)}
                          className={`${fieldBaseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-brand-500`}
                          disabled={isCancelled}
                        >
                          <option value="" disabled>
                            Restricted (Yes/No)
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {/* <div className="min-h-[1.25rem] mt-1"></div> */}
                    </div>

                      {/* Add/Update Button */}
                      <div className={fieldWrapperClass}>
                        <Button
                          onClick={() =>
                            handleAddClick(
                              quantity,
                              restricted,
                              currentShiftSelection,
                              setQuantity,
                              setRestricted,
                              setEditingIndex,
                              setShowNewInputFields,
                              setProductionOrderDetails,
                              editingDetailId
                            )
                          }
                          disabled={entryLoading || !orderNumber || isCancelled}
                          className={`lg:w-[80%] flex items-center justify-center gap-2 font-medium px-2 py-1 rounded-md shadow-md transition-all text-sm md:text-base ${
                            entryLoading || !orderNumber
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-brand-500 hover:bg-brand-600 text-white"
                          }`}
                        >
                          <FiPlus className="text-lg" />
                          {editingIndex !== null ? "Update Row" : "Add Row"}
                        </Button>
                        {/* <div className="min-h-[1.25rem] mt-1"></div> */}
                      </div>
                    </div>
                  </div>
                )}
              {/* )} */}
            </div>

            {/* Display Production Details Table */}
            {productionOrderDetails &&
              productionOrderDetails[0]?.ProductionDetails &&
              productionOrderDetails[0].ProductionDetails.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-md mt-8 bg-white dark:bg-gray-900">
                  <h6 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white p-4">
                    Production Details
                  </h6>

                  <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="px-4 py-3">Detail #</th>
                        <th className="px-4 py-3">Shift</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Restricted</th>
                        <th className="px-4 py-3">Production Date</th>
                        <th className="px-4 py-3">Stock ID</th>
                        <th className="px-4 py-3 w-36 text-center">Actions</th>
                        {/* Added w-36 (a fixed width) and text-center */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentProductionDetails.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-4 text-center">
                            No production details available.
                          </td>
                        </tr>
                      )}
                      {currentProductionDetails
                        .slice()
                        .reverse()
                        .map((detail, index) => {
                          const isEditing =
                            inlineEditingId === detail.ProductionDetailID;
                          const currentDetail = isEditing
                            ? inlineEditedDetail
                            : detail;

                          if (!currentDetail) return null;

                          return (
                            <tr
                              key={detail.ProductionDetailID || `new-${index}`}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                            >
                              <td className="px-4 py-3">{index + 1}</td>

                              <td className="px-4 py-2">
                                {isEditing ? (
                                  <select
                                    value={currentDetail.Shift ?? "M"}
                                    onChange={(e) =>
                                      handleInlineInputChange(
                                        "Shift",
                                        e.target.value
                                      )
                                    }
                                    disabled={isCancelled}
                                    className="w-20 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="M">M</option>
                                    <option value="A">A</option>
                                    <option value="N">N</option>
                                  </select>
                                ) : (
                                  currentDetail.Shift
                                )}
                              </td>

                              <td className="px-4 py-2">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    step="any"
                                    value={currentDetail.CompletedQuantity}
                                    onChange={(e) =>
                                      handleInlineInputChange(
                                        "CompletedQuantity",
                                        e.target.value
                                      )
                                    }
                                    disabled={isCancelled}
                                    className="w-25 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                ) : (
                                    currentDetail.CompletedQuantity
                                )}
                              </td>

                              <td className="px-4 py-2">
                                {isEditing ? (
                                  <select
                                    value={currentDetail.isRestricted ?? "No"} // Provide a default value if null/undefined
                                    onChange={(e) =>
                                      handleInlineInputChange(
                                        "isRestricted",
                                        e.target.value
                                      )
                                    }
                                    disabled={isCancelled}
                                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                ) : (
                                  currentDetail.isRestricted
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
                                        disabled={isCancelled}
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
                                        disabled={isCancelled}
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
                                      {/* Edit Button - Disabled if production order is finished */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleInlineEditClick(detail)
                                        }
                                        title="Edit"
                                        disabled={isFinished || isCancelled} // <--- Accurate disabling based on isFinishedStage
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

                                      {/* Delete Button - Disabled if production order is finished */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        title="Delete"
                                        disabled={isFinished || isCancelled}
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
                                          if (detail.ProductionDetailID) {
                                            confirmDelete(
                                              detail.ProductionDetailID
                                            );
                                          } else {
                                            console.warn(
                                              "Cannot delete: ID missing"
                                            );
                                            toast.error(
                                              "Cannot delete: ProductionDetailID is missing for this entry."
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
                                        onClick={() =>
                                          handleClick(
                                            currentDetail.IdentifiedStockID,
                                            currentDetail.CompletedQuantity,
                                            productDescription,
                                            orderNumber
                                          )
                                        }
                                        disabled={isCancelled}
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
                    message={`Production Order not found.`}
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
            description="This action cannot be undone.  This will permanently delete this production detail."
          />
          <WarningModal
            show={showQuantityModal}
            onClose={() => setShowQuantityModal(false)}
            message={`You have entered a quantity that exceeds the planned order. Please note: ${quantityValidationMessage}`}
          />
          <ConfirmationFinishModal
            isOpen={isFinalModalOpen}
            onClose={() => setIsFinalModalOpen(false)}
            onConfirm={handleFinishProduction}
            title="Confirm Finish Production Order"
            description="Are you sure you want to finalize this Production Order? This action cannot be reversed."
            confirmLabel="Finish"
            cancelLabel="Cancel"
          />
          <ConfirmationApprovalModal
            isOpen={isApproveModalOpen}
            onClose={() => setIsApproveModalOpen(false)}
            onConfirm={handleApproveProduction}
            title="Confirm Approval"
            description="Are you sure you want to approve this production order? This action cannot be undone."
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
                    Are you sure you want to cancel Production Order?
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
                    <li>
                      Disable all related production actions for this order.
                    </li>
                  </ul>

                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md flex items-start gap-3">
                    <FaBan className="text-red-500 dark:text-red-400 text-xl flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-300 font-medium text-sm">
                      Only proceed if you are absolutely certain this production
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
                    onClick={handleCancelProduction}
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

export default ProductionOrderPage;
