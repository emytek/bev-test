
// import { useState, useCallback, useEffect } from "react";
// import { BiBarcodeReader } from "react-icons/bi";
// import { BsCameraFill } from "react-icons/bs";
// import BarcodeScannerComponent from "../../components/settings/BarcodeScanner";

// const ScannerPage = () => {
//     const [scannedCode, setScannedCode] = useState<string | null>(null);
//     const [scanAgain, setScanAgain] = useState<boolean>(false);
//     const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
//     const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
//     const [isSmallScreen, setIsSmallScreen] = useState(false);
  
//     const handleScan = useCallback((code: string) => {
//       setScannedCode(code);
//       setScanAgain(false); // Stop scanning after a successful scan
//     }, [setScannedCode, setScanAgain]);
  
//     const resetScanner = useCallback(() => {
//       setScannedCode(null);
//       setScanAgain(true); // Trigger a new scan (will remount BarcodeScanner)
//     }, [setScannedCode, setScanAgain]);
  
//     const switchCamera = useCallback(() => {
//       const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
//       const nextIndex = (currentIndex + 1) % availableCameras.length;
//       setCurrentCameraId(availableCameras[nextIndex].deviceId);
//     }, [availableCameras, currentCameraId]);
  
//     useEffect(() => {
//       const getCameras = async () => {
//         try {
//           const devices = await navigator.mediaDevices.enumerateDevices();
//           const videoDevices = devices.filter((device) => device.kind === 'videoinput');
//           setAvailableCameras(videoDevices);
  
//           if (isSmallScreen) {
//             const backCamera = videoDevices.find(device =>
//               device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
//             );
//             setCurrentCameraId(backCamera?.deviceId || videoDevices[0]?.deviceId);
//           } else if (videoDevices.length > 0 && !currentCameraId) {
//             setCurrentCameraId(videoDevices[0].deviceId);
//           }
//         } catch (error) {
//           console.error("Error enumerating video devices:", error);
//         }
//       };
  
//       getCameras();
//     }, [isSmallScreen, setCurrentCameraId, setAvailableCameras]);
  
//     useEffect(() => {
//       const handleResize = () => {
//         setIsSmallScreen(window.innerWidth < 768);
//       };
//       handleResize();
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }, [setIsSmallScreen]);
  
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex flex-col items-center justify-center py-12 px-6 sm:px-12">
//         <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <BiBarcodeReader size={32} />
//               <h1 className="text-xl font-semibold tracking-tight">
//                 {scanAgain ? "Scan Barcode" : scannedCode ? "Scan Successful" : "Ready to Scan"}
//               </h1>
//             </div>
//           </div>
//           <div className="p-8 space-y-6 relative">
//             {availableCameras.length > 1 && scanAgain && (
//               <button
//                 onClick={switchCamera}
//                 className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
//               >
//                 <BsCameraFill size={20} />
//               </button>
//             )}
//             {scanAgain ? (
//               <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
//                 <BarcodeScannerComponent
//                   key={currentCameraId} // Force remount on camera change as well
//                   onScan={handleScan}
//                   onError={(err) => console.error("Scanner Error:", err)}
//                   preferredCameraId={currentCameraId}
//                 />
//                 <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
//                 <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2">
//                   Point camera at barcode
//                 </p>
//               </div>
//             ) : (
//               <div className="text-center space-y-6">
//                 {scannedCode ? (
//                   <div className="flex flex-col items-center justify-center">
//                     <svg
//                       className="w-16 h-16 text-green-500 rounded-full bg-green-100 p-3"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M5 13l4 4L19 7"
//                       ></path>
//                     </svg>
//                     <p className="mt-4 text-lg text-gray-800">
//                       <span className="font-medium text-brand-500">Scanned Code:</span>
//                       <br />
//                       <span className="font-mono text-xl break-words">{scannedCode}</span>
//                     </p>
//                   </div>
//                 ) : (
//                   <p className="text-gray-600">Ready to scan</p>
//                 )}
//                 <button
//                   onClick={resetScanner}
//                   className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
//                 >
//                   <BiBarcodeReader className="inline-block mr-2" />
//                   Scan Again
//                 </button>
//                 <div className="mt-4 text-sm text-gray-500">
//                   <p>
//                     Need help? <a href="#" className="text-brand-500 hover:underline">Contact Support</a>
//                   </p>
//                   <p className="mt-1">Ensure the barcode is well-lit and within the frame.</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };
  
// export default ScannerPage;


// src/pages/ScannerPage.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { BiBarcodeReader } from "react-icons/bi";
import { BsCameraFill } from "react-icons/bs";
import { FaBarcode, FaCamera, FaCheckCircle, FaKeyboard, FaTimesCircle } from 'react-icons/fa'; // Removed FaSpinner as no processing
import BarcodeScannerComponent from "../../components/settings/BarcodeScanner";
import Card from "../../components/common/Card";
import Button from "../../components/ui/button/SalesBtn";

import WarningModal from "../../components/ui/modal/WarningModal"; // Still useful for duplicate scans
import SubInput from "../../components/form/input/SubInput";

const ScannerPage: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false); // Controls camera scanner
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [manualBarcodeInput, setManualBarcodeInput] = useState<string>(''); // State for manual input
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Unified function to process any scanned barcode (from camera or manual input)
  const processBarcode = useCallback((code: string) => {
    if (!code) {
      setWarningMessage('Barcode cannot be empty.');
      setShowWarningModal(true);
      return;
    }

    // If you need to prevent immediate re-scanning of the *same* barcode, you can add:
    if (scannedCode === code) {
        setWarningMessage(`Barcode "${code}" has already been scanned.`);
        setShowWarningModal(true);
        return;
    }

    setScannedCode(code); // Directly set the scanned code for display
    setManualBarcodeInput(''); // Clear manual input field after processing
    
    toast.success(`Barcode captured: ${code}`, { duration: 2000 });

    // Refocus manual input after processing, useful for handheld scanners
    if (manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [scannedCode]); // Dependency on scannedCode to check for duplicates

  // Handler for camera scans
  const handleCameraScan = useCallback((code: string) => {
    setIsCameraActive(false); // Stop camera after a scan
    processBarcode(code);
  }, [processBarcode]);

  // Handler for manual input change (updates state)
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualBarcodeInput(e.target.value);
  };

  // Handler for manual input key down (detects Enter for handheld scanners/manual submission)
  const handleManualInputKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && manualBarcodeInput.trim() !== '') {
      e.preventDefault(); // Prevent form submission
      setIsCameraActive(false); // Ensure camera is off if using manual input
      processBarcode(manualBarcodeInput.trim()); // Directly process the barcode
    }
  }, [manualBarcodeInput, processBarcode]);

  // Camera enumeration and selection logic
  const switchCamera = useCallback(() => {
    if (availableCameras.length <= 1) return;

    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setCurrentCameraId(availableCameras[nextIndex].deviceId);
  }, [availableCameras, currentCameraId]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);

        let defaultCameraId: string | undefined;
        if (isSmallScreen) {
          const backCamera = videoDevices.find(device =>
            device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
          );
          defaultCameraId = backCamera?.deviceId || videoDevices[0]?.deviceId;
        } else {
          defaultCameraId = videoDevices[0]?.deviceId;
        }
        setCurrentCameraId(defaultCameraId);
      } catch (error) {
        console.error("Error enumerating video devices:", error);
        toast.error("Failed to access camera devices. Please check permissions.", { duration: 5000 });
      }
    };

    getCameras();
  }, [isSmallScreen]);

  // Effect to handle screen resize for camera preference
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to reset the scanner to its initial state (ready for new scan)
  const resetScanner = useCallback(() => {
    setScannedCode(null);
    setManualBarcodeInput('');
    setIsCameraActive(false); // Camera starts off on reset now
    if (manualInputRef.current) {
      manualInputRef.current.focus(); // Focus manual input for handheld scanner users
    }
    toast.info("Scanner reset. Ready for new scan.", { duration: 1500 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center py-12 px-6 sm:px-12 text-gray-800 dark:text-gray-200">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BiBarcodeReader size={32} />
            <h1 className="text-xl font-semibold tracking-tight">
              Barcode Capture
            </h1>
          </div>
          {/* Reset Button */}
          <Button
            onClick={resetScanner}
            variant="secondary"
            className="bg-blue-700 hover:bg-blue-900 text-blue-700 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200 text-sm"
          >
            Reset
          </Button>
        </div>

        <div className="p-8 space-y-6 relative">
          {/* Camera Scanner Section */}
          <Card className="p-6 border-l-4 border-purple-500 dark:border-purple-600">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCamera className="mr-2 text-purple-500" /> Camera Scan
            </h3>
            {/* Conditional rendering of the camera display area */}
            <AnimatePresence mode="wait">
              {isCameraActive && currentCameraId ? (
                <motion.div
                  key="camera-active"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-video rounded-md overflow-hidden shadow-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
                >
                  <BarcodeScannerComponent
                    key={currentCameraId}
                    onScan={handleCameraScan}
                    onError={(err) => toast.error(`Camera Error: ${err instanceof Error ? err.message : String(err)}`, { duration: 5000 })}
                    preferredCameraId={currentCameraId}
                  />
                  {/* Overlays for active scanning */}
                  <>
                    <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
                    <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2 z-10">
                      Point camera at barcode
                    </p>
                  </>
                </motion.div>
              ) : (
                // Optional: Placeholder when camera is not active and no camera is selected
                // This block is now removed as per user request.
                // The space will simply collapse.
                <motion.div
                  key="camera-inactive-placeholder"
                  initial={{ opacity: 0, height: 'auto' }}
                  animate={{ opacity: 0, height: 0 }} // Collapse the height
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden" // Ensure it's hidden from layout
                />
              )}
            </AnimatePresence>

            <div className="flex justify-center mt-4 space-x-2">
              <Button
                onClick={() => setIsCameraActive(true)}
                disabled={isCameraActive || !currentCameraId}
                variant="secondary"
                className="w-1/2"
              >
                <FaBarcode className="mr-2" /> Start Camera
              </Button>
              <Button
                onClick={() => setIsCameraActive(false)}
                disabled={!isCameraActive}
                variant="secondary"
                className="w-1/2"
              >
                <FaTimesCircle className="mr-2" /> Stop Camera
              </Button>
            </div>
            {availableCameras.length > 1 && (
              <div className="mt-2 text-center">
                <Button
                  onClick={switchCamera}
                  variant="tertiary"
                  className="text-sm px-3 py-1.5"
                >
                  <BsCameraFill className="inline-block mr-2" /> Switch Camera
                </Button>
              </div>
            )}
          </Card>

          {/* Manual/Handheld Barcode Input Section */}
          <Card className="p-6 border-l-4 border-blue-500 dark:border-blue-600">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaKeyboard className="mr-2 text-blue-500" /> Manual / Handheld Scan
            </h3>
            <SubInput
              label="Enter Barcode"
              type="text"
              value={manualBarcodeInput}
              onChange={handleManualInputChange}
              onKeyDown={handleManualInputKeyDown}
              placeholder="Scan or type barcode and press Enter"
              ref={manualInputRef}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              For handheld scanners (e.g., Intermec CK3s), place cursor here and scan.
            </p>
          </Card>

          {/* Scan Result Display */}
          <AnimatePresence mode="wait">
            {scannedCode && (
              <motion.div
                key="scanResult"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 border-l-4 border-green-500 dark:border-green-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-green-700 dark:text-green-400">
                    <FaCheckCircle className="mr-2" /> Captured Barcode
                  </h3>
                  <div className="text-center text-lg font-bold text-gray-900 dark:text-gray-100 break-all p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {scannedCode}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                    This barcode has been successfully captured.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        message={warningMessage}
        timeout={5000}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default ScannerPage;

