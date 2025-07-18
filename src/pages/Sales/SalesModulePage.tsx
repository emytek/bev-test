// src/pages/SalesModulePage.tsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // For smooth animations
import { Toaster } from "sonner"; // Changed from react-toastify to sonner
import Button from "../../components/ui/button/SalesBtn";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import CreatePickslipHeaderForm from "../../components/operations/Sales/outbound-logistics/pickslip/CreatePickSlip";
import PickslipScanningPage from "../../components/operations/Sales/outbound-logistics/pickslip/PickSlipScanningPage";
import Loader from "../../components/ui/loader/NxtLoader";
import { useNavigate } from "react-router";
import { useSalesModuleContext } from "../../context/sales/SalesModuleContext";
import { usePickslipContext } from "../../context/sales/PickSlipContext";

// const SalesModulePage: React.FC = () => {
//   const [showPickslipForm, setShowPickslipForm] = useState(false);
//   const [createdPickslipId, setCreatedPickslipId] = useState<string | null>(
//     null
//   );

//   const handleCreatePickslipClick = () => {
//     setCreatedPickslipId(null); // Reset any existing pickslip ID
//     setShowPickslipForm(true);
//   };

//   const handlePickslipHeaderCreated = (id: string) => {
//     setCreatedPickslipId(id);
//     setShowPickslipForm(false); // Hide the header form after creation
//     // In a real app, you might navigate to a pickslip details page here
//     // For now, we'll just show a success message.
//     toast.success(`Pickslip ${id} created successfully!`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-10 transition-colors duration-200">
//       {/* <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">Sales Order Management</h1> */}
//       <div className="flex justify-center mb-8">
//         <Button onClick={handleCreatePickslipClick} variant="primary" size="lg">
//           Create New Pickslip
//         </Button>
//       </div>
//       <AnimatePresence>
//         {/* Conditionally render the pickslip creation form */}
//         {showPickslipForm && !createdPickslipId && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <CreatePickslipHeaderForm
//               onPickslipHeaderCreated={handlePickslipHeaderCreated}
//             />
//           </motion.div>
//         )}

//         {createdPickslipId && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.3, delay: 0.2 }} // Slight delay for smoother transition
//           >
//             <AddSalesDetailsForm salesOrderId={createdPickslipId} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {/* Replaced ToastContainer with Toaster from sonner */}
//       <Toaster position="top-right" richColors />{" "}
//       {/* sonner uses richColors for variants */}
//     </div>
//   );
// };


const SalesModulePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    pickslipCreationStage,
    setPickslipCreationStage,
    createdPickslipId,
    setCreatedPickslipId,
    showLoaderAfterHeader,
    setShowLoaderAfterHeader,
    resetPickslipFlow, // Get the reset function from context
  } = useSalesModuleContext();

  const { clearSelectedPickslipId } = usePickslipContext(); // To clear the PickslipContext's ID

  // --- Sales Order Management (Existing Logic, assuming it's still needed) ---
  const [_showSalesHeaderForm, setShowSalesHeaderForm] = useState(false);
  const [_salesOrderId, setSalesOrderId] = useState<string | null>(null);

  // const handleCreateNewSalesClick = () => {
  //   setSalesOrderId(null);
  //   setShowSalesHeaderForm(true);
  //   resetPickslipFlow(); // Reset pickslip flow when starting sales order
  // };

  // const handleSalesHeaderCreated = (id: string) => {
  //   setSalesOrderId(id);
  //   setShowSalesHeaderForm(false);
  //   toast.success(`Sales Order ${id} created successfully!`);
  // };
  // --- End Sales Order Management ---


  // --- Pickslip Management Logic ---
  const handleCreateNewPickslipClick = () => {
    setCreatedPickslipId(null); // Ensure local state is reset
    setPickslipCreationStage('header'); // Start at header creation stage
    setShowSalesHeaderForm(false); // Reset sales flow
    setSalesOrderId(null);
  };

  const handlePickslipHeaderCreated = (id: string) => {
    setCreatedPickslipId(id);
    setPickslipCreationStage('proceed_to_scan'); // Move to "proceed to scan" stage
    // The toast is already handled by the CreatePickslipHeaderForm
  };

  const handleProceedToScanClick = () => {
    setShowLoaderAfterHeader(true);
    setTimeout(() => {
      setShowLoaderAfterHeader(false);
      setPickslipCreationStage('scanning'); // Move to actual scanning stage
    }, 2000); // Show loader for 2 seconds
  };

  const handleGoBack = () => {
    // Clear the specific pickslip contexts when going back
    clearSelectedPickslipId();
    // Optionally clear ProductContext's productID and numberOfPacks if they are specific to the current pickslip session
    // clearSelectedProductId();
    // clearNumberOfPacks();
    
    // Reset the SalesModulePage's pickslip flow state
    resetPickslipFlow();

    // Navigate back to the desired route
    navigate('/sales-order'); // Assuming '/sales-order' is the main entry point for sales/pickslip
  };
  // --- End Pickslip Management Logic ---

  // Determine if the "Create New Pickslip" button should be visible
  const showCreatePickslipButton = pickslipCreationStage === null;

  // Determine if the "Go Back" button should be visible
  const showGoBackButton = pickslipCreationStage === 'scanning'; // Only visible in scanning stage for now

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-10 transition-colors duration-200 relative">
      {/* Go Back Button (Conditional) */}
      <AnimatePresence>
        {showGoBackButton && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-6 left-6 z-10" // Position top-left
          >
            <Button
              onClick={handleGoBack}
              variant="secondary" // Or a custom 'ghost' variant for a subtle look
              className="px-4 py-2 text-sm rounded-md shadow-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
              icon={<FaArrowLeft className="mr-2" />}
            >
              Go Back
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <h4 className="text-lg font-bold mb-8 text-center text-blue-700 dark:text-blue-400">Outbound Logistics Operations</h4> */}

      <div className="flex justify-center mb-8 space-x-4">
        {/* Conditional rendering for Create New Pickslip button */}
        <AnimatePresence>
          {showCreatePickslipButton && (
            <motion.div
              key="createPickslipBtn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button onClick={handleCreateNewPickslipClick} variant="primary" size="lg" icon={<FaPlus />}>
                Create New Pickslip
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {/* Pickslip Creation Flow */}
        {pickslipCreationStage === 'header' && !createdPickslipId && (
          <motion.div
            key="createPickslipHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CreatePickslipHeaderForm onPickslipHeaderCreated={handlePickslipHeaderCreated} />
          </motion.div>
        )}

        {pickslipCreationStage === 'proceed_to_scan' && createdPickslipId && (
          <motion.div
            key="proceedToScanButton"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mt-8"
          >
            <Button onClick={handleProceedToScanClick} variant="primary" size="lg">
              Proceed to Scan
            </Button>
          </motion.div>
        )}

        {showLoaderAfterHeader && (
          <motion.div
            key="loaderAfterHeader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader message="Loading Scanner..." />
          </motion.div>
        )}

        {pickslipCreationStage === 'scanning' && createdPickslipId && !showLoaderAfterHeader && (
          <motion.div
            key="pickslipScanningPage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <PickslipScanningPage />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default SalesModulePage;
