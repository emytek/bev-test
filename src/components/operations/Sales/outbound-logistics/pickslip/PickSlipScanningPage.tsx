// // src/components/operations/Pickslip/PickslipScanningPage.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AnimatePresence, motion } from "framer-motion";
// import { FaBarcode, FaExclamationCircle, FaTimesCircle, FaPlus, FaCamera, FaSpinner, FaSave, FaInfoCircle } from 'react-icons/fa';
// import { usePickslipContext } from '../../../../../context/sales/PickSlipContext';
// import { useProductContext } from '../../../../../context/production/ProductContext';
// import { useUserAuth } from '../../../../../context/auth/AuthContext';
// import { addPickslipDetails } from '../../../../../api/sales/pickslip';
// import Loader from '../../../../ui/loader/NxtLoader';
// import Card from '../../../../common/Card';
// import Button from '../../../../ui/button/SalesBtn';
// import LiveBarcodeScannerUI from './LiveBarcodeScanner';
// import WarningModal from '../../../../ui/modal/WarningModal';
// import { getProductionDetailsByIdentifiedStock, ProductionDetailItem } from '../../../../../api/production/production';

// // Define structure for a scanned item to display in the list
// interface ScannedItem {
//   lineNo: number;
//   productID: string;
//   identifiedStockID: string; // The barcode
//   quantity: number; // Quantity for this specific line item (8.169)
//   uom: 'EA' | 'TH';
//   timestamp: string; // For display
//   productionDetails: ProductionDetailItem;
// }

// const PickslipScanningPage: React.FC = () => {
//   const { selectedPickslipId, clearSelectedPickslipId } = usePickslipContext();
//   const { selectedProductId, numberOfPacks, clearSelectedProductId, clearNumberOfPacks } = useProductContext();
//   const { token } = useUserAuth();

//   const authHeader = { Authorization: token ? `Bearer ${token}` : '' };

//   const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
//   const [currentTotalScannedQuantity, setCurrentTotalScannedQuantity] = useState<number>(0);
//   const [isScanningActive, setIsScanningActive] = useState(false);
//   const [showWarningModal, setShowWarningModal] = useState(false);
//   const [warningMessage, setWarningMessage] = useState('');
//   const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
//   const [isBarcodeValidating, setIsBarcodeValidating] = useState(false);
//   const [currentScannedProductionDetails, setCurrentScannedProductionDetails] = useState<ProductionDetailItem | null>(null);

//   const BASE_QUANTITY_PER_SCAN = 8.169;
//   const UOM_STATIC = 'TH';

//   const [initialLoading, setInitialLoading] = useState(true);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setInitialLoading(false);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleScan = useCallback(async (code: string) => {
//     setIsScanningActive(false);
//     setIsBarcodeValidating(true);

//     if (!selectedProductId || numberOfPacks === null || selectedPickslipId === null) {
//       setWarningMessage('Missing pickslip setup data (Product ID, Number of Packs, or Pickslip Header ID). Please restart the process.');
//       setShowWarningModal(true);
//       setIsBarcodeValidating(false);
//       return;
//     }

//     if (scannedItems.length >= numberOfPacks) {
//       setWarningMessage(`You have already scanned the maximum allowed number of packs (${numberOfPacks}).`);
//       setShowWarningModal(true);
//       setIsBarcodeValidating(false);
//       return;
//     }

//     try {
//       const productionResponse = await getProductionDetailsByIdentifiedStock(code, authHeader);

//       if (!productionResponse.status || productionResponse.data.length === 0) {
//         setWarningMessage(`Scanned barcode "${code}" does not exist in the system or no details found.`);
//         setShowWarningModal(true);
//         setCurrentScannedProductionDetails(null);
//         return;
//       }

//       const fetchedProductionDetail = productionResponse.data[0];

//       if (fetchedProductionDetail.SAPProductID !== selectedProductId) {
//         setWarningMessage(`Scanned product ID "${fetchedProductionDetail.SAPProductID}" does not match the selected product ID for this pickslip "${selectedProductId}".`);
//         setShowWarningModal(true);
//         setCurrentScannedProductionDetails(null);
//         return;
//       }

//       if (scannedItems.some(item => item.identifiedStockID === code)) {
//         setWarningMessage(`Barcode "${code}" has already been scanned in this session. Duplicate scans are not allowed.`);
//         setShowWarningModal(true);
//         setCurrentScannedProductionDetails(null);
//         return;
//       }

//       setCurrentScannedProductionDetails(fetchedProductionDetail);

//       const newScannedItem: ScannedItem = {
//         lineNo: (scannedItems.length + 1) * 10,
//         productID: selectedProductId,
//         identifiedStockID: code,
//         quantity: BASE_QUANTITY_PER_SCAN,
//         uom: UOM_STATIC,
//         timestamp: new Date().toLocaleString(),
//         productionDetails: fetchedProductionDetail,
//       };

//       setScannedItems((prevItems) => {
//         const updatedItems = [...prevItems, newScannedItem];
//         setCurrentTotalScannedQuantity(parseFloat((updatedItems.length * BASE_QUANTITY_PER_SCAN).toFixed(3)));
//         return updatedItems;
//       });

//       toast.success(`Barcode "${code}" validated and added. (${scannedItems.length + 1} of ${numberOfPacks})`, { duration: 2000 });

//     } catch (error: any) {
//       const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred during barcode validation.';
//       setWarningMessage(`Validation Error: ${errMsg}`);
//       setShowWarningModal(true);
//       setCurrentScannedProductionDetails(null);
//       console.error('Barcode validation error:', error);
//     } finally {
//       setIsBarcodeValidating(false);
//     }
//   }, [selectedProductId, numberOfPacks, selectedPickslipId, scannedItems, authHeader]);

//   const handleAddDetails = async () => {
//     if (!selectedPickslipId) {
//       toast.error('Pickslip Header ID is missing. Cannot add details.');
//       return;
//     }
//     if (scannedItems.length === 0) {
//       toast.error('No items scanned to add details.');
//       return;
//     }
//     if (numberOfPacks !== null && scannedItems.length !== numberOfPacks) {
//       setWarningMessage(`You must scan exactly ${numberOfPacks} items to complete the pickslip. Currently scanned: ${scannedItems.length}.`);
//       setShowWarningModal(true);
//       return;
//     }

//     setIsSubmittingDetails(true);
//     try {
//       const payload = {
//         pickslipHeaderID: selectedPickslipId,
//         pickslipDetails: scannedItems.map(item => ({
//           pickslipHeaderID: selectedPickslipId,
//           lineNo: item.lineNo,
//           productID: item.productID,
//           identifiedStockID: item.identifiedStockID,
//           quantity: item.quantity,
//           uom: item.uom,
//         })),
//       };

//       console.log('Add Pickslip Details Payload:', payload);

//       const response = await addPickslipDetails(payload, authHeader);

//       if (response && response[0]?.isSuccess) {
//         toast.success(response[0].message || 'Pickslip details added successfully!', { duration: 3000 });
//         clearSelectedPickslipId();
//         clearSelectedProductId();
//         clearNumberOfPacks();
//         setScannedItems([]);
//         setCurrentTotalScannedQuantity(0);
//         setIsScanningActive(false);
//         setCurrentScannedProductionDetails(null);
//       } else {
//         const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to add pickslip details.';
//         toast.error(errorMessage, { duration: 5000 });
//       }
//     } catch (error: any) {
//       const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
//       toast.error(`Error: ${errMsg}`, { duration: 5000 });
//       console.error('Error adding pickslip details:', error);
//     } finally {
//       setIsSubmittingDetails(false);
//     }
//   };

//   if (initialLoading) {
//     return <Loader message="Preparing Scanner..." />;
//   }

//   if (!selectedPickslipId || !selectedProductId || numberOfPacks === null) {
//     return (
//       <Card className="max-w-2xl mx-auto p-6 text-center text-red-600 dark:text-red-400">
//         <FaExclamationCircle className="text-6xl mx-auto mb-4" />
//         <h2 className="text-2xl font-bold mb-3">Missing Pickslip Data</h2>
//         <p>Please go back to "Create New Pickslip" to start the process.</p>
//         <Button onClick={() => {
//           clearSelectedPickslipId();
//           clearSelectedProductId();
//           clearNumberOfPacks();
//         }} className="mt-4">
//           Go Back
//         </Button>
//       </Card>
//     );
//   }

//   const scansRemaining = numberOfPacks - scannedItems.length;
//   const canScan = !isBarcodeValidating && !isScanningActive && scannedItems.length < numberOfPacks;
//   // `canAddDetails` controls if the button is *enabled*.
//   // It should only be enabled if the exact number of packs are scanned.
//   const isAddDetailsButtonEnabled = scannedItems.length === numberOfPacks && !isSubmittingDetails;
  
//   // `showAddDetailsButton` controls if the button is *visible*.
//   // It should be visible if at least one item has been scanned.
//   const showAddDetailsButton = scannedItems.length > 0;


//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-10 transition-colors duration-200">
//       <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">Pickslip Scanning</h1>

//       <div className="flex justify-end mb-4">
//         <AnimatePresence>
//           {showAddDetailsButton && ( // <-- Conditional rendering for visibility
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Button
//                 onClick={handleAddDetails}
//                 disabled={!isAddDetailsButtonEnabled} // <-- Use the enabled state
//                 variant="primary"
//                 icon={isSubmittingDetails ? <FaSpinner className="animate-spin" /> : <FaSave />}
//               >
//                 {isSubmittingDetails ? 'Adding Details...' : 'Add Details'}
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left Column: Pickslip Details Card & Scan Controls */}
//         <div className="space-y-6">
//           <Card className="p-6">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
//               <FaBarcode className="mr-2 text-blue-500" /> Current Pickslip Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400">Pickslip Header ID:</span>
//                 <span className="font-medium text-gray-900 dark:text-white break-all">{selectedPickslipId}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400">Product ID:</span>
//                 <span className="font-medium text-gray-900 dark:text-white">{selectedProductId}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400">Number of Packs (Target):</span>
//                 <span className="font-medium text-gray-900 dark:text-white">{numberOfPacks}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400">Quantity Per Scan:</span>
//                 <span className="font-medium text-gray-900 dark:text-white">{BASE_QUANTITY_PER_SCAN}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400">UOM:</span>
//                 <span className="font-medium text-gray-900 dark:text-white">{UOM_STATIC}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400">Total Scanned Quantity:</span>
//                 <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{currentTotalScannedQuantity.toFixed(3)}</span>
//               </div>
//             </div>
//             <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
//               <p className="text-blue-700 dark:text-blue-200 font-medium text-center">
//                 Scanned: <span className="font-bold">{scannedItems.length}</span> / {numberOfPacks} packs.
//                 (<span className="font-bold">{scansRemaining}</span> remaining)
//               </p>
//             </div>
//           </Card>

//           {/* New Card: Scanned Product Details */}
//           <AnimatePresence mode="wait">
//             {currentScannedProductionDetails && (
//               <motion.div
//                 key={currentScannedProductionDetails.IdentifiedStockID}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className="p-6 border-l-4 border-green-500 dark:border-green-600">
//                   <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
//                     <FaInfoCircle className="mr-2 text-green-500" /> Last Scanned Product Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">Identified Stock ID:</span>
//                       <span className="font-medium text-gray-900 dark:text-white break-all">{currentScannedProductionDetails.IdentifiedStockID}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">Production Date:</span>
//                       <span className="font-medium text-gray-900 dark:text-white">{new Date(currentScannedProductionDetails.ProductionDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">SAP Product ID:</span>
//                       <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.SAPProductID}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">SAP Product Description:</span>
//                       <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.SAPProductDescription}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">Is Posted:</span>
//                       <span className={`font-medium ${currentScannedProductionDetails.IsPosted ? 'text-green-600' : 'text-red-600'}`}>
//                         {currentScannedProductionDetails.IsPosted ? 'Yes' : 'No'}
//                       </span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">Completed Quantity:</span>
//                       <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.CompletedQuantity.toFixed(2)}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">UoM Quantity Per Pallet:</span>
//                       <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.UoMQuantityPallet.toFixed(2)}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-gray-500 dark:text-gray-400">Quantity Unit Code:</span>
//                       <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.QuantityUnitCode || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>


//           {/* Scanner Section */}
//           <Card className="p-6">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
//               <FaCamera className="mr-2 text-purple-500" /> Barcode Scanner
//             </h3>
//             <div className="relative aspect-video rounded-md overflow-hidden shadow-md">
//               {isBarcodeValidating && (
//                 <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-500/80 dark:bg-gray-900/80">
//                   <Loader message="Validating Barcode..." fullScreen={false} />
//                 </div>
//               )}
//               <LiveBarcodeScannerUI
//                 onScan={handleScan}
//                 scanActive={isScanningActive}
//                 onError={(err) => toast.error(`Scanner Error: ${err instanceof Error ? err.message : String(err)}`, { duration: 5000 })}
//               />
//             </div>
//             <div className="flex justify-center mt-4 space-x-2">
//               <Button
//                 onClick={() => setIsScanningActive(true)}
//                 disabled={!canScan || isScanningActive}
//                 variant="secondary"
//                 className="w-1/2"
//               >
//                 <FaBarcode className="mr-2" /> Start Scan
//               </Button>
//               <Button
//                 onClick={() => setIsScanningActive(false)}
//                 disabled={!isScanningActive}
//                 variant="secondary"
//                 className="w-1/2"
//               >
//                 <FaTimesCircle className="mr-2" /> Stop Scan
//               </Button>
//             </div>
//           </Card>
//         </div>

//         {/* Right Column: Scanned Items List */}
//         <Card className="p-6">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
//             <FaPlus className="mr-2 text-green-500" /> Scanned Items List
//           </h3>
//           {scannedItems.length === 0 ? (
//             <div className="text-center text-gray-500 dark:text-gray-400 py-10">
//               <p>No items scanned yet.</p>
//               <p className="text-sm mt-2">Start scanning barcodes to see the list here.</p>
//             </div>
//           ) : (
//             <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//               {scannedItems.map((item, index) => (
//                 <motion.div
//                   key={item.identifiedStockID + item.lineNo}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row sm:justify-between sm:items-center"
//                 >
//                   <div className="flex-grow">
//                     <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
//                       Line No: {item.lineNo}
//                     </p>
//                     <p className="text-gray-800 dark:text-gray-100">
//                       Product ID: <span className="font-medium">{item.productID}</span>
//                     </p>
//                     <p className="text-gray-600 dark:text-gray-300 text-sm">
//                       Barcode: <span className="font-mono break-all">{item.identifiedStockID}</span>
//                     </p>
//                   </div>
//                   <div className="mt-2 sm:mt-0 sm:text-right">
//                     <p className="text-gray-800 dark:text-gray-100">
//                       Quantity: <span className="font-bold">{item.quantity.toFixed(3)} {item.uom}</span>
//                     </p>
//                     <p className="text-gray-500 dark:text-gray-400 text-xs">
//                       Scanned At: {item.timestamp}
//                     </p>
//                     {item.productionDetails && (
//                       <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
//                         <p>Prod. Desc: {item.productionDetails.SAPProductDescription}</p>
//                         <p>Posted: {item.productionDetails.IsPosted ? 'Yes' : 'No'}</p>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>

//       <WarningModal
//         isOpen={showWarningModal}
//         onClose={() => setShowWarningModal(false)}
//         message={warningMessage}
//         timeout={5000}
//       />

//       {/* Custom Scrollbar Style */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-track {
//           background: #333;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #555;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #777;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PickslipScanningPage;


// src/components/operations/Pickslip/PickslipScanningPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from "framer-motion";
import { FaBarcode, FaExclamationCircle, FaTimesCircle, FaPlus, FaCamera, FaSpinner, FaSave, FaInfoCircle, FaKeyboard } from 'react-icons/fa'; // Added FaKeyboard
import { usePickslipContext } from '../../../../../context/sales/PickSlipContext';
import { useProductContext } from '../../../../../context/production/ProductContext';
import { useUserAuth } from '../../../../../context/auth/AuthContext';
import { addPickslipDetails } from '../../../../../api/sales/pickslip';
import Loader from '../../../../ui/loader/NxtLoader';
import Card from '../../../../common/Card';
import Button from '../../../../ui/button/SalesBtn';
import LiveBarcodeScannerUI from './LiveBarcodeScanner'; // Renamed to LiveBarcodeScanner
import WarningModal from '../../../../ui/modal/WarningModal';
import { getProductionDetailsByIdentifiedStock, ProductionDetailItem } from '../../../../../api/production/production';
import SubInput from '../../../../form/input/SubInput';


// Define structure for a scanned item to display in the list
interface ScannedItem {
  lineNo: number;
  productID: string;
  identifiedStockID: string; // The barcode
  quantity: number; // Quantity for this specific line item (8.169)
  uom: 'EA' | 'TH';
  timestamp: string; // For display
  productionDetails: ProductionDetailItem;
}

const PickslipScanningPage: React.FC = () => {
  const { selectedPickslipId, clearSelectedPickslipId } = usePickslipContext();
  const { selectedProductId, numberOfPacks, clearSelectedProductId, clearNumberOfPacks } = useProductContext();
  const { token } = useUserAuth();

  const authHeader = { Authorization: token ? `Bearer ${token}` : '' };

  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [currentTotalScannedQuantity, setCurrentTotalScannedQuantity] = useState<number>(0);
  const [isScanningActive, setIsScanningActive] = useState(false); // Controls the camera scanner activation
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isBarcodeValidating, setIsBarcodeValidating] = useState(false); // Global loader for any barcode validation
  const [currentScannedProductionDetails, setCurrentScannedProductionDetails] = useState<ProductionDetailItem | null>(null);
  const [manualBarcodeInput, setManualBarcodeInput] = useState<string>(''); // State for manual input field

  const BASE_QUANTITY_PER_SCAN = 8.169;
  const UOM_STATIC = 'TH';

  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Shared function for barcode validation and adding to list
  const handleBarcodeValidationAndAddition = useCallback(async (code: string) => {
    if (!code) return; // Do nothing if code is empty

    setIsBarcodeValidating(true); // Start global barcode validation loader
    setCurrentScannedProductionDetails(null); // Clear previous details immediately

    if (!selectedProductId || numberOfPacks === null || selectedPickslipId === null) {
      setWarningMessage('Missing pickslip setup data (Product ID, Number of Packs, or Pickslip Header ID). Please restart the process.');
      setShowWarningModal(true);
      setIsBarcodeValidating(false);
      return;
    }

    if (scannedItems.length >= numberOfPacks) {
      setWarningMessage(`You have already scanned the maximum allowed number of packs (${numberOfPacks}).`);
      setShowWarningModal(true);
      setIsBarcodeValidating(false);
      return;
    }

    try {
      const productionResponse = await getProductionDetailsByIdentifiedStock(code, authHeader);

      if (!productionResponse.status || productionResponse.data.length === 0) {
        setWarningMessage(`Scanned barcode "${code}" does not exist in the system or no details found.`);
        setShowWarningModal(true);
        return;
      }

      const fetchedProductionDetail = productionResponse.data[0];

      if (fetchedProductionDetail.SAPProductID !== selectedProductId) {
        setWarningMessage(`Scanned product ID "${fetchedProductionDetail.SAPProductID}" does not match the selected product ID for this pickslip "${selectedProductId}".`);
        setShowWarningModal(true);
        return;
      }

      if (scannedItems.some(item => item.identifiedStockID === code)) {
        setWarningMessage(`Barcode "${code}" has already been scanned in this session. Duplicate scans are not allowed.`);
        setShowWarningModal(true);
        return;
      }

      // All validations passed
      setCurrentScannedProductionDetails(fetchedProductionDetail);

      const newScannedItem: ScannedItem = {
        lineNo: (scannedItems.length + 1) * 10,
        productID: selectedProductId,
        identifiedStockID: code,
        quantity: BASE_QUANTITY_PER_SCAN,
        uom: UOM_STATIC,
        timestamp: new Date().toLocaleString(),
        productionDetails: fetchedProductionDetail,
      };

      setScannedItems((prevItems) => {
        const updatedItems = [...prevItems, newScannedItem];
        setCurrentTotalScannedQuantity(parseFloat((updatedItems.length * BASE_QUANTITY_PER_SCAN).toFixed(3)));
        return updatedItems;
      });

      toast.success(`Barcode "${code}" validated and added. (${scannedItems.length + 1} of ${numberOfPacks})`, { duration: 2000 });

    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred during barcode validation.';
      setWarningMessage(`Validation Error: ${errMsg}`);
      setShowWarningModal(true);
      console.error('Barcode validation error:', error);
    } finally {
      setIsBarcodeValidating(false); // End global barcode validation loader
      setManualBarcodeInput(''); // Clear the manual input field after processing
    }
  }, [selectedProductId, numberOfPacks, selectedPickslipId, scannedItems, authHeader]);

  // Handler for camera scans
  const handleCameraScan = useCallback(async (code: string) => {
    setIsScanningActive(false); // Stop camera scanner after it detects something
    await handleBarcodeValidationAndAddition(code);
  }, [handleBarcodeValidationAndAddition]);

  // Handler for manual/handheld input
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualBarcodeInput(e.target.value);
  };

  const handleManualInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // For handheld scanners (keyboard wedges), they typically send the barcode followed by an "Enter" keypress.
    // For manual entry, the user might type and then press Enter.
    if (e.key === 'Enter' && manualBarcodeInput.trim() !== '') {
      e.preventDefault(); // Prevent form submission if input is part of a form
      // Stop camera scanning if it's active, as manual input takes precedence
      if (isScanningActive) {
        setIsScanningActive(false);
      }
      await handleBarcodeValidationAndAddition(manualBarcodeInput.trim());
    }
  };

  const handleAddDetails = async () => {
    if (!selectedPickslipId) {
      toast.error('Pickslip Header ID is missing. Cannot add details.');
      return;
    }
    if (scannedItems.length === 0) {
      toast.error('No items scanned to add details.');
      return;
    }
    if (numberOfPacks !== null && scannedItems.length !== numberOfPacks) {
      setWarningMessage(`You must scan exactly ${numberOfPacks} items to complete the pickslip. Currently scanned: ${scannedItems.length}.`);
      setShowWarningModal(true);
      return;
    }

    setIsSubmittingDetails(true);
    try {
      const payload = {
        pickslipHeaderID: selectedPickslipId,
        pickslipDetails: scannedItems.map(item => ({
          pickslipHeaderID: selectedPickslipId,
          lineNo: item.lineNo,
          productID: item.productID,
          identifiedStockID: item.identifiedStockID,
          quantity: item.quantity,
          uom: item.uom,
        })),
      };

      console.log('Add Pickslip Details Payload:', payload);

      const response = await addPickslipDetails(payload, authHeader);

      if (response && response[0]?.isSuccess) {
        toast.success(response[0].message || 'Pickslip details added successfully!', { duration: 3000 });
        clearSelectedPickslipId();
        clearSelectedProductId();
        clearNumberOfPacks();
        setScannedItems([]);
        setCurrentTotalScannedQuantity(0);
        setIsScanningActive(false);
        setCurrentScannedProductionDetails(null);
      } else {
        const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to add pickslip details.';
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(`Error: ${errMsg}`, { duration: 5000 });
      console.error('Error adding pickslip details:', error);
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  if (initialLoading) {
    return <Loader message="Preparing Scanner..." />;
  }

  if (!selectedPickslipId || !selectedProductId || numberOfPacks === null) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center text-red-600 dark:text-red-400">
        <FaExclamationCircle className="text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Missing Pickslip Data</h2>
        <p>Please go back to "Create New Pickslip" to start the process.</p>
        <Button onClick={() => {
          clearSelectedPickslipId();
          clearSelectedProductId();
          clearNumberOfPacks();
        }} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  const scansRemaining = numberOfPacks - scannedItems.length;
  // Can activate camera scan if not validating, not already active, and not exceeded limit
  const canActivateCameraScan = !isBarcodeValidating && !isScanningActive && scannedItems.length < numberOfPacks;
  
  // `isAddDetailsButtonEnabled` controls if the button is *enabled*.
  // It should only be enabled if the exact number of packs are scanned.
  const isAddDetailsButtonEnabled = scannedItems.length === numberOfPacks && !isSubmittingDetails;
  
  // `showAddDetailsButton` controls if the button is *visible*.
  // It should be visible if at least one item has been scanned.
  const showAddDetailsButton = scannedItems.length > 0;


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-10 transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">Pickslip Scanning</h1>

      <div className="flex justify-end mb-4">
        <AnimatePresence>
          {showAddDetailsButton && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleAddDetails}
                disabled={!isAddDetailsButtonEnabled}
                variant="primary"
                icon={isSubmittingDetails ? <FaSpinner className="animate-spin" /> : <FaSave />}
              >
                {isSubmittingDetails ? 'Adding Details...' : 'Add Details'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Scanner Section (Moved to top) */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <FaCamera className="mr-2 text-purple-500" /> Barcode Scanner
            </h3>
            <div className="relative aspect-video rounded-md overflow-hidden shadow-md mb-4">
              {isBarcodeValidating && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-500/80 dark:bg-gray-900/80">
                  <Loader message="Validating Barcode..." fullScreen={false} />
                </div>
              )}
              <LiveBarcodeScannerUI
                onScan={handleCameraScan} // Use the new camera-specific handler
                scanActive={isScanningActive}
                onError={(err) => toast.error(`Scanner Error: ${err instanceof Error ? err.message : String(err)}`, { duration: 5000 })}
              />
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                onClick={() => setIsScanningActive(true)}
                disabled={!canActivateCameraScan} // Use new canActivateCameraScan
                variant="secondary"
                className="w-1/2"
              >
                <FaBarcode className="mr-2" /> Start Camera Scan
              </Button>
              <Button
                onClick={() => setIsScanningActive(false)}
                disabled={!isScanningActive}
                variant="secondary"
                className="w-1/2"
              >
                <FaTimesCircle className="mr-2" /> Stop Camera Scan
              </Button>
            </div>

            {/* Manual/Handheld Barcode Input Field */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                <FaKeyboard className="mr-2 text-blue-500" /> Manual/Handheld Scan
              </h4>
              <SubInput
                label="Enter Barcode"
                type="text"
                value={manualBarcodeInput}
                onChange={handleManualInputChange}
                onKeyDown={handleManualInputKeyDown}
                placeholder="Scan or type barcode and press Enter"
                error={isBarcodeValidating ? "Validating..." : undefined} // Show validation status
                disabled={isBarcodeValidating} // Disable input during validation
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                For handheld scanners, place cursor here and scan.
              </p>
            </div>
          </Card>

          {/* Current Pickslip Details Card (Now below scanner) */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <FaBarcode className="mr-2 text-blue-500" /> Current Pickslip Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">Pickslip Header ID:</span>
                <span className="font-medium text-gray-900 dark:text-white break-all">{selectedPickslipId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">Product ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedProductId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">Number of Packs (Target):</span>
                <span className="font-medium text-gray-900 dark:text-white">{numberOfPacks}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">Quantity Per Scan:</span>
                <span className="font-medium text-gray-900 dark:text-white">{BASE_QUANTITY_PER_SCAN}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">UOM:</span>
                <span className="font-medium text-gray-900 dark:text-white">{UOM_STATIC}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">Total Scanned Quantity:</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{currentTotalScannedQuantity.toFixed(3)}</span>
              </div>
            </div>
            <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
              <p className="text-blue-700 dark:text-blue-200 font-medium text-center">
                Scanned: <span className="font-bold">{scannedItems.length}</span> / {numberOfPacks} packs.
                (<span className="font-bold">{scansRemaining}</span> remaining)
              </p>
            </div>
          </Card>

          {/* New Card: Scanned Product Details (Last validated barcode) */}
          <AnimatePresence mode="wait">
            {currentScannedProductionDetails && (
              <motion.div
                key={currentScannedProductionDetails.IdentifiedStockID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 border-l-4 border-green-500 dark:border-green-600">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                    <FaInfoCircle className="mr-2 text-green-500" /> Last Scanned Product Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">Identified Stock ID:</span>
                      <span className="font-medium text-gray-900 dark:text-white break-all">{currentScannedProductionDetails.IdentifiedStockID}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">Production Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{new Date(currentScannedProductionDetails.ProductionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">SAP Product ID:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.SAPProductID}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">SAP Product Description:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.SAPProductDescription}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">Is Posted:</span>
                      <span className={`font-medium ${currentScannedProductionDetails.IsPosted ? 'text-green-600' : 'text-red-600'}`}>
                        {currentScannedProductionDetails.IsPosted ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">Completed Quantity:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.CompletedQuantity.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">UoM Quantity Per Pallet:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.UoMQuantityPallet.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400">Quantity Unit Code:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{currentScannedProductionDetails.QuantityUnitCode || 'N/A'}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Scanned Items List */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <FaPlus className="mr-2 text-green-500" /> Scanned Items List
          </h3>
          {scannedItems.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p>No items scanned yet.</p>
              <p className="text-sm mt-2">Start scanning barcodes or enter manually.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {scannedItems.map((item, index) => (
                <motion.div
                  key={item.identifiedStockID + item.lineNo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div className="flex-grow">
                    <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      Line No: {item.lineNo}
                    </p>
                    <p className="text-gray-800 dark:text-gray-100">
                      Product ID: <span className="font-medium">{item.productID}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Barcode: <span className="font-mono break-all">{item.identifiedStockID}</span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:text-right">
                    <p className="text-gray-800 dark:text-gray-100">
                      Quantity: <span className="font-bold">{item.quantity.toFixed(3)} {item.uom}</span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Scanned At: {item.timestamp}
                    </p>
                    {item.productionDetails && (
                      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        <p>Prod. Desc: {item.productionDetails.SAPProductDescription}</p>
                        <p>Posted: {item.productionDetails.IsPosted ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        message={warningMessage}
        timeout={5000}
      />

      {/* Custom Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </div>
  );
};

export default PickslipScanningPage;